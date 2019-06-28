define([],
function() {
    
    
/**
 * @abstract
 * Template for entity renderers.
 * @memberOf cz.kajda.timeline.render
 */
var AbstractItemRenderer = new Class("cz.kajda.timeline.render.AbstractItemRenderer", {
    
    /**
     * Created HTML element that will represent the entity in the timeline.
     * This method does not affect its height or width,
     * these properties are changed by a band
     * depending on the available timeline space and the entity parameters.
     * 
     * Note you should mind the item state, that means you should check whether it is backdropped etc.
     * 
     * @param {cz.kajda.timeline.AbstractItem} item to render
     * @returns{jQuery} jQuery element ready to be added to a band
     */
    render : function(item) {
        this.__abstract("render");
    },
    
    /**
     * Doesn't create new HTML element, but changes the current if necessary.
     * @param {cz.kajda.timeline.AbstractItem} item to redraw.
     * 
     * Note you should mind the item state, that means you should check whether it is backdropped etc.
     */
    redraw : function(item) {
        this.__abstract("redraw");
    }
    
});


return AbstractItemRenderer;
});
