/**
 * @constructor
 */
function GraphLoader() {

	/**
	 * Loads a new graph using graph data passed as parameters.
	 * @param {object} data Data of the graph.
	 * @param {object} graphExportData Export of a previously loaded diagram.
	 * @throws {InvalidArgumentException} Thrown when either graph data or export data are incomplete.
	 */
	this.run  = function(data, graphExportData) {
		if (app.utils.isUndefined(data.vertices) || app.utils.isUndefined(data.edges)) {
			throw new InvalidArgumentException('Invalid data.');
		}

		if (graphExportData !== null && (app.utils.isUndefined(data.vertices) || app.utils.isUndefined(data.edges))) {
			throw new InvalidArgumentException('Invalid graph export data.');
		}

		var canvasSize = ((data.vertices.length * 75) / Math.round(Math.sqrt(data.vertices.length))) + 1000;

		// vertices
		var vertexMap = {};
		data.vertices.forEach(function(component) {
			var vertex = new Vertex(component);

			var isPositionSet = false;
			if (graphExportData !== null) {
				var exportedVertex = graphExportData.vertices.find(function(exportedVertex) {
					return exportedVertex.name == this;
				}, vertex.name);

				// vertex is present in exported graph data
				if (app.utils.isDefined(exportedVertex)) {
					var coords = new Coordinates(exportedVertex.position.x, exportedVertex.position.y);
					vertex.setPosition(coords);

					isPositionSet = true;
				}
			}

			if (isPositionSet === false) {
				vertex.setPosition(new Coordinates(
					Math.floor(Math.random() * canvasSize),
					Math.floor(Math.random() * canvasSize),
				));
			}

			app.nodeList.push(vertex);
			app.vertexList.push(vertex);

			vertexMap[component.symbolicName] = vertex;

			app.viewportComponent.addVertex(vertex);
		});

		// edges
		data.edges.forEach(function(component) {
			var edge = new Edge(component);

			var fromNode = vertexMap[component.from];
			if (fromNode) {
				fromNode.addOutEdge(edge);
			}

			var toNode = vertexMap[component.to];
			if (toNode) {
				toNode.addInEdge(edge);
			}

			app.edgeList.push(edge);

			app.viewportComponent.addEdge(edge);
		});

		delete vertexMap;

		// center viewport
		app.viewportComponent.center();

		// find unconnected vertices
		app.vertexList.filter(function(vertex) {
			return vertex.isUnconnected();
		}).forEach(function(vertex) {
			vertex.exclude();
			app.sidebarComponent.unconnectedNodeListComponent.add(vertex);
		});

		// find missing components
		app.edgeList.filter(function(edge) {
			return edge.getFrom().name === app.constants.notFoundVertexName;
		}).forEach(function(edge) {
			var compatibilityInfoList = edge.getCompatibilityInfo();
			compatibilityInfoList.forEach(function(compatibilityInfo) {
				if (compatibilityInfo.incomps.length === 0) return;

				compatibilityInfo.incomps.forEach(function(incompatibility) {
					if (!incompatibility.desc.isIncompCause) return;

					app.sidebarComponent.missingClassListComponent.add(incompatibility.desc.name);
				});
			});
		});

		// update status bar
		app.sidebarComponent.statusBarComponent.setComponentCount(data.vertices.length);
		app.sidebarComponent.statusBarComponent.setGraphVersion(app.cookies.get('graphVersion'));
	};

}