/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'cz/kajda/timeline/Component',
    'cz/kajda/common/Identifiable',
    'momentjs'
], function(Component, Identifiable, moment) {
    
/**
 * @abstract
 * Abstract for itme of the timeline.
 * @memberOf {cz.kajda.timeline}
 */
var AbstractItem = new Class("cz.kajda.timeline.AbstractItem", {
   
    _extends : Component,
    _implements : [Identifiable],

    /**
     * @constructor
     * @see cz.kajda.timeline.Component
     * @param {cz.kajda.timeline.Timeline} timeline
     * @param {cz.kajda.data.AbstractItem} entity
     * @param {cz.kajda.timeline.render.AbstractItemRender} renderer
     */
    _constructor : function(timeline, entity, renderer) {
        Component.call(this, timeline);
        this._entity = entity;
        this._renderer = renderer;
        this._focus = false;
    },
   
    //<editor-fold defaultstate="collapsed" desc="private/protected members">
   
        /** @member {cz.kajda.data.AbstractEntity} */
        _entity : null,
        
        /** @member {cz.kajda.timeline.render.AbstractItemRenderer} */
        _renderer : null,
        
        /** @member {Boolean} true if the item is focused */
        _focus : null,
        
    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="overridden">

        /** @see cz.kajda.timeline.Component#build */
        build : function() {
            if(this._renderer === null) 
                this.__exception("Rendering problem", "No renderer was specified for this instance.");
            
            this._htmlElement = this._renderer.render(this);
            if(!isset(this._htmlElement)) 
                this.__exception("Rendering problem", "Renderer " + this._renderer.__className + " does not return jQuery object when render method is called.");
            
            return this._htmlElement
                    .addClass(this.getPrefixedCssClass())
                    .attr("data-entity", this._entity.getId());
        },
        
        /** @see cz.kajda.timeline.Component#redraw */
        redraw : function() {
            this._renderer.redraw(this);
        },
            
    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="getter">

        /**
         * @returns{Number|String} timeline item identifier
         */
        getId : function() {
            return this._entity.getId();
        },

        /**
         * @returns{cz.kajda.data.AbstractEntity} the entity represented by the timeline item
         */
        getEntity : function() {
            return this._entity;
        },
        
        /**
         * @returns {Boolean} true if the item has focus
         */
        isFocused : function() {
            return this._focus;
        },
        
    //</editor-fold>
    
    /**
     * Tests whether the duration of the entity represented by this component starts after
     * the passed moment or start time of the passed item entity.
     * @param {cz.kajda.timeline.AbstractItem|moment} item item object or moment
     * @returns {Boolean} 
     */
    startsAfter : function(item) {
        var time = moment.isMoment(item) ? item : item.getEntity().getStart();
        return this.getEntity().getStart().isAfter(time);
    },
        
    /**
     * Flags the item as focused.
     * @param {Boolean} bool (optional) true if should be focused (default : true)
     */
    focus : function(bool /* = true */) {
        if(!isset(bool)) bool = true;
        this._focus = bool;
        this.redraw();
    },
    
    /**
     * Removes focus flag. The item will lose focus.
     */
    blur : function() {
        this.focus(false);
    },
        
});

   
return AbstractItem;    
});

