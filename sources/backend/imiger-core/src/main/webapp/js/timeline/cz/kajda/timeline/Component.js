/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'cz/kajda/common/Observable'
], function(Observable) {


/**
 * @abstract
 * Timeline widget component that can
 *  - be built (added to DOM hierarchy)
 *  - be redrawn (change its style, position...)
 *  - fire events
 *  - contain and manage subcomponents.
 *  
 * Provides basic methods for getting its position, size, adding subcomponents etc.
 */
var Component = Class("cz.kajda.timeline.Component", {
    
    _extends : Observable,
    
    /**
     * @constructor 
     * @param {cz.kajda.timeline.Timeline} timeline instance
     */
    _constructor : function(timeline) {
        this._timeline = timeline;
        this._components = [];
    },
    
    INC_PADDING : 1,
    INC_BORDER : 2,
    INC_MARGIN : 4,
    
    //<editor-fold defaultstate="collapsed" desc="private members">

        /** @member {String} CSS class prefix for the component */
        _cssPrefix : null,

        /** @member {jQuery} HTML container */
        _htmlElement : null,

        /** @member {cz.kajda.timeline.Component} parent component */
        _parent : null,

        /** @member {cz.kajda.timeline.Component[]} array of child components */
        _components : null,

        /** @member {cz.kajda.timeline.Timeline} timeline component (root parent) */
        _timeline : null,
        
    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="getter">
    
        /**
         * @returns {jQuery} HTML container
         */
        getHtmlElement : function() {
            return this._htmlElement;
        },
        
        /**
         * Prepends corresponding prefix to the passed CSS classname.
         * If null is passed, returns prefixes only.
         * @param {String} className
         * @param {Booleam} cssSelector true if the class name should be formatted as a CSS selector (will be prepended with ".")
         * @returns {String} 
         */
        getPrefixedCssClass : function(className, cssSelector) {
            if(this._cssPrefix === null)
                this.__exception("CSS prefix not specified.","_cssPrefix member is not defined for class " + this.__className + ".");
            return this._timeline.getPrefixedCssClass(this._cssPrefix + (!isset(className) ? "" : "-" + className), cssSelector);
        },
        
        /**
         * Returns component width figured out of its HTML container.
         * @param {Number} flag one of INC_ consts defining the method of gauge
         * @returns{Number} 
         */
        getWidth : function(flag) {
            if(!this._htmlElement) return 0;
            if(!isset(flag))
                return this._htmlElement.width();
            
            switch(flag) {
                case this.INC_PADDING:
                    return this._htmlElement.innerWidth();
                case this.INC_BORDER:
                    return this._htmlElement.outerWidth();
                case this.INC_MARGIN:
                    return this._htmlElement.outerWidth(true);
            }
        },

        /**
         * Returns component height figured out of its HTML container.
         * @param {Number} flag one of INC_ consts defining the method of gauge
         * @returns{Number} 
         */
        getHeight : function(flag) {
            if(!this._htmlElement) return 0;
            if(!isset(flag))
                return this._htmlElement.height();
            switch(flag) {
                case this.INC_PADDING:
                    return this._htmlElement.innerHeight();
                case this.INC_BORDER:
                    return this._htmlElement.outerHeight();
                case this.INC_MARGIN:
                    return this._htmlElement.outerHeight(true);
            }
        },

        /**
         * Returns component position figured out of its HTML container (relatively to the parent).
         * @returns{Object} {left, top}
         */
        getPosition : function() {
            if(this._htmlElement)
                return this._htmlElement.position();
        },

        /**
         * Returns component position relative to the timeline.
         * @returns {Object} {left, top}
         */
        getAbsolutePosition : function() {
            if(this._htmlElement)
                return {
                    left: this._htmlElement.offset().left - this._timeline.getHtmlElement().offset().left,
                    top: this._htmlElement.offset().top - this._timeline.getHtmlElement().offset().top
                };
        },

        /**
         * @returns{cz.kajda.timeline.Component} the parent component
         */
        getParent : function() {
            return this._parent;
        },

        /**
         * @returns{Array} all subcomponents
         */
        getComponents : function() {
            return this._components;
        },
        
        /**
         * @returns{cz.kajda.timeline.Timeline} timeline that the component belongs to
         */
        getTimeline : function() {
            return this._timeline;
        },
    
        
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="setter">
    
        /**
         * Sets the parent component.
         * @param {cz.kajda.timeline.Component} component
         */
        setParent : function(component) {
            this._parent = component;
        },
        
    //</editor-fold>

    /**
     * Redraws the component
     * and calls this method for each its child component.
     * Usually overridden to invoke some attribute-changing actions.
     */
    redraw : function() {
        for(var i = 0; i < this._components.length; ++i) {
            this._components[i].redraw();
        }
    },
    
    /**
     * Removes component from the DOM.
     * The component object still lives but not present in HTML body
     * so it can be easily brought back to the DOM.
     */
    undraw : function() {
        if(this._htmlElement !== null) {
            this.getHtmlElement().remove();   
            delete this._htmlElement;
        }
        for(var i = 0; i < this._parent._components.length; i++)
            if(this === this._parent._components[i]);
                this._parent._components.splice(i, 1);
    },
    
    /**
     * Builds HTML container so it is ready to be added to DOM.
     * @returns {jQuery} HTML container
     */
    build : function() {
    },
    
    /**
     * Checks whether the component is present in the DOM.
     * @returns{Boolean} true if so
     */
    isInDOM : function() {
        return isset(this._htmlElement)         // has been already built
                && this._htmlElement !== null   // has not been nulled
                && this._htmlElement.length !== 0; // is not empty jQuery set
    },
    
    /**
     * Sets the component visible.
     * @param {Boolean} bool (optional) true if should be visible (default : true)
     */
    show : function(bool) {
        if(!isset(bool)) bool = true;
        
        if(bool) this._htmlElement.show();
        else this._htmlElement.hide();
    },
    
    /**
     * Sets the components invisible.
     */
    hide : function() {
        this.show(false);
    },
    
    /**
     * Checks whether the component is visible.
     * @returns {Boolean}
     */
    isShown : function() {
        if(!this._htmlElement) return false;
        return this._htmlElement.is(":visible");
    },
    
    
    /**
     * Adds a component to this component.
     * @param {cz.kajda.timeline.Component} component component to be added
     * @returns {cz.kajda.timeline.Component} self
     */
    addComponent : function(component) {
        
        // set "this" as a parent of the being-added component
        component.setParent(this);
        
        // insert HTML element of the being-added component to the element of this component
        this._htmlElement.append(component.build());
        
        // add the being-added component to the list
        this._components.push(component);
        
        return this;
    }
    
    
});

//<editor-fold defaultstate="collapsed" desc="static properties">

    // constants used to determine the way of width/height computation
    /** @constant {Number} include paddings  */
    Component.INC_PADDING = 1;
    
    /** @constant {Number} include borders  */
    Component.INC_BORDER = 2,
    
    /** @constant {Number} include margins  */
    Component.INC_MARGIN = 4;
    
//</editor-fold>

return Component;
});

