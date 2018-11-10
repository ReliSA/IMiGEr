/**
 * Class representing a node in graph.
 */
class Node {
	/**
	 * @constructor
	 * @param {object} props Properties of the node.
	 */
	constructor(props) {
		/** @prop {integer} id Unique identifier of the node. */
		this.id = props.id;
		/** @prop {string} name Name of the node. */
		this.name = props.name;
		/** @prop {array} symbol Symbol of the node. */
		this.symbol = app.markSymbol.getMarkSymbol();
		/** @prop {function} removeFromSidebarList Hook function used to remove the node from the sidebar list it is located in before it is moved to the viewport. */
		this.removeFromSidebarList = Utils.noop;

		// components
		this._symbolListComponent = new NodeSymbolList;

		this._position = null;
		this._size = null;
		this._proxy = null;

		this._panning = false;

		this._isExcluded = false;
		this._isFound = false;
		this._isDimmed = false;
		this._isHighlighted = false;
		this._isRequiredNeighboursHighlighted = false;
		this._isProvidedNeighboursHighlighted = false;
		this._isArchetypeNeighboursHighlighted = false;
		this._isNeighbourIconsDisplayed = false;

		this._relatedArchetypeMap = {};
	}

	/**
	 * Adds symbol to the list of symbols displayed next to the node.
	 * @param {array} symbol Node symbol to be added.
	 */
	addSymbol(symbol) {
		if (this.isExcluded) return;

		this._symbolListComponent.add(symbol);
	}

	/**
	 * Removes symbol from the list of symbols displayed next to the node.
	 * @param {array} symbol Node symbol to be removed.
	 */
	removeSymbol(symbol) {
		if (this.isExcluded) return;

		this._symbolListComponent.remove(symbol);
	}

	/**
	 * @returns {string} Unique identifier of a graph node (group or vertex).
	 */
	get uniqueId() {
		let prefix;
		if (this instanceof Vertex) {
			prefix = 'vertex-';
		} else if (this instanceof Group) {
			prefix = 'group-';
		} else {
			prefix = '';
		}

		return prefix + this.id;
	}

	/**
	 * @returns {Coordinates} Current position of the node.
	 */
	get position() {
		return this._position;
	}
	
	/**
	 * Updates the current position of the node in graph.
	 * @param {Coordinates} New position of the node.
	 */
	set position(coords) {
		if (!(coords instanceof Coordinates)) {
			throw new TypeError(coords.toString() + ' is not an instance of Coordinates');
		}

		this._position = coords;
	}

	/**
	 * @returns {Coordinates} Centre of the node.
	 */
	get center() {
		return new Coordinates(
			this._position.x + (this._size.width / 2),
			this._position.y + (this._size.height / 2),
		);
	}

	/**
	 * @returns {Dimensions} Dimensions of the node.
	 */
	get size() {
		return this._size;
	}

	/**
	 * Moves the node to a new position in graph. Edges related to the node are moved as well.
	 * @param {Coordinates} coords Coordinates to be moved to.
	 */
	move(coords) {
		if (!(coords instanceof Coordinates)) {
			throw new TypeError(coords.toString() + ' is not an instance of Coordinates');
		}

		this._rootElement.setAttribute('x', coords.x);
		this._rootElement.setAttribute('y', coords.y);

		let inEdgeList = this.inEdgeList;
		inEdgeList.forEach(edge => {
			edge.end = new Coordinates(
				coords.x + (this._size.width / 2),
				coords.y + (this._size.height / 2),
			);
		});

		let outEdgeList = this.outEdgeList;
		outEdgeList.forEach(edge => {
			edge.start = new Coordinates(
				coords.x + (this._size.width / 2),
				coords.y + (this._size.height / 2),
			);
		});
	}

	/**
	 * @returns {object} Map with archetype indexes as keys and counters of their instances as values.
	 */
	get relatedArchetypeMap() {
		return this._relatedArchetypeMap;
	}

	/**
	 * Sets the node as found. Highlighting is skipped when the node is excluded.
	 * @param {boolean} newValue True to mark the node as found, otherwise false.
	 */
	set isFound(newValue) {
		this._isFound = newValue;

		if (this.isExcluded) return;
		
		if (newValue) {
			this._rootElement.classList.add('node--found');
		} else {
			this._rootElement.classList.remove('node--found');
		}
	}

	/**
	 * Toggles transparency of the node. Style change is skipped when the node is excluded.
	 * @param {boolean} newValue True to dim the node, false to display it normally.
	 */
	set isDimmed(newValue) {
		this._isDimmed = newValue;

		if (this.isExcluded) return;

		if (newValue) {
			this._rootElement.classList.add('node--dimmed');
		} else {
			this._rootElement.classList.remove('node--dimmed');
		}
	}

	/**
	 * @returns true if the node is currently highlighted (in any way), otherwise false
	 */
	get isHighlighted() {
		return this._isHighlighted;
	}

	/**
	 * Toggles highlighting of the node.
	 * @param {boolean} newValue True to highlight the node, false to unhighlight.
	 */
	set isHighlighted(newValue) {
		this._isHighlighted = newValue;

		if (newValue) {
			this._rootElement.classList.add('node--highlighted');
		} else {
			this._rootElement.classList.remove('node--highlighted');
		}
	}

	/**
	 * Toggles inner state of the node marking whether highlighting of its requirements is active.
	 * @param {boolean} newValue True to highlight the neighbours, false to unhighlight.
	 */
	set isRequiredNeighboursHighlighted(newValue) {
		this._isRequiredNeighboursHighlighted = newValue;
	}

	/**
	 * Toggles inner state of the node marking whether highlighting of its dependents is active.
	 * @param {boolean} newValue True to highlight the neighbours, false to unhighlight.
	 */
	set isProvidedNeighboursHighlighted(newValue) {
		this._isProvidedNeighboursHighlighted = newValue;
	}

	/**
	 * Toggles inner state of the node marking whether highlighting of instances of a node archetype is active.
	 * @param {boolean} newValue True to highlight the neighbours, false to unhighlight.
	 */
	set isArchetypeNeighboursHighlighted(newValue) {
		this._isArchetypeNeighboursHighlighted = newValue;
	}

	/**
	 * Toggles highlighting of the node to mark it as requirement of some other node.
	 * @param {boolean} newValue True to highlight, false to unhighlight.
	 */
	set isHighlightedAsRequired(newValue) {
		if (newValue) {
			this._rootElement.classList.add('node--highlighted-as-required');
		} else {
			this._rootElement.classList.remove('node--highlighted-as-required');
		}
	}
	
	/**
	 * Toggles highlighting of the node to mark it as dependent of some other node.
	 * @param {boolean} newValue True to highlight, false to unhighlight.
	 */
	set isHighlightedAsProvided(newValue) {
		if (newValue) {
			this._rootElement.classList.add('node--highlighted-as-provided');
		} else {
			this._rootElement.classList.remove('node--highlighted-as-provided');
		}
	}
	
	/**
	 * Toggles highlighting of the node to mark it as instance of archetype related to some other node.
	 * @param {boolean} newValue True to highlight, false to unhighlight.
	 */
	set isHighlightedAsArchetype(newValue) {
		if (newValue) {
			this._rootElement.classList.add('node--highlighted-as-archetype');
		} else {
			this._rootElement.classList.remove('node--highlighted-as-archetype');
		}
	}

	/**
	 * Method add or remove highlighting of vertex and all neighbours.
	 *
	 * @param newValue true to highlight, false otherwise
	 */
	highlightWithNeighbours(newValue) {
		this.isHighlighted = newValue;
		this.isRequiredNeighboursHighlighted = newValue;
		this.isProvidedNeighboursHighlighted = newValue;

		this._prepareHighlighting();
		this._highlightRequiredNeighbours();
		this._highlightProvidedNeighbours();
	}

	/**
	 * @returns {boolean} True is the node is currently excluded from the viewport, otherwise false.
	 */
	get isExcluded() {
		return this._isExcluded;
	}

	/**
	 * Toggles excluded state of the node. If the node is set excluded, a new proxy is created to connect it with 
	 * related nodes in the viewport. Otherwise, the proxy is destroyed.
	 * Any node is called excluded when it is not visible in the viewport but instead in the sidebar.
	 * @param {boolean} newValue True to set the node as excluded, otherwise false.
	 */
	set isExcluded(newValue) {
		this._isExcluded = newValue;

		if (this instanceof Vertex && this._group !== null) return;

		if (newValue) {
			// set proxy
			this._proxy = new NodeProxy(this);
			app.proxyList.push(this._proxy);

		} else {
			// remove proxy
			app.proxyList.splice(app.proxyList.indexOf(this._proxy), 1);
			this._proxy = null;
		}
	}

	/**
	 * Excludes the node from the viewport. Removes node DOM element and hides its edges. If showIcon is set to True
	 * display icon in all neighbour vertices.
	 * @param {boolean} showIcon True to display icon in all neighbours, False otherwise
	 */
	exclude() {
		this.isExcluded = true;
		this.remove(true);

		app.viewportComponent.removeNode(this);
	}

	/**
	 * Includes the node in the viewport. Afterwards, edges related to the node are moved to the current position of the node.
	 */
	include() {
		this.removeFromSidebarList();

		this.isExcluded = false;
		this.remove(false);

		app.viewportComponent.addNode(this);
	}

	/**
	 * Creates a new DOM element representing the node in memory. The element being created depends on whether the node
	 * is excluded at the moment. Binds user interactions to local handler functions.
	 * @returns {Element} HTML or SVG DOM element depending on whether the node is excluded.
	 */
	render() {
		this._rootElement = this.isExcluded ? this._renderExcluded() : this._renderIncluded();

		return this._rootElement;
	}
	
	/**
	 * Removes the DOM element representing the node from document.
	 * @param {boolean} hideEdges True to hide edges related to the node in the viewport. Edges are (almost) never really
	 * removed but rather hidden for cases when a node is included back in the viewport.
	 */
	remove(hideEdges) {
		this._rootElement.remove();

		// toggle edges
		let inEdgeList = this.inEdgeList;
		inEdgeList.filter(edge => {
			return !edge.from.isExcluded;
		}).forEach(edge => {
			edge.isHidden = hideEdges;
		});

		let outEdgeList = this.outEdgeList;
		outEdgeList.filter(edge => {
			return !edge.to.isExcluded;
		}).forEach(edge => {
			edge.isHidden = hideEdges;
		});

		// hide neighbour symbols
		if (this._isNeighbourIconsDisplayed) {
			this._onShowNeighbourIconsClick();
		}
	};

	/**
	 * Exports the node to a new, plain JS object.
	 * @returns {Object} exported node
	 */
	export() {
		throw new AbstractMethodError;
	}

	/**
	 * @returns {SVGElement} SVG DOM element.
	 */
	_renderIncluded() {
		throw new AbstractMethodError;
	}

	/**
	 * @returns {HTMLElement} HTML DOM element.
	 */
	_renderExcluded() {
		throw new AbstractMethodError;
	}

	/**
	 * Node click interaction. Based on whether the node is excluded and currently selected mouse mode (move, exclude),
	 * the node is either highlighted or moved within the graph.
	 */
	_onNodeClick(e) {
		e.stopPropagation();

		if (this.isExcluded) {
			this.highlightWithNeighbours(!this.isHighlighted);

		} else {
			if (this._panning === true) {
				this._panning = false;
				return;
			}

			switch (document.modeForm.mode.value) {
				case 'move':
					this.highlightWithNeighbours(!this.isHighlighted);
					break;

				case 'exclude':
					this.exclude();

					app.sidebarComponent.excludedNodeListComponent.addNode(this);
					break;
			}
		}
	}

	/**
	 * Handles drag and drop interaction with the node. At the moment mouse button is pressed, it is not yet known whether 
	 * it is just clicked or dragged.
	 * @param {Event} e Mouse down event.
	 */
	_onNodeMouseDown(e) {
		e.stopPropagation();
		app.closeFloatingComponents();
		
		let that = this;
		let start = new Coordinates(e.clientX, e.clientY);

		this._rootElement.classList.add('node--dragged');
		
		document.body.addEventListener('mousemove', mouseMove);
		document.body.addEventListener('mouseup', mouseUp);
		document.body.addEventListener('mouseleave', mouseUp);

		/**
		 * At the moment mouse is moved, the node is clearly being dragged. The node is moved to the current position of mouse.
		 * @param {Event} e Mouse move event.
		 */
		function mouseMove(e) {
			that._panning = true;

			that.move(new Coordinates(
				that.position.x - (start.x - e.clientX) / app.zoom.scale,
				that.position.y - (start.y - e.clientY) / app.zoom.scale,
			));
		}

		/**
		 * At the moment mouse button is released, dragging is done and its final position is set to the node.
		 * @param {Event} e Mouse up event.
		 */
		function mouseUp() {
			that.position = new Coordinates(
				+that._rootElement.getAttribute('x'),
				+that._rootElement.getAttribute('y'),
			);

			that._rootElement.classList.remove('node--dragged');
			
			document.body.removeEventListener('mousemove', mouseMove);
			document.body.removeEventListener('mouseup', mouseUp);
			document.body.removeEventListener('mouseleave', mouseUp);
		}
	}

	/**
	 * Displays symbol of the node next to all nodes that this node is connected with.
	 */
	_onShowNeighbourIconsClick() {
		this._isNeighbourIconsDisplayed = !this._isNeighbourIconsDisplayed;

		let neighbourNodeList = [];

		let inEdgeList = this.inEdgeList;
		inEdgeList.filter(edge => {
			return !edge.from.isExcluded;
		}).forEach(edge => {
			if (neighbourNodeList.includes(edge.from) === false) {
				neighbourNodeList.push(edge.from);
			}
		});

		let outEdgeList = this.outEdgeList;
		outEdgeList.filter(edge => {
			return !edge.to.isExcluded;
		}).forEach(edge => {
			if (neighbourNodeList.includes(edge.to) === false) {
				neighbourNodeList.push(edge.to);
			}
		});

		neighbourNodeList.forEach(node => {
			if (this._isNeighbourIconsDisplayed) {
				node.addSymbol(this.symbol);
			} else {
				node.removeSymbol(this.symbol);
			}
		});
	}

	/**
	 * Archetype icon click interaction. Toggles highlighting of neighbour vertices which are instances of a vertex archetype.
	 * @param {integer} archetypeIndex Index of the vertex archetype.
	 * @param {MouseEvent} e Click event.
	 */
	_onRelatedArchetypeIconClick(archetypeIndex, e) {
		e.stopPropagation();

		this.isArchetypeNeighboursHighlighted = !this.isHighlighted;
		this.isHighlighted = !this.isHighlighted;

		this._prepareHighlighting();
		this._highlightArchetypeNeighbours(archetypeIndex);
	}

	/**
	 * * Prepares highlighting of all graph components so that only the wished ones need to be modified.
	 */
	_prepareHighlighting() {
		this.isDimmed = false;

		this.isHighlightedAsRequired = false;
		this.isHighlightedAsProvided = false;
		this.isHighlightedAsArchetype = false;

		if (this.isHighlighted) {
			// dim and unhighlight all nodes but this
			app.nodeList.forEach(node => {
				if (node === this) return;

				node.isDimmed = true;

				node.isHighlighted = false;
				node.isHighlightedAsRequired = false;
				node.isHighlightedAsProvided = false;
				node.isHighlightedAsArchetype = false;
			});

			// dim and unhighlight all edges
			app.edgeList.forEach(edge => {
				edge.isDimmed = true;

				edge.isHighlighted = false;
				edge.isHighlightedAsRequired = false;
				edge.isHighlightedAsProvided = false;
			});

		} else {
			app.nodeList.forEach(node => {
				if (node === this) return;

				node.isDimmed = false;

				node.isHighlighted = false;
				node.isHighlightedAsRequired = false;
				node.isHighlightedAsProvided = false;
				node.isHighlightedAsArchetype = false;
			});

			app.edgeList.forEach(edge => {
				edge.isHidden = edge.from.isExcluded || edge.to.isExcluded;

				edge.isDimmed = false;

				edge.isHighlighted = false;
				edge.isHighlightedAsRequired = false;
				edge.isHighlightedAsProvided = false;
			});
		}
	}

	/**
	 * Highlights only neighbours of the vertex that are required.
	 */
	_highlightRequiredNeighbours() {
		if (this._isRequiredNeighboursHighlighted === false) return;

		let inEdgeList = this.inEdgeList;
		inEdgeList.forEach(edge => {
			edge.isHidden = false;

			edge.isDimmed = false;
			edge.from.isDimmed = false;

			edge.isHighlightedAsRequired = true;
			edge.from.isHighlightedAsRequired = true;
		});
	}

	/**
	 * Highlights only neighbours of the vertex that are provided.
	 */
	_highlightProvidedNeighbours() {
		if (this._isProvidedNeighboursHighlighted === false) return;

		let outEdgeList = this.outEdgeList;
		outEdgeList.forEach(edge => {
			edge.isHidden = false;

			edge.isDimmed = false;
			edge.to.isDimmed = false;

			edge.isHighlightedAsProvided = true;
			edge.to.isHighlightedAsProvided = true;
		});
	}

	/**
	 * Highlights only neighbours of the vertex that are instances of the archetype.
	 * @param {integer} archetypeIndex Index of the vertex archetype.
	 */
	_highlightArchetypeNeighbours(archetypeIndex) {
		if (this._isArchetypeNeighboursHighlighted === false) return;

		let inEdgeList = this.inEdgeList;
		inEdgeList.filter(edge => {
			return edge.from.archetype === archetypeIndex;
		}).forEach(edge => {
			edge.isHidden = false;

			edge.isDimmed = false;
			edge.from.isDimmed = false;

			edge.from.isHighlightedAsArchetype = true;
		});

		let outEdgeList = this.outEdgeList;
		outEdgeList.filter(edge => {
			return edge.to.archetype === archetypeIndex;
		}).forEach(edge => {
			edge.isHidden = false;

			edge.isDimmed = false;
			edge.to.isDimmed = false;

			edge.to.isHighlightedAsArchetype = true;
		});
	}
}
