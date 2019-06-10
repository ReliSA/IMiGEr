/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'jquery',
    'cz/kajda/timeline/Component',
    'snap',
    'cz/kajda/timeline/render/BandItemRelationRenderer'
], function($, Component, Snap, BandItemRelationRenderer) {
    

/**
 * A layer that enables the timeline to visualize relations
 * between the focused item and related ones.
 * 
 * @extends cz.kajda.timeline.Component
 * @memberOf cz.kajda.timeline
 */
var RelationViewer = new Class("cz.kajda.timeline.RelationViewer", {
    
    _extends: Component,
    
    _constructor : function(timeline) {
        Component.call(this, timeline);
    },
    
    _cssPrefix : "relation-viewer",
    
    /** @member {Snap.Paper} SVG "canvas" */
    _paper : null,
    /** @member {Snap} */
    _snap : null,
    /** @member {cz.kajda.timeline.render.AbstractRelationRenderer} relation renderer */
    _renderer : null,
    
    build : function() {
        this._htmlElement = $("<svg width='" + this.getParent().getWidth() + "' height='" + this.getParent().getHeight() + "'>")
                .attr("class", this.getPrefixedCssClass());
        this._snap = Snap(this._htmlElement[0]);
        this._paper = this._snap.paper;
        this._marker = this._paper.polygon([0,0, 0,10, 10,5, 0,0]).attr({fill: '#000'}).marker(0,0,10,10, 0,5);
        this._renderer = new BandItemRelationRenderer(this._paper);
        this._htmlElement.on("contextmenu", new Closure(this, function(e) {
                this.hide();
                e.preventDefault();
        }));
        
        this.getTimeline().addListener("itemFocus", new Closure(this, this.redraw));
        return this._htmlElement.hide();
    },
    
    redraw : function() {
        if(!this._htmlElement) return;
        var item = this.getTimeline().getFocusedItem(true);        
        this._paper.clear();
        if(item === null || !this.getTimeline().option("showRelations")) {
            this.hide();
            return;
        }
        if(!item.isInDOM()) return;
        
        this.__groupDebug("Relation viewer redraw");
        var compTimer = new __DebugTimer("Computing relation positions"),
            drawTimer = new __DebugTimer("Drawing relations");
    
        this.show();
        this._htmlElement.attr({
            width : this.getParent().getWidth(),
            height : this.getParent().getHeight()
        });
        
        var pos = item.getGlobalPosition(),
            relationIds = item.getEntity().getRelationIds(),
            relationCollection = this.getTimeline().getDataSource().getRelations(),
            bandGroup = this.getTimeline().getBandGroup();
        
            for(var i = 0; i < relationIds.length; i++) {
                compTimer.start();
                var relation = relationCollection.get(relationIds[i]);
                var entityId = relation.isOrigin(item.getEntity()) ? relation.getDestinationId() : relation.getOriginId();
                var tBandItem = bandGroup.getBandItem(entityId);
                if(tBandItem === null || !tBandItem.isInDOM() || tBandItem.getPosition().top + tBandItem.getHeight() > tBandItem.getBand().getHeight()) continue;
                compTimer.pause();
                drawTimer.start();
                var g = this._renderer.drawRelation(relation, item, tBandItem);
                drawTimer.pause();
                g.attr("data-relation", relation.getId());
            }
        compTimer.dump();
        drawTimer.dump();
        this.__closeGroupDebug();
    }
    
});
    

return RelationViewer;
});

