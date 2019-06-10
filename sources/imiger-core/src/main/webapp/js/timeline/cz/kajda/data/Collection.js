/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([],
function() {
    
    
/**
 * Stores Identifiables in a map 
 * where their identifier is used as the key.
 * 
 * @memberOf cz.kajda.data
 */
var Collection = new Class("cz.kajda.data.Collection", {
   
    _constructor : function() {
        this._data = [];
    },
   
    //<editor-fold defaultstate="collapsed" desc="private members">

        /** @member {Object} collection data store */
        _data : null,
   
    //</editor-fold>

    /**
     * Adds new item to the collection.
     * If the item already exists, throws an error.
     * @param {cz.kajda.common.Identifiable} identifiable
     * @returns {cz.kajda.data.Collection} self
     */
    add : function(identifiable) {
        var key = identifiable.getId();
        if(this._data.hasOwnProperty(key)) 
            throw Error("Attempt to add item with ambiguous identifier (" + key + ") to the cz.kajda.data.Collection.");
        
        this._data[key] = identifiable;
        return this;
    },
    
    /**
     * Returns item of the collection whose identifier corresponds with the passed value.
     * @param {Number} id identifier
     * @returns {cz.kajda.common.Identifiable} the item or null if not found
     */
    get : function(id) {
        if(this._data.hasOwnProperty(id))
            return this._data[id];
        return null;
    },
    
    /**
     * Returns number of items present in the collection.
     * @returns {Number}
     */
    size : function() {
        return this._data.length;
    },
    
    /**
     * Returns object that is used to store the data.
     * @returns {Object}
     */
    raw : function() {
        return this._data;
    }
    
});



return Collection;
});


