/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'jquery',
    'cz/kajda/timeline/Component',
    'cz/kajda/timeline/band/BandItem',
    'cz/kajda/timeline/band/SubItem',
    'cz/kajda/common/Identifiable'
],
function($, Component, BandItem, SubItem, Identifiable) {
    
/**
 * A band that merges entities (band items) of the same type into a component.
 * @memberOf cz.kajda.timeline.band
 */
var Band = new Class("cz.kajda.timeline.band.Band", {
    
    _implements : [Identifiable],
    _extends : Component,
    
    /**
     * @constructor
     * @see cz.kajda.timeline.Component
     * @param {cz.kajda.timeline.Timeline} timeline
     * @param {Object} opts band options
     */
    _constructor : function(timeline, opts) {
        Component.call(this, timeline);
        
        // transform options to the private class members
        for(var key in opts) {
            this["_" + key] = opts[key];
        }
        
        this._bandItems = [];
        this._bandItemIds = [];
        this._lanes = [];
        this._laneEnds = [];
        this._bandItemsSorted = false;
        this._contextOverflown = false;

        this._types = opts.types == null ? null : this._createTypesDictionary(opts.types);
        this._subItems = [];
        this._subItemsIds = [];
    },
    
    //<editor-fold defaultstate="collapsed" desc="private members">
    
        /** @see cz.kajda.timeline.Component#_cssPrefix */
        _cssPrefix : "band",

        /** @member {cz.kajda.timeline.render.Color} background color */
        _color : null,

        /** @member {cz.kajda.timeline.render.AbstractItemRenderer} band ite renderer used in this band */
        _itemRenderer : null,

        /** @member {String} */
        _id : null,

        /** @member {String} */
        _label: null,

        /** @member {Object} <String|Number, cz.kajda.timeline.band.BandItem> 
         * map of ALL items that can be possibly shown in the band (not only in the current wrapper time range) */
        _bandItems : null,
        
        /** @member {Number[]} registers identifiers of time-sorted band items */
        _bandItemIds : null,
        
        /** @member {Boolean} true if band item identifiers array has been sorted */
        _bandItemsSorted : false,
        
        /** @member {moment[]} register time that the last entity in a lane ends at */
        _laneEnds : null,
        
        /** @member {Boolean} indicates that the items inside of the band overflow */
        _contentOverflow : false,

        /** 
         * @author Michal Fiala
         * Dictionary {TypeOfEntity} : {Renderer} 
         */
        _types : {},
        /** 
         * @author Michal Fiala 
         * Array of SubItems in Band
         */
        _subItems: null,
        /** 
         * @author Michal Fiala
         * Array of SubItems Ids in Band
         */
        _subItemsIds: null,
        
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="private methods">
            
        /**
         * @private
         * Loops over all possible band items,
         * choose those that fit the currect time range and zoom level
         * and add them as a component of the band.
         */
        _addBandItemComponents : function() {
            // if band items registry is not already sorted, do it now
            if(!this._bandItemsSorted) {
                this._sortBandItemsByDate();
            }


            var timer = new __DebugTimer("Band item DOM insertation");
            var timer2 = new __DebugTimer("Band item redraw");
            this.empty();
            var timeline = this.getTimeline();
            var boundaries = timeline.getZoomLevel().getBoundaries(timeline, timeline.getTime(), true);
            // loop over all band items registred by the band
            for(var i = 0; i < this._bandItemIds.length; i++) {
                var bi = this._bandItems[this._bandItemIds[i]],
                    entity = bi.getEntity();
                // if the item fits current time range and zoom level, add it as a component
                if(entity.isPresentInRange(boundaries.min, boundaries.max) && 
                    (this.getTimeline().matchesZoomLevel(entity) || bi.isFocused())) {
                    timer.start();
                    this.addComponent(bi);  
                    timer.stop();
                    timer2.start();
                    // set proper position in the timeline (wrapper)
                    bi.redraw();     
                    timer2.stop();
                }
            }
            timer.dump();
            timer2.dump();
        },
        
        /**
         * @private 
         * Loops over components (already time-sorted)
         * and sorts out them into lanes according their width.
         * It solves the problem of overlapping.
         */
        _solveOverlapping : function() {
            var timer = new __DebugTimer("Compute overlaps");
            var timer2 = new __DebugTimer("Redraw required by solving overlaps");
            // reset lane registry
            this._laneEnds = [];
			var skips = 0;
            for(var i = 0; i < this._components.length; i++) {
				timer.start();
                var bi = this._components[i];
                var laneIndex = 0; // begin at the first lane
                var biRight = bi.getPosition().left + bi.getWidth();
                while(true) {
                    // no empty lane was found, add new one (stack the band item lower in the band)
                    if(laneIndex === this._laneEnds.length) {
                        this._laneEnds.push(biRight);
                        break;
                    } else
                    // adding to the lane with current index will not cause overlap, add item to it
                    if(bi.getPosition().left > this._laneEnds[laneIndex]) {
                        this._laneEnds[laneIndex] = biRight;
                        break;
                    }
                    laneIndex++;
                }
				skips += laneIndex;
				timer.stop();
				timer2.start();
                // move item vertically according its lane position
                bi.getHtmlElement().css({
                    "top" : laneIndex * 15
                });
                
                if(laneIndex * bi.getHeight() > this.getHeight() && !this._contentOverflow) {
                    this._contentOverflow = true;
                    this._fireEvent("contentOverflow", bi);
                }
				timer2.stop();
            }
            timer.dump();
			timer2.dump();
			this.__debug("Lane crossings: " + skips + ", lane count: " + this._laneEnds.length);
        },
        
        /**
         * @private
         * Using shellsort puts all the band items in time order.
         */
        _sortBandItemsByDate : function() {
            var gap = Math.round(this._bandItemIds.length / 2);
            while (gap > 0) { // while there is somthing to compare
                for (var i = 0; i < this._bandItemIds.length - gap; i++) { // modificated insert sort
                    var j = i + gap;
                    var tmpId = this._bandItemIds[j];
                    while (j >= gap && !this.getBandItem(tmpId).startsAfter(this.getBandItem(this._bandItemIds[j - gap]))) {
                        this._bandItemIds[j] = this._bandItemIds[j - gap];
                        j -= gap;
                    }
                    this._bandItemIds[j] = tmpId;
                }
                if (gap === 2) {
                    gap = 1;
                } else {
                    gap = Math.round(gap / 2.2);
                }
            }           
            
            this._bandItemsSorted = true;
        },
        
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="overridden">
    
        /** @see cz.kajda.timeline.Component#build */
        build : function() {
            return this._htmlElement = new $("<div>")
                    .css("background-color", this._color)
                    .addClass(this.getPrefixedCssClass());
        },
        
        /** @see cz.kajda.timeline.Component#redraw */
        redraw : function() {
            this.__groupDebug("[" + this.getId() + "] band redraw");
            this._addBandItemComponents();
            this._solveOverlapping();
            this.__closeGroupDebug();
        },

        /** @see cz.kajda.timeline.Component */
        addComponent : function(obj) {
            if(!(obj instanceof BandItem))
                this.__exception("Invalid object", "Attempt to add component that is not instance of cz.kajda.timeline.band.BandItem to the band.");
            this.__super.addComponent.call(this, obj);
        },

    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="getter & setters">

        /**
         * @returns {String} band label
         */
        getLabel : function() {
            return this._label;
        },

        /**
         * @returns {String} band identifier
         */
        getId : function() {
            return this._id;
        },

        /**
         * @author Bc. Michal Kacerovský
         * @author Michal Fiala
         * Finds item with passed identifier.
         * Try find it in BandItems if not found => try find it in SubItems
         * @param {Number|String} id
         * @returns {cz.kajda.timeline.band.BandItem} || @returns {cz.kajda.timeline.band.SubItem}
         */
        getBandItem : function(id) {
            // Find it in bandItems array
            var bandItem = this._bandItems[id];
            if(bandItem)
                return bandItem;
            // Find it in subItems array    
            else
                return this._subItems[id];
        },


        /**
         * Sets band height.
         * @param {Number} height
         */
        setHeight : function(height) {
            this._htmlElement.css("height", height); 
        },
        
        /**
         * Checks whether the content overflowns off the band.
         * @returns {Boolean} true if content overflows
         */
        isContentOverflown : function() {
            return this._contentOverflow;
        },
        
    //</editor-fold>

    /**
     * @author Bc. Michal Kacerovský
     * @author Michal Fiala
     * Register item to the band.
     * It does not mean that the item is added as a component.
     * The item becomes band's component when it fits the timeline range.
     * @param {cz.kajda.data.AbstractEntity} entity
     */
    addItem : function(entity) {
        if(isset(this._bandItems[entity.getId()]))
            this.__exception("Ambiguous item", "Attempt to add item with duplicate identifier (" + entity.getId() + ")");
        
        // Get renderer from _types
        var renderer = null
        if(this.issetTypes())
        {
            renderer = this._types[entity.getType()];                 
        }
        // If not found => Get this.itemRenderer 
        if(renderer == null)
            renderer = this._itemRenderer;
        var bandItem = new BandItem(this._timeline, entity, renderer);

        // For each subEntity create SubItem add to 
        // _subItems and subItemsIds 
        // Insert it in BandItem
        if(entity.issetSubEntities())
        {
            var subEntities = entity.getSubEntities();
            for(var i = 0; i < subEntities.length; i++)
            {
                var subItem = new SubItem(this._timeline,subEntities[i], renderer);
                this._subItems[subItem.getId()] = subItem;
                this._subItemsIds.push(subItem.getId());

                bandItem.addSubItem(subItem);
            }
        }

        this._bandItems[bandItem.getId()] = bandItem;
        this._bandItemIds.push(bandItem.getId());
        this._bandItemsSorted = false;
    },
    
    /**
     * Clears the band as a component.
     * That means all the subcomponents are removed
     * but the band item list is not affected (if full is false).
     * @param {Boolean} full (optional) if true, clear band item map (default : false)
     */
    empty : function(full /* = false */) {      
        if(!isset(full)) full = false;
        // remove HTML elements
        this._components.forEach(function(bi) {
            bi.undraw();
        });
        
        // clear subcomponents array
        this._components = [];
        this._contentOverflow = false;
        
        if(full) {
            this._bandItemIds.splice(0, Number.MAX_VALUE);
            this._bandItems.splice(0, Number.MAX_VALUE);
            this._bandItemsSorted = false;
        }
    },

    /**
     * @author Michal Fiala
     * Create types dictionary
     * [Type (EntityType)] : Renderer
     * @param {JSON} types
     * @returns {Dictionary}
     */
    _createTypesDictionary : function (types)
    {  
        var typesDict = {}; 
        // For each type assign renderer
        for(var i = 0; i< types.length ; i++)
        {
            var type = types[i];
            typesDict[type.id] = type.itemRenderer;
        }

        return typesDict;
    },
    /**
     * @author Michal Fiala
     * @returns {Boolean}
     */
    issetTypes : function() {
      if(this._types == null) return false;
      
      return true;
    },
    /**
     * @author Michal Fiala
     * Return _types
     * @returns {Dictionary}
     */
    getTypes : function()
    {
        return this._types;
    }
           
});


return Band;
});
