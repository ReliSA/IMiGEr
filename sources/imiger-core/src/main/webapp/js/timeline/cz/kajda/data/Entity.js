/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'momentjs',
    'cz/kajda/data/AbstractEntity',
    /* FIALA */
    'cz/kajda/data/Collection',
    'cz/kajda/data/SubEntity'
],
function(moment, AbstractEntity, /* FIALA */ Collection, SubEntity) {
    
/**
 * Default implementation of the class mapping database items to an entity.
 * @memberOf {cz.kajda.data}
 */
var Entity = new Class("cz.kajda.data.Entity", {

    _extends : AbstractEntity,

    /**
     * @constructor
     * @param {Object} data data to be mapped
     */
    _constructor : function(data) {
         AbstractEntity.call(this, data.id);

         this._title = data.name;
         this._priority = data.importance ? data.importance : 100;
         this._startTime = moment.utc(data.begin);
         this._stereotype = data.stereotype;
         this._properties = data.properties ? data.properties : null;
         this._continuous = isset(data.end);
         this._description = data.description;
		 // FIALA
         this._subEntities = data.subItems ? [] : null;
         this._css = data.css ? data.css : null;

         // set default precision if none is present
         data.properties.startPrecision = this.has("startPrecision") ? this.property("startPrecision") : this._DEF_PRECISION;

         // copy starttime precision if endtime one is not present
         if(!isset(data.properties.endPrecision))
             this.property("endPrecision", this.property("startPrecision"));

         this._endTime = this._guessEndTime(this._startTime, data.end, this.property("startPrecision"));
         if(data.inEdges && data.outEdges)
            this._relationIds = data.inEdges.concat(data.outEdges);
    },

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

    //<editor-fold defaultstate="collapsed" desc="private members">
    
        _DEF_PRECISION : "day",
        _NO_PRECISION : "none",

        _stereotype : null,
        _priority : null,
        _title : null,
        _startTime : null,
        _endTime : null,
        _continuous : null,
        _properties : null,
        _description : null,
        /**
         * @author Michal Fiala
         * Array for subEntities
         */
        _subEntities : null,
        /**
         * @author Michal Fiala
         * css of entity
         */
        _css : null,
        /**
         * @author Michal Fiala
         * parent entity
         */
        _parentEntity : null,
    //</editor-fold>  
   
    //<editor-fold defaultstate="collapsed" desc="private methods">
       
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
                    this.__exception("Missing end time for entity.");
                return mStartTime.clone().add(1, precision).subtract(1, "second");
            }
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
        
    //</editor-fold>    
    
    //<editor-fold defaultstate="collapsed" desc="getters & setters">
    
        /**
         * Checks whether the entity represents a moment or an interval.
         * Returned value is not influenced by presence of start and end time.
         * @returns {Boolean}
         */
        isContinuous : function() {
            return this._continuous;
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

        /**
         * @returns {moment} start time of represented event
         */
        getStart : function() {
            return this._startTime;
        },

        /**
         * @returns {moment} ned time of represented event
         */
        getEnd : function() {
            return this._endTime;
        },

        /**
         * @returns {String} entity stereotype identifier
         */
        getType : function() {
            return this._stereotype;
        },

        /**
         * @returns {Number} priority as a number between 1 and 100 (inc)
         */
        getPriority : function() {
            return this._priority;
        },

        /**
         * @returns {String}
         */
        getDescription : function() {
            return this._description;
        },

        /**
         * @returns {String} entity title
         */
        getTitle : function() {
            return this._title;
        },

        /**
         * @returns {String} start time in the format matching its precision
         */
        getStartFormatted : function() {
            return this._formatDate(this.getStart(), "startPrecision");
        },

        /**
         * If the entity is considered as a moment, its end time should not have been specified.
         * Therefore, if the entity represents interval, returns its end time.
         * Othewise (the entity represents MOMENT), it returns NULL! 
         * @returns {String} end time in the format matching its precision
         */
        getEndFormatted : function() {
            if(!this._continuous) return null;
            return this._formatDate(this.getEnd(), "endPrecision");
        },

        /**
         * Returns moment.duration object corresponding with true duration of the presicion level.
         * @param {String} precisionProp precision level
         * @returns {moment.duration}
         */
        getPrecisionDuration : function(precisionProp) {
            if(!this.has(precisionProp)) return null;
            return this._PRECISION_DURATION[this.property(precisionProp)];
        },

        /**
         * @author Michal Fiala
         * @returns {Array<SubEntity>} subEntities of Entity
         */ 
        getSubEntities : function()
        {
            return this._subEntities;
        },
        /**
         * @author Michal Fiala
         * @param {SubEntity} subEntity to be added
         */ 
        addSubEntity : function(subEntity)
        {
            this._subEntities.push(subEntity);
        },
        /**
         * @author Michal Fiala
         * @returns {Boolean}
         */ 
        issetSubEntities : function() {
            if(this._subEntities === null) return false;
            
            return true;
        },
        /**
        * @author Michal Fiala
        * @returns {Entity} parent entity
        */
        getParentEntity : function(){
            return this._parentEntity;
        }
    
    //</editor-fold>
    
});


return Entity;
});


