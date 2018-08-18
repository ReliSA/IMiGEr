/**
 * @constructor
 */
function GraphExporter() {

	/**
	 * Exports positions of edges and vertices in graph to JSON.
	 */
	this.run = function() {
		var edgesExport = app.edgeList.map(function(edge) {
			return {
				id: edge.id,
				from: edge.getFrom().id,
				to: edge.getTo().id,
			};
		});

		var verticesExport = app.vertexList.map(function(vertex) {
			return {
				id: vertex.id,
				name: vertex.name,
				position: vertex.getPosition(),
				isExcluded: vertex.isExcluded(),
			};
		});

		return {
			edges: edgesExport,
			vertices: verticesExport,
		};
	};

}
