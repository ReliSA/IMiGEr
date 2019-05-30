/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'cz/kajda/timeline/Component'
], function(Component) {
    

var ZoomBar = new Class("cz.kajda.timeline.ZoomBar", {
    
    _extends : Component,
    
    /** @see cz.kajda.timeline.Component */
    _constructor : function(timeline) {
        Component.call(this, timeline);
    },
    
    /** @see cz.kajda.timeline.Component#_cssPrefix */
    _cssPrefix : "zoombar",
    
    _zoomInBtn : null,
    _zoomOutBtn : null,
    
    //<editor-fold defaultstate="collapsed" desc="overridden">
        
        /** @see cz.kajda.timeline.Component#build */
        build : function() {
            this._htmlElement = new $("<div>")
                    .addClass(this.getPrefixedCssClass());
            
            this._zoomInBtn = new $("<a>")
                    .attr({
                        "href" : "#",
                        "title" : this.getTimeline().lc("btnZoomIn")
                    })
                    .addClass("tool-btn " + this.getPrefixedCssClass("zoom-in"))
                    .html("+");
            this._zoomOutBtn = new $("<a>")
                    .attr({
                        "href" : "#",
                        "title" : this.getTimeline().lc("btnZoomOut")
                    })
                    .addClass("tool-btn " + this.getPrefixedCssClass("zoom-out"))
                    .html("&minus;");
            
            this._htmlElement
                    .append(this._zoomInBtn)
                    .append(this._zoomOutBtn)
                    .on("click", this.getPrefixedCssClass("zoom-in", true), new Closure(this, this._handleZoom, +1))
                    .on("click", this.getPrefixedCssClass("zoom-out", true), new Closure(this, this._handleZoom, -1));
            
            this.getTimeline().addListener("zoomChanged", new Closure(this, this._updateBtns));
            this._updateBtns(0, this.getTimeline().getZoom());
            return this._htmlElement;
        },
        
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="private methods">

        _handleZoom : function(e, direction) {
            e.preventDefault();
            this.getTimeline().zoom(direction);
        },
        
        _updateBtns : function(dir, zl) {
            if(zl > 0)
                this._zoomOutBtn.removeClass("disabled");
             else 
                this._zoomOutBtn.addClass("disabled");
            if(zl < this.getTimeline().option("zoomLevels").length - 1)
                this._zoomInBtn.removeClass("disabled");
            else
                this._zoomInBtn.addClass("disabled");
        }

    //</editor-fold>

    
});


return ZoomBar;
});