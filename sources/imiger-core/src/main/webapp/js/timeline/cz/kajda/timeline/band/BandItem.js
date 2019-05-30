/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'cz/kajda/timeline/AbstractItem'
], function(AbstractItem) {
            
        
/**
 * Visual representation of entity, a child of a band.
 * @memberOf cz.kajda.timeline.band
 */    
var BandItem = new Class("cz.kajda.timeline.band.BandItem", {
    
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

        this._subItems = [];
    },
    
    //<editor-fold defaultstate="collapsed" desc="private members">

        /** @see cz.kajda.timeline.Component */
        _cssPrefix :  "banditem",

        /** @member {jQuery} */
        _labelElement : null,
        
        /** @member {jQuery} */
        _durationElement : null,

        /** @author Michal Fiala
         *  Array of SubItems
         */
        _subItems : [],
    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="overridden">
    
        /** 
         *  @author Bc. Michal Kacerovský
         *  @author Michal Fiala
         *  @see cz.kajda.timeline.Component#build
         *  For each subItem call his build method and append created element to durationElement 
         */
        build : function() {
            var bandItem = this.__super.build.call(this)
                    .attr("data-band", this.getBand().getId())
                    .addClass(this.getPrefixedCssClass());
            // Create subItem element and append to durationElement
            for(var i = 0; i < this._subItems.length; i++)
            {
                this._durationElement.append(this._subItems[i].build());
            }
            return bandItem;
        },

    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="getters & setters">
    
        /**
         * Returns band which the item is placed in.
         * @returns{cz.kajda.timeline.Band}
         */
        getBand : function() {
            return this.getParent();
        },

        /**
         * @param {jQuery} el
         */
        setLabelElement : function(el) {
            this._labelElement = el;
        },

        /**
         * @param {jQuery} el
         */
        setDurationElement : function(el) {
            this._durationElement = el;
        },

        /**
         * @returns {jQuery}
         */
        getLabel : function() {
            return this._labelElement;
        },

        /**
         * @returns {jQuery}
         */
        getDurationElement : function() {
            return this._durationElement;
        },

        /** @see cz.kajda.timeline.Component */
        getWidth : function(flag) {
            var w = this.__super.getWidth.call(this, flag);
            // jQuery incorrectly adds label element width to the total width
            // even though it is placed inside of banditem
            // -> has to be subtracted
            if(this._labelElement && this._labelElement.css("position") === "absolute")
                w -= this._labelElement.width();
            return w;
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
                top: this.getParent().getPosition().top + pos.top
            };
        },

        /**
         * Computes center point of the band item duration element
         * considering only the visible part of it.
         * @param {Boolean} global true if global position should be used (affects usually only the top coordinate) (default: false)
         * @returns {Object} {left : Number, top : Number}
         */
        getVisibleCenter : function(global /* = false */) {
            if(!isset(global)) global = false;
            var e_pos = global ? this.getGlobalPosition() : this.getPosition();
                w_l = this._timeline.getWrapper().getPosition().left,
                e_l = e_pos.left,
                e_t = e_pos.top,
                e_h = this.getDurationElement().height(),
                e_w = this.getDurationElement().width(),
                vp_w = this._timeline.getWidth(),
                o_l = Math.min(0, w_l + e_l),
                o_r = Math.max(0, e_l + e_w + w_l - vp_w);
            return {
                left : (e_w - o_l - o_r) / 2 + e_l,
                top: e_t + e_h / 2
            };
        },

        /** 
         *  @author Michal Fiala 
         *  @param {SubItem} subItem
         *  Adds subItem to subItems
         *  Set subItem parent this BandItem
         */
        addSubItem : function(subItem){
            subItem.setParent(this);
            this._subItems.push(subItem);
        },
        /** 
         *  @author Michal Fiala 
         *  @return {Array} subItems
         */
        getSubItems: function(){
            return this._subItems;
        },

        /** 
         *  @author Bc. Michal Kacerovský
         *  @author Michal Fiala 
         *  @see cz.kajda.timeline.Component#build
         *  For each subItem undraw it
         */
        undraw : function() {
            if(this._htmlElement !== null) {
                this.getHtmlElement().remove();   
                delete this._htmlElement;
            }
            for(var i = 0; i < this._parent._components.length; i++)
                if(this === this._parent._components[i]);
                    this._parent._components.splice(i, 1);
            // Remove subItems
            for(var i = 0; i < this._subItems.length; i++)
                this._subItems[i].undraw();        
        },
        /**
         * @author Michal Fiala
         * Hide all SubItems
         */
        hideSubItems : function()
        {
            for(var i = 0; i < this._subItems.length; i++)
                this._subItems[i].hide();
        },
        /**
         * @author Michal Fiala
         * Show all SubItems
         */
        showSubItems : function()
        {
            for(var i = 0; i < this._subItems.length; i++)
                this._subItems[i].show();
        }
    
    //</editor-fold>
    
});


return BandItem;
});


