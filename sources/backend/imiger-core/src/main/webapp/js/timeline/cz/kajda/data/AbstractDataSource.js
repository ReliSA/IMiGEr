/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'cz/kajda/common/Observable'
],
function(Observable) {

/**
 * @abstract
 * Creates template for data sources used by timeline.
 * 
 * @memberOf cz.kajda.data
 */
var AbstractDataSource = new Class("cz.kajda.data.AbstractDataSource", {
   
    _extends : Observable,

    /**
     * @constructor
     * @param {Class} T_entity class/object used to map entities (has to extend AbstractEntity)
     * @param {Class} T_relation class/object used to map relations (has to extend AbstractRelation)
     */
    _constructor : function(T_entity, T_relation) {

        this._objectMapping = {
            "entity" : T_entity,
            "relation" : T_relation
        };

    },
    
    //<editor-fold defaultstate="collapsed" desc="private members">

        /** @member {Object} stores objects that data are mapped to */
        _objectMapping : null,

        /** @member {cz.kajda.data.Collection} contains all the entities gained from the specified source location */
        _entities : null,

        /** @member {cz.kajda.data.Collection} contains all the relations gained from the specified source location */
        _relationCollection : null,

        /** time range specifying the period that data come from */
        _timeRange : null,

    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="private methods">

        /**
         * @abstract
         * Maps data received from the source location to the objects
         * and stores them to the collections.
         * @param {Object} data non-specified data
         */
        _map : function(data) {
            this.__abstract("_map");
        },

    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="getters & setters">
    
        /**
         * Informs whether data have been loaded from the specified location.
         * @returns {Boolean}
         */
        areDataLoaded : function() {
            return isset(this._entities);
        },

        /**
         * Returns all the entities loaded from the source.
         * @returns{cz.kajda.data.Collection}
         */
        getEntities : function() {
            return this._entities;
        },

        /**
         * @author Michal Fiala
         * Returns all mapped entities
         */
        getAllMappedEntities : function()
        {
            return this._entities;
        },
        /**
         * Returns all the relations loaded from the source.
         * @returns {cz.kajda.data.Collection}
         */
        getRelations : function() {
            return this._relations;
        },

        /**
         * Sets the period that data should come from.
         * @param {moment} start
         * @param {moment} end
         */
        setTimeRange : function(start, end) {
            this._timeRange = {
                "start" : start,
                "end" : end
            };
        },

        /**
         * Returns the period that the data come from.
         * @returns {Object} {start : moment, end : moment}
         */
        getTimeRange : function() {
            return this._timeRange;
        },
    
    //</editor-fold>

    
    /**
     * @abstract
     * Loads data from the specified source location, maps 
     * and puts them into the collections.
     * @fires dataLoaded
     */
    loadData : function() {
        this.__abstract("loadData");
    },

});
        
 
return AbstractDataSource;
});


