/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'cz/kajda/data/AbstractRelation'
],
function(AbstractRelation) {
    
/**
 * Default implementation of the class mapping database items to a relation.
 * @memberOf cz.kajda.data
 */
var Relation = new Class("cz.kajda.data.Relation", {
    
    _extends : AbstractRelation,
    
    /**
     * @constructor
     * @param {Object} data data to be mapped
     */
    _constructor : function(data) {
         AbstractRelation.call(this, data.id, data.from, data.to);
         this._title = data.name;
         this._properties = data.properties ? data.properties : null;
         this._stereotype = data.stereotype;
    },
   
    //<editor-fold defaultstate="collapsed" desc="private members">

        _stereotype : null,
        _title : null,
        _properties : null,

    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="getters & setters">

        /**
         * Returns property value if is available.
         * Otherwise returns null.
         * @param {String} key
         * @returns {Object}
         */
        property : function(key) {
            if(this.hasProperty(key)) 
                return this._properties[key];
            else return null;
        },

        /**
         * @returns {String} entity stereotype identifier
         */
        getType : function() {
            return this._stereotype;
        },

        /**
         * @returns {String} entity title
         */
        getTitle : function() {
            return this._title;
        }
    
    //</editor-fold>
   
});



return Relation;
});


