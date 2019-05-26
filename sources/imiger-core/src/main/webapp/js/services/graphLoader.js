class GraphLoader {
	/**
	 * @constructor
	 */
	constructor() {
		this._ajv = new Ajv();
	}

	/**
	 * Loads a new graph using graph data passed as parameters.
	 * @param {object} data Data of the graph.
	 * @param {boolean} enableInitialElimination Enable initial elimination
	 * @throws {AJVValidationError} Thrown when graph data are incomplete.
	 */
	run(data, enableInitialElimination) {
		let isValid = this._ajv.validate(GraphLoader.rawInputSchema, data);
		if (isValid === false) {
			throw new AJVValidationError(this._ajv.errorsText(), this._ajv.errors);
		}

		const canvasSize = ((data.vertices.length * 75) / Math.round(Math.sqrt(data.vertices.length))) + 1000;

		// store archetypes
		app.archetype.vertex = Utils.isDefined(data.vertexArchetypes) ? data.vertexArchetypes : [];
		app.archetype.edge = Utils.isDefined(data.edgeArchetypes) ? data.edgeArchetypes : [];

		app.attributeTypeList = Utils.isDefined(data.attributeTypes) ? data.attributeTypes : [];
		app.possibleEnumValues = Utils.isDefined(data.possibleEnumValues) ? data.possibleEnumValues : {};

		app.archetype.vertex.filter(vertexArchetype => {
			return Utils.isDefined(vertexArchetype.icon);
		}).forEach(vertexArchetype => {
			app.viewportComponent.addSvgDefinition('vertexArchetypeIcon-' + vertexArchetype.name, vertexArchetype.icon);
		});

		// highlighted node
		let highlightedNodeId;
		let highlightedNodeType;
		if (Utils.isDefined(data.highlightedVertex) && data.highlightedVertex.length > 0) {
			let highlightedNodeAttr = data.highlightedVertex.split('-');
			if (highlightedNodeAttr.length === 2) {
				highlightedNodeType = highlightedNodeAttr[0];
				highlightedNodeId = parseInt(highlightedNodeAttr[1], 10);
			}
		}

		// highlighted edge
		let highlightedEdgeId;
		if (Utils.isDefined(data.highlightedEdge) && data.highlightedEdge.length > 0) {
			highlightedEdgeId = parseInt(data.highlightedEdge, 10);
		}

		let highlightedNode;
		let highlightedEdge;

		// construct vertices
		let vertexMap = new Map;
		data.vertices.forEach(component => {
			let vertex = new Vertex(component);

			if (highlightedNodeType === 'vertex' && highlightedNodeId === vertex.id ){
				highlightedNode = vertex;
			}

			if (component.position === null || Utils.isUndefined(component.position)) {
				// set random
				vertex.position = new Coordinates(
					Math.floor(Math.random() * canvasSize),
					Math.floor(Math.random() * canvasSize),
				);
			} else {
				vertex.position = new Coordinates(component.position.x, component.position.y);
			}

			app.nodeList.push(vertex);
			app.vertexList.push(vertex);

			vertexMap.set(component.id, vertex);
		});

		// construct edges
		data.edges.forEach(component => {
			let edge = new Edge(component);

			if (highlightedEdgeId === edge.id) {
				highlightedEdge = edge;
			}

			let fromNode = vertexMap.get(component.from);
			if (fromNode) {
				fromNode.addOutEdge(edge);
			}

			let toNode = vertexMap.get(component.to);
			if (toNode) {
				toNode.addInEdge(edge);
			}

			if (fromNode && toNode) {
				fromNode.incrementRelatedArchetype(toNode.archetype);
				toNode.incrementRelatedArchetype(fromNode.archetype);
			}

			app.edgeList.push(edge);
		});

		// render components
		app.vertexList.forEach(vertex => {
			app.viewportComponent.addNode(vertex);
		});

		app.edgeList.forEach(edge => {
			app.viewportComponent.addEdge(edge);
		});

		// find unconnected vertices
		app.vertexList.filter(vertex => {
			return vertex.isUnconnected;
		}).forEach(vertex => {
			vertex.exclude();
			app.sidebarComponent.unconnectedNodeListComponent.addNode(vertex);
		});

		// construct groups
		if (Utils.isDefined(data.groups)) {
			data.groups.forEach(component => {
				let group = new Group(component);

				if (highlightedNodeType === 'group' && highlightedNodeId === group.id) {
					highlightedNode = group;
				}

				// position
				if (component.position === null || Utils.isUndefined(component.position)) {
					// set random
					group.position = new Coordinates(
						Math.floor(Math.random() * canvasSize),
						Math.floor(Math.random() * canvasSize),
					);
				} else {
					group.position = new Coordinates(component.position.x, component.position.y);
				}

				// vertices
				app.vertexList.filter(vertex => {
					return component.verticesId.indexOf(vertex.id) > -1;
				}).forEach(vertex => {
					group.addVertex(vertex);
				});

				app.nodeList.push(group);
				app.groupList.push(group);

				app.viewportComponent.addNode(group);
			});
		}

		// exclude nodes
		if (Utils.isDefined(data.sideBar)) {
			data.sideBar.forEach(excludedNode => {
				if (typeof excludedNode.id !== 'string' && !(excludedNode.id instanceof String)) return;

				let idArr = excludedNode.id.split('-');
				if (idArr.length !== 2) return;

				idArr[1] = parseInt(idArr[1], 10);

				let node = app.nodeList.find(node => {
					let prefix = '';
					if (node instanceof Vertex) {
						prefix = 'vertex';
					} else if (node instanceof Group) {
						prefix = 'group';
					}

					return idArr[0] === prefix && node.id === idArr[1];
				});

				if (Utils.isDefined(node)) {
					node.exclude();

					app.sidebarComponent.excludedNodeListComponent.addNode(node);
				}
			});
		}

		if (enableInitialElimination) {
			let MAX_VISIBLE_COMPONENTS = 20;
			new InitialElimination(MAX_VISIBLE_COMPONENTS).run();
        }

		// center viewport
		app.viewportComponent.center();

		// update status bar
		app.sidebarComponent.statusBarComponent.componentCount = data.vertices.length;

		if (Utils.isDefined(highlightedEdge)) {
			highlightedEdge.isHighlighted = true;
			highlightedEdge.from.isHighlighted = true;
			highlightedEdge.to.isHighlighted = true;
		}

		if (Utils.isDefined(highlightedNode)) {
			highlightedNode.highlightWithNeighbours(true);
		}
	}
}

GraphLoader.rawInputSchema = JSON.parse(document.getElementById('imigerRawInputSchema').textContent);
