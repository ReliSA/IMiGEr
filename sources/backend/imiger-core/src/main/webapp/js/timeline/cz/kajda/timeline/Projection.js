/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'momentjs'
], function(moment) {



/** * 
 * Handles location to time transformation and vice-versa.
 * 
 * Computes x-position [pixels] that corresponds with the specific moment
 * or time at position specified by pixel value.
 * For these purpose, it uses zoom level and center-moment information.
 */

var Projection = new Class("cz.kajda.timeline.Projection", {
        
    /**
     * @param {cz.kajda.timeline.Timeline} 
     */
    _constructor: function(timeline) {
        this._timeline = timeline;
    },
    
    //<editor-fold defaultstate="collapsed" desc="private members">

        /** @member {cz.kajda.timeline.Timeline} */
        _timeline : null,
        
    //</editor-fold>
    
    /**
     * Converts passed moment to x-osition that is relative to the timeline viewport content.
     * @returns{Number}
     */
    moment2px : function(oMoment) {
        return (oMoment.unix() - this._timeline.getCurrentInterval(true).min.unix()) / this.getSecondPerPixel();
    },
    
    /**
     * Converts time duration to an amount of pixels.
     * @param {moment.duration|Array} duration duration object or an array containing two moments (duration boundaries)
     * @returns {Number}
     */
    duration2px : function(duration) {
        if(duration instanceof Array) {
            duration = moment.duration(duration[1].unix() - duration[0].unix(), moment.SECOND);
        }
        return duration.asSeconds() / this.getSecondPerPixel();
    },
    
    /**
     * Converts amount of pixels to a time duration.
     * @param {Number} pxs
     * @returns{moment.duration}
     */
    px2duration : function(pxs) {
        return moment.duration(pxs * this.getSecondPerPixel(), moment.SECOND);
    },
    
    /**
     * Converts passed pixel x-position to the corresponding moment.
     * The pixel value is expected to be a position relative to the timeline viewport content.
     * @returns{moment}
     */
    px2moment : function(px) {        
        return moment.unix(px * this.getSecondPerPixel() + this._timeline.getCurrentInterval(true).min.unix());
        
    },
    
    /**
     * Returns number of seconds that corresponds to a pixel in the timeline.
     * @returns{Number}
     */
    getSecondPerPixel : function() {
        return this._timeline.getZoomLevel().getSecondsPerPixel();
        
    }
    
});


return Projection;
});