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
				id: app.utils.getUniqueId(node),
				isHighlighted: node.isIconsDisplayed(),
			};
		});

        var highlightedEdge = app.edgeList.find(function (edge) {
            return edge.isHighlighted()
        });

        // when edge is highlighted another vertex can not be highlighted
        if (app.utils.isUndefined(highlightedEdge)) {
            var highlightedVertex = app.nodeList.find(function (vertex) {
                return vertex.isHighlighted()
            });
        }

		return {
			attributeTypes: app.attributeTypeList,
			edgeArchetypes: app.archetype.edge,
			vertexArchetypes: app.archetype.vertex,
			vertices: vertices,
			edges: edges,
			possibleEnumValues: app.possibleEnumValues,
			groups: groups,
			sideBar: sideBar,
			selectedVertex: app.utils.getUniqueId(highlightedVertex), // selected = highlighted
			selectedEdge: app.utils.isUndefined(highlightedEdge) ? '' : highlightedEdge.id, // selected = highlighted
		};
	}

}
