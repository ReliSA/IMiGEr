/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'cz/kajda/data/AbstractDataSource',
    'cz/kajda/data/Collection',
    '../../data/data',
    /** FIALA */
    'cz/kajda/data/SubEntity'
],
function(AbstractDataSource, Collection, __data, SubEntity) {
    

/**
 * Data source used for test purpose.
 * gets data from a JSON variable.
 */
var StaticSource = new Class("StaticSource", {
   
    _extends : AbstractDataSource,

    /**
     * @constructor
     * @param {Class} T_entity object that entities should be mapped to
     * @param {Class} T_relation object that relations should be mapped to
     */
    _constructor: function(T_entity, T_relation) {
        AbstractDataSource.call(this, T_entity, T_relation);
    },
    /**
     * @author Michal Fiala
     * All mapped entities
     */
    _allMappedEntities : null,

    //<editor-fold defaultstate="collapsed" desc="overridden">

        /** @see cz.kajda.data.AbstractDataSource#loadData */
        loadData : function() {
            this._map(__data);
            this._fireEvent("dataLoaded", this);
        },

        /** 
         * @see cz.kajda.data.AbstractDataSource#_map 
         * @author Bc. Michal Kacerovský
         * @author Michal Fiala
         */
        _map : function(data) {
            // All entities (Entity for BandItem)
            var entities = new Collection(),
                relations = new Collection();
            // All mapped entities (Entity and SubEntity)
            var allMappedEntities = new Collection();    
            // Map all entities 
            for(var i = 0; i < data.nodes.length; i++)
                this._createEntity(data.nodes[i], entities, allMappedEntities);

            // Map relations
            for(var i = 0; i < data.edges.length; i++) {
                var edge = data.edges[i],
                    edgeObj = new this._objectMapping.relation(edge); // mapped object
                // Find relation and add relation in all entities include SubEntity
                if(!allMappedEntities.get(edge.from).hasRelation(edgeObj.getId()))
                    allMappedEntities.get(edge.from).addRelation(edge.id);
                if(!allMappedEntities.get(edge.to).hasRelation(edgeObj.getId()))
                    allMappedEntities.get(edge.to).addRelation(edge.id);
                
                relations.add(edgeObj);
            }
            this._allMappedEntities = allMappedEntities;
            this._entities = entities;
            this._relations = relations;
        },
        /**
         * @author Michal Fiala
         * @author Bc. Michal Kacerovský
         * Create Entity and adds it in Collections       
         * Create SubEntities of Entity and adds it in Collection
         * @param {JSON} dataNode
         * @param {Collection} entities contain only Entity
         * @param {Collection} allMappedEntities contain Entity and SubEntity
         */
        _createEntity : function(dataNode, entities, allMappedEntities)
        {
            var entity = new this._objectMapping.entity(dataNode);
            
            entities.add(entity);
            allMappedEntities.add(entity);
            // Has SubEntities
            if(dataNode.subItems)
                for(var i =0; i < dataNode.subItems.length; i++)
                {
                    // Create SubEntity
                    var subEntity = new SubEntity(dataNode.subItems[i], entity);
                    // Add SubEntity in Entity
                    entity.addSubEntity(subEntity);
                    // Add in all mapped entities
                    allMappedEntities.add(subEntity);
                }
        },
        
        /**
         * @author Michal Fiala
         * Returns all mapped entities
         */
        getAllMappedEntities : function()
        {
            return this._allMappedEntities;
        },
    //</editor-fold>
    
});
    
return StaticSource;
});

