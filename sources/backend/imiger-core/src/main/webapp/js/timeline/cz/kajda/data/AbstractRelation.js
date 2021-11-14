/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    "cz/kajda/common/Identifiable"
],
function(Identifiable) {

/**
 * @abstract
 * Abstract of the entity relation.
 * This class represents relation between two entities.
 * 
 * @memberOf {cz.kajda.data}
 */
var AbstractRelation = new Class("cz.kajda.data.AbstractRelation", {
    
    _implements : [Identifiable],
    
    /**
     * @constructor
     * 
     * @param {Number} id identifier
     * @param {Number} originId originator entity identifier
     * @param {Number} destinationId influenced (relation destination) entity identifier
     */
    _constructor : function(id, originId, destinationId) {
        this._id = Number(id);
        this._originId = originId;
        this._destinationId = destinationId;             
    },
    
    //<editor-fold defaultstate="collapsed" desc="private members">
    
        /** @member {Number} identifier */
        _id : null,

        /** @member {Number} originator entity identifier */
        _originId : null,

        /** @member {Number}  influenced (relation destination) entity identifier */
        _destinationId : null,

    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="overridden">
       
        /**
         * @returns{Number} unique relation identifier
         */
        getId : function() {
            return this._id;
        },
        
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="getters & setters">

        /**
         * @returns {Number} origin entity identifier
         */
        getOriginId : function() {
            return this._originId;
        },

        /**
         * @returns {Number} destination entity identifier
         */
        getDestinationId : function() {
            return this._destinationId;
        },

        /**
         * Checks whether the passed entity is the origin of the relation.
         * @param {cz.kajda.data.AbstractEntity} entity or its identifier
         * @returns {Boolean} true if the passed entity is the origin
         */
        isOrigin : function(entity) {
            if(typeof(entity) !== "number")
                entity = entity.getId();
            return entity === this._originId;
        },

        /**
         * @abstract
         * @returns{String} relation title
         */
        getTitle : function() {
            this.__abstract("getTitle");
        },

        /**
         * @abstract
         * Returns type of the relation.
         * @returns{String} relation type identifier
         */
        getType : function() {
            this.__abstract("getType");
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
         * Indicates whether the entity has property identified with the passed key
         * @param {String} key tested property name
         * @returns {Boolean} true, if the entity has the property
         */
        has : function(key) {
            return this.property(key) !== null;
        }
        
    //</editor-fold>
    
});


return AbstractRelation;
});
