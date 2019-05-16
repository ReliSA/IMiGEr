/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'jquery',
    'cz/kajda/timeline/Component'
],
function($, Component) {

/**
 * Feature that informs user what the current center-time is
 * and enables him to change it using appropriate buttons.
 * @memberOf cz.kajda.timeline
 */
var NavBar = Class("cz.kajda.timeline.NavBar", {
   
    _extends : Component,
    
    /** @see cz.kajda.timeline.Component */
    _constructor : function(timeline) {
        Component.call(this, timeline);
    },
    
    //<editor-fold defaultstate="collapsed" desc="private members">

        /** @see cz.kajda.timeline.Component#_cssPrefix */
        _cssPrefix : "navbar",
    
        /** @member {moment} time display in the bar */
        _displayTime : null,

        /** @member {jQuery} HTML element used to display time */
        _centerLabel : null,
        
        /** @member {jQuery} */
        _prevBtn : null,
        
        /** @member {jQuery} */
        _nextBtn : null,
        
    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="private methods">
        
        _handleNav : function(e, direction) {
            e.preventDefault();
            this.getTimeline().slide(direction);
        },
        
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="overridden">
    
        /** @see cz.kajda.timeline.Component#redraw */
        redraw : function() {
            var zoomLevel = this._timeline.getZoomLevel();
            this._centerLabel.text(this._displayTime.iformat(zoomLevel.getDisplayFormat()));
            this.__super.redraw.call(this);
        },

        /** @see cz.kajda.timeline.Component#build */
        build : function() {
            this._htmlElement = new $("<div>")
                    .addClass(this.getPrefixedCssClass());

            var lSide = new $("<div>")
                    .addClass(this.getPrefixedCssClass("left"))
                    .appendTo(this._htmlElement);
            

            this._centerLabel = new $("<div>")
                    .addClass(this.getPrefixedCssClass("center"))
                    .appendTo(this._htmlElement);
            
            var rSide = new $("<div>")
                    .addClass(this.getPrefixedCssClass("right"))
                    .appendTo(this._htmlElement);

            this._prevBtn = new $("<a>")
                    .attr("href", "#")
                    .html("&laquo; " + this.getTimeline().lc("btnSlideBack"))
                    .addClass(this.getPrefixedCssClass("prev-btn"))
                    .appendTo(lSide);
            
            this._nextBtn = new $("<a>")
                    .attr("href", "#")
                    .html(this.getTimeline().lc("btnSlideForward") + " &raquo;")
                    .addClass(this.getPrefixedCssClass("next-btn"))
                    .appendTo(rSide);

            return this._htmlElement
                    .on("click", this.getPrefixedCssClass("prev-btn", true), new Closure(this, this._handleNav, -1))
                    .on("click", this.getPrefixedCssClass("next-btn", true), new Closure(this, this._handleNav, +1));

            this._htmlElement;
        },
        
    //</editor-fold>

    /**
     * Changes the displayed time.
     * @param {moment} momentObj
     */
    setDisplayTime : function(momentObj) {
        this._displayTime = momentObj;
        this.redraw();
    }
    
});


return NavBar;
});