/**
 * @constructor
 */
function GraphExporter() {

	/**
	 * Exports graph to JSON.
	 */
	this.run = function() {
		// vertices
		var vertices = app.vertexList.map(function(vertex) {
			return vertex.export();
		});

		// edges
		var edges = app.edgeList.map(function(edge) {
			return edge.export();
		});

		// groups
		var groups = app.groupList.map(function(group) {
			return group.export();
		});

		// nodes excluded to the sidebar
		var excludedNodeList = app.sidebarComponent.excludedNodeListComponent.getNodeList();
		var sideBar = excludedNodeList.map(function(node) {
			return {
				id: Utils.getUniqueId(node),
				isIconsDisplayed: node.isIconsDisplayed,
			};
		});

		let highlightedEdge = app.edgeList.find(edge => edge.isHighlighted);
		let highlightedVertex = app.nodeList.find(vertex => vertex.isHighlighted);

		return {
			attributeTypes: app.attributeTypeList,
			edgeArchetypes: app.archetype.edge,
			vertexArchetypes: app.archetype.vertex,
			vertices: vertices,
			edges: edges,
			possibleEnumValues: app.possibleEnumValues,
			groups: groups,
			sideBar: sideBar,
			highlightedVertex: Utils.isUndefined(highlightedVertex) ? '' : Utils.getUniqueId(highlightedVertex),
			highlightedEdge: Utils.isUndefined(highlightedEdge) ? '' : highlightedEdge.id,
		};
	}

}
