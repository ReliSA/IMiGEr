/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'jquery',
    'jqueryui',
    'cz/kajda/timeline/Component',
    'momentjs'
], function($, ui, Component, moment) {


/**
 * Wraps all the widget parts that should be moved.
 * @memberOf cz.kajda.timeline
 */
var Wrapper = Class("cz.kajda.timeline.Wrapper", {
    
    _extends : Component,
    
    _constructor : function(timeline) {
        Component.call(this, timeline);
    },
    
    
    /** @see cz.kajda.timeline.Component#_cssPrefix */
    _cssPrefix : "wrapper",
    
    //<editor-fold defaultstate="collapsed" desc="private members">

        /** @member {Number} stores relative position before dragging starts */
        _positionBeforeMove : 0,

        /** @member {Array} stores entity guideline jQuery objects */
        _guidelines : [],
        
    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="overridden">
        
        /**
         * @see cz.kajda.timeline.Component#build
         */
        build : function() {
            this._htmlElement = new $("<div>")
                    .addClass(this.getPrefixedCssClass())
                    .css("left", -this._parent.getWidth())
                    .draggable({
                        axis: "x"
                    })
                    .on("dragstop", new Closure(this, this.handleWrapperDropped))
                    .on("dragstart", new Closure(this, this.handleWrapperDragged))
                    .on("drag", new Closure(this, this.handleWrapperDragging));
            return this._htmlElement;
        },

        /**
         * @see cz.kajda.timeline.Component#redraw
         */
        redraw : function() {
            var viewportWidth = this._timeline.getWidth(),
                projection = this._timeline.getProjection(),
                time = this._timeline.getTime();
            this._htmlElement.css("left", viewportWidth / 2 - projection.moment2px(time));
            this.__super.redraw.call(this);
        },
    
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="event handlers">

        /**
         * Fires when user starts dragging the wrapper.
         */
        handleWrapperDragged : function(e) {
            this._positionBeforeMove = this._htmlElement.position().left;
            this.getHtmlElement().css("cursor","ew-resize");
            this._fireEvent("dragged", e);
        },

        /**
         * Fires when user drops the wrapper.
         */
        handleWrapperDropped : function(e) {
            deltaPx = this._positionBeforeMove - this._htmlElement.position().left;
            
            var zoomLevel = this._timeline.getZoomLevel();
            var secsPerPx =  zoomLevel.getSecondsPerPixel();
            
            this.getHtmlElement().css("cursor","default");
            this._fireEvent("dropped", e, moment.duration(secsPerPx * deltaPx, "seconds"));
        },

        /**
         * Being fired when user is dragging the wrapper.
         */
        handleWrapperDragging : function(e, ui) {
            deltaPx = this._positionBeforeMove - ui.position.left;
            
            var viewportWidth = this._timeline.getWidth();
            var zoomLevel = this._timeline.getZoomLevel();
            var secsPerPx =  zoomLevel.getSecondsPerPixel();
            
            this._fireEvent("dragging", e, secsPerPx * deltaPx);
        },

    //</editor-fold>

    
    /**
     * Moves wrapper by passed number of pixels.
     * @param {Number} deltaPx 
     */
    moveBy : function(deltaPx) {
        this.getHtmlElement().css({
            left : "+=" + deltaPx
        });
    },
    
    /**
     * Draws guidelines that help user to identify entity duration in the ruler.
     * If the entity is not continuous, just draws a guideline in the centre of the represented moment.
     * @param {cz.kajda.timeline.BandItem} bandItem band item what guidelines should be drawn for
     * @param {Boolean} show decides whether display guidelines or hide them
     */
    drawGuidelines : function(bandItem, show) {
        // empty stored guidelines
        for(var i = 0; i < this._guidelines.length; i++)
            this._guidelines[i].remove();
        
        this._guidelines = [];
        
        // should be hidden
        if(isset(show) && show === false)
            return;
        
        var entity = bandItem.getEntity(),
                bandItemPosition = bandItem.getPosition(),
                entityAbsTopPosition = bandItemPosition.top + bandItem.getBand().getPosition().top;
        var jGuidelineLeft = new $("<div>");
        jGuidelineLeft
                .addClass(this.getPrefixedCssClass("guideline"))
                .css({
                    "border-left-width" : 1,
                    "height" : this.getHeight() - entityAbsTopPosition - bandItem.getHeight(),
                    // x-position depends on continuity of the entity
                    "left" : this._timeline.getProjection().moment2px(entity.getStart()),
                    "top": entityAbsTopPosition + bandItem.getHeight()
                });
        this._guidelines.push(jGuidelineLeft);
        this.getHtmlElement().append(jGuidelineLeft);
        
        // if the entity is continuous, create right guideline too
        if(entity.isContinuous()) {
            var jGuidelineRight = new $("<div>");
            jGuidelineRight
                    .addClass(this.getPrefixedCssClass("guideline"))
                    .css({
                        "border-right-width" : 1,
                        "height" : this.getHeight() - entityAbsTopPosition - bandItem.getHeight(),
                        "left" : this._timeline.getProjection().moment2px(entity.getEnd()),
                        "top": entityAbsTopPosition + bandItem.getHeight()
                    });
            this.getHtmlElement().append(jGuidelineRight);
            this._guidelines.push(jGuidelineRight);
        }
        
    }
    
});



return Wrapper;
});