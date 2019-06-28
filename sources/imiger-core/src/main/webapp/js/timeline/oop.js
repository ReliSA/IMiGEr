/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

//<editor-fold defaultstate="collapsed" desc="OOP framework">
    
    /**
     * OOP support settings.
     */
    var _OOP  = {

        /** @member Boolean should be warnings genereted in OOP model suppressed? */
        suppressWarnings : false,

        /** @member {Boolean} should be any debug information output? */
        debug : true,

        /** @member {Boolean} should be zime debug information output? */
        timeInfo : true

    };

    /**
     * Default class used as the ancestor for new classes.
     */
    _Core = function() {};
    _Core.__className = "[Core]";
    _Core.prototype = {

        /** @member {__DebugTimer} */ 
        __DebugTimer : null,
        
        /**
         * Creates grouped output in the console.
         * @param {String} msg optional message
         */
        __groupDebug : function(msg) {
            if(_OOP.debug) console.groupCollapsed(msg);
        },
        
        /**
         * Closes group created in the console.
         */
        __closeGroupDebug : function() {
            if(_OOP.debug) console.groupEnd();
        },

        /**
         * Core method used to determine 
         * that the specified method is abstract. 
         * Call inside of the abstract method body.
         * @param {String} name method name used in error message
         */
        __abstract : function(name) {
            this.__exception("Abstract method is not implemented.","The class extends " + this.__super.__className + " but does not implement its abstract method " + name + ".");
        },

        /**
         * Sophisticated way to throw an exception.
         * @param {String} err short error description
         * @param {String} msg detailed description (optional)
         */
        __exception : function(err, msg) {
            throw Error("\n" + this.__className + ": " + err + (isset(msg) ? "\n" + msg : ""));
        },

        /**
         * Dumps instance current state to the console.
         */
        __dump : function() {
            if(_OOP.debug)
                console.debug(this.__className + ": %O", this);
        },
		
		/**
		 * Outputs message to the console if debugMode is on.
		 * @param {String} str
		 */
		__debug : function(str) {
			if(_OOP.debug) 
				console.debug(str);
		}



    };

    /**
     * <p>Function for class definition
     * handling issues such as inheritance or polymorphism.</p>
     * <p>Parameter 'definition' structure:
     * <pre>{
     *   _extends : {Class},
     *   _implements : {Interface[]},
     *   _constructor : function(...) {},
     *   
     *   (static and member attributes)
     *   
     *   (member methods)
     * }</pre>
     * </p>
     * 
     * <h2>Super</h2>
     * <p>Instance of the class can access member <i>__super</i>
     * that refers to the ancestor.</p>
     * 
     * <p>Note that class extending another class should call ancestor's constructor.
     * It cannot be done using <i>__super</i> because <i>__super</i> refers to an already created instance.
     * So you need to call super constructor in the scope of its descendand. Therefore use following:
     * 
     * <pre>{super class}.call(this, [constructor args...])</pre>
     * </p>
     * 
     * <h2>ClassName</h2>
     * <p>Inside the class you can access default member <i>__className</i>
     * that contains string representing the class. It is specified during the class definition.</p>
     * <p>This string is used in error information.</p>
     * 
     * @param {String} className class name
     * @param {Object} definition definition
     * @returns {Function} function that should be called with <i>new</i> keyword (used as a constructor)
     */
    Class = function(className, definition) {

        // ancestor validating
        if(definition.hasOwnProperty("_extends") && !definition._extends) { // defined but not exists
            throw new Error("Class " + className + " tries to extend class that does not exist.");
        }
        var parentClass = definition._extends ? definition._extends : _Core;

        var interfaces = definition._implements;
        var ctor = definition._constructor; 

        if(!ctor) {
            ctor = function() {};
            if(parentClass !== _Core && !_OOP.suppressWarnings) {
                console.warn("Class " + className + " uses default constructor despite extending " + parentClass.__className + ". Make sure that calling super constructor is not required:\n" + parentClass.__className + ".call(this, ...)");
            }
        }

        // extending
        if (parentClass) {
            var F = function() { };
            ctor.__super = F.prototype = parentClass.prototype;
            ctor.prototype = new F();
        }

        // adding defined methods and members
        for (var key in definition) {
            ctor.prototype[key] = definition[key];
        }

        // checking interfaces match
        if (interfaces) {
            for(i = 0; i < interfaces.length; i++) {
                if(!isset(interfaces[i]))
                    throw new Error("Class " + className + " tries to implement interface (at index " + i + ") that does not exist.");
                for(var key in interfaces[i]) {
                    if(key.substr(0,1) !== "_" && !ctor.prototype[key]) {
                        throw new Error("Class " + className + " uses " + interfaces[i].__className + " but not implements " + interfaces[i].__className + "." + key + ".");
                    }
                }
            }
        }

        // refer to the constructor
        ctor.prototype.constructor = ctor;
        ctor.__className = className;
        ctor.prototype.__super = parentClass.prototype;
        ctor.prototype.__className = className;
        return ctor;

    };

    /**
     * Function for interface definition
     * handling interface inheritance.
     *
     * <p>Parameter 'definition' structure:
     * <pre>{
     *   _extends : {Class},
     *   
     *   (empty member methods - <i>function(){}</i> )
     * }</pre>
     * </p>
     * 
     * <h2>ClassName</h2>
     * <p>Inside the interface you can access default member <i>__className</i>
     * that contains string representing the interface. It is specified during the interface definition.</p>
     * <p>This string is used in error information.</p>
     * 
     * @param {String} interfaceName interface name
     * @param {Object} definition definition
     * @returns {Object} object that contains empty methods to be implemented
     */
    Interface = function(interfaceName, definition) {

        var parentInterface = definition._extends;
        var interface = {};

        if (parentInterface) {
            for (var key in parentInterface) {
                interface[key] = parentInterface[key];
            }
        }

        for (var key in definition) {
            interface[key] = definition[key];
        }

        interface.__className = interfaceName;
        return interface;
    }
    
//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="auxiliary classes">

    /**
     * Closure function enables you to store
     * function (method) and its scope together.
     * So then you can be sure that the function is called
     * in the appropriate environment.
     * 
     * It is usually used for binding event handlers
     * inside of class instance. There, you need the method
     * to be called in the scope of the instance.
     * 
     * 
     * Closure enables user to add extra arguments at the time of initiation.
     * If caller passes any other arguments,
     * they will be "append" to the arguments passed at the closure initiation.
     * 
     * For example:
     * Initiation : var closure = new Closure(this, this.doSomething, anExtraArgument)
     * Calling closure:  closure.call(null, arg1, arg2)
     *
     * Then the arguments received by closure function will be in following order:
     * arg1, arg2, anExtraArgument
     * 
     * 
     * @param {Object} scope
     * @param {Function} method
     * @param {Array} additional args that should method received
     * @returns {Function}
     */
    Closure = function(scope, method, _additionalArgs) {
        var _scope = scope,
            _method = method,
            _args = typeof(_additionalArgs) === "undefined" ? [] : _additionalArgs;
        return function() {
            var args = Array.prototype.slice.call(arguments).concat(_args);
            _method.apply(_scope, args);
        };
    };

    /**
     * Measures elapsed time for debug purposes.
     */
    __DebugTimer = new Class("__DebugTimer", {

       /**
        * @constructor
        * @param {String} debugMessage message to be ouput with the information
        */
       _constructor : function(debugMessage) {
           if(!_OOP.timeInfo || !_OOP.debug) return;
           this._debugMessage = debugMessage;
           this._elapsed = 0;
       },

       /** @member {Number} unix ms of the start */
       _start : null,

       /** @member {Number} unix ms of the start */
       _stop : null,
       
       /** @member {Number} elapsed ms */
       _elapsed : null,


       /** @member {String} message to be ouput with the information */
       _debugMessage : null,

       /**
        * Starts the timer.
        */
       start : function() {
           if(!_OOP.timeInfo || !_OOP.debug) return;
           this._start = Date.now();
       },

       /**
        * Pauses the timer.
        */
       pause : function() {
           if(!_OOP.timeInfo || !_OOP.debug || !this._start) return;
           this._stop = Date.now();
           this._elapsed += this._stop - this._start;
       },

       /**
        * Stops the timer.
        */
       stop : function() {
           this.pause();
       },

       /**
        * Returns time elapsed between the start and the end.
        * @returns {Number}
        */
       getElapsed : function() {
           return this._elapsed / 1000;
       },

       /**
        * Returns the message tobe output with the elapsed time.
        * @returns {String}
        */
       getMessage : function() {
           return this._debugMessage;
       },
       
       /**
        * Stops the timer and outputs commented result.
        */
       dump : function() {
           if(!_OOP.timeInfo || !_OOP.debug) return;
           this.stop();
           console.debug("%s [%f s]", this.getMessage(), this.getElapsed());
       }

    });

//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="auxiliary functions">

    /**
     * Checks whether the variable is not undefined.
     * It is useful especially in case of boolean.
     * There, simple condition "if(variable)" cannot be used
     * bacause it would not be match in two cases:
     *  - variable = false
     *  - undefined variable
     * Sometimes, it is needed to recognize these two cases.
     * @param {Object} v
     * @returns {Boolean} true if is not undefined
     */
    isset = function(v) {
        return typeof(v) !== "undefined";
    };

    /**
     * Shorthand to perform XOR operation.
     * @param {Boolean} A
     * @param {Boolean} B
     * @returns {Boolean}
     */
    xor = function(A, B) {
        return (A || B) && !(A && B);
    };
    
//</editor-fold>
