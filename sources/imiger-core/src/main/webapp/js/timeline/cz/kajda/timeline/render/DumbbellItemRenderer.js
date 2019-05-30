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
 * Renderer for dumbbell-entity with subentities.
 * Renders items as a circle and interspace them with line
 * Renders continuous subitem as box
 * that contain label inside if possible, otherwise puts the label aside.
 * @memberOf cz.kajda.timeline.render
 */
var DumbbellItemRenderer = new Class("cz.kajda.timeline.render.DumbbellItemRenderer", {
    
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
    DUMBBELL_ELEMENT_CLASS : "dumbbell-element",
    DUMBBELL_JOIN_CLASS : "dumbbell-join",
    DUMBBELL_NODE_CLASS : "dumbbell-node",
    DUMBBELL_MOMENT_CLASS : "dumbbellitem-moment",
    DEFAULT_COLOR_CLASS : "default-color",



    
    //<editor-fold defaultstate="collapsed" desc="private members">
        
        /** @member {cz.kajda.timeline.render.Color} */
        _color : null,
        
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="private methods">
        /**
         * @private
         * Renders an interval entity.
         * Renders interspace line
         * @param {cz.kajda.timeline.AbstractItem} item
         * @returns {jQuery}
         */
        _renderContinuous : function(item) {

            var wrapper = new $("<div>")
                    .css({
                        "background-color" : "transparent",
                    });
            // Create interspace line
            var dumbbellJoin = new $("<div>")
                    .addClass(this.DUMBBELL_ELEMENT_CLASS)
                    .addClass(this.DUMBBELL_JOIN_CLASS)

            wrapper.append(dumbbellJoin);
                      
            return wrapper;
        },
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
                .addClass(this.DUMBBELL_ELEMENT_CLASS)
                .addClass(this.DUMBBELL_NODE_CLASS) 
            // Add css to element
            element.addClass((cssClasses) ? cssClasses : this.DEFAULT_COLOR_CLASS);
            // Add moment dumbbell class
            if(!subEntity.isContinuous())
                element.addClass(this.DUMBBELL_MOMENT_CLASS);

            return element;    
        },
        /**
         * Calculates left position and width if Continuous SubItem in BandItem
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
            // If subEntity is start or end, use time from Entity (BandItem)
            if(entity.getType() == "start")
                leftPos = projection.moment2px(item.getEntity().getStart()) - item.getPosition().left;
            else if(entity.getType() == "end")
                leftPos = projection.moment2px(item.getEntity().getEnd()) - item.getPosition().left - 15;

            $(htmlElement).css({
                "position" : "absolute",
                "left" : leftPos
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
                // var subItem = subItems[i];
                // if(subItem.getEntity().isContinuous())
                //     this._correctProtrusionSubItemContinuous(subItem, item);
                // else 
                //     this._correctProtrusionSubItemMoment(subItem, item);
                this._correctProtrusionSubItem(subItems[i], item);
            }
        },
        
        /**
         * @private
         * Set label aside
         * @param {cz.kajda.timeline.AbstractItem} item
         */
        _redrawLabel : function(item) {

            var labelEl = item.getHtmlElement().find("." + this.LABEL_CLASS);
        
            labelEl.css({
                "position" : ""
            });
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

            if(entity.isContinuous()){
                item.getHtmlElement().find("." + this.DURATION_CLASS).css({
                    "width": width,
                    "border-color" : "transparent",
                });
                item.getHtmlElement().find("." + this.DUMBBELL_JOIN_CLASS).css({
                    "width": width
                });
            }
            
            if(item.isFocused())
                item.getHtmlElement().addClass("focused");
            else
                item.getHtmlElement().removeClass("focused");

            this._redrawLabel(item);

            // If wrapper has width smaller than 30px => hide all subentities
            // Let the first entity shown
            if(width < 30)
            {
                var subItems = item.getSubItems();
                // Hide dumbell join
                item.getHtmlElement().find("."+ this.DUMBBELL_JOIN_CLASS).hide();
                // Hide all subItems expect first
                for(var i = 1; i < subItems.length; i++)
                    $(subItems[i].getHtmlElement()).hide();
            }
            // Else recalculate atributes of subentities and show them
            else
            {
                this._correctProtrusionSubItems(item);
                // Find all elements and show them
                item.getHtmlElement().find("." + this.DUMBBELL_ELEMENT_CLASS).each(function()
                {
                    $(this).show();
                });
            }
        }
        
    //</editor-fold>

});


return DumbbellItemRenderer;
});