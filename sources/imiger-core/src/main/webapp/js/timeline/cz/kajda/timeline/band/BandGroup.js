/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'jquery',
    'cz/kajda/timeline/Component',
    'cz/kajda/timeline/band/Band',
    'cz/kajda/timeline/RelationViewer'
],
function($, Component, Band, RelationViewer) {
            
/**
 * Component that merges all the band used within the timeline.
 * @memberOf cz.kajda.timeline.band
 */
var BandGroup = new Class("cz.kajda.timeline.band.BandGroup", {
   
    _extends: Component,
   
    /**
     * @constructor
     * @see cz.kajda.timeline.Component
     */
    _constructor : function(timeline) {
        Component.call(this, timeline);
        this._bands = {};
        this._bandTypes = {};
    },
    
    //<editor-fold defaultstate="collapsed" desc="private members">

        /** @see cz.kajda.timeline.Component#_cssPrefix */
        _cssPrefix : "band-group",

        /** @member {Object} bands map */
        _bands : null,
        
        /** @member {cz.kajda.timeline.RelationViewer} */
        _relationViewer : null,
        /**
         * @author Michal Fiala
         * Dictionary for type of entity to band
         * [Type] : [Band]
         */
        _bandTypes : null,
    
    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="overridden">
        
        /** @see cz.kajda.timeline.Component#build */
        build : function() {
            this._htmlElement = new $("<div>")
                    .addClass(this.getPrefixedCssClass());
            
            this.addComponent(new RelationViewer(this.getTimeline()));
            return this._htmlElement;
            
        },

        /** @see cz.kajda.timeline.Component#redraw */
        redraw : function() {
            // vertical space available in the group
            var availHeight = this._timeline.getHeight(Component.INC_PADDING)
                    - this._timeline.getRuler().getHeight(Component.INC_MARGIN)
                    - this._timeline.getNavBar().getHeight(Component.INC_MARGIN);
            
            // band IDs
            var bandIds = Object.keys(this._bands);
            
            // vertical space available for a band
            var bandHeight = availHeight / bandIds.length;
            
            // update band heights
            for(var i = 0; i < bandIds.length; ++i) {
                this._bands[bandIds[i]].setHeight(bandHeight);
                this._bands[bandIds[i]].redraw();
            }
            if(this._relationViewer) this._relationViewer.redraw();
        },
        
        /** @see cz.kajda.timeline.Component#addComponent */
        addComponent : function(comp) {
            if(comp instanceof RelationViewer)
                this._relationViewer = comp;
            this.__super.addComponent.call(this, comp);
        },

    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="getters & setters">
    
        /**
         * @author Bc. Michal Kacerovský 
         * @author Michal Fiala
         * Gets band by its identifier.
         * @param {String|NUmber} id entity type
         * @returns {cz.kajda.timeline.band.Band}
         */
        getBand : function(id) {
            // Try find entity type in bandTypes
            if(this._bandTypes[id])
                return this._bandTypes[id];
            else
                return this._bands[id];
        },

        /**
         * @author Bc. Michal Kacerovský 
         * @author Michal Fiala
         * Informs whether a band with passed ID exists in the group.
         * @param {Number|String} id 
         */
        hasBand : function(id) {
            // Try find entity type in bandTypes
            if(this._bandTypes[id])
                return isset(this._bandTypes[id])
            else
                return isset(this._bands[id]);
        },

        /**
         * Gets map of the bands in the group.
         * @returns {Object} {{id} : cz.kajda.timeline.band.Band}
         */
        getBands : function() {
            return this._bands;
        },

        /**
         * Looks for an item specified by its identifier in all the bands.
         * Notice that item IDs are unique across the timeline not only a band.
         * @param {String|Number} id
         * @returns {cz.kajda.timeline.band.Band} band or null if not found any
         */
        getBandItem : function(id) {
            var bi;
            for(var i = 0; i < this._components.length; i++) {
                if(this._components[i] instanceof RelationViewer) continue;
                bi = this._components[i].getBandItem(id);
                if(isset(bi)) return bi;
            }
            return null;
        },

        /**
         * @returns {cz.kajda.timeline.RelationViewer} relation layer
         */
        getRelationViewer : function() {
            return this._relationViewer;
        },
    
    //</editor-fold>


    /**
     * @author Bc. Michal Kacerovský 
     * @author Michal Fiala
     * Adds new band into the band group.
     * Band properties object :
     * {
     *   id : String|Number, 
     *   label : String,
     *   color : String // background color (#??????)
     *   itemRenderer : cz.kajda.timeline.render.AbstractItemRenderer
     * }
     * 
     * OR
     * 
     * Band properties object :
     * { 
     *      types: [
     *              {
     *                    id: "person",
     *                    itemRenderer: new BandItemRenderer("#FFB182"),
     *                    color: "#fafafa"
     *              },
     *              {
     *                    id: "event",
     *                    itemRenderer: new BandItemRenderer("#F2BC53"),
     *                    color: "#f5f5f5"
     *               },
     *   }
     * @param {Object} opts band properties
     * @returns{cz.kajda.timeline.band.Band} added band
     */
    addBand : function(opts) {
        var band = new Band(this._timeline, opts);
        band.addListener("contentOverflown", new Closure(this, function(bandItem) {
            this._fireEvent("contentOverflown", bandItem);
        }));
        this._bands[opts.id] = band;
        this.addComponent(band);


        // If Band has property types
        // For each type add this band in bandTypes
        var entityTypes = opts.types;
        if(entityTypes)
        {
            for(var i=0; i< entityTypes.length;i++)
            {
                var type = entityTypes[i];
                this._bandTypes[type.id] = band;
            }
        }
        // Else add this opts.id (type of entity) and this band
        else
        {
            this._bandTypes[opts.id] = band;
        }    
        return band;
    },
    
    /**
     * Removes all items from the bands in the group.
     * @param {Boolean} full (optional) if true band item registry is also cleared
     */
    emptyBands : function(full /* = false */) {
        for(var bandId in this._bands) {
            this._bands[bandId].empty(full);
        }
    }
    
});


return BandGroup;
});