/**
 * @author Michal Fiala
 * @version 1.0
 */

define([
    'cz/kajda/timeline/render/BandItemRenderer',
    'cz/kajda/timeline/render/AbstractItemRenderer',
    'cz/kajda/timeline/render/Color'
], 
function(BandItemRenderer, AbstractItemRenderer, Color) {
    
    
/**
 * Renderer for split-item entity with subentities.
 * Renders items as a bar in the passed color 
 * that contain label inside if possible, otherwise puts the label aside.
 * Renders subitems as bars or line
 * @memberOf cz.kajda.timeline.render
 */
var SplitBandItemRenderer = new Class("cz.kajda.timeline.render.SplitBandItemRenderer", {
    
    _extends : BandItemRenderer,
    
    _constructor : function(bgColor) {
        AbstractItemRenderer.call(this);
        bgColor = bgColor == null ? "#03f945" : bgColor;
        this._color = bgColor instanceof Color ? bgColor : Color.fromHex(bgColor);
    },
    
    MOMENT_CLASS : 'moment',
    INTERVAL_CLASS : "interval",
    DURATION_CLASS : "duration",
    LABEL_CLASS : "title",
    SUB_ITEM_CLASS : "subitem",
    SPLIT_ITEM_MOMENT_CLASS : "splititem-moment",
    DEFAULT_COLOR_CLASS : "default-color",

    
    //<editor-fold defaultstate="collapsed" desc="private members">
        
        /** @member {cz.kajda.timeline.render.Color} */
        _color : null,
        
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="private methods">

        /**
         * Renders SubItem element
         * Adds css classes of entity
         * Adds default css classes
         * @param {SubItem} subItem
         * @return {jQuery} HTML element
         */
        renderSubItem : function(subItem)
        {
            var subEntity = subItem.getEntity();

            // GET CSS of subEntity
            var cssClasses = subEntity.getCssClasses();
            // Create div element
            var element = new $("<div>")
                        .attr("id",subEntity.getId())
                        .addClass(this.SUB_ITEM_CLASS)
                        .css({
                            "border-color" : this._color.darken(20).getRgba()
                        });
            // Add css to element
            element.addClass((cssClasses) ? cssClasses : this.DEFAULT_COLOR_CLASS);
            // Is entity moment?
            // Add moment subentity class
            if(!subEntity.isContinuous())
                element.addClass(this.SPLIT_ITEM_MOMENT_CLASS);

            return element;    
        },
        /**
         * Calculates left position of Moment SubItem in BandItem
         * Set this values to SubItem Html element
         * Set SubItem leftPositionToParent
         * @param {SubItem} subItem
         * @param {BandItem} item
         */
        _correctProtrusionSubItem: function(subItem ,item){
            var entity = subItem.getEntity(),
            projection = item.getTimeline().getProjection(),
            htmlElement = subItem.getHtmlElement();
            // Left position in wrapper
            var absoluteLeftPos = projection.moment2px(entity.getStart());
            // Left position in bandItem
            var leftPos = absoluteLeftPos - item.getPosition().left; 

            $(htmlElement).css({
                "position" : "absolute",
                "left" : leftPos,
            });

            if(entity.isContinuous()){
                // Width in bandItem
                var width = projection.duration2px(entity.getDuration());

                $(htmlElement).css({
                    "width" : width
                });
            }
            // Set leftPositionToParent
            subItem.setLeftPositionToParent(leftPos);
        },
        /**
         * @private
         * Correct protusion of subitems
         * @param {cz.kajda.timeline.AbstractItem} item
         */
        _correctProtrusionSubItems: function(item){
            var subItems = item.getSubItems();
            for(var i = 0; i < subItems.length; i++)
            {
                this._correctProtrusionSubItem(subItems[i], item);
                // var subItem = subItems[i];
                // if(subItem.getEntity().isContinuous())
                //     this._correctProtrusionSubItemContinuous(subItem, item);
                // else 
                //     this._correctProtrusionSubItemMoment(subItem, item);
            }
        },

    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="overridden">
              
        /** @see cz.kajda.timeline.render.AbstractItemRenderer#redraw */
        redraw : function(item) {
            if(!item.isInDOM()) return;
            var entity = item.getEntity(),
                dims = this._correctProtrusion(item),
                leftPos = dims.left,
                width = dims.width;
                
            item.getHtmlElement().css({
                "position" : "absolute",
                "left" : leftPos,
            });

            if(entity.isContinuous())
                item.getHtmlElement().find("." + this.DURATION_CLASS).css("width", width);
            
            if(item.isFocused())
                item.getHtmlElement().addClass("focused");
            else
                item.getHtmlElement().removeClass("focused");

            this._redrawLabel(item);
            // If wrapper has width smaller than 30px => hide all subitems  
            if(width < 30)
            {
                item.getHtmlElement()
                    .find("." + this.DURATION_CLASS).css("background-color",this._color.getRgba())
                item.hideSubItems();
            }
            // Else recalculate atributes of subitems and show them
            else{
                this._correctProtrusionSubItems(item);
                item.getHtmlElement()
                    .find("." + this.DURATION_CLASS).css("background-color","transparent")
                item.showSubItems();
            }
        }
        
    //</editor-fold>

});


return SplitBandItemRenderer;
});