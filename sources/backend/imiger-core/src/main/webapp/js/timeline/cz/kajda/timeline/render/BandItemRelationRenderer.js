define([
    "cz/kajda/timeline/render/AbstractRelationRenderer"
], function(AbstractRelationRenderer) {
   
/**
 * Default band item relation renderer.
 * Using arrows renders relations between entities represented by band items.
 * @memberOf cz.kajda.timeline.render
 */
var BandItemRelationRenderer = new Class("cz.kajda.timeline.render.BandItemRelationRenderer", {
    
    _extends : AbstractRelationRenderer,
    
    /** @see cz.kajda.timeline.render.AbstractRelationRenderer */
    _constructor : function(paper) {
        AbstractRelationRenderer.call(this, paper);
    },
    
    /** @see cz.kajda.timeline.render.AbstractRelationRenderer#drawRelation */
    drawRelation : function(relation, selectedBandItem, targetBandItem) {
        var markerDO = this._paper.polygon([0,0, 0,8, 8,4, 0,0]).attr({fill: '#000'}).marker(0,0,8,8, 8,4),
            markerOD = this._paper.polygon([0,4, 8,8, 8,0, 0,4]).attr({fill: '#000'}).marker(0,0,8,8, 8,4),
            entityId = relation.isOrigin(selectedBandItem.getEntity()) ? relation.getDestinationId() : relation.getOriginId(),
            epos = selectedBandItem.getVisibleCenter(true),
            tpos = targetBandItem.getVisibleCenter(true);
    
        var line = this._paper.line(epos.left, epos.top, tpos.left, tpos.top);
        line.attr({stroke: "#000", strokeWidth: 1, markerEnd: relation.isOrigin(entityId) ? markerOD : markerDO });
        var line2 = this._paper.line(epos.left, epos.top, tpos.left, tpos.top);
        line2.attr({stroke: "transparent", strokeWidth: 10});
        var g = this._paper.group(line2, line);
        return g.attr({"cursor" : "pointer"});
    }
    
});

return BandItemRelationRenderer;
});


