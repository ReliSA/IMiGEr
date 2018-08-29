/**
 * @constructor
 */
function GraphLoader() {

	/**
	 * Loads a new graph using graph data passed as parameters.
	 * @param {object} data Data of the graph.
	 * @throws {InvalidArgumentException} Thrown when either graph data are incomplete.
	 */
	this.run  = function(data) {
		if (app.utils.isUndefined(data.vertices) || app.utils.isUndefined(data.edges)) {
			throw new InvalidArgumentException('Invalid data.');
		}

		var canvasSize = ((data.vertices.length * 75) / Math.round(Math.sqrt(data.vertices.length))) + 1000;

		// store archetypes
		app.archetype.vertex = data.vertexArchetypes;
		app.archetype.edge = data.edgeArchetypes;

		app.attributeTypeList = data.attributeTypes;
		app.possibleEnumValues = data.possibleEnumValues;

		// construct vertices
		var vertexMap = {};
		data.vertices.forEach(function(component) {
			var vertex = new Vertex(component);

			var position = component.position

			if (position === null) {
                // set random
                vertex.setPosition(new Coordinates(
                    Math.floor(Math.random() * canvasSize),
                    Math.floor(Math.random() * canvasSize),
                ));

            } else {
                vertex.setPosition(new Coordinates(position.x, position.y));
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

			// vertices
			app.vertexList.filter(function(vertex) {
				return component.verticesId.indexOf(vertex.id) > -1;
			}).forEach(function(vertex) {
				group.addVertex(vertex);
			});

			// position
			var position = component.position
			if (position === null) {
                // set random
                group.setPosition(new Coordinates(
                    Math.floor(Math.random() * canvasSize),
                    Math.floor(Math.random() * canvasSize),
                ));

            } else {
                group.setPosition(new Coordinates(position.x, position.y));
            }

			app.nodeList.push(group);
			app.groupList.push(group);

			app.viewportComponent.addGroup(group);
		});

		// exclude nodes
		data.sideBar.forEach(function(excludedNode) {
			var node = app.nodeList.find(function(node) {
				return node.id === excludedNode.id;
			});

			if (app.utils.isDefined(node)) {
				node.exclude();

				app.sidebarComponent.excludedNodeListComponent.add(node);
			}
		});

		// center viewport
		app.viewportComponent.center();

		// update status bar
		app.sidebarComponent.statusBarComponent.setComponentCount(data.vertices.length);
	};

}