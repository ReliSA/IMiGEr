/**
 * @author Michal Fiala
 * @version 1.0
 */

define([
    'cz/kajda/timeline/AbstractItem'
], function(AbstractItem) {
            
        
/**
 * Visual representation of SubEntity, a child of a BandItem.
 * @memberOf cz.kajda.timeline.band
 */    
var SubItem = new Class("cz.kajda.timeline.band.SubItem", {
    
    _extends : AbstractItem,
    
    /**
     * @constructor
     * @see cz.kajda.timeline.Component
     * @param {cz.kajda.timeline.Timeline} timeline
     * @param {cz.kajda.data.AbstractEntity} entity
     * @param {cz.kajda.timeline.render.AbstractItemRenderer} renderer
     */
    _constructor : function(timeline, entity, renderer) {
        AbstractItem.call(this, timeline, entity, renderer);
    },
    
    //<editor-fold defaultstate="collapsed" desc="private members">

        /** @see cz.kajda.timeline.Component */
        _cssPrefix :  "subitem",
        /** Left positon inside BandItem.HtmlElement */
        _leftPositionToParent : null,

    
    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="overridden">

        /** Build function for creating htmlElement 
         *  Calls renderer method to render SubItem HTML element
         *  @returns {jQuery} HTML element
         */
        build : function() {
            return this._htmlElement = this._renderer.renderSubItem(this);
        },

    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="getters & setters">
        /**
         * Get band of Parent = BandItem
         * @returns {BandItem} parent
         */
        getBand : function() {
            return this.getParent().getBand();
        },
        /**
         * Sets left position
         * @param {Number} left left position in bandItem
         */
        setLeftPositionToParent : function(left)
        {
            this._leftPositionToParent = left;
        },
        /**
         * Get left position inside bandItem
         * @returns {Number} left position
         */
        getLeftPositionToParent : function()
        {
            return this._leftPositionToParent;
        },
        /**
         *  Computes position
         *  left :(left position inside banditem) + (left position of banditem related to the Band)
         *  top : banditem top position
         *  @returns {Object} {left : Number, top : Number}
         */
        getPosition(){

            var parent = this.getParent();
            var parentPosition = parent.getPosition();
            return{
                left: this._leftPositionToParent + this.getParent().getPosition().left,
                top: this.getParent().getPosition().top
            };
        },
        /**
         * Computes global position related to the wrapper.
         * (Standard getPosition() computes top value related to the band.)
         * @returns {Object} {left : Number, top : Number}
         */
        getGlobalPosition : function() {
            var pos = this.getPosition();
            return {
                left : pos.left,
                top: this.getParent().getGlobalPosition().top
            };
        },

        /** @see cz.kajda.timeline.band.BandItem#getVisibleCenter */
        getVisibleCenter : function(global /* = false */) {
            if(!isset(global)) global = false;
            var e_pos = global ? this.getGlobalPosition() : this.getPosition();
                w_l = this._timeline.getWrapper().getPosition().left,
                e_l = e_pos.left,
                e_t = e_pos.top,
                e_h = this.getParent().getDurationElement().height(),
                e_w = this.getHtmlElement().width(),
                vp_w = this._timeline.getWidth(),
                o_l = Math.min(0, w_l + e_l),
                o_r = Math.max(0, e_l + e_w + w_l - vp_w);
            return {
                left : (e_w - o_l - o_r) / 2 + e_l,
                top: e_t + e_h / 2
            };
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
        },
    
    //</editor-fold>
    
});


return SubItem;
});


