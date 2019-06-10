/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'jquery',
    'cz/kajda/timeline/Component'
], function($, Component) {

/**
 * Enables user to create overlay layer containing the band labels above the timeline.
 * It prevents the labels from being dragged simultaneously with the wrapper.
 * @memberOf cz.kajda.timeline.band
 */
var BandLabelContainer = new Class("cz.kajda.timeline.band.BandLabelContainer", {
   
    _extends : Component,
    
    /**
     * @construct
     * @see cz.kajda.timeline.Component
     * @param {cz.kajda.timeline.band.BandGroup} bandGroup
     * @param {cz.kajda.timeline.Timeline} timeline
     */
    _constructor : function(bandGroup, timeline) {
        Component.call(this, timeline);
        this._bandGroup = bandGroup;
    },
    
    //<editor-fold defaultstate="collapsed" desc="private members">v

        /** @see cz.kajda.timeline.Component#_cssPrefix */
        _cssPrefix : "band-legend",

        /** @member {cz.kajda.timeline.BandGroup} */
        _bandGroup : null,
        
    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="overridden">

        /** @see cz.kajda.timeline.Component#build */
        build : function() {
            this._htmlElement = new $("<div>")
                    .addClass(this.getPrefixedCssClass())
            return this._htmlElement;
        },

        /** @see cz.kajda.timeline.Component#redraw */
        redraw : function() {

            var band, bandId, bandLabel,
                bands = this._bandGroup.getBands();

            this.getHtmlElement().empty().css({
                "height" : this._bandGroup.getHeight(),
                "top" : this._bandGroup.getAbsolutePosition().top
            });

            for(bandId in bands) {
                band = bands[bandId];
                bandLabel = new $("<div>")
                        .addClass(this.getPrefixedCssClass("item"))
                        .css({
                            "top" : band.getPosition().top
                        })
                        .text(band.getLabel());
                this.getHtmlElement().append(bandLabel);
            }
        }
    
    //</editor-fold>
    
});



return BandLabelContainer;
});