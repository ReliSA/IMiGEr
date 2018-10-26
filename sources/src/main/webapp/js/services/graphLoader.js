/**
 * @constructor
 */
function GraphLoader() {

	/**
	 * Loads a new graph using graph data passed as parameters.
	 * @param {object} data Data of the graph.
	 * @throws {InvalidArgumentError} Thrown when either graph data are incomplete.
	 */
	this.run  = function(data) {
		if (Utils.isUndefined(data.vertices) || Utils.isUndefined(data.edges)) {
			throw new InvalidArgumentError('Invalid data.');
		}

		var canvasSize = ((data.vertices.length * 75) / Math.round(Math.sqrt(data.vertices.length))) + 1000;

		// store archetypes
		app.archetype.vertex = data.vertexArchetypes;
		app.archetype.edge = data.edgeArchetypes;

		app.attributeTypeList = data.attributeTypes;
		app.possibleEnumValues = data.possibleEnumValues;

		app.archetype.vertex.filter(function(vertexArchetype) {
			return Utils.isDefined(vertexArchetype.icon);
		}).forEach(function(vertexArchetype) {
			app.viewportComponent.addSvgDefinition('vertexArchetypeIcon-' + vertexArchetype.name, vertexArchetype.icon);
		});

        var highlightedNodeId;
        var highlightedNodeType;
        if (Utils.isDefined(data.highlightedVertex) && data.highlightedVertex.length > 0) {
            var highlightedNodeAttr = data.highlightedVertex.split("-");
            if (highlightedNodeAttr.length === 2) {
                highlightedNodeType = highlightedNodeAttr[0];
                highlightedNodeId = parseInt(highlightedNodeAttr[1], 10);
            }
        }
        if (Utils.isDefined(data.highlightedEdge) && data.highlightedEdge.length > 0) {
            var highlightedEdgeId = parseInt(data.highlightedEdge, 10);
        }

        var highlightedNode = undefined;
        var highlightedEdge = undefined;

        // construct vertices
		var vertexMap = {};
		data.vertices.forEach(function(component) {
			var vertex = new Vertex(component);

			if (highlightedNodeType === 'vertex' && highlightedNodeId === vertex.id ){
                highlightedNode = vertex;
			}

			var position = component.position;

			if (position === null || Utils.isUndefined(position)) {
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

			vertexMap[component.id] = vertex;
		});

		// construct edges
		data.edges.forEach(function(component) {
			var edge = new Edge(component);

            if (highlightedEdgeId === edge.id ){
                highlightedEdge = edge;
            }

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

			if (highlightedNodeType === 'group' && highlightedNodeId === group.id ){
                highlightedNode = group;
            }

			// position
			var position = component.position;
			if (position === null || Utils.isUndefined(position)) {
                // set random
                group.setPosition(new Coordinates(
                    Math.floor(Math.random() * canvasSize),
                    Math.floor(Math.random() * canvasSize),
                ));

            } else {
                group.setPosition(new Coordinates(position.x, position.y));
            }

			// vertices
			app.vertexList.filter(function(vertex) {
				return component.verticesId.indexOf(vertex.id) > -1;
			}).forEach(function(vertex) {
				group.addVertex(vertex);
			});

			app.nodeList.push(group);
			app.groupList.push(group);

			app.viewportComponent.addGroup(group);
		});

		// exclude nodes
		data.sideBar.forEach(function(excludedNode) {
            if(typeof excludedNode.id !== 'string' && !(excludedNode.id instanceof String)) {
            	return;
            }
            var idArr = excludedNode.id.split("-");
            if(idArr.length !== 2){
				return;
            }
            idArr[1] = parseInt(idArr[1], 10);

			var node = app.nodeList.find(function(node) {
				var prefix = '';
				if (node instanceof Vertex) {
					prefix = 'vertex';
				} else if (node instanceof Group) {
					prefix = 'group';
				}
				return idArr[0] === prefix && node.id === idArr[1];
			});

			if (Utils.isDefined(node)) {
				node.exclude(excludedNode.isIconsDisplayed);

				app.sidebarComponent.excludedNodeListComponent.add(node);
			}
		});

		// center viewport
		app.viewportComponent.center();

		// update status bar
		app.sidebarComponent.statusBarComponent.componentCount = data.vertices.length;

		if (Utils.isDefined(highlightedEdge)) {
            highlightedEdge.setHighlighted(true);
            highlightedEdge.getFrom().setHighlighted(true);
            highlightedEdge.getTo().setHighlighted(true);
        }
		if (Utils.isDefined(highlightedNode)) highlightedNode.setHighlightedWithNeighbours(true);
	};

}