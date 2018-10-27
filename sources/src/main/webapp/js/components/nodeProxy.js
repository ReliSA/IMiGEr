/**
 * Class representing a proxy node connecting a node present in the viewport with a node excluded to the sidebar. Position 
 * of a proxy is changed every time when graph is moved or zoomed, the node is moved in viewport or sidebar is scrolled.
 */
class NodeProxy {
	/**
	 * @constructor
	 * @param {Node} node Node that this proxy is bound to.
	 */
	constructor(node) {
		if (!(node instanceof Node)) {
			throw new TypeError(node.toString() + ' is not an instance of Node');
		}

		this._node = node;

		this._position = new Coordinates(0, 0);

		this._inEdgeList = [];
		this._outEdgeList = [];
	}

	/**
	 * Sets a DOM element in sidebar that this proxy is bound to. It is used to calculate proxy position when sidebar is scrolled.
	 * @param {Element} newValue DOM element in sidebar the proxy is bound to.
	 */
	set element(newValue) {
		if (!(newValue instanceof Element)) {
			throw new TypeError(newValue.toString() + ' is not an instance of Element');
		}

		this._rootElement = newValue;
	}

	/**
	 * Adds a new edge ending in this proxy. Its ending point is moved to the current position of the proxy.
	 * @param {Edge} edge Edge going to this proxy.
	 */
	addInEdge(edge) {
		if (!(edge instanceof Edge)) {
			throw new TypeError(edge.toString() + ' is not an instance of Edge');
		}

		edge.end = this.position;

		this._inEdgeList.push(edge);
	}
	
	/**
	 * Adds a new edge starting in this proxy. Its starting point is moved to the current position of the proxy.
	 * @param {Edge} edge Edge going from this proxy.
	 */
	addOutEdge(edge) {
		if (!(edge instanceof Edge)) {
			throw new TypeError(edge.toString() + ' is not an instance of Edge');
		}

		edge.start = this.position;
		
		this._outEdgeList.push(edge);
	}

	/**
	 * @returns {array<Edge>} Array of edges going to the proxy.
	 */
	get inEdgeList() {
		return this._inEdgeList;
	}

	/**
	 * @returns {array<Edge>} Array of edges going from this proxy.
	 */
	get outEdgeList() {
		return this._outEdgeList;
	}

	/**
	 * @returns {Coordinates} Current position of this proxy.
	 */
	get position() {
		return this._position;
	}

	/**
	 * Updates the current position of vertices related to this proxy.
	 */
	updatePosition() {
		let bbox = this._rootElement.getBoundingClientRect();
		let viewportPosition = app.viewportComponent.getPosition();

		this._position.x = (bbox.left - viewportPosition.x);
		this._position.y = (bbox.top - viewportPosition.y - app.headerComponent.height - app.navbarComponent.height);

		let edgeOffsetY;
		if (this._node instanceof Vertex) {
			edgeOffsetY = 10;
		} else if (this._node instanceof Group) {
			edgeOffsetY = 35;
		} else {
			edgeOffsetY = 0;
		}

		let archetypeList = Object.keys(this._node.relatedArchetypeMap).map(archetypeIndex => parseInt(archetypeIndex));
		let archetypeIconOrder;

		// redraw dependent edges
		let inEdgeList = this.inEdgeList;
		inEdgeList.forEach(edge => {
			archetypeIconOrder = archetypeList.indexOf(edge.from.archetype);

			edge.end = new Coordinates(
				this._position.x / app.zoom.scale,
				(this._position.y + edgeOffsetY + archetypeIconOrder * 20) / app.zoom.scale,
			);
		});

		let outEdgeList = this.outEdgeList;
		outEdgeList.forEach(edge => {
			archetypeIconOrder = archetypeList.indexOf(edge.to.archetype);

			edge.start = new Coordinates(
				this._position.x / app.zoom.scale,
				(this._position.y + edgeOffsetY + archetypeIconOrder * 20) / app.zoom.scale,
			);
		});
	}

	/**
	 * @returns {Coordinates} Centre of this proxy.
	 */
	get center() {
		return this._position;
	}

	/**
	 * Always returns false as proxies may never be excluded. It is here for NodeProxy to be compatible with API of Node.
	 * @see Node
	 * @returns {boolean} Always false.
	 */
	get isExcluded() {
		return false;
	}

	/**
	 * Does nothing as proxies may never be dimmed. It is here for NodeProxy to be compatible with API of Node.
	 * @see Node
	 * @param {boolean} newValue Anything.
	 */
	set isDimmed(newValue) {
		// do nothing
	}

	/**
	 * Toggles highlighting of the depedent node.
	 * @param {boolean} newValue True to highlight the node as required, otherwise false.
	 */
	set isHighlightedAsRequired(newValue) {
		this._node.isHighlightedAsRequired = newValue;
	}

	/**
	 * Toggles highlighting of the depedent node.
	 * @param {boolean} newValue True to highlight the node as provided, otherwise false.
	 */
	set isHighlightedAsProvided(newValue) {
		this._node.isHighlightedAsProvided = newValue;
	}
}
