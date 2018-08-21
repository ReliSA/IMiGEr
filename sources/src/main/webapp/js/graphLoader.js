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

		// store archetypes
		app.archetype.vertex = data.vertexArchetypes;
		app.archetype.edge = data.edgeArchetypes;
		app.archetype.icon = data.archetypeIcons;

		// construct vertices
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

			vertexMap[component.originalId] = vertex;
		});

		// construct edges
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

			if (fromNode && toNode) {
				fromNode.incrementRelatedArchetype(toNode.archetype);
				toNode.incrementRelatedArchetype(fromNode.archetype);
			}

			app.edgeList.push(edge);
		});

		delete vertexMap;

		// render components
		app.vertexList.forEach(function(vertex) {
			app.viewportComponent.addVertex(vertex);
		});

		app.edgeList.forEach(function(edge) {
			app.viewportComponent.addEdge(edge);
		});

		// center viewport
		app.viewportComponent.center();

		// find unconnected vertices
		app.vertexList.filter(function(vertex) {
			return vertex.isUnconnected();
		}).forEach(function(vertex) {
			vertex.exclude();
			app.sidebarComponent.unconnectedNodeListComponent.add(vertex);
		});

		// construct groups
		data.groups.forEach(function(component) {
			var group = new Group(component);
			group.setExcluded(true);

			app.vertexList.filter(function(vertex) {
				return component.verticesId.indexOf(vertex.id) > -1;
			}).forEach(function(vertex) {
				group.addVertex(vertex);
			});

			app.nodeList.push(group);
			app.groupList.push(group);

			app.sidebarComponent.excludedNodeListComponent.add(group);
		});

		// update status bar
		app.sidebarComponent.statusBarComponent.setComponentCount(data.vertices.length);
	};

}