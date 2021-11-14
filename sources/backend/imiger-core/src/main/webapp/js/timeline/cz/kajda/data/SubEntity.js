/**
 * @author Michal Fiala
 * @version 1.0
 */
define([
    'momentjs',
    'cz/kajda/data/AbstractEntity'
],
function(moment, AbstractEntity) {
    
/**
 * Default implementation of the class mapping database items to an subentity.
 * @memberOf {cz.kajda.data}
 */
var SubEntity = new Class("cz.kajda.data.SubEntity", {

    _extends : AbstractEntity,

    /**
     * @constructor
     * @param {Object} data data of subitem to be mapped
     */
    _constructor : function(data, entity) {
        AbstractEntity.call(this, data.id);

         this._startTime = moment.utc(data.begin);
         this._continuous = isset(data.end);
         this._endTime = this._guessEndTime(this._startTime, data.end, this._DEF_PRECISION);
         this._cssClasses = data.css ? data.css : null;
         this._title = data.name;

         this._type = data.type ? data.type : null;

         this._parentEntity = entity;

         this._description = data.description;
    },
    _title : null,
    _startTime : null,
    _endTime : null,
    _continuous : null,
    _type: null,
    _cssClasses : null,
    _parentEntity : null,
    _description: null,
    _properties : null,

    _PRECISION_FORMAT : {
        "none" : "D. MMMM YYyy H.mm:ss",
        "day" : "D. MMMM YYyy",
        "month" : "MMMM YYyy",
        "year" : "YYyy",
        "decade" : "dc [l]ét[a] CC",
        "century" : "CC"
    },
    _PRECISION_DURATION : {
        "none" : null,
        "day" : moment.duration(1, "day"),
        "month" : moment.duration(1, "month"),
        "year" : moment.duration(1, "year"),
        "decade" : moment.duration(10, "year"),
        "century" : moment.duration(100, "year")       
    },

    _DEF_PRECISION : "day",
    _NO_PRECISION : "none",
   
    /**
     * If end time is specified, it is returned.
     * Otherwise finds out end time using start time precision.
     * If start time is 2015-01-01 00:00 and its precision is DAY,
     * this method returns time matching 2015-01-01 23:59.
     * @param {moment} mStartTime
     * @param {moment} endTime
     * @param {String} precision precision expression
     * @returns {moment}
     */
    _guessEndTime : function(mStartTime, endTime, precision) {
        if(isset(endTime)) // end time is set, use it
            return moment.utc(endTime);
        else { // find out end time using start time precision
            if(!isset(precision))
                this.__exception("Missing end time for sub-entity.");
            return mStartTime.clone().add(1, precision).subtract(1, "second");
        }
    },

    /**
     * Checks whether the entity represents a moment or an interval.
     * Returned value is not influenced by presence of start and end time.
     * @returns {Boolean}
     */
    isContinuous : function() {
        return this._continuous;
    },

    /**
     * @returns {moment} start time of represented event
     */
    getStart : function() {
        return this._startTime;
    },
    /**
     * @returns {String}
    */
    getDescription : function() {
        return this._description;
    },
    /**
     * @returns {moment} end time of represented event
     */
    getEnd : function() {
        return this._endTime;
    },
    getCssClasses : function() {
        if(this._cssClasses === null)
            return "";
        return this._cssClasses;
    },
    /**
     * @returns {type} type of subEntity
     */
    getType : function(){
        return this._type;
    },

    /**
     * @returns {String} entity title
     */
    getTitle : function() {
        return this._title;
    },
    /**
     * @returns {Entity} parent entity
     */
    getParentEntity : function(){
        return this._parentEntity;
    },

    /**
     * @returns {String} start time in the format matching its precision
     */
    getStartFormatted : function() {
        return this._formatDate(this.getStart(), this._DEF_PRECISION);
    },

    /**
     * If the entity is considered as a moment, its end time should not have been specified.
     * Therefore, if the entity represents interval, returns its end time.
     * Othewise (the entity represents MOMENT), it returns NULL! 
     * @returns {String} end time in the format matching its precision
     */
    getEndFormatted : function() {
        if(!this._continuous) return null;
        return this._formatDate(this.getEnd(), this._DEF_PRECISION);
    },

    /**
     * Formats time according its precision format.
     * @param {moment} momentObj time
     * @param {String} precisionProp precision level
     * @returns {String}
     */
    _formatDate : function(momentObj, precisionProp) {
        var format = this._PRECISION_FORMAT[this.property(precisionProp) === null ? this._NO_PRECISION : this.property(precisionProp)];
        return momentObj.iformat(format);
    },

    
    /**
     * Returns property value if is available.
     * Otherwise returns null.
     * @param {String} key
     * @returns {Object}
     */
    property : function(key) {
        if(this._properties === null || !isset(this._properties[key])) return null;
        return this._properties[key];
    },
    //</editor-fold>
    
});


return SubEntity;
});