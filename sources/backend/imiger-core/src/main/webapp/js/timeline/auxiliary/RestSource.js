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
            this._client.get("api/load-graph-data", new Closure(this, function(data) {
                var json = JSON.parse(data.graph_json);
                var graph = this._convertGraph(json);
                this._map(graph);
                this._fireEvent("dataLoaded", this);
            }));
        },

        _convertGraph : function(data) {
            var archetypes = data.vertexArchetypes;
            var nodes = new Array(data.vertices.length), edges = new Array(data.edges.length);
            var attrNames = data.attributeTypes.map(function(attr) { return attr.name; })
                ,beginAttrIdx = attrNames.indexOf('begin')
                ,endAttrIdx = attrNames.indexOf('end');

            for(var i = 0; i < data.vertices.length; i++) {
                var v = data.vertices[i];
                var prop = {
                    startPrecision: "none",
                    endPrecision: "none"
                };

                var archetype = archetypes[v.archetype].name.toLowerCase();
                if (archetype !== 'person') {
                    archetype = 'item';
                }

                var node = {
                    id: v.id, 
                    name: v.name, 
                    description: v.text,
                    stereotype: archetype,
                    properties: prop
                };

                // spade search
                if (beginAttrIdx === -1 || endAttrIdx === -1) {
                    attrNames = v.attributes.map(function(attr) { return attr[0]; });
                    beginAttrIdx = attrNames.indexOf('begin');
                    endAttrIdx = attrNames.indexOf('end');
                }

                var parsed, date;
                if (beginAttrIdx !== -1 && typeof v.attributes[beginAttrIdx] !== 'undefined') {
                    parsed = parseInt(v.attributes[beginAttrIdx][1], 10);

                    if (isNaN(parsed) || parsed < 4000) {
                        node.begin = v.attributes[beginAttrIdx][1];
                    } else {
                        date = new Date(parsed);
                        node.begin = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
                            + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                    }
                }
                if (endAttrIdx !== -1 && typeof v.attributes[endAttrIdx] !== 'undefined') {
                    parsed = parseInt(v.attributes[endAttrIdx][1], 10);

                    if (isNaN(parsed) || parsed < 4000) {
                        node.end = v.attributes[endAttrIdx][1];
                    } else {
                        date = new Date(parsed);
                        node.end = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
                            + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                    }
                }

                nodes[i] = node;
            }

            for(var j = 0; j < data.edges.length; j++) {
                var e = data.edges[j];
                edges[j] = {
                    id: e.id,
                    name: e.text,
                    from: e.from,
                    stereotype: "relationship",
                    to: e.to
                };
            }

            return {
                nodes: nodes,
                edges: edges
            }
        },

        /** @see cz.kajda.data.AbstractDataSource#_map */
        _map : function(data) {
            var entities = new Collection(),
                relations = new Collection();

            // map entities
            for(var nodeIdx in data.nodes) {
                entities.add(new this._objectMapping.entity(data.nodes[nodeIdx]));
            }

            // map relations
            for(var edgeIdx in data.edges) {
                var edge = data.edges[edgeIdx],
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

