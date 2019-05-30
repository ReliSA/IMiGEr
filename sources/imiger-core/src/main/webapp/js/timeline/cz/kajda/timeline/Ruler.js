/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'jquery',
    'cz/kajda/timeline/Component'
], function($, Component) {


/**
 * Ruler that contains major and minor time axis.
 * This component should be placed into timeline wrapper in order to be moved when dragged.
 */
var Ruler = Class("cz.kajda.timeline.Ruler", {
    
    _extends : Component,
    
    /** @see cz.kajda.timeline.Component */
    _constructor : function(timeline) {
        Component.call(this, timeline);
    },
    
    /** @see cz.kajda.timeline.Component#_cssPrefix */
    _cssPrefix : "ruler",
        
    //<editor-fold defaultstate="collapsed" desc="private members">

        /** @member {jQuery} jQuery */
        _majorAxisContainer : null,

        /** @member {jQuery} jQuery */
        _highlightElement : null,
         
    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="private methods">

        /**
         * Creates a scale segment of the major axis.
         * @param {String} label segment label
         * @param {Number} width segment width
         * @returns {Object} {scale : jQuery, minorAxis : jQuery}
         */
        _createScaleInterval : function(label, width) {
            var majorScale = new $('<div>')
                    .addClass(this.getPrefixedCssClass("major-axis-interval"))
                    .css("width", width);

            var label = new $('<div>')
                    .addClass(this.getPrefixedCssClass("major-axis-interval-label"))
                    .text(label)
                    .appendTo(majorScale);

            var minorAxis = new $('<div>')
                    .addClass(this.getPrefixedCssClass("minor-axis"))
                    .appendTo(majorScale);

            return {scale : majorScale, minorAxis : minorAxis};
        },

        /**
         * Creates a scale segment of the minor axis.
         * @param {Number} width segment width
         * @returns {jQuery}
         */
        _createMinorScaleInterval : function(width) {
            return new $('<div>')
                    .addClass(this.getPrefixedCssClass("minor-axis-interval"))
                    .css("width", width);
        },
        
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="overridden">   
    
        /** @see cz.kajda.timeline.Component#build  */
        build : function() {
            this._htmlElement = new $("<div>")
                    .addClass(this.getPrefixedCssClass());

            this._majorAxisContainer = new $("<div>")
                    .addClass(this.getPrefixedCssClass("major-axis"))
                    .appendTo(this._htmlElement);

            return this._htmlElement;
        },

        /** @see cz.kajda.timeline.Component#redraw  */
        redraw : function() {
            var timer = new __DebugTimer("Generating ruler");
            timer.start();
            var zoomLevel = this._timeline.getZoomLevel(),
                bounds = this._timeline.getCurrentInterval(true),
                scaleIntCount = zoomLevel.getScaleIntervalCountFor(this._timeline),
                majorScaleDuration = zoomLevel.getMajorScaleDuration(true),
                minorScaleDuration = zoomLevel.getMinorScaleDuration(true),
                // currently drawn scale interval start moment
                majorScaleMoment = bounds.min.clone(),
                majorScaleWidth,
                majorScalePosition = 0,
                // following scale interval start moment
                nextMajorScaleMoment,
                // start moment of the currently drawn minor axis scale interval
                minorScaleMoment,
                minorScaleWidth,
                minorScalePosition = 0,
                // start moment of the following drawn minor axis scale interval
                nextMinorScaleMoment,
                // object storing HTML representation of the scale interval
                currentScaleInterval,
                ISOrepaired = false;

            // empty container
            this._majorAxisContainer.empty();

            // drawing major axis scale intervals
            for(var i = 0; i < scaleIntCount; i++) {
                
                // getting next moment using duration defined by the current zoom level
                nextMajorScaleMoment = majorScaleMoment.clone().add(majorScaleDuration.val, majorScaleDuration.unit);
                // reset minor scale interval position counter
                minorScalePosition = 0;

                if(bounds.max.isBefore(majorScaleMoment))
                    break;

                // end of the 1st century BC correction (subtract a year)
                if(majorScaleMoment.isBC() && !nextMajorScaleMoment.isBC() && !ISOrepaired) {
                    nextMajorScaleMoment.subtract(1, "year");
                    ISOrepaired = true;
                    if(nextMajorScaleMoment.isSame(majorScaleMoment)) continue;
                }

                majorScaleWidth = this._timeline.getProjection().duration2px([majorScaleMoment, nextMajorScaleMoment]);
                currentScaleInterval = this._createScaleInterval(
                        majorScaleMoment.iformat(zoomLevel.getScaleIntervalFormat()),
                        majorScaleWidth);

                currentScaleInterval.scale.css("left", majorScalePosition);

                // first minor scale interval starts at the same point as the major one
                minorScaleMoment = majorScaleMoment.clone();

                // drawing scale intervals for minor axis of current major scale interval
                while(minorScaleMoment.isBefore(nextMajorScaleMoment)) {
                    nextMinorScaleMoment = minorScaleMoment.clone().add(minorScaleDuration.val, minorScaleDuration.unit);

                    minorScaleWidth = this._timeline.getProjection().duration2px([minorScaleMoment, nextMinorScaleMoment]);
                    currentScaleInterval.minorAxis.append(
                            this._createMinorScaleInterval(minorScaleWidth).css("left", minorScalePosition)
                    );

                    minorScaleMoment = nextMinorScaleMoment;
                    minorScalePosition += minorScaleWidth;
                }

                // add scale interval to the DOM
                currentScaleInterval.scale.appendTo(this._majorAxisContainer);

                // update currently drawn time
                majorScaleMoment = nextMajorScaleMoment;
                majorScalePosition += majorScaleWidth;
            }
            timer.dump();
        },
        
    //</editor-fold>
  
    /**
     * Draws duration highlight in the ruler.
     * @param {cz.kajda.timeline.BandItem} bandItem band item whose duration should be drawn
     * @param {Boolean} show decides whether show or hide highlight
     */
    highlightDuration : function(bandItem, show) {
        // remove old highlight element
        if(this._highlightElement !== null) {
            this._highlightElement.remove();
        }
        
        if(!show) return;
        var highlightElm = new $("<div>");
        highlightElm
                .addClass(this.getPrefixedCssClass("highlight-duration"))
                .css({
                    "left" : bandItem.getPosition().left,
                    "height" : this.getHeight(),
                    "width" : this.getTimeline().getProjection().moment2px(bandItem.getEntity().getEnd()) - bandItem.getPosition().left
                 });
        
        this._highlightElement = highlightElm;
        this._htmlElement.append(highlightElm);
    }
    
});


return Ruler;
});