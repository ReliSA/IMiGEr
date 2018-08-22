/**
 * Class representing a group of vertices in graph. A group is composed from one or more vertices.
 * @constructor
 * @param {object} props Properties of the group.
 */
function Group(props) {
	/** @prop {integer} id Unique identifier of the group. */
	this.id = props.hasOwnProperty('id') ? props.id : app.groupList.length + 1;
	/** @prop {string} name Name of the group. */
	this.name = props.hasOwnProperty('name') ? props.name : 'Group ' + this.id;
	/** @prop {array} symbol Symbol of the group. */
	this.symbol = app.markSymbol.getMarkSymbol();

	var rootElement;
	var vertexListComponent;

	var position = new Coordinates(0, 0);
	var size = {
		width: 70,
		height: 70,
	};
	var floater = null;

	var pan = false;
	var excluded = false;

	var highlighted = false;
	var highlightedRequiredNeighbours = false;
	var highlightedProvidedNeighbours = false;
	var highlightedArchetypeNeighbours = false;
	var found = false;
	var dimmed = false;

	var vertexList = [];
	var relatedArchetypeMap = {};

	/**
	 * Adds a new vertex to the group. The vertex is set as excluded and its DOM element is removed from document. Its edges are moved so that they end at the group.
	 * @param {Vertex} vertex Vertex to be added to the group.
	 */
	this.addVertex = function(vertex) {
		if (!(vertex instanceof Vertex)) {
			throw new TypeError(vertex.toString() + 'is not instance of Vertex');
		}

		if (vertexList.length === 0) {
			position = vertex.getPosition();
		}

		vertex.setGroup(this);
		vertex.setExcluded(this.isExcluded());
		vertex.remove(this.isExcluded());	// edges of the vertex should be removed from DOM only if group is excluded

		vertex.getInEdgeList().forEach(function(edge) {
			if (this.isExcluded()) {
				floater.addInEdge(edge);
			} else {
				edge.moveEnd(this.getCenter());
			}
		}, this);

		vertex.getOutEdgeList().forEach(function(edge) {
			if (this.isExcluded()) {
				floater.addOutEdge(edge);
			} else {
				edge.moveStart(this.getCenter());
			}
		}, this);

		var vertexRelatedArchetypeMap = vertex.getRelatedArchetypeMap();
		for (var archetypeIndex in vertexRelatedArchetypeMap) {
			if (!relatedArchetypeMap.hasOwnProperty(archetypeIndex)) {
				relatedArchetypeMap[archetypeIndex] = 0;
			}
	
			relatedArchetypeMap[archetypeIndex] += vertexRelatedArchetypeMap[archetypeIndex];
		}

		app.viewportComponent.removeVertex(vertex);

		if (rootElement) {
			vertexListComponent.appendChild(vertex);
		}

		vertexList.push(vertex);
	};

	/**
	 * Removes a vertex from the group. The vertex is returned back to the viewport and its edges are moved to it.
	 * @param {Vertex} vertex Vertex to be removed from the group.
	 */
	this.removeVertex = function(vertex) {
		if (!(vertex instanceof Vertex)) {
			throw new TypeError(vertex.toString() + 'is not instance of Vertex');
		}

		vertex.setGroup(null);

		vertex.getInEdgeList().forEach(function(edge) {
			edge.moveEnd(this.getCenter());
		}, vertex);

		vertex.getOutEdgeList().forEach(function(edge) {
			edge.moveStart(this.getCenter());
		}, vertex);

		var vertexRelatedArchetypeMap = vertex.getRelatedArchetypeMap();
		for (var archetypeIndex in vertexRelatedArchetypeMap) {
			relatedArchetypeMap[archetypeIndex] -= vertexRelatedArchetypeMap[archetypeIndex];
		}

		app.viewportComponent.addVertex(vertex);

		if (rootElement) {
			vertexListComponent.removeChild(vertex);
		}

		vertexList.splice(vertexList.indexOf(vertex), 1);
	};
	
	/**
	 * @returns {array<Vertex>} List of vertices added to the group.
	 */
	this.getVertexList = function() {
		return vertexList;
	};

	/**
	 * @returns {array<Edge>} List of edges going to vertices added to the group.
	 */
	this.getInEdgeList = function() {
		var edgeList = [];

		vertexList.forEach(function(vertex) {
			vertex.getInEdgeList().filter(function(edge) {
				return edgeList.indexOf(edge) === -1;
			}).forEach(function(edge) {
				edgeList.push(edge);
			});
		});

		return edgeList;
	};

	/**
	 * @returns {array<Edge>} List of edges going from vertices added to the group.
	 */
	this.getOutEdgeList = function() {
		var edgeList = [];

		vertexList.forEach(function(vertex) {
			vertex.getOutEdgeList().filter(function(edge) {
				return edgeList.indexOf(edge) === -1;
			}).forEach(function(edge) {
				edgeList.push(edge);
			});
		});

		return edgeList;
	};

	/**
	 * @returns {array<Edge>} List of all edges related to vertices added to the group.
	 */
	this.getEdgeList = function() {
		return [].concat(this.getInEdgeList(), this.getOutEdgeList());
	};

	/**
	 * @returns {object} Map with archetype indexes as keys and counters of their instances as values.
	 */
	this.getRelatedArchetypeMap = function() {
		return relatedArchetypeMap;
	};

	/**
	 * @returns {Coordinates} Current position of the group in graph.
	 */
	this.getPosition = function() {
		return position;
	};

	/**
	 * Updates the current position of the group in graph.
	 */
	this.setPosition = function(coords) {
		if (!(coords instanceof Coordinates)) {
			throw new TypeError(coords.toString() + 'is not instance of Coordinates');
		}

		position = coords;
	};

	/**
	 * @returns {Coordinates} Centre of the group.
	 */
	this.getCenter = function() {
		return new Coordinates(
			position.x + size.width / 2,
			position.y + size.height / 2,
		);
	};

	/**
	 * Moves the group to a new position in graph. Edges related to vertices in the group are moved as well.
	 * @param {Coordinates} coords Coordinates to be moved to.
	 */
	this.move = function(coords) {
		if (!(coords instanceof Coordinates)) {
			throw new TypeError(coords.toString() + 'is not instance of Coordinates');
		}

		rootElement.setAttribute('x', coords.x);
		rootElement.setAttribute('y', coords.y);

		vertexList.forEach(function(vertex) {
			vertex.getInEdgeList().forEach(function(edge) {
				edge.moveEnd(new Coordinates(
					coords.x + size.width / 2,
					coords.y + size.height / 2,
				));
			});

			vertex.getOutEdgeList().forEach(function(edge) {
				edge.moveStart(new Coordinates(
					coords.x + size.width / 2,
					coords.y + size.height / 2,
				));
			});
		}, this);
	};

	/**
	 * Sets the group as found. Highlighting is skipped when the group is excluded.
	 * @param {boolean} newValue True to mark the group as found, otherwise false.
	 */
	this.setFound = function(newValue) {
		found = newValue;

		if (excluded) return;
		
		if (newValue) {
			rootElement.classList.add('node--found');
		} else {
			rootElement.classList.remove('node--found');
		}
	};

	/**
	 * Toggles transparency of the group.
	 * @param {boolean} newValue True to set the group semitransparent, false to display it normally.
	 */
	this.setDimmed = function(newValue) {
		dimmed = newValue;

		if (excluded) return;

		if (newValue) {
			rootElement.classList.add('node--dimmed');
		} else {
			rootElement.classList.remove('node--dimmed');
		}
	};

	/**
	 * Toggles highlighting of the group.
	 * @param {boolean} newValue True to highlight the group, false to unhighlight.
	 */
	this.setHighlighted = function(newValue) {
		highlighted = newValue;

		if (newValue) {
			rootElement.classList.add('node--highlighted');
		} else {
			rootElement.classList.remove('node--highlighted');
		}
	};

	/**
	 * Toggles inner state of the group marking whether highlighting of its requirements is active.
	 * @param {boolean} newValue True to highlight the neighbours, false to unhighlight.
	 */
	this.setHighlightedRequiredNeighbours = function(newValue) {
		highlightedRequiredNeighbours = newValue;
	};

	/**
	 * Toggles inner state of the group marking whether highlighting of its dependents is active.
	 * @param {boolean} newValue True to highlight the neighbours, false to unhighlight.
	 */
	this.setHighlightedProvidedNeighbours = function(newValue) {
		highlightedProvidedNeighbours = newValue;
	};

	/**
	 * Toggles inner state of the group marking whether highlighting of instances of a vertex archetype is active.
	 * @param {boolean} newValue True to highlight the neighbours, false to unhighlight.
	 */
	this.setHighlightedArchetypeNeighbours = function(newValue) {
		highlightedArchetypeNeighbours = newValue;
	};

	/**
	 * Toggles highlighting of the group to mark it as requirement of some other node.
	 * @param {boolean} newValue True to highlight, false to unhighlight.
	 */
	this.setHighlightedRequired = function(newValue) {
		if (newValue) {
			rootElement.classList.add('node--highlighted-required');
		} else {
			rootElement.classList.remove('node--highlighted-required');
		}
	};
	
	/**
	 * Toggles highlighting of the group to mark it as dependent of some other node.
	 * @param {boolean} newValue True to highlight, false to unhighlight.
	 */
	this.setHighlightedProvided = function(newValue) {
		if (newValue) {
			rootElement.classList.add('node--highlighted-provided');
		} else {
			rootElement.classList.remove('node--highlighted-provided');
		}
	};
	
	/**
	 * Toggles highlighting of the group to mark it as instance of archetype related to some other node.
	 * @param {boolean} newValue True to highlight, false to unhighlight.
	 */
	this.setHighlightedArchetype = function(newValue) {
		if (newValue) {
			rootElement.classList.add('node--highlighted-archetype');
		} else {
			rootElement.classList.remove('node--highlighted-archetype');
		}
	};

	/**
	 * @returns {boolean} True is the group is currently excluded from the viewport, otherwise false.
	 */
	this.isExcluded = function() {
		return excluded;
	};

	/**
	 * Toggles excluded state of the group. If the group is set excluded, a new floating point is created to connect it with 
	 * related nodes in the viewport. Otherwise, the floating point is deleted.
	 * Any node is called excluded when it is not visible in the viewport but instead in the sidebar.
	 * @param {boolean} newValue True to set the group as excluded, otherwise false.
	 */
	this.setExcluded = function(newValue) {
		excluded = newValue;

		vertexList.forEach(function(vertex) {
			vertex.setExcluded(newValue);
		});

		if (newValue) {
			// set floater
			floater = new FloatingPoint;
			floater.setNode(this);
			app.sidebarComponent.addFloater(floater);

		} else {
			// remove floater
			app.sidebarComponent.removeFloater(floater);
			delete floater;
		}
	};

	/**
	 * Excludes the group from the viewport. Removes group DOM element and hides its edges.
	 */
	this.exclude = function() {
		this.setExcluded(true);
		this.remove(true);

		app.viewportComponent.removeGroup(this);
	};

	/**
	 * Includes the group in the viewport. Afterwards, edges related to the group are moved to the current position of the group.
	 */
	this.include = function() {
		this.removeFromSidebarList();

		this.setExcluded(false);
		this.remove(false);

		app.viewportComponent.addGroup(this);

		// set edges' ends
		var inEdgeList = this.getInEdgeList();
		inEdgeList.forEach(function(edge) {
			edge.moveEnd(this.getCenter());
		}, this);

		var outEdgeList = this.getOutEdgeList();
		outEdgeList.forEach(function(edge) {
			edge.moveStart(this.getCenter());
		}, this);
	};

	/**
	 * Hook function used to remove the group from the sidebar list it is located in before it is moved to the viewport.
	 */
	this.removeFromSidebarList = app.utils.noop;

	/**
	 * Creates a new DOM element representing the group in memory. The element being created depends on whether the group
	 * is excluded at the moment. Binds user interactions to local handler functions.
	 * @returns {Element} depending on whether the group is excluded.
	 */
	this.render = function() {
		rootElement = excluded ? renderExcluded.call(this) : renderIncluded.call(this);

		this.setHighlighted(highlighted);

		return rootElement;
	};

	/**
	 * Removes the DOM element representing the group from document.
	 * @param {boolean} hideEdges True to hide edges of vertices in the group in the viewport. Edges are (almost) never really
	 * removed but rather hidden for cases when a node is included back in the viewport.
	 */
	this.remove = function(hideEdges) {
		rootElement.remove();

		// hide edges
		var inEdgeList = this.getInEdgeList();
		inEdgeList.filter(function(edge) {
			return !edge.getFrom().isExcluded();
		}).forEach(function(edge) {
			edge.setHidden(hideEdges);
		});

		var outEdgeList = this.getOutEdgeList();
		outEdgeList.filter(function(edge) {
			return !edge.getTo().isExcluded();
		}).forEach(function(edge) {
			edge.setHidden(hideEdges);
		});
	};

	/**
	 * @returns {Element} SVG DOM element.
	 */
	function renderIncluded() {
		rootElement = app.utils.createSvgElement('svg', {
			'class': 'node group',
			'x': position.x,
			'y': position.y,
			'data-id': this.id,
		});
		rootElement.addEventListener('click', click.bind(this));
		rootElement.addEventListener('mousedown', mouseDown.bind(this));

		rootElement.appendChild(app.utils.createSvgElement('rect', {
			'width': size.width,
			'height': size.height,
			'x': 1,
			'y': 1,
			'fill': this.symbol[1],
			'stroke': 'black',
			'stroke-width': 1,
		}));

		// name
		var nameText = app.utils.createSvgElement('text', {
			'class': 'group-name',
			'x': 20,
			'y': 15,
		});
		nameText.appendChild(document.createTextNode(this.name));
		nameText.addEventListener('click', nameClick.bind(this));
		rootElement.appendChild(nameText);

		// symbol
		var symbolText = app.utils.createSvgElement('text', {
			'class': 'group-symbol',
			'x': 10,
			'y': 60,
		});
		symbolText.appendChild(document.createTextNode(this.symbol[0]));
		rootElement.appendChild(symbolText);

		// expand button
		var expandButton = app.utils.createSvgElement('g', {
			'class': 'button expand-button',
		});
		expandButton.appendChild(app.utils.createSvgElement('rect', {
			'rx': 4,
			'ry': 4,
			'x': 4,
			'y': 4,
			'height': 14,
			'width': 14,
		}));
		expandButton.appendChild(app.utils.createSvgElement('line', {
			'x1': 11,
			'y1': 6,
			'x2': 11,
			'y2': 16,
		}));
		expandButton.appendChild(app.utils.createSvgElement('line', {
			'x1': 6,
			'y1': 11,
			'x2': 16,
			'y2': 11,
		}));
		expandButton.addEventListener('click', expandClick.bind(this));
		rootElement.appendChild(expandButton);

		// compress button
		var compressButton = app.utils.createSvgElement('g', {
			'class': 'button compress-button',
		});
		compressButton.appendChild(app.utils.createSvgElement('rect', {
			'rx': 4,
			'ry': 4,
			'x': 4,
			'y': 4,
			'height': 14,
			'width': 14,
		}));
		compressButton.appendChild(app.utils.createSvgElement('line', {
			'x1': 6,
			'y1': 11,
			'x2': 16,
			'y2': 11,
		}));
		compressButton.addEventListener('click', compressClick.bind(this));
		rootElement.appendChild(compressButton);

		// dissolve button
		var dissolveButton = app.utils.createSvgElement('g', {
			'class': 'button dissolve-button',
		});
		dissolveButton.appendChild(app.utils.createSvgElement('rect', {
			'rx': 4,
			'ry': 4,
			'x': 52,
			'y': 4,
			'height': 14,
			'width': 14,
		}));
		dissolveButton.appendChild(app.utils.createSvgElement('line', {
			'x1': 55,
			'y1': 7,
			'x2': 63,
			'y2': 15,
		}));
		dissolveButton.appendChild(app.utils.createSvgElement('line', {
			'x1': 63,
			'y1': 7,
			'x2': 55,
			'y2': 15,
		}));
		dissolveButton.addEventListener('click', dissolveClick.bind(this));
		rootElement.appendChild(dissolveButton);

		// vertex list
		vertexListComponent = new GroupVertexList(this);
		rootElement.appendChild(vertexListComponent.render());

		vertexList.forEach(function(vertex) {
			vertexListComponent.appendChild(vertex);
		}, this);

		return rootElement;
	}

	/**
	 * @returns {Element} HTML DOM element.
	 */
	function renderExcluded() {
		rootElement = app.utils.createHtmlElement('li', {
			'class': 'node group',
			'data-id': this.id,
		});

		var svg = app.utils.createSvgElement('svg', {
			'xmlns': 'http://www.w3.org/2000/svg',
			'height': 60,
			'width': 46,
		});
		rootElement.appendChild(svg);

		// related archetypes
		var relatedArchetypesGroup = app.dom.createSvgElement('g', {
			'transform': 'translate(10, 15)',
		});
		svg.appendChild(relatedArchetypesGroup);

		var archetypeIconOrder = 0;
		for (var archetypeIndex in relatedArchetypeMap) {
			var relatedArchetype = app.dom.createSvgElement('g', {
				'class': 'related-archetype',
				'transform': `translate(0, ${archetypeIconOrder * 20})`,
			});
			relatedArchetypesGroup.appendChild(relatedArchetype);

			// counter
			var relatedArchetypeCounter = app.dom.createSvgElement('text', {});
			relatedArchetypeCounter.appendChild(app.dom.createTextElement(relatedArchetypeMap[archetypeIndex]));
			relatedArchetype.appendChild(relatedArchetypeCounter);

			// icon
			var relatedArchetypeIcon = app.dom.createSvgElement('g', {
				'class': 'archetype-icon',
				'transform': `translate(15, -10)`,
			});
			relatedArchetypeIcon.addEventListener('click', relatedArchetypeClick.bind(this, parseInt(archetypeIndex)));
			relatedArchetypeIcon.innerHTML = app.archetype.icon[app.archetype.vertex[archetypeIndex].name];
			relatedArchetype.appendChild(relatedArchetypeIcon);

			// line
			relatedArchetype.appendChild(app.dom.createSvgElement('line', {
				'x1': 30,
				'y1': -5,
				'x2': 36,
				'y2': -5,
			}));

			archetypeIconOrder++;
		}

		// symbol
		var symbolText = app.utils.createHtmlElement('span', {
			'class': 'group-symbol',
			'style': 'background-color: ' + this.symbol[1] + ';',
			'x': 10,
			'y': 55,
		});
		symbolText.appendChild(document.createTextNode(this.symbol[0]));
		symbolText.addEventListener('click', click.bind(this));
		rootElement.appendChild(symbolText);

		// name
		var nameText = app.utils.createHtmlElement('span', {
			'class': 'group-name',
		});
		nameText.appendChild(document.createTextNode(this.name));
		nameText.addEventListener('click', nameClick.bind(this));
		rootElement.appendChild(nameText);

		// vertex list
		vertexListComponent = new GroupVertexList(this);
		rootElement.appendChild(vertexListComponent.render());

		vertexList.forEach(function(vertex) {
			vertexListComponent.appendChild(vertex);
		}, this);

		// buttons
		var buttonGroup = app.utils.createHtmlElement('div', {
			'class': 'button-group',
		});
		rootElement.appendChild(buttonGroup);

		// include button
		var includeButton = app.utils.createHtmlElement('button', {
			'class': 'include-button button',
			'title': 'Display group in viewport',
		});
		includeButton.appendChild(app.utils.createHtmlElement('img', {
			'src': 'images/button_cancel.png',
			'alt': 'Icon of "display group in viewport" action',
		}));
		includeButton.addEventListener('click', includeClick.bind(this));
		buttonGroup.appendChild(includeButton);

		// set floater
		floater.setElement(rootElement);

		// set edges' ends
		var inEdgeList = this.getInEdgeList();
		inEdgeList.forEach(function(edge) {
			floater.addInEdge(edge);
		});

		var outEdgeList = this.getOutEdgeList();
		outEdgeList.forEach(function(edge) {
			floater.addOutEdge(edge);
		});

		return rootElement;
	}

	/**
	 * Group click interaction. Based on whether the group is excluded and currently selected mouse mode (move, exclude),
	 * the group is either highlighted or moved within the graph.
	 */
	function click() {
		if (excluded) {
			this.setHighlighted(!highlighted);
			this.setHighlightedRequiredNeighbours(highlighted);
			this.setHighlightedProvidedNeighbours(highlighted);

			prepareHighlighting.call(this);
			highlightRequiredNeighbours.call(this);
			highlightProvidedNeighbours.call(this);
			return;
		}

		if (pan) {
			pan = false;
			return;
		}

		switch (document.actionForm.actionMove.value) {
			case 'move':
				this.setHighlighted(!highlighted);
				this.setHighlightedRequiredNeighbours(highlighted);
				this.setHighlightedProvidedNeighbours(highlighted);
	
				prepareHighlighting.call(this);
				highlightRequiredNeighbours.call(this);
				highlightProvidedNeighbours.call(this);
				break;

			case 'exclude':
				this.exclude.call(this);

				app.sidebarComponent.excludedNodeListComponent.add(this);
				break;
		}
	}

	/**
	 * Group name click interaction. Reveals a prompt for new group name.
	 * @param {Event} e Click event.
	 */
	function nameClick(e) {
		e.stopPropagation();

		var newValue = prompt('Enter new group name:', this.name);
		if (newValue !== null) {
			this.name = newValue;

			rootElement.querySelector('.group-name').textContent = this.name;
		}
	}

	/**
	 * Includes the group back to the viewport.
	 */
	function includeClick() {
		this.include.call(this);
	}

	/**
	 * Sets the group as expanded so that its vertices are listed too.
	 * @param {Event} e Click event.
	 */
	function expandClick(e) {
		e.stopPropagation();

		rootElement.classList.add('group--expanded');
	}

	/**
	 * Sets the group as compress so that its vertices are not explicitly listed.
	 * @param {Event} e Click event.
	 */
	function compressClick(e) {
		e.stopPropagation();

		rootElement.classList.remove('group--expanded');
	}

	/**
	 * Dissolves the group so that its vertices are displayed separately again. The group itself is destroyed.
	 * @param {Event} e Click event.
	 */
	function dissolveClick(e) {
		e.stopPropagation();

		this.remove.call(this, false);

		var vertexListCopy = vertexList.slice(0);
		vertexListCopy.forEach(function(vertex) {
			this.removeVertex.call(this, vertex);
		}, this);

		app.viewportComponent.removeGroup(this);
	}
	
	/**
	 * Archetype icon click interaction. Toggles highlighting of neighbour vertices which are instances of a vertex archetype.
	 * @param {integer} archetypeIndex Index of the vertex archetype.
	 * @param {MouseEvent} e Click event.
	 */
	function relatedArchetypeClick(archetypeIndex, e) {
		e.stopPropagation();

		this.setHighlighted(!highlighted);
		this.setHighlightedArchetypeNeighbours(highlighted);

		prepareHighlighting.call(this);
		highlightArchetypeNeighbours.call(this, archetypeIndex);
	}
	
	/**
	 * Handles drag and drop interaction with the group. At the moment mouse button is pressed, it is not yet known whether 
	 * it is just clicked or dragged.
	 * @param {Event} e Mouse down event.
	 */
	function mouseDown(e) {
		e.stopPropagation();
		app.closeFloatingComponents();
		
		var self = this;
		var start = new Coordinates(e.clientX, e.clientY);
		
		rootElement.classList.add('node--dragged');
		
		document.body.addEventListener('mousemove', mouseMove);
		document.body.addEventListener('mouseup', mouseUp);
		document.body.addEventListener('mouseleave', mouseUp);
		
		/**
		 * At the moment mouse is moved, the group is clearly being dragged. The group is moved to the current position of mouse.
		 * @param {Event} e Mouse move event.
		 */
		function mouseMove(e) {
			pan = true;
			
			self.move(new Coordinates(
				position.x - (start.x - e.clientX) / app.zoom.scale,
				position.y - (start.y - e.clientY) / app.zoom.scale,
			));
		}

		/**
		 * At the moment mouse button is released, dragging is done and its final position is set to the group.
		 * @param {Event} e Mouse up event.
		 */
		function mouseUp(e) {
			self.setPosition(new Coordinates(
				+rootElement.getAttribute('x'),
				+rootElement.getAttribute('y'),
			));
			
			rootElement.classList.remove('node--dragged');
			
			document.body.removeEventListener('mousemove', mouseMove);
			document.body.removeEventListener('mouseup', mouseUp);
			document.body.removeEventListener('mouseleave', mouseUp);
		}
	}
	
	/**
	 * Prepares highlighting of all graph components so that only the wished ones need to be modified.
	 */
	function prepareHighlighting() {
		this.setDimmed(false);

		this.setHighlightedRequired(false);
		this.setHighlightedProvided(false);
		this.setHighlightedArchetype(false);

		if (highlighted) {
			// dim and unhighlight all nodes but this
			app.nodeList.forEach(function(node) {
				if (node === this) return;

				node.setDimmed(true);

				node.setHighlighted(false);
				node.setHighlightedRequired(false);
				node.setHighlightedProvided(false);
				node.setHighlightedArchetype(false);
			}, this);

			// dim and unhighlight all edges
			app.edgeList.forEach(function(edge) {
				edge.setDimmed(true);

				edge.setHighlighted(false);
				edge.setHighlightedRequired(false);
				edge.setHighlightedProvided(false);
			});

		} else {
			app.nodeList.forEach(function(node) {
				if (node === this) return;

				node.setDimmed(false);

				node.setHighlighted(false);
				node.setHighlightedRequired(false);
				node.setHighlightedProvided(false);
				node.setHighlightedArchetype(false);
			}, this);

			app.edgeList.forEach(function(edge) {
				edge.setHidden(edge.getFrom().isExcluded() || edge.getTo().isExcluded());

				edge.setDimmed(false);

				edge.setHighlighted(false);
				edge.setHighlightedRequired(false);
				edge.setHighlightedProvided(false);
			});
		}
	}

	/**
	 * Highlights only neighbours of vertices in the group that are required.
	 */
	function highlightRequiredNeighbours() {
		if (highlightedRequiredNeighbours === false) return;

		this.getInEdgeList().forEach(function(edge) {
			edge.setHidden(false);

			edge.getFrom().setDimmed(false);
			edge.setDimmed(false);

			edge.setHighlightedRequired(true);
			edge.getFrom().setHighlightedRequired(true);
		});
	}

	/**
	 * Highlights only neighbours of vertices in the group that are provided.
	 */
	function highlightProvidedNeighbours() {
		if (highlightedProvidedNeighbours === false) return;

		this.getOutEdgeList().forEach(function(edge) {
			edge.setHidden(false);

			edge.setDimmed(false);
			edge.getTo().setDimmed(false);

			edge.setHighlightedProvided(true);
			edge.getTo().setHighlightedProvided(true);
		});
	}

	/**
	 * Highlights only neighbours of the group that are instances of the archetype.
	 * @param {integer} archetypeIndex Index of the vertex archetype.
	 */
	function highlightArchetypeNeighbours(archetypeIndex) {
		if (highlightedArchetypeNeighbours === false) return;

		this.getInEdgeList().filter(function(edge) {
			return edge.getFrom().archetype === archetypeIndex;
		}).forEach(function(edge) {
			edge.setHidden(false);

			edge.setDimmed(false);
			edge.getFrom().setDimmed(false);

			edge.getFrom().setHighlightedArchetype(true);
		});

		this.getOutEdgeList().filter(function(edge) {
			return edge.getTo().archetype === archetypeIndex;
		}).forEach(function(edge) {
			edge.setHidden(false);

			edge.setDimmed(false);
			edge.getTo().setDimmed(false);

			edge.getTo().setHighlightedArchetype(true);
		});
	}
}
