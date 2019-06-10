define([],
function() {
    
/**
 * @abstract
 * Template for relation renderers.
 * @memberOf cz.kajda.timeline.render
 */
var AbstractRelationRenderer = new Class("cz.kajda.timeline.render.AbstractRelationRenderer", {
   
   /**
    * @constructor
    * @param {Snap.Paper} papers
    */
   _constructor : function(paper) {
       this._paper = paper;
   },
   
   /** @member {Snap.Paper} */
   _paper : null,
   
   /**
    * @abstract
    * Draws relation from the originator item to the influenced item.
    * @param {cz.kajda.data.AbstractRelation} relation
    * @param {cz.kajda.timeline.AbstractItem} originatorItem
    * @param {cz.kajda.timeline.AbstractItem} influencedItem
    */
   drawRelation : function(relation, originatorItem, influencedItem) {
       this.__abstract("drawRelation");
   }
   
});

return AbstractRelationRenderer;
    
});


