/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'momentjs',
    'cz/kajda/timeline/Component',
    'cz/kajda/timeline/ZoomLevel',
    'cz/kajda/timeline/Projection',
    'cz/kajda/timeline/Wrapper',
    'cz/kajda/timeline/Ruler',
    'cz/kajda/timeline/band/BandLabelContainer',
    'cz/kajda/timeline/band/BandGroup',
    'cz/kajda/timeline/NavBar',
    'cz/kajda/data/AbstractEntity',
    'cz/kajda/timeline/RelationViewer',
    'cz/kajda/timeline/ZoomBar'
], function(moment,
    Component,
    ZoomLevel,
    Projection,
    Wrapper,
    Ruler,
    BandLabelContainer,
    BandGroup,
    NavBar,
    AbstractEntity,
    RelationViewer,
    ZoomBar) {
    
/**
 * The timeline class that cover and initiates all the functionality.
 * @type type
 */
var Timeline = Class("cz.kajda.timeline.Timeline", {
    
    _extends : Component, 
    
    /**
     * @constructor
     * @param {jQuery} htmlElement
     * @param {Object} options 
     */
    _constructor : function(htmlElement, options) {
        Component.call(this, null);

        this._selected = false;
        this._selectedEntity = null;
        this._htmlElement = htmlElement;
        this._options =  $.extend(this._defaults, options);
        this._zoomLevel = this._options.defaultZoomLevel;
        this._currentTime = this._options.defaultTime;
        this._projection = new Projection(this);
        this._popovers = [];
        this._currentInterval = null;
        this.bands = {};
        this.build();
        this._addListeners();
        this._addBands();
        this.setDataSource(options.data);
        this.redraw();
        this._bandLabels.redraw();
        
    },
    
    POPOVER_TYPE_ENTITY : "entity",
    POPOVER_TYPE_RELATION  : "relation",
    
    KEY_ESCAPE : 27,
    KEY_PLUS : 43,
    KEY_MINUS : 45,
    KEY_LEFT : 37,
    KEY_RIGHT : 39,
    
    //<editor-fold defaultstate="collapsed" desc="private members">
    
        /** @see cz.kajda.timeline.Component#_cssPrefix */
        _cssPrefix : "timeline",

        _defaults : {
            data : null,    
            // max value used for specifying entity priority
            maxDataPriority : 100,
            // default zoom level used when timeline is created
            defaultZoomLevel: 0,  
            // index of first zoom level that shows all the items regardless their priority
            safeZoomLevel : 5,
            // default time set as center-moment when timeline is created
            defaultTime: moment().utc(),
            // default CSS class prefix
            cssPrefix : "timeline",
            // should be center-time pointer shown?
            showTimePointer : true,
            // should be entity guidelines shown?
            showGuidelines : true,
            // should be entity popovers shown?
            showItemPopovers : true,
            // delay in milliseconds before the popover is displayed
            popoverDelay : 500,
            // should be relation popovers shown?
            showRelationPopovers : true,
            // should be band labels shown?
            showBandLabels : true,
            // should be zoom buttons shown?
            showZoombar : true,
            // should be relations between entities shown?
            showRelations : true,
            // minimum time that can be display within the timeline
            minTime : moment.MIN_MOMENT,
            // maximum time that can be display within the timeline
            maxTime : moment.MAX_MOMENT,
            // if true, outputs debug information to the console
            debugMode : false,
            
            
            // zoom levels description
            /** @see cz.kajda.timeline.ZoomLevel */
            zoomLevels : [
                new ZoomLevel([10, 'year'], [1000, 'year'], [100, 'year'], 'YYYy', 'CC'),
                new ZoomLevel([5, 'year'], [1000, 'year'], [100, 'year'], 'YYYy', 'dc [l]ét[a] CC'),
                new ZoomLevel([3, 'year'], [1000, 'year'], [100, 'year'], 'YYYy', 'dc [l]ét[a] CC'),
                new ZoomLevel([1, 'year'], [100, 'year'], [10, 'year'], 'YYYy', 'YYyy'),
                new ZoomLevel([6, 'month'], [100, 'year'], [10, 'year'], 'YYYy', 'YYyy'),
                new ZoomLevel([3, 'month'], [50, 'year'], [5, 'year'], 'YYYy', 'YYyy'),
                new ZoomLevel([1, 'month'], [25, 'year'], [1, 'year'], 'YYYy', 'MMMM YYyy'),
                new ZoomLevel([14, 'day'], [10, 'year'], [1, 'year'], 'YYYy', 'MMMM YYyy'),
                new ZoomLevel([7, 'day'], [5, 'year'], [1, 'year'], 'YYYy', 'MMMM YYyy'),
                new ZoomLevel([3, 'day'], [1, 'year'], [3, 'month'], 'YYYy', 'MMMM YYyy'),
                new ZoomLevel([1, 'day'], [1, 'year'], [1, 'month'], 'YYYy', 'D. MMMM YYyy'),
                new ZoomLevel([12, 'hour'], [6, 'month'], [1, 'month'], 'MMMM YYYy', 'D. MMMM YYyy'),
                new ZoomLevel([6, 'hour'], [3, 'month'], [1, 'month'], 'MMMM YYYy', 'D. MMMM YYyy'),
                new ZoomLevel([3, 'hour'], [1, 'month'], [1, 'day'], 'MMMM YYYy', 'D. MMMM YYyy'),
                new ZoomLevel([1, 'hour'], [14, 'day'], [1, 'day'], 'D. MMMM', 'D. MMMM YYyy HH:00'),
                new ZoomLevel([30, 'minute'], [7, 'day'], [1, 'day'], 'D. MMMM', 'D. MMMM YYyy HH:mm'),
                new ZoomLevel([15, 'minute'], [3, 'day'], [1, 'day'], 'D. MMMM', 'D. MMMM YYyy HH:mm'),
                new ZoomLevel([10, 'minute'], [1, 'day'], [12, 'hour'], 'D. MMMM', 'D. MMMM YYyy HH:mm'),
                new ZoomLevel([5, 'minute'], [12, 'hour'], [1, 'hour'], 'HH.mm', 'D. MMMM YYyy HH:mm'),
                new ZoomLevel([1, 'minute'], [6, 'hour'], [1, 'hour'], 'HH.mm', 'D. MMMM YYyy HH:mm'),
                new ZoomLevel([30, 'second'], [3, 'hour'], [1, 'hour'], 'HH.mm', 'D. MMMM YYyy HH:mm'),
                new ZoomLevel([15, 'second'], [1, 'hour'], [15, 'minute'], 'HH.mm', 'D. MMMM YYyy HH:mm'),
                new ZoomLevel([10, 'second'], [30, 'minute'], [5, 'minute'], 'HH.mm', 'D. MMMM YYyy HH:mm'),
                new ZoomLevel([5, 'second'], [15, 'minute'], [1, 'minute'], 'HH.mm', 'D. MMMM YYyy HH:mm'),
                new ZoomLevel([1, 'second'], [5, 'minute'], [1, 'minute'], 'HH.mm', 'D. MMMM YYyy HH:mm'),
                new ZoomLevel([0.5, 'second'], [1, 'minute'], [15, 'second'], 'HH.mm', 'D. MMMM YYyy HH:mm')
            ],
            
            // localization strings
            locale : {
                "btnSlideBack" : "back",
                "btnSlideForward" : "forward",
                "btnZoomIn" : "zoom in (Num +)",
                "btnZoomOut" : "zoom out (Num -)"
            },

            // defines fraction of the viewport size that will be used when users moves timeline using keyboard
            slideCoeficient : 0.2,
            
            // sets position offset (px) of all the popovers according to the banditem
            popoverOffset : 10,
            
            /* Decides which band the entity will be added to.
             * @param {cz.kajda.timeline.Timeline} timeline 
             * @param {cz.kajda.data.Entity} entity
             * @returns {cz.kajda.timeline.band.Band} target band
             */
            bandAssignMethod : function(timeline, entity) {
                return null;
            },

            // bands map (key : String (band ID), value : cz.kajda.timeline.band.Band)
            bands : {},

            // events map (key  event name, value : Array
            events : {
                itemClick : null,
                itemEnter : null,
                itemLeave : null, 
                itemFocus : null,
                itemBlur : null,
                relationClick : null,
                relationEnter : null,
                relationLeave : null,
                zoomChanged : null,
                timeChanged : null,
                resize : null,
                dataChanged : null,
            },
            
            /**
             * Map of functions that return jQuery element 
             * representing entity popover.
             * Use entity type identifier as the key.
             * If the factory should be used for all types (if not specified for particualr type), 
             * use '*' as the key.
             * Function signature:
             * jQuery function (cz.kajda.data.AbstractEntity)
             */
            popoverTemplateFactory : {}
            
        },

        /** @member {Object} timeline parameters (defaults extended with user's)*/
        _options : null,

        /** @member {cz.kajda.timeline.Wrapper}  */
        _wrapper : null,

        /** @member {cz.kajda.timeline.Ruler} */
        _ruler : null,

        /** @member {cz.kajda.timeline.BandGroup} */
        _bandGroup : null,
        
        /** @member {cz.kajda.timeline.BandLabelContainer} */
        _bandLabels : null,

        /** @member {cz.kajda.timeline.NavBar} */
        _navbar : null,
        
        /** @member {cz.kajda.timeline.ZoomBar} */
        _zoombar : null,

        /** @member {jQuery} _timePointer center-moment pointer */
        _timePointer : null,

        /** @member {cz.kajda.timeline.ZoomLevel} current zoom level */
        _zoomLevel : null,

        /** @member {moment} currently set center-moment */
        _currentTime : null,

        /** @member {cz.kajda.data.AbstractDataSource} source of data to be visualizated */
        _dataSource : null,

        /** @member {cz.kajda.data.Projection} projection object that helps to convert moments to pixel position */
        _projection : null,
        
        /** @member {Array} popover registry */
        _popovers : null,
        
        /** @member {Number} delays showing item popover */ 
        _popoverItemTimer : null,
        
        /** @member {Number} delays showing relation popover */
        _popoverRelationTimer : null,
        
        /** @member {cz.kajda.timeline.AbstractItem} */
        _focusedItem : null,

    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="private methods">
    
        //<editor-fold defaultstate="collapsed" desc="common">

            /**
             * @private
             * Register event handlers set by user in configuration object.
             */
            _addListeners : function() {
                for(var key in this._options.events) {
                    event = this._options.events[key];
                    if(event === null) continue;
                    this.addListener(key,this,event);
                }
            },

            /**
             * @private
             * Transforms band definitions to the band objects
             * and add them to the timeline.
             */
            _addBands : function() {
                for (var i = 0; i < this._options.bands.length; ++i) {
                    var bandDef = this._options.bands[i];
                    this._addBand(bandDef);
                }
            },

            /**
             * @private
             * Creates center-moment pointer line.
             */
            _createTimePointer : function() {
                this._timePointer = new jQuery("<div>")
                        .addClass(this.getPrefixedCssClass("timepointer"));
                this._htmlElement.append(this._timePointer);
                if(!this.option("showTimePointer")) this._timePointer.hide();
            },

            /**
             * @private
             * Changes zoom to the passed level and sets the new center-moment.
             * @param {Number} level new zoom level index
             * @param {moment} centerMoment new center-moment to be set
             * @param {Number} offset x-position related to the timeline where the zoom request was performed
             */
            _zoomToLevel : function(level, centerMoment, offset) {
                var origZoomLevel = this._zoomLevel;
                if(!isset(offset)) offset = null;

                var levels = this._options.zoomLevels;
                this._zoomLevel = level;

                // zoom level underflown
                if(this._zoomLevel < 0) {
                    this._zoomLevel = 0;
                    return;
                }

                // zoom level overflown
                if(this._zoomLevel >= levels.length) {
                    this._zoomLevel = levels.length - 1;
                    return;
                }

                var timeChanged = !this._currentTime.isSame(centerMoment);
                this._currentTime = centerMoment;
                this._navbar.setDisplayTime(this._currentTime);
                this.redraw();

                if(timeChanged) 
                    this._fireEvent("timeChanged", this._currentTime);
                
                if(this._zoomLevel !== origZoomLevel) // only if the zoom level was truly changed
                    this._fireEvent("zoomChanged", this._zoomLevel - origZoomLevel, this._zoomLevel, offset);

            },

            /**
             * @private
             * Uses passed band characterics to create band and add it to the band group.
             * @param {type} opts
             * @returns {undefined}
             */
            _addBand : function(opts) {
                this._bandGroup.addBand(opts);
            },

            /**
             * @private
             * Classify entities according to the bandAssignMethod
             * and add them to the bands registries.
             */
            _processData : function() {
                if(!this._dataSource) return;
                var entities = this._dataSource.getEntities().raw();
                this._bandGroup.emptyBands(true);
                for(id in entities) {
                    if(!entities.hasOwnProperty(id)) continue;
                    var entity = entities[id];
                    var targetBand = this._options.bandAssignMethod(this, entity);
                    if(targetBand === null) continue;
                    targetBand.addItem(entity);
                }
                this.redraw();
                this._fireEvent("dataChanged", this._dataSource);
            },

            /**
             * @private
             * Shows or hides guidelines displaying boundary moments of the entity.
             * @param {cz.kajda.timeline.band.BandItem} bandItem bandItem that fired the hover event
             * @param {Boolean} show false, if should be hidden
             */
            _renderGuidelines : function(bandItem, show) {
                if(!this._options.showGuidelines) return;
                this._wrapper.drawGuidelines(bandItem, show);
                this._ruler.highlightDuration(bandItem, show);
            },

            /**
             * @private
             * Finds out what popover template factory should be used for passed entity or relation.
             * If template factory for the particular item type is not defined, looks for general template factory (*).
             * If even the general one is not found, returns null.
             * @param {String} type POPOVER_TYPE_ constants
             * @param {String|Number} id
             * @returns {null|Function}
             */
            _getPopoverTemplateFor : function(type, id) {
                if(this._options.popoverTemplateFactory[type][id]) return this._options.popoverTemplateFactory[type][id];
                else if(this._options.popoverTemplateFactory[type]["*"]) return this._options.popoverTemplateFactory[type]["*"];
                return null;
            },

            /**
             * @private
             * Shows or hides popover for the entity.
             * @param {cz.kajda.timeline.band.BandItem} bandItem bandItem that fired the hover event
             * @param {Boolean} show (optional) false, if should be hidden (default : true)
             */
            _renderPopover : function(bandItem, show /* = true*/) {
                // ignore if not allowed to use popovers
                if(!this.option("showItemPopovers")) return;

                // hide popovers (remove all existing)
                if(isset(show) && !show) {
                    for(var i = 0; i < this._popovers.length; i++)
                        this._popovers[i].remove();
                    return;
                }

                var popover = this._getPopoverTemplateFor(this.POPOVER_TYPE_ENTITY, bandItem.getEntity().getType()).call(this, bandItem.getEntity());
                var popoverOffset = this._options.popoverOffset;
                if(popover === null) return; // no template found, ignore popover request

                // appended to the body (need to be above all elements)
                $(document.body).append(popover);

                // computing position using the timeline position and bandItem position
                // if the computed position lays outside the window, normalize it
                var positionLeft = this.getPosition().left + bandItem.getAbsolutePosition().left;
                if(positionLeft < this.getPosition().left + popoverOffset)
                    positionLeft = this.getPosition().left + popoverOffset;

                var positionTop = this.getPosition().top
                        + bandItem.getAbsolutePosition().top
                        + bandItem.getHtmlElement().outerHeight()
                        + 10;

                popover.addClass(this.getPrefixedCssClass("item-popover"))
                    .css({
                        "left" : positionLeft,
                        "top" : positionTop
                    }).show();

                // register popover for future removal
                this._popovers.push(popover);
            },
            
            

            /**
             * @private
             * Shows or hides popover for the entity.
             * @param {cz.kajda.timeline.band.BandItem} bandItem bandItem that fired the hover event
             * @param {Boolean} show (optional) false, if should be hidden (default : true)
             */
            _renderRelationPopover : function(relation, e, show /* = true*/) {
                // ignore if not allowed to use popovers
                if(!this.option("showRelationPopovers")) return;

                // hide popovers (remove all existing)
                if(isset(show) && !show) {
                    for(var i = 0; i < this._popovers.length; i++)
                        this._popovers[i].remove();
                    return;
                }

                var popover = this._getPopoverTemplateFor(this.POPOVER_TYPE_RELATION, relation.getType()).call(this, relation);
                var popoverOffset = this._options.popoverOffset;
                if(popover === null) return; // no template found, ignore popover request

                // appended to the body (need to be above all elements)
                $(document.body).append(popover);
                
                // computing position using the timeline position and bandItem position
                // if the computed position lays outside the window, normalize it
                var positionLeft = e.originalEvent.pageX + popoverOffset;
                if(positionLeft < this.getPosition().left + popoverOffset)
                    positionLeft = this.getPosition().left + popoverOffset;

                var positionTop = e.originalEvent.pageY + popoverOffset;

                popover.addClass(this.getPrefixedCssClass("item-popover"))
                    .css({
                        "left" : positionLeft,
                        "top" : positionTop
                    }).show();

                // register popover for future removal
                this._popovers.push(popover);
            },

        //</editor-fold>

        //<editor-fold defaultstate="collapsed" desc="event handlers">

            /**
             * Attaches listeners to the key events generated in the timeline DOM.
             */
            _attachTimelineEventListeners : function() {
                $(window).on("resize", new Closure(this, this._handleResizing));
                $(document).on("imigerClick", new Closure(this, this._handleIMiGErClick));
                $(document).on("imigerExclude", new Closure(this, this._handleIMiGErExclude));
                $(document).on("imigerInclude", new Closure(this, this._handleIMiGErInclude));
                this._htmlElement
                        .on("mouseover", "*", new Closure(this, this._handleMouseOver))
                        .on("wheel", new Closure(this, this._handleZooming))
                        .on("keypress keydown", new Closure(this, this._handleKeyboard))
                        .on("click", "[data-entity]", new Closure(this, this._handleItemClick))
                        .on("mouseenter", "[data-entity]", new Closure(this, this._handleItemEnter))
                        .on("mouseleave", "[data-entity]", new Closure(this, this._handleItemLeave))
                        .on("contextmenu", "[data-entity]", new Closure(this, this._handleItemRightClick))
                        .on("mouseenter", "[data-relation]", new Closure(this, this._handleRelationEnter))
                        .on("mouseleave", "[data-relation]", new Closure(this, this._handleRelationLeave))
                        .on("click", "[data-relation]", new Closure(this, this._handleRelationClick));
                
                this._wrapper.addListener("dragging", this, this._handleWrapperDragging)
                    .addListener("dropped", this, this._handleWrapperDropped);
            },

            _handleIMiGErExclude : function(e) {
                var entity = this.getEntities().get(e.originalEvent.detail.entityID);
                $('div[data-entity=' + entity.getId() + ']').hide();
            },

            _handleIMiGErInclude : function(e) {
                var entity = this.getEntities().get(e.originalEvent.detail.entityID);
                $('div[data-entity=' + entity.getId() + ']').show();
            },

            _handleIMiGErClick : function(e) {
                var entity = this.getEntities().get(e.originalEvent.detail.entityID),
                    bandItem = this._bandGroup.getBand(e.originalEvent.detail.archetype).getBandItem(entity.getId());

                if (this._selected) {
                    this.blur();
                    e.preventDefault();
                    this._selected = false;
                    if (this._selectedEntity === entity.getId()) {
                        return;
                    }
                }

                this.focusItem(bandItem.getEntity(), false);
                this._fireEvent("itemClick", entity);
                // FIALA Event for item click
                this._fireEvent("itemLogClick", entity);
                this._selected = true;
                this._selectedEntity = entity.getId();
            },

            /**
             * @private
             * Mouse over event used for getting focus for the timeline HTML element.
             * @param {jQuery.Event} e
             */
            _handleMouseOver : function(e) {
                this._htmlElement.focus();
            },


            /**
             * @private
             * Key press event handler.
             * @param {jquery.Event} e
             */
            _handleKeyboard : function(e) {
                switch(e.keyCode) {
                    case this.KEY_ESCAPE: 
                        e.preventDefault();
                        this.blur(); break;
                    case this.KEY_PLUS: this.zoom(+1, this.getWidth() / 2); break; //+
                    case this.KEY_MINUS: this.zoom(-1, this.getWidth() / 2); break; //-
                    case this.KEY_LEFT: this.slide(-1); break; //<-
                    case this.KEY_RIGHT: this.slide(+1); break; //->
                }
            },

            /**
             * @private
             * Window resize event handler.
             * @param {jquery.Event} e
             */
            _handleResizing : function(e) {
                this.redraw();
                
                // band labels are redrawn separately
                // not needed to be redrawn each time the wrapped is moved
                this._bandLabels.redraw();
                this._fireEvent("resize", this);
            },

            /**
             * @private
             * Mouse wheel (zoom) event handler.
             * @param {jquery.Event} e
             */
            _handleZooming : function(e) {
                e.preventDefault(); // nerolovat
                var timelineLeft = this._htmlElement.position().left;
                var eventX = e.originalEvent.pageX;
                var timelineEventX = eventX - timelineLeft;
                var delta = null;
                if("deltaY" in e.originalEvent) delta = e.originalEvent.deltaY;
                if("wheelDelta" in e.originalEvent) delta = e.originalEvent.wheelDelta;
                var direction = delta < 0 ? -1 : 1;
                this.zoom(direction, timelineEventX);

                // FIALA Event for timeline zoom log
                this._fireEvent("timelineLogZoom", {direction : direction, timelineEventX : timelineEventX});
            },

            /**
             * @private
             * Timeline wrapper move event handler.
             * @param {jQuery.Event} e
             * @param {Number} secOffset second difference between original (before movement started) and current center-moment
             */
            _handleWrapperDragging : function(e, secOffset) {
                this._navbar.setDisplayTime(this._currentTime.clone().add(secOffset, moment.SECOND));
            },

            /**
             * @private
             * Timeline wrapper drop event handler.
             * @param {jQuery.Event} e
             * @param {Number} deltaDuration second difference between original (before dragging started) and new center-moment
             */
            _handleWrapperDropped : function(e, deltaDuration) {
                this._currentTime.add(deltaDuration, "seconds");
                this.redraw();
                this._fireEvent("timeChanged", this._currentTime, deltaDuration);
                // FIALA Event for timeline drop log
                this._fireEvent("timelineLogShifted", {currentTime : this._currentTime, deltaDuration: deltaDuration});
            },

            /**
             * @private
             * Timeline item click event handler.
             * @param {jQuery.Event} e
             */
            _handleItemClick : function(e) {
                var bandItemElm = $(e.currentTarget);
                var entity = this.getEntities().get(bandItemElm.data("entity")),
                    bandItem = this._bandGroup.getBand($(e.currentTarget).data("band")).getBandItem(entity.getId());

                // imiger trigger
                var ev = new CustomEvent('timelineClick', { detail: entity.getId() });
                window.parent.document.dispatchEvent(ev);

                if (document.modeForm.mode.value === 'move' && e.altKey === false) {
                    if (this._selected) {
                        this.blur();
                        e.preventDefault();
                        this._selected = false;
                        if (this._selectedEntity === entity.getId()) {
                            return;
                        }
                    }

                    this.focusItem(bandItem.getEntity(), false);
                    this._fireEvent("itemClick", entity);
                    // FIALA Event for item click
                    this._fireEvent("itemLogClick", entity);
                    this._selected = true;
                    this._selectedEntity = entity.getId();
                }
            },

            /**
             * @private
             * Timeline item mouseover event handler.
             * @param {jQuery.Event} e
             */
            _handleItemEnter : function(e) {            
                var entity = this.getEntities().get($(e.currentTarget).data("entity")),
                        bandItem = this._bandGroup.getBand($(e.currentTarget).data("band")).getBandItem(entity.getId());
                clearTimeout(this._popoverItemTimer);
                this._popoverItemTimer = setTimeout(new Closure(this, this._renderPopover, [bandItem, e]), this.option("popoverDelay"));
                this._renderGuidelines(bandItem, true);
                this._fireEvent("itemEnter", entity);

                // FIALA Event item enter
                this._fireEvent("itemLogEnter", entity);
            },

            /**
             * Timeline item mouseleave event handler.
             * @param {jQuery.Event} e
             */
            _handleItemLeave : function(e) {
                var entity = this.getEntities().get($(e.currentTarget).data("entity")),
                    bandItem = this._bandGroup.getBand($(e.currentTarget).data("band")).getBandItem(entity.getId());
                this._renderGuidelines(null, false);
                clearTimeout(this._popoverItemTimer);
                this._renderPopover(null, false);
                this._fireEvent("itemLeave", entity);
            },

            /**
             * Timeline item double click event handler.
             * @param {jQuery.Event} e
             */
            _handleItemRightClick : function(e) {
                e.preventDefault();
                e.stopPropagation();
                var entity = this.getEntities().get($(e.currentTarget).data("entity"));
                this._fireEvent("itemRightClick", entity);

                // FIALA Event item righ click
                this._fireEvent("itemLogRightClick", entity);
            },
            
            /**
             * @private
             * Item relation mouseenter event handler.
             * @param {jQuery.Event} e
             */
            _handleRelationEnter : function(e) {
                var target = $(e.currentTarget),
                    relation = this.getDataSource().getRelations().get(target.data("relation"));
                clearTimeout(this._popoverRelationTimer);
                this._popoverRelationTimer = setTimeout(new Closure(this, this._renderRelationPopover, [relation, e]), this.option("popoverDelay"));
                this._fireEvent("relationEnter", relation);

                // FIALA Event relation enter
                this._fireEvent("relationLogEnter", relation);
            },
            
            /**
             * @private
             * Item relation mouseleave event handler.
             * @param {jQuery.Event} e
             */
            _handleRelationLeave : function(e) {
                var target = $(e.currentTarget),
                    relation = this.getDataSource().getRelations().get(target.data("relation"));
                clearTimeout(this._popoverRelationTimer);
                this._renderRelationPopover(null, null, false);
                this._fireEvent("relationLeave", relation);
            },
            
            
            /**
             * @private
             * Item relation click event handler.
             * @param {jQuery.Event} e
             */
            _handleRelationClick : function(e) {
                var target = $(e.currentTarget),
                    relation = this.getDataSource().getRelations().get(target.data("relation"));
                this._fireEvent("relationClick", relation);
                // FIALA Event relation click
                this._fireEvent("relationLogClick", relation);
            },

        //</editor-fold>

    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="overridden">
    
        /** @see cz.kajda.timeline.Component#build */
        build : function() {
            this._htmlElement
                    .empty() // remove unused children elements
                    .addClass(this._options.cssPrefix);

            // create navbar
            this._navbar = new NavBar(this);
            this.addComponent(this._navbar);
            this._navbar.setDisplayTime(this._currentTime);

            // create wrapper
            this._wrapper = new Wrapper(this);
            this.addComponent(this._wrapper);
            
            // create bandgroup
            this._bandGroup = new BandGroup(this);
            this._wrapper.addComponent(this._bandGroup);

            // create ruler
            this._ruler = new Ruler(this);
            this._wrapper.addComponent(this._ruler);

            // create center time pointer
            this._createTimePointer();

            // add band labels
            this._bandLabels = new BandLabelContainer(this._bandGroup, this);
            this.addComponent(this._bandLabels);
            if(!this.option("showBandLabels")) this._bandLabels.hide();
            
            // add zoombar
            this._zoombar = new ZoomBar(this);
            this.addComponent(this._zoombar);
            if(!this.option("showZoombar")) this._zoombar.hide();
            
            
            this._attachTimelineEventListeners();

            return this._htmlElement;
        },
        
        /**
         * Returns projection instance that enables user to perform 
         * px <-> time and vice-versa transformations.
         * @returns {cz.kajda.timeline.Projection}
         */
        getProjection: function() {
            return this._projection;
        },
        
        /** @see cz.kajda.timeline.Component#getPrefixedCssClass */
        getPrefixedCssClass : function(className, cssSelector) {            
            return (cssSelector ? "." : "") + this._cssPrefix + (!isset(className) ? "" : "-" + className);
        },
    
        /**
         * @see cz.kajda.timeline.Component#redraw
         */
        redraw : function() {
            this.__groupDebug("Timeline widget redraw stats");
            var timer = new __DebugTimer("Total time");
            timer.start();
            
            // invalidate current interval
            this._currentInterval = null;
            
            this._renderGuidelines(null, false);
            this._renderPopover(null, false);
            this._wrapper.redraw();
            this._navbar.redraw();
            
            timer.dump();
            this.__closeGroupDebug();
        },
    
    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="getters">
    
        /**
         * @returns{cz.kajda.data.AbstractDataSource} datasource used by the timeline
         */
        getDataSource : function() {
            return this._dataSource;
        },
        
        /**
         * 
         * @param {cz.kajda.data.AbstractDataSource} source
         * @returns {undefined}
         */
        setDataSource : function(source) {
            this._dataSource = source;
            this._processData();
        },
        
        /**
         * @returns{cz.kajda.Collection} data collection
         */
        getEntities : function() {
            return this._dataSource.getEntities();
        },
    
        /**
         * @returns {moment} current center-moment
         */
        getTime : function() {
            return this._currentTime;
        },
    
        /**
         * @returns {jQuery} HTML container where the timeline is displayed
         */
        getViewport : function() {
            return this._htmlElement;
        },
        
        /**
         * Returns currently loaded time period in the timeline.
         * It is the triple of the viewport range.
         * @param {Boolean} round true if the boundary times should be rounded to closest scale interval of the maor axis
         * @returns{Object} {min : moment, max : moment}
         */
        getCurrentInterval : function(round /* = false */) {
            if(!round)
                return this.getZoomLevel().getBoundaries(this, this.getTime(), round);
            if(this._currentInterval === null) 
                this._currentInterval = this.getZoomLevel().getBoundaries(this, this.getTime(), round);
            return this._currentInterval;
        },
        
        /**
         * Returns time range visible within the viewport.
         * @returns {Object} {start : moment, end : moment}
         */
        getViewportRange : function() {
            var posLeft = -this._wrapper.getPosition().left;
            return {
                start : this._projection.px2moment(posLeft),
                end : this._projection.px2moment(posLeft + this.getWidth())
            };
        },
    
        /**
         * @returns{Number} currently used zoom level index
         */
        getZoom : function() {
            return this._zoomLevel;
        },
        
        /**
         * @returns{cz.kajda.timeline.ZoomLevel} currently used zoom level object
         */
        getZoomLevel : function() {
            return this._options.zoomLevels[this._zoomLevel];
        },
        
        /**
         * @returns{cz.kajda.timeline.band.BandGroup} band group object
         */
        getBandGroup : function() {
            return this._bandGroup;
        },
        
        /**
         * @returns{cz.kajda.timeline.Ruler} timeline ruler object
         */
        getRuler : function() {
            return this._ruler;
        },
        
        /**
         * @returns{cz.kajda.timeline.Wrapper} timeline wrapper object
         */
        getWrapper : function() {
            return this._wrapper;
        },
        
        /**
         * @returns{cz.kajda.timeline.NavBar} navigation bar object
         */
        getNavBar : function() {
            return this._navbar;
        },
        
        /**
         * @param {String} key option key
         * @param {Object} value if any passed, set as value for the key (default : null)
         * @returns{Object} timeline configuration info
         */
        option : function(key, value /* = null */) {
            if(isset(value) && isset(this._options[key])) {
                this._options[key] = value;
            }
            return this._options[key];
        },
    
    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="openly used">

        //<editor-fold defaultstate="collapsed" desc="focus & blur">

            /**
             * Returns entity represented by currently focused item (if any)
             * @param {Boolean} itemNeeded if true returns AbstractItem instead of AbstractEntity
             * @returns {cz.kajda.data.AbstractEntity|cz.kajda.timeline.AbstractItem} entity, item or null
             */
            getFocusedItem : function(itemNeeded /* = false */) {
                if(!isset(itemNeeded)) itemNeeded = false;
                
                if(this._focusedItem)
                    return itemNeeded ? this._focusedItem : this._focusedItem.getEntity();
                else
                    return null;
            },

            /**
             * Remove focus from the currently focused item (if any).
             * @returns {undefined}
             */
            blur : function() {
                if(!this._focusedItem) return;
                this._focusedItem.blur();
                this._fireEvent("itemBlur", this._focusedItem.getEntity());
                this._focusedItem = null;  
                this.getBandGroup().getRelationViewer().redraw();
            },

            /**
             * Adds focus to the item represented by the passed entity or its identifier.
             * @param {cz.kajda.data.AbstractEntity|Number} entity entity object or its identifier
             * @param {Boolean} adjust true if the item should fit into the viewport
             * @param {Boolean} includingZoom true if the zoom level should be adjusted to the entity too (default : true)
             * @returns {Boolean} true if succeed
             */
            focusItem : function(entity, adjust /* = true */, includingZoom /* = true */) {
                if(!isset(adjust)) adjust = true;
                if(!isset(includingZoom)) includingZoom = true;
                if(!(entity instanceof AbstractEntity))
                    entity = this._dataSource.getAllMappedEntities().get(entity);

                //Fiala pokud je to pod-entita nastavime jako puvodni ji a dale pouzijeme tu nad-entitu na focus
                var sourceEntity = null;
                if(entity.getParentEntity() !== null){
                    sourceEntity = entity;
                    entity = entity.getParentEntity();
                }  

                if(adjust) this.adjustTo(entity, includingZoom);
                var bandItem = this._bandGroup.getBandItem(entity.getId());

                if(bandItem === null) return;
                
                this.getBandGroup().getRelationViewer().redraw();

                if(bandItem.isFocused()) return;
                this.blur();
                bandItem.focus();
                this._focusedItem = bandItem;
                //Pokud to bylo podentita tak vypln informace o ni
                if(sourceEntity !== null){
                    this._fireEvent("itemFocus", sourceEntity);
                }
                else{
                    this._fireEvent("itemFocus", bandItem.getEntity());
                }
                return true;
            },
        
        //</editor-fold>

        //<editor-fold defaultstate="collapsed" desc="zoom & move">
        
            /**
             * Performs zoom in/out process or sets specific zoom level.
             * @param {Number} direction +1 to zoom in, -1 to zoom out or specific zoom level if the 3rd argument is true
             * @param {Number} offset position (px) related to the viewport where the zoom should be performed (if not specified, center time position is used)
             * @param {Boolean} specificLevel if true, first argument is treated as a zoom level index
             */
            zoom : function(direction, offset /* = null */, specificLevel /* = false */) {
                var origZoomLevel = this._zoomLevel;
                if(!isset(offset))
                    offset = this.getWidth() / 2;
                if(!isset(specificLevel)) specificLevel = false;
                
                var eventMoment = this.getProjection().px2moment(offset - this._wrapper.getPosition().left);
                var levels = this._options.zoomLevels;
                this._zoomLevel = specificLevel ? direction : this._zoomLevel + direction;
                
                // invalidate current interval
                this._currentInterval = null;

                // zoom level underflown
                if(this._zoomLevel < 0) {
                    this._zoomLevel = 0;
                    return;
                }

                // zoom level overflown
                if(this._zoomLevel >= levels.length) {
                    this._zoomLevel = levels.length - 1;
                    return;
                }

                eventMoment.add((this.getWidth() / 2 - offset) * this.getProjection().getSecondPerPixel(), "seconds");
                var timeChanged = !this._currentTime.isSame(eventMoment);

                this._currentTime = eventMoment;
                this._navbar.setDisplayTime(this._currentTime);

                this.redraw();

                if(timeChanged)
                    this._fireEvent("timeChanged", eventMoment);

                if(this._zoomLevel !== origZoomLevel) // only if the zoom level change was made
                    this._fireEvent("zoomChanged", direction, this._zoomLevel, offset);

            },
            
            /**
             * Performs keyboard alternative to the wrapper drag.
             * That means the wrapper is discontinuously moved.
             * @param {Number} direction movement direction (negative value for left, positive value for right)
             */
            slide : function(direction) {
                var zoomLevel = this.getZoomLevel();

                // computes new center time that will be valid after the slide
                var newTime = this._currentTime.clone().add(
                        Math.sign(direction) * this.getProjection().px2duration(this.getWidth()).asSeconds() * this._options.slideCoeficient,
                        moment.SECOND);

                // computes second offset between the new and the current center time
                var offsetSecs = newTime.unix() - this._currentTime.unix();

                // performs wrapper move by the corresponding number of pixels
                this._wrapper.moveBy(offsetSecs / this.getProjection().getSecondPerPixel());

                this._wrapper.getHtmlElement().css({
                    left : "+=" +  offsetSecs / this.getProjection().getSecondPerPixel()
                });
                this._currentTime = newTime;

                // fires timeChanged event
                this._navbar.setDisplayTime(this._currentTime);
                this.redraw();
                this._fireEvent("timeChanged", this._currentTime, moment.duration(offsetSecs, "seconds"));

            },
            
            /**
             * Adjusts current zoom level and center-moment to the passed entity
             * so that it can be fully displayed in the viewport.
             * @param {cz.kajda.data.AbstractEntity|Number} entity entity object or identifier
             * @param {Boolean} includingZoom (optional) if true sets optimal zoom level too (default : true)
             * @returns {Boolean} true if succeed
             */
            adjustTo : function(entity, includingZoom /* = true */) {
                if(!isset(includingZoom)) includingZoom = true;
                if(!(entity instanceof AbstractEntity)) entity = this._dataSource.getAllMappedEntities().get(entity);
                
                var duration, entityCenterMoment, i, bandItem, zl, selectedZl;

                bandItem = this._bandGroup.getBandItem(entity.getId());
                if(bandItem === null) return false;
                
                duration = entity.getDuration();
                entityCenterMoment = entity.isContinuous() ?
                    entity.getStart().clone().add(duration.valueOf() / 2, "millisecond")
                    : entity.getStart();

                if(includingZoom) {
                    for(i = 0; i < this._options.zoomLevels.length; ++i) {
                        zl = this._options.zoomLevels[i];
                        if(zl.canContainDuration(this,duration))
                            selectedZl = i;
                        else break;
                    }

                    this._zoomToLevel(selectedZl, entityCenterMoment);
                } else {
                    var oldTime = this._currentTime;
                    this._currentTime = entityCenterMoment;
                    if(!oldTime.isSame(this._currentTime))
                        this._fireEvent("timeChanged", this._currentTime);
                    this.redraw();
                }
                return true;
            },
            
            /**
             * Moves timeline in order to set the center time to the passed time.
             * @param {moment|String} time moment object or ISO representation
             */
            goTo : function(time) {
                if(!moment.isMoment(time))
                    time = moment.utc(time);
                
                if(time.isSame(this._currentTime)) return;
                
                this._currentTime = time;
                this.redraw();
                this._fireEvent("timeChanged", time);                
            },

         
        //</editor-fold>
        
        //<editor-fold defaultstate="collapsed" desc="component manipulation">
        
            showBandLabels : function(show /* = true */) {
                if(!isset(show)) show = true;
                if(show)
                    this._bandLabels.show();
                else
                    this._bandLabels.hide();
                this.option("showBandLabels", show);
            },
            
            showZoombar : function(show /* = true */) {
                if(!isset(show)) show = true;
                if(show) 
                    this._zoombar.show();
                else
                    this._zoombar.hide();
                this.option("showZoombar", show);
            },
            
            showTimePointer : function(show /* = true*/) {
                if(!isset(show)) show = true;
                if(show) 
                    this._timePointer.show();
                else
                    this._timePointer.hide();
                this.option("showTimePointer", show);
            },            
        
        //</editor-fold>

        /**
         * Checks whether the entity should be shown
         * according its priority and current zoom level.
         * @param {type} entity
         * @returns {Boolean}
         */
        matchesZoomLevel : function(entity) {
            var safeZl = this.option("safeZoomLevel"),
                    zlLen = this.option("zoomLevels").length,
                    zlScaleTurn = zlLen / safeZl;
            return this.getZoom() >= zlScaleTurn - Math.ceil(zlScaleTurn * entity.getPriority() / this.option("maxDataPriority"));
        },
        
        /**
         * Get localized phrase corresponding with the passed key.
         * If the phrase does not exist, the key quoted by "{}" is returned.
         * @param {String} key
         * @returns {String}
         */
        lc : function(key) {
            var lc = this.option("locale")[key];
            if(lc) return lc;
            return "{" + key + "}";
        }
    
    //</editor-fold>    
    
});


return Timeline;
});