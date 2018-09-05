/**
 * Class representing a vertex in graph.
 * @constructor
 * @param {object} props Properties of the vertex.
 */
function Vertex(props) {
	/** @prop {integer} id Unique identifier of the vertex. */
	this.id = props.id;
	/** @prop {integer} archetype Identifier of the vertex archetype. */
	this.archetype = props.archetype;
	/** @prop {string} name Name of the vertex. */
	this.name = props.name;
	/** @prop {array} symbol Symbol of the group. */
	this.symbol = app.markSymbol.getMarkSymbol();

	const oneCharacterWidth = 8.3;	// approximate width (in pixels) of one character using Consolas at 15px font size
	const minimumWidth = 200;
	const relatedArchetypeIconWidth = 20;

	var rootElement;
	var symbolListComponent;

	var position = new Coordinates(0, 0);
	var size = {
		width: Math.max(30 + this.name.length * oneCharacterWidth, minimumWidth),
		height: 30,
	};
	var group = null;
	var floater = null;

	var pan = false;
	var excluded = false;
	var iconsDisplayed = false;

	var highlighted = false;
	var highlightedRequiredNeighbours = false;
	var highlightedProvidedNeighbours = false;
	var highlightedArchetypeNeighbours = false;
	var found = false;
	var dimmed = false;

	var inEdgeList = [];
	var outEdgeList = [];
	var symbolList = [];
	var relatedArchetypeMap = {};
	
	/**
	 * Adds a new edge ending in the vertex. Its ending point is moved to the current position of the vertex.
	 * @param {Edge} edge Edge going to the vertex.
	 */
	this.addInEdge = function(edge) {
		if (!(edge instanceof Edge)) {
			throw new TypeError(edge.toString() + 'is not instance of Edge');
		}
		
		edge.setTo(this);
		
		inEdgeList.push(edge);
	};
	
	/**
	 * Adds a new edge starting in the vertex. Its starting point is moved to the current position of the vertex.
	 * @param {Edge} edge Edge going from the vertex.
	 */
	this.addOutEdge = function(edge) {
		if (!(edge instanceof Edge)) {
			throw new TypeError(edge.toString() + 'is not instance of Edge');
		}
		
		edge.setFrom(this);
		
		outEdgeList.push(edge);
	};

	/**
	 * @returns {array<Edge>} Array of edges incoming to the vertex.
	 */
	this.getInEdgeList = function() {
		return inEdgeList;
	};

	/**
	 * @returns {array<Edge>} Array of edges outgoing from the vertex.
	 */
	this.getOutEdgeList = function() {
		return outEdgeList;
	};

	/**
	 * @returns {integer} Number of incoming/outgoing edges.
	 */
	this.countEdges = function() {
		return inEdgeList.length + outEdgeList.length;
	};

	/**
	 * Increments counter of instances of a vertex archetype by one.
	 * @param {integer} archetypeIndex Index of the vertex archetype.
	 */
	this.incrementRelatedArchetype = function(archetypeIndex) {
		if (!relatedArchetypeMap.hasOwnProperty(archetypeIndex)) {
			relatedArchetypeMap[archetypeIndex] = 0;
		}

		relatedArchetypeMap[archetypeIndex]++;
	};

	/**
	 * @returns {object} Map with archetype indexes as keys and counters of their instances as values.
	 */
	this.getRelatedArchetypeMap = function() {
		return relatedArchetypeMap;
	};

	/**
	 * @returns {integer} Number of unique vertex archetypes related to the vertex.
	 */
	this.countRelatedArchetypes = function() {
		return Object.keys(relatedArchetypeMap).length;
	};

	/**
	 * Adds symbol to the list of symbols displayed next to the vertex.
	 * @param {array} symbol Node symbol to be added.
	 */
	this.addSymbol = function(symbol) {
		symbolList.push(symbol);

		if (excluded) return;

		symbolListComponent.appendChild(symbol);
	};

	/**
	 * Removes symbol from the list of symbols displayed next to the vertex.
	 * @param {array} symbol Node symbol to be removed.
	 */
	this.removeSymbol = function(symbol) {
		symbolList.splice(symbolList.indexOf(symbol), 1);

		if (excluded) return;

		symbolListComponent.removeChild(symbol);
	};
	
	/**
	 * @returns {Coordinates} Current position of the vertex.
	 */
	this.getPosition = function() {
		return position;
	};

	/**
	 * Updates the current position of the vertex in graph.
	 * @param {Coordinates} New position of the vertex.
	 */
	this.setPosition = function(coords) {
		if (!(coords instanceof Coordinates)) {
			throw new TypeError(coords.toString() + 'is not instance of Coordinates');
		}

		position = coords;
	};

	/**
	 * @returns {Coordinates} Centre of the vertex.
	 */
	this.getCenter = function() {
		return new Coordinates(
			position.x + size.width / 2,
			position.y + size.height / 2,
		);
	};

	/**
	 * Moves the vertex to a new position in graph. Edges related to the vertex are moved as well.
	 * @param {Coordinates} coords Coordinates to be moved to.
	 */
	this.move = function(coords) {
		if (!(coords instanceof Coordinates)) {
			throw new TypeError(coords.toString() + 'is not instance of Coordinates');
		}

		rootElement.setAttribute('x', coords.x);
		rootElement.setAttribute('y', coords.y);

		inEdgeList.forEach(function(edge) {
			edge.moveEnd(new Coordinates(
				coords.x + size.width / 2,
				coords.y + size.height / 2
			));
		});
	
		outEdgeList.forEach(function(edge) {
			edge.moveStart(new Coordinates(
				coords.x + size.width / 2,
				coords.y + size.height / 2
			));
		});
	};

	/**
	 * @returns {Group} Group this vertex is currently part of. If the vertex stands alone, null is returned.
	 */
	this.getGroup = function() {
		return group;
	};

	/**
	 * Sets a new group that the vertex is added to. If the vertex is currently excluded, its floating point is destroyed.
	 * @param {Group} newValue Group this vertex is a part of.
	 */
	this.setGroup = function(newValue) {
		if (!(newValue instanceof Group) && newValue !== null) {
			throw new TypeError(newValue.toString() + 'is neither instance of Group nor null');
		}

		group = newValue;

		if (newValue && this.isExcluded()) {
			// remove floater
			app.sidebarComponent.removeFloater(floater);
			delete floater;
		}
	};

	/**
	 * Sets the vertex as found. Highlighting is skipped when the vertex is excluded.
	 * @param {boolean} newValue True to mark the vertex as found, otherwise false.
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
	 * Toggles transparency of the vertex. Style change is skipped when the vertex is excluded.
	 * @param {boolean} newValue True to dim the vertex, false to display it normally.
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
     * @returns {boolean} true if icon in all neighbours should be displayed, false otherwise
     */
	this.isIconsDisplayed = function () {
		return iconsDisplayed;
    };


	/**
	 * @returns true if the vertex is currently highlighted (in any way), otherwise false
	 */
	this.isHighlighted = function() {
		return highlighted;
	};

	/**
	 * Toggles highlighting of the vertex.
	 * @param {boolean} newValue True to highlight the vertex, false to unhighlight.
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
	 * Toggles inner state of the vertex marking whether highlighting of its requirements is active.
	 * @param {boolean} newValue True to highlight the neighbours, false to unhighlight.
	 */
	this.setHighlightedRequiredNeighbours = function(newValue) {
		highlightedRequiredNeighbours = newValue;
	};

	/**
	 * Toggles inner state of the vertex marking whether highlighting of its dependents is active.
	 * @param {boolean} newValue True to highlight the neighbours, false to unhighlight.
	 */
	this.setHighlightedProvidedNeighbours = function(newValue) {
		highlightedProvidedNeighbours = newValue;
	};

	/**
	 * Toggles inner state of the vertex marking whether highlighting of instances of a vertex archetype is active.
	 * @param {boolean} newValue True to highlight the neighbours, false to unhighlight.
	 */
	this.setHighlightedArchetypeNeighbours = function(newValue) {
		highlightedArchetypeNeighbours = newValue;
	};

	/**
	 * Toggles highlighting of the vertex to mark it as requirement of some other node.
	 * @param {boolean} newValue True to highlight, false to unhighlight.
	 */
	this.setHighlightedRequired = function(newValue) {
		if (newValue) {
			rootElement.classList.add('node--highlighted-required');
		} else {
			rootElement.classList.remove('node--highlighted-required');
		}

		if (group !== null) {
			group.setHighlightedRequired(newValue);
		}
	};
	
	/**
	 * Toggles highlighting of the vertex to mark it as dependent of some other node.
	 * @param {boolean} newValue True to highlight, false to unhighlight.
	 */
	this.setHighlightedProvided = function(newValue) {
		if (newValue) {
			rootElement.classList.add('node--highlighted-provided');
		} else {
			rootElement.classList.remove('node--highlighted-provided');
		}

		if (group !== null) {
			group.setHighlightedProvided(newValue);
		}
	};
	
	/**
	 * Toggles highlighting of the vertex to mark it as instance of archetype related to some other node.
	 * @param {boolean} newValue True to highlight, false to unhighlight.
	 */
	this.setHighlightedArchetype = function(newValue) {
		if (newValue) {
			rootElement.classList.add('node--highlighted-archetype');
		} else {
			rootElement.classList.remove('node--highlighted-archetype');
		}
	
		if (group !== null) {
			group.setHighlightedArchetype(newValue);
		}
	};

	/**
	 * @returns {boolean} True is the vertex is currently excluded from the viewport, otherwise false.
	 */
	this.isExcluded = function() {
		return excluded;
	};

	/**
	 * Toggles excluded state of the vertex. If the vertex is set excluded, a new floating point is created to connect it with 
	 * related nodes in the viewport. Otherwise, the floating point is deleted.
	 * Any node is called excluded when it is not visible in the viewport but instead in the sidebar.
	 * @param {boolean} newValue True to set the vertex as excluded, otherwise false.
	 */
	this.setExcluded = function(newValue) {
		excluded = newValue;

		if (group !== null) return;

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
	 * Excludes the vertex from the viewport. Removes vertex DOM element and hides its edges. If showIcon is set to True
	 * display icon in all neighbour vertices.
	 * @param {boolean} showIcon True to display icon in all neighbours, False otherwise
	 */
	this.exclude = function(showIcon = false) {
		this.setExcluded(true);
		this.remove(true);

		app.viewportComponent.removeVertex(this);

		if(showIcon){
			showIconClick.bind(this)(null)
		}
	};

	/**
	 * Includes the vertex in the viewport. Afterwards, edges related to the vertex are moved to the current position of the vertex.
	 */
	this.include = function() {
		this.removeFromSidebarList();

		this.setExcluded(false);
        this.remove(false);

        if(iconsDisplayed) {
            showIconClick.bind(this)(null);
        }

		app.viewportComponent.addVertex(this);

		// set edges' ends
		var inEdgeList = this.getInEdgeList();
		inEdgeList.forEach(function(edge) {
			edge.setTo(this);
			edge.moveEnd(this.getCenter());
		}, this);

		var outEdgeList = this.getOutEdgeList();
		outEdgeList.forEach(function(edge) {
			edge.setFrom(this);
			edge.moveStart(this.getCenter());
		}, this);
	};

	/**
	 * Hook function used to remove the vertex from the sidebar list it is located in before it is moved to the viewport.
	 */
	this.removeFromSidebarList = app.utils.noop;

	/**
	 * @returns {boolean} True if the vertex is not connected to any other nodes.
	 */
	this.isUnconnected = function() {
		return inEdgeList.length === 0 && outEdgeList.length === 0;
	};

	/**
	 * Creates a new DOM element representing the vertex in memory. The element being created depends on whether the vertex
	 * is excluded at the moment. Binds user interactions to local handler functions.
	 * @returns {Element} HTML or SVG DOM element depending on whether the vertex is excluded.
	 */
	this.render = function() {
		rootElement = excluded ? renderExcluded.call(this) : renderIncluded.call(this);

		this.setHighlighted(highlighted);

		return rootElement;
	};
	
	/**
	 * Removes the DOM element representing the vertex from document.
	 * @param {boolean} hideEdges True to hide edges related to the vertex in the viewport. Edges are (almost) never really
	 * removed but rather hidden for cases when a node is included back in the viewport.
	 */
	this.remove = function(hideEdges) {
		rootElement.remove();

		// toggle edges
		inEdgeList.filter(function(edge) {
			return !edge.getFrom().isExcluded();
		}).forEach(function(edge) {
			edge.setHidden(hideEdges);
		});

		outEdgeList.filter(function(edge) {
			return !edge.getTo().isExcluded();
		}).forEach(function(edge) {
			edge.setHidden(hideEdges);
		});
	};

	/**
	 * Exports the vertex to a new, plain JS object.
	 * @returns {Object} exported vertex
	 */
	this.export = function() {
		return {
			archetype: this.archetype,
			attributes: props.attributes,
			id: this.id,
			text: '',
			name: this.name,
			position: position,
		};
	};

	/**
	 * @returns {Element} SVG DOM element.
	 */
	function renderIncluded() {
		rootElement = app.utils.createSvgElement('svg', {
			'class': 'node vertex',
			'x': position.x,
			'y': position.y,
			'data-id': this.id,
			'data-name': this.name,
		});
		rootElement.addEventListener('click', click.bind(this));
		rootElement.addEventListener('dblclick', app.utils.stopPropagation);
		rootElement.addEventListener('contextmenu', contextMenu.bind(this));
		rootElement.addEventListener('mousedown', mouseDown.bind(this));
		
		rootElement.appendChild(app.utils.createSvgElement('rect', {
			'height': size.height,
			'width': size.width + this.countRelatedArchetypes() * relatedArchetypeIconWidth,
			'x': 1,
			'y': 1,
		}));

		// archetype icon
		var archetypeIcon = app.dom.createSvgElement('g', {
			'class': 'archetype-icon',
			'transform': 'translate(8, 8)',
		});
		archetypeIcon.addEventListener('click', archetypeClick.bind(this)); // TODO when icon == null can not click on item

		archetypeIcon.innerHTML = app.archetype.vertex[this.archetype].icon;

		rootElement.appendChild(archetypeIcon);

		// name
		var nameText = app.utils.createSvgElement('text', {
			'fill': 'black',
			'x': 25,
			'y': 20,
		});
		nameText.appendChild(document.createTextNode(this.name));
		rootElement.appendChild(nameText);

		// related archetype icons
		var relatedArchetypeListContainer = app.dom.createSvgElement('g', {
			'transform': `translate(${size.width}, 0)`,
		});
		rootElement.appendChild(relatedArchetypeListContainer);

		var archetypeIconOrder = 0;
		for (var archetypeIndex in relatedArchetypeMap) {
			var relatedArchetype = app.utils.createSvgElement('g', {
				'class': 'archetype-icon',
				'transform': `translate(${archetypeIconOrder * relatedArchetypeIconWidth}, 8)`,
			});
			relatedArchetype.addEventListener('click', relatedArchetypeClick.bind(this, parseInt(archetypeIndex))); // TODO when icon == null can not click on item

			relatedArchetype.innerHTML = app.archetype.vertex[archetypeIndex].icon;

			relatedArchetypeListContainer.appendChild(relatedArchetype);

			archetypeIconOrder++;
		}

		// symbol list
		symbolListComponent = new VertexSymbolList;
		rootElement.appendChild(symbolListComponent.render());

		symbolList.forEach(function(symbol) {
			symbolListComponent.appendChild(symbol);
		}, this);

		return rootElement;
	}

	/**
	 * @returns {Element} HTML DOM element.
	 */
	function renderExcluded() {
		rootElement = app.dom.createHtmlElement('li', {
			'class': 'node vertex',
			'data-id': this.id,
		});

		var svg = app.dom.createSvgElement('svg', {
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
			relatedArchetypeIcon.addEventListener('click', relatedArchetypeClick.bind(this, parseInt(archetypeIndex))); // TODO when icon == null can not click on item
			relatedArchetypeIcon.innerHTML = app.archetype.vertex[archetypeIndex].icon;
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

		// name
		var nameText = app.utils.createHtmlElement('div', {
			'class': 'vertex-name',
			'title': this.name,
		});
		nameText.appendChild(document.createTextNode(this.name));
		nameText.addEventListener('click', click.bind(this));
		rootElement.appendChild(nameText);

		// buttons
		var buttonGroup = app.utils.createHtmlElement('div', {
			'class': 'button-group',
		});
		rootElement.appendChild(buttonGroup);

		// show symbol button
		var showSymbolButton = app.utils.createHtmlElement('button', {
			'class': 'show-symbol-button button',
			'style': 'background-color: ' + this.symbol[1] + ';',
			'title': 'Show symbol next to all neighbouring components',
		});
		showSymbolButton.appendChild(document.createTextNode(this.symbol[0]));
		showSymbolButton.addEventListener('click', showIconClick.bind(this));
		buttonGroup.appendChild(showSymbolButton);

		// include button
		var includeButton = app.utils.createHtmlElement('button', {
			'class': 'include-button button',
			'title': 'Display node in viewport',
		});
		includeButton.appendChild(app.utils.createHtmlElement('img', {
			'src': 'images/button_cancel.png',
			'alt': 'Icon of "Icon of "display node in viewport" action" action',
		}));
		includeButton.addEventListener('click', includeClick.bind(this));
		buttonGroup.appendChild(includeButton);

		// set floater element
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
	 * Vertex click interaction. Based on whether the vertex is excluded and currently selected mouse mode (move, exclude),
	 * the vertex is either highlighted or moved within the graph.
	 */
	function click(e) {
		e.stopPropagation();

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
	 * Reveals vertex popover.
	 * @param {MouseEvent} e Click event.
	 */
	function archetypeClick(e) {
		e.stopPropagation();

		app.viewportComponent.vertexPopoverComponent.setContent(this.name + ` (${app.archetype.vertex[this.archetype].name})`, props.attributes);
		app.viewportComponent.vertexPopoverComponent.setPosition(new Coordinates(e.clientX, e.clientY));
		app.viewportComponent.vertexPopoverComponent.open();
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
	 * Displays symbol of the vertex next to all nodes that it is connected with.
	 * @param {MouseEvent} e Click event.
	 */
	function showIconClick(e) {
		iconsDisplayed = !iconsDisplayed;

		var neighbourList = [];

		inEdgeList.filter(function(edge) {
			return !edge.getFrom().isExcluded();
		}).forEach(function(edge) {
			if(!neighbourList.includes(edge.getFrom())) {
				neighbourList.push(edge.getFrom());
			}
		});

		outEdgeList.filter(function(edge) {
			return !edge.getTo().isExcluded();
		}).forEach(function(edge) {
			if(!neighbourList.includes(edge.getTo())) {
				neighbourList.push(edge.getTo());
			}
		});

		neighbourList.forEach(function(node) {
			if (iconsDisplayed) {
				node.addSymbol(this.symbol);
			} else {
				node.removeSymbol(this.symbol);
			}
		}, this);
	}

	/**
	 * Includes the group back to the viewport.
	 */
	function includeClick() {
		this.include.call(this);
	}

	/**
	 * Vertex right click interaction. Displays context menu filled with items representing groups that the vertex can be added to.
	 * @param {Event} e Context menu event.
	 */
	function contextMenu(e) {
		e.preventDefault();

		var excludedNodeList = app.sidebarComponent.excludedNodeListComponent.getNodeList();
		var includedGroupList = app.viewportComponent.getGroupList();

		var nodeList = [].concat(excludedNodeList, includedGroupList);
		if (nodeList.length === 0) return;

		app.viewportComponent.contextMenuComponent.setVertex(this);

		// fill list with items
		nodeList.forEach(function(node) {
			app.viewportComponent.contextMenuComponent.addNode(node);
		});

		app.viewportComponent.contextMenuComponent.setPosition(new Coordinates(e.clientX, e.clientY));
		app.viewportComponent.contextMenuComponent.open();
	}
	
	/**
	 * Handles drag and drop interaction with the vertex. At the moment mouse button is pressed, it is not yet known whether 
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
		 * At the moment mouse is moved, the vertex is clearly being dragged. The vertex is moved to the current position of mouse.
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
		 * At the moment mouse button is released, dragging is done and its final position is set to the vertex.
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
	 * * Prepares highlighting of all graph components so that only the wished ones need to be modified.
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
	 * Highlights only neighbours of the vertex that are required.
	 */
	function highlightRequiredNeighbours() {
		if (highlightedRequiredNeighbours === false) return;

		inEdgeList.forEach(function(edge) {
			edge.setHidden(false);

			edge.setDimmed(false);
			edge.getFrom().setDimmed(false);

			edge.setHighlightedRequired(true);
			edge.getFrom().setHighlightedRequired(true);
		});
	}

	/**
	 * Highlights only neighbours of the vertex that are provided.
	 */
	function highlightProvidedNeighbours() {
		if (highlightedProvidedNeighbours === false) return;

		outEdgeList.forEach(function(edge) {
			edge.setHidden(false);

			edge.setDimmed(false);
			edge.getTo().setDimmed(false);

			edge.setHighlightedProvided(true);
			edge.getTo().setHighlightedProvided(true);
		});
	}

	/**
	 * Highlights only neighbours of the vertex that are instances of the archetype.
	 * @param {integer} archetypeIndex Index of the vertex archetype.
	 */
	function highlightArchetypeNeighbours(archetypeIndex) {
		if (highlightedArchetypeNeighbours === false) return;

		inEdgeList.filter(function(edge) {
			return edge.getFrom().archetype === archetypeIndex;
		}).forEach(function(edge) {
			edge.setHidden(false);

			edge.setDimmed(false);
			edge.getFrom().setDimmed(false);

			edge.getFrom().setHighlightedArchetype(true);
		});

		outEdgeList.filter(function(edge) {
			return edge.getTo().archetype === archetypeIndex;
		}).forEach(function(edge) {
			edge.setHidden(false);

			edge.setDimmed(false);
			edge.getTo().setDimmed(false);

			edge.getTo().setHighlightedArchetype(true);
		});
	}
}
