/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'momentjs'
], function(moment) {
    
    
/**
 * Zoom level defines what is the duration of a scale interval in the major and minor axis,
 * what format should be used for time interpretation etc., all for the current level of zoom.
 * @memberOf cz.kajda.timeline
 */
var ZoomLevel = new Class("cz.kajda.timeline.ZoomLevel", {
    
    /**
     * @constructor
     * @param {Array} durationPerPixel [Number, String] specifies duration represented by a pixel of the timeline width
     * @param {Array} majorScaleDuration [Number, String] scale interval duration in the major axis
     * @param {Array} minorScaleDuration scale interval duration in the minor axis
     * @param {String} scaleIntervalFormat time format for scale interval labels in the major axis
     * @param {String} displayFormat time format used for interpretation of the center-time
     */
    _constructor : function(durationPerPixel, majorScaleDuration, minorScaleDuration, scaleIntervalFormat, displayFormat) {
        this._secondsPerPixel = moment.duration(durationPerPixel[0], durationPerPixel[1]).asSeconds();
        this._scaleIntervalFormat = scaleIntervalFormat;
        this._displayFormat = displayFormat;
        this._majorScaleDuration = {"val" : majorScaleDuration[0], "unit" : majorScaleDuration[1]};
        this._minorScaleDuration = {"val" : minorScaleDuration[0], "unit" : minorScaleDuration[1]};
    },
    
    //<editor-fold defaultstate="collapsed" desc="private members">

        /** @member {Number} number of seconds represented by a pixel */
        _secondsPerPixel : null,
        /** @member {String} label format for major scale interval */
        _scaleIntervalFormat : null,
        /** @member {String} format for center-time representation */
        _displayFormat : null,
        /** @member {Array} major scale interval duration [value : Number, unit : String] */
        _majorScaleDuration : null,
        /** @member {Array} minor scale interval duration [value : Number, unit : String] */
        _minorScaleDuration : null,
        
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="private methods">
        

        /**
         * @private
         * Passed moment rounds to the closest scale interval moment according to passed method type (ceil/floor).
         * For instance, when the scale intervals last for 15 mins, the time 16:23 rounds to 16:30 or to 16:15.
         * @param {moment} momentObj
         * @param {Boolean} ceilMethod true if ceil method should be used
         * @returns {moment} new moment object
         */
        _round2scale : function(momentObj, ceilMethod) {
            var scaleDuration = this.getMajorScaleDuration(true);
            // get the time as a number of scale interval units that the moment differs from 1/1/1BC by
            var minUnited = momentObj.diff(moment.Y1BC, scaleDuration.unit, true) / scaleDuration.val;
            
            // ceil the number of units and add it to the 1/1/1BC moment
            var newMoment = moment.Y1BC.clone().add(
                    (ceilMethod ? Math.ceil(minUnited) : Math.floor(minUnited)) * scaleDuration.val, 
                    scaleDuration.unit);  
            
            return newMoment;
        },
        
    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="getters">

        /**
         * Computes number of time segments so that they fill triple size of the passed timeline viewport.
         * @param {cz.kajda.timeline.Timeline} timeline timeline what the number is computed for
         * @returns {Number} number of time segments
         */
        getScaleIntervalCountFor : function(timeline) {
            var avgScaleIntWidth = this.getMajorScaleDuration().asSeconds() / this._secondsPerPixel;       
            return Math.ceil(timeline.getWidth() * 3 / avgScaleIntWidth);
        },

        /**
         * Returns duration for a scale interval of the major axis.
         * Depending on the argument, moment.duration or simple object can be returned.
         * @param {Boolean} orig true to obtain initial object { val : Number, unit : String }
         * @returns{moment.duration|Object}
         */
        getMajorScaleDuration : function(orig /* = false */) {
            if(isset(orig) && orig) return this._majorScaleDuration;
            return moment.duration(this._majorScaleDuration.val, this._majorScaleDuration.unit);
        },

        /**
         * Returns duration for a scale interval of the minor axis.
         * Depending on the argument, moment.duration or simple object can be returned.
         * @param {Boolean} orig true to obtain initial object { val : Number, unit : String }
         * @returns{moment.duration|Object}
         */
        getMinorScaleDuration : function(orig /* = false */) {
            if(isset(orig) && orig) return this._minorScaleDuration;
            return moment.duration(this._minorScaleDuration.val, this._minorScaleDuration.unit);
        },

        /**
         * @returns{Number} number of seconds reresented by a pixel
         */
        getSecondsPerPixel : function() {
            return this._secondsPerPixel;
        },

        /**
         * @returns{String} format used for scale interval labels
         */
        getScaleIntervalFormat : function() {
            return this._scaleIntervalFormat;
        },

        /**
         * @returns{String} format used to represent current center-time
         */
        getDisplayFormat : function() {
            return this._displayFormat;
        },

        /**
         * Returns boundary time moments for the passed center-time.
         * @param {cz.kajda.timeline.Timeline} timeline
         * @param {moment} momentObj current center-time
         * @param {Boolean} round true if the boundary times should be rounded to closest scale interval of the maor axis
         * @returns{Object} {min : moment, max : moment}
         */
        getBoundaries : function(timeline, momentObj, round /* = false */) {
            if(!isset(round)) round = false;
            var vd = timeline.getWidth() * this._secondsPerPixel;
            var min = moment.max(timeline._options.minTime, momentObj.clone().subtract(vd * 3 / 2, moment.SECOND)),
                max = moment.min(timeline._options.maxTime, momentObj.clone().add(vd * 3 / 2, moment.SECOND)),
                minr, maxr;
        
            if(round) {
                minr = this.floor2scale(min);
                maxr = this.ceil2scale(max);
                if(!minr.isValid()) minr = this.floor2scale(timeline._options.minTime);
                if(!maxr.isValid()) maxr = this.ceil2scale(timeline._options.maxTime);
            }
            
            if(minr.isBC() && !maxr.isBC())
                minr.add(1, moment.YEAR);
            
            return {
                min : round ? minr : min,
                max : round ? maxr : max
            };
        },
        
    //</editor-fold>

    
    /**
     * Finds out if the passed duration can be fully displayed
     * when this zoom level is used.
     * @param {cz.kajda.timeline.Timeline} timeline
     * @param {moment.duration} duration
     * @returns{Boolean} true if the passed duration can be fully displayed
     */
    canContainDuration : function(timeline, duration) {
        return timeline.getWidth() * this._secondsPerPixel > duration.asSeconds();
    },
    
    /**
     * Passed moment rounds to the closest (lower) scale interval moment.
     * For instance, when the scale intervals last for 15 mins, the time 16:23 rounds to 16:15.
     * @param {moment} momentObj
     * @returns {moment} new moment object
     */
    floor2scale : function(momentObj) {
        return this._round2scale(momentObj, false);
    },
    
    
    /**
     * Passed moment rounds to the closest (greater) scale interval moment.
     * For instance, when the scale intervals last for 15 mins, the time 16:23 rounds to 16:30.
     * @param {moment} momentObj
     * @returns {moment} new moment object
     */
    ceil2scale : function(momentObj) {
        return this._round2scale(momentObj, true);
    }
    
});



return ZoomLevel;
});