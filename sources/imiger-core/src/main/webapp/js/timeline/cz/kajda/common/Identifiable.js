/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([],
function() {

/**
 * Interface for all classes that produce instances identifiable by their numeric ID.
 * @memberOf cz.kajda.common
 */
var Identifiable = new Interface("cz.kajda.common.Identifiable", {
    
    /**
     * @returns {Number} numeric identifier
     */
    getId : function() {}
    
});

return Identifiable;

});

