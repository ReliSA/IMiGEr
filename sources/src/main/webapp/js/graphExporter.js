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
				id: node.id,
				isHighlighted: node.isHighlighted(),
			};
		});

		return {
			attributeTypes: app.attributeTypeList,
			edgeArchetypes: app.archetype.edge,
			vertexArchetypes: app.archetype.vertex,
			vertices: vertices,
			edges: edges,
			possibleEnumValues: app.possibleEnumValues,
			groups: groups,
			sideBar: sideBar,
			selectedVertex: null,	// TODO: selected == highlighted
			selectedEdge: null,	// TODO selected == highlighted
		};
	}

}
