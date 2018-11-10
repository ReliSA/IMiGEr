class GraphExporter {
	/**
	 * Exports graph to JSON.
	 */
	run() {
		// nodes excluded to the sidebar
		let excludedNodeList = app.sidebarComponent.excludedNodeListComponent.nodeList;
		let sideBar = excludedNodeList.map(node => {
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
			vertices: app.vertexList.map(vertex => vertex.export()),
			edges: app.edgeList.map(edge => edge.export()),
			possibleEnumValues: app.possibleEnumValues,
			groups: app.groupList.map(group => group.export()),
			sideBar: sideBar,
			highlightedVertex: Utils.isUndefined(highlightedVertex) ? '' : Utils.getUniqueId(highlightedVertex),
			highlightedEdge: Utils.isUndefined(highlightedEdge) ? '' : highlightedEdge.id,
		};
	}
}
