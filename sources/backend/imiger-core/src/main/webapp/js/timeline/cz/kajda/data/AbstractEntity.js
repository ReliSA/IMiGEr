/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'momentjs',
    "cz/kajda/data/AbstractRelation",
    "cz/kajda/common/Identifiable"
],
function(moment, AbstractRelation, Identifiable) {


/**
 * @abstract
 * Abstract of the entity.
 * Entity is used for storing data that should be visualized in the timeline.
 * That means the entity carries all the information associated with its graphic representation.
 * 
 * @memberOf {cz.kajda.data}
 */
var AbstractEntity = new Class("cz.kajda.data.AbstractEntity", {
    
    _implements : [Identifiable],
    
    /**
     * @constructor
     * @param {Number} id unique identifier
     */
    _constructor : function(id) {
        this._id = Number(id);
        this._relationIds = [];
    },
    
    //<editor-fold defaultstate="collapsed" desc="private members">
    
        /** @member {Number} unique identifier */
        _id : null,

        /** @member {Number[]} array of involved relations identifiers */
        _relationIds : null,
        
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="overridden">
        
        /** @see cz.kajda.common.Identifiable#getId */
        getId : function() {
            return this._id;
        },
        
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="getters & setters">

        /**
         * @abstract
         * @returns {String} entity title
         */
        getTitle : function() {
            this.__abstract("getTitle");
        },

        /**
         * @abstract
         * Returns time when the entity duration starts.
         * If the complete date is not known (e.g. only year is specified), the earliest moment of the time is used.
         * That means if the entity should start in 1898, the date 1898-01-01T00:00 is set as the start of entity duration.
         * @returns {moment} exact or approximate moment specifying when the entity begins in time
         */
        getStart : function(){
            this.__abstract("getStart");
        },

        /**
         * @abstract
         * returns time when the entity duration ends.
         * - If the entity is continuous and the complete date is not known (e.g. only year is specified), the last moment of the time is used.
         *   That means if the entity should end in 1898, the date 1898-12-31T23:59 is set as the end of entity duration.
         * - If the entity is just a moment and its start is not a complete date, the end of the start inaccuracy duration is set as end.
         *   That means if the entity start is set to 1898 (i.e. 1898-01-01T00:00), its inaccuracy is a year so the end is set to 1898-31-12T23:59.
         * @returns{moment} exact or approximate moment specifying when the entity ends in time
         */
        getEnd : function() {
            this.__abstract("getEnd");
        },

        /**
         * Returns accurate or approximate duration (depends on entity type – continuous or moment).
         * @returns{moment.duration} duration object
         */
        getDuration : function() {
           return moment.duration(this.getEnd().diff(this.getStart()));
        },

        /**
         * @abstract
         * Returns type of the entity. The type is usually used for entity graphic classification.
         * @returns{String} entity type identifier
         */
        getType : function() {
            this.__abstract("getType");
        },

        /**
         * @abstract
         * Returns entity priority that indicates the historical importance.
         * @returns{Number} 
         */
        getPriority : function() {
            this.__abstract("getPriority");
        },
        
        /**
         * @abstract
         * Returns entity description
         * @returns {String} 
         */
        getDescription : function() {
            this.__abstract("getDescription");
        },

        /**
         * @abstract
         * Returns true if the entity lasts for a time interval.
         * Otherwise (false) it happened/occured just at an exact moment.
         */
        isContinuous : function() {
            this.__abstract("isContinuous");
        },

        /**
         * @abstract
         * If two arguments are passed, sets the property value.
         * Otherwise, just returns value of the property or null if the property does not exist.
         * @param {String} key property key
         * @param {Object} value property value
         * @returns{Object|null} property value or null if not exists
         */
        property : function(key, value) {
            this.__abstract("property");
        },

        /**
         * Indicates whether the entity has a property identified with the passed key
         * @param {String} key tested property name
         * @returns {Boolean} true if the entity has the property
         */
        has : function(key) {
            return this.property(key) !== null;
        },
        
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="relations handling">
        
        /**
         * Adds a relation to the entity.
         * @param {Number|cz.kajda.data.AbstractRelation} relation instance or its identifier
         */
        addRelation : function(id) {
            id = id instanceof AbstractRelation ? id.getId() : id;
            if(this._relationIds.indexOf(id) >= 0)
                this.__exception("Ambiguous relation", "Attempt to add relation with duplicate identifier (" + id + ") to the single entity.");

            this._relationIds.push(id);
        },

        /**
         * Removes relation from the entity.
         * @param {Number|cz.kajda.data.AbstractRelation} relation instance or its identifier
         */
        removeRelation : function(id) {
            id = id instanceof AbstractRelation ? id.getId() : id;
            var index = this._relationIds.indexOf(id);
            if(index === -1)
                this.__exception("Invalid ID", "There is no relation with passed ID (" + id + ") registred in the entity #" + id + ".");
            this._relationIds.splice(index, 1);
        },

        /**
         * Checks whether the passed relation is involved in the entity.
         * @param {Number|cz.kajda.data.AbstractRelation} relation instance or its identifier
         * @returns {Boolean} true if the relation is involved in the entity
         */
        hasRelation : function(id) {
            id = id instanceof AbstractRelation ? id.getId() : id;
            return this._relationIds.indexOf(id) >= 0;
        },

        /**
         * @returns {Number[]} involved relation identifiers
         */
        getRelationIds : function() {
            return this._relationIds;
        },
    
    //</editor-fold>
    
    /**
     * Informs whether the entity duration fits the passed range. 
     * That means the entity can be "seen" completely within the passed range.
     * @param {moment} mStart range minimum
     * @param {moment} mEnd range maximum
     */
    fitsRange : function(mStart, mEnd) {
        var entityStart = this._startTime.unix(),
            entityEnd = this._endTime.unix(),
            rangeStart = mStart.unix(),
            rangeEnd = mEnd.unix();            
        if(!this.isContinuous()) { // moment
            return entityStart >= rangeStart && entityStart <= rangeEnd;
        } else { // interval 
            return entityStart >= rangeStart && entityEnd <= rangeEnd;
        }
    },
    
    /**
     * Informs whether the entity duration covers passed range.
     * That means the entity starts before the range start and ends after the range end.
     * Note that moment entity cannot cover any range.
     * @param {moment} mStart range minimum
     * @param {moment} mEnd range maximum
     */
    coversRange : function(mStart, mEnd) {
        if(!this.isContinuous()) return false;
        return this._startTime.unix() <= mStart.unix()
                && this._endTime.unix() >= mEnd.unix();
    },
    
    /**
     * Informs if the entity duration
     * protrudes passed range no matter whether from left or right.
     * That means the entity starts before the range start and ends in the range or vice versa.
     * Note that moment entity cannot protrude the range anyhow.
     * @param {moment} mStart range minimum
     * @param {moment} mEnd range maximum
     */
    protrudesRange : function(mStart, mEnd) {
        if(!this.isContinuous()) return false;
        var entityStart = this._startTime.unix(),
            entityEnd = this._endTime.unix(),
            rangeStart = mStart.unix(),
            rangeEnd = mEnd.unix();
        return xor(
                entityStart < rangeStart && entityEnd < rangeEnd && entityEnd > rangeStart,
                entityStart > rangeStart && entityStart < rangeEnd && entityEnd > rangeEnd);
    },
    
    /**
     * Informs if any part of the entity duration
     * is present in the passed range.
     * @param {moment} mStart range minimum
     * @param {moment} mEnd range maximum
     */
    isPresentInRange : function(mStart, mEnd) {
        return this.protrudesRange(mStart, mEnd) ||
                this.coversRange(mStart, mEnd) ||
                this.fitsRange(mStart, mEnd);
    }

    /* FIALA */
    /*
    getSubItems : function() {
            this.__abstract("getSubItems");
        }, */

});


return AbstractEntity;
});
