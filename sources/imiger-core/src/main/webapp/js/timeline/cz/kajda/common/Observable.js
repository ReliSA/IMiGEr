/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([],
function() {
    
/**
 * @abstract
 * Enables object inheriting this class to generate events
 * so that when the event is fired, all the listeners are notified.
 * 
 * @memberOf cz.kajda.common
 */
var Observable = new Class("cz.kajda.common.Observable", {
    
    /** @member {Object} event listeners map */
    events : [],
       
    /**
     * Attaches event listener.
     * @param {String} eventName event type identifier
     * @param {Object|Closure|Function} listener object that listens the event, function or Closure instance
     * @param {Function} handler handler method/fuction if <i>listener</i> is not a Closure instance
     * @returns {cz.kajda.timeline.Observable} self
     */
    addListener : function(eventName, listener, handler) {
        var closure = listener instanceof Function ? listener : new Closure(listener, handler);
        if(!this.events[eventName]) this.events[eventName] = [];
        this.events[eventName].push(closure);
        return this;
    },
        
    /**
     * Notifies listeners that the event with corresponding name has been fired.
     * @private
     * @param {String} eventName event type identifier
     * @param {Object} ___args___ optional arguments
     */
    _fireEvent : function(eventName /* , arguments */) {
        var args = Array.prototype.slice.call(arguments,1); // pop eventName argument
        var listeners = this.events[eventName];
        if(listeners) {
            for(i = 0; i < listeners.length; i++) {
                listeners[i].apply(null,args); // no need to pass anything as a scope, it is included in the closure
            }
        }
    }
    
});


return Observable;
});


