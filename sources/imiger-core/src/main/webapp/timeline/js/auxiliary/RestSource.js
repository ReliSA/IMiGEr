/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'cz/kajda/data/AbstractDataSource',
    'auxiliary/RestClient',
    'cz/kajda/data/Collection',
],
function(AbstractDataSource, RestClient, Collection) {
    

/**
 * Stores data get by REST requests.
 */
var RestSource = new Class("cz.kajda.data.RestSource", {
   
    _extends: AbstractDataSource,
    
    /**
     * @constructor
     * @see cz.kajda.data.AbstractDataSource
     * @param {Class} T_entity class/object used to map entities (has to extend AbstractEntity)
     * @param {Class} T_relation class/object used to map relations (has to extend AbstractRelation)
     * @param {String} base URL for REST requests
     * @param {String} type data type used for request and responses (default: TYPE_JSON)
     */
    _constructor: function(T_entity, T_relation, url, type) {
        this._client = new RestClient(url, type);
        this._entityPriors = this._ENTITY_PRIOR_DEFS;
        this._relationPriors = this._RELATION_PRIOR_DEFS;
        AbstractDataSource.call(this, T_entity, T_relation);
    },
    
    //<editor-fold defaultstate="collapsed" desc="private members">
    
        _ENTITY_PRIOR_DEFS : {
            "person": 5,
            "event": 5,
            "place": 5,
            "item": 5
        },

        _RELATION_PRIOR_DEFS : {
            "relationship": 5,
            "interaction": 5,
            "participation": 5,
            "creation": 5,
            "cause": 5,
            "part_of": 5,
            "takes_place": 5
        },

        /** @member {RestClient} */
        _client : null,

        /** @member {Object} */
        _entityPriors : null,

        /** @member {Object} */
        _relationPriors : null,

    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="overridden">

        /** @see cz.kajda.data.AbstractDataSource#loadData */
        loadData : function(callback) {
            var mapClosure = new Closure(this, this._map);
            this._client.post("importances", {
                "query" : {
                    "from" : this._timeRange.start.utc().format(),
                    "to" : this._timeRange.end.format(),
                    "nodeImportance" : this._entityPriors,
                    "edgeImportance" : this._relationPriors,
                    "properties" : {}
                }
            }, new Closure(this, function(data) {
                this._map(data);
                this._fireEvent("dataLoaded", this);
            }));
        },

        /** @see cz.kajda.data.AbstractDataSource#_map */
        _map : function(data) {
            var entities = new Collection(),
                relations = new Collection();

            // map entities 
            for(var i = 0; i < data.nodes.length; i++) {    
                entities.add(new this._objectMapping.entity(data.nodes[i]));
            }

            // map relations
            for(var i = 0; i < data.edges.length; i++) {
                var edge = data.edges[i],
                    edgeObj = new this._objectMapping.relation(edge); // mapped object
            
                if(!entities.get(edge.from).getRelationIds())
                    entities.get(edge.from).addRelation(edge.id);
                if(!entities.get(edge.to).getRelationIds())
                    entities.get(edge.to).addRelation(edge.id);
                
                relations.add(edgeObj);
            }

            this._entities = entities;
            this._relations = relations;
        },
        
    //</editor-fold>

    /**
     * @param {Object} priors
     */
    setRelationPriorities : function(priors) {
        this._relationPriors = priors;
    },

    /**
     * @param {Object} priors
     */
    setEntityPriorities : function(priors) {
        this._entityPriors = priors;
    }

});
    
return RestSource;
});

