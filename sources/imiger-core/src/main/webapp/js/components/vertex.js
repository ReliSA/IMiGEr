/**
 * Class representing a vertex in graph.
 */
class Vertex extends Node {
	/**
	 * @constructor
	 * @param {object} props Properties of the vertex.
	 */
	constructor(props) {
		super(props);

		// constants
		this._oneCharacterWidth = 8.3;	// approximate width (in pixels) of one character using Consolas at 15px font size
		this._minimumWidth = 200;

		// properties
		/** @prop {integer} archetype Identifier of the vertex archetype. */
		this.archetype = props.archetype;
		/** @prop {array} attributes TODO: jsDoc */
		this.attributes = props.attributes;

		this._size = new Dimensions(
			Math.max(30 + this.name.length * this._oneCharacterWidth, this._minimumWidth),
			30,
		);

		this._group = null;

		this._inEdgeList = [];
		this._outEdgeList = [];
	}

	/**
	 * @inheritdoc
	 */
	addSymbol(symbol) {
		super.addSymbol(symbol);

		if (this._group !== null) {
			this._group.addSymbol(symbol);
		}
	}

	/**
	 * @inheritdoc
	 */
	removeSymbol(symbol) {
		super.removeSymbol(symbol);

		if (this._group !== null) {
			this._group.removeSymbol(symbol);
		}
	}

	/**
	 * Adds a new edge ending in the vertex. Its ending point is moved to the current position of the vertex.
	 * @param {Edge} edge Edge going to the vertex.
	 */
	addInEdge(edge) {
		if (!(edge instanceof Edge)) {
			throw new TypeError(edge.toString() + ' is not an instance of Edge');
		}

		edge.to = this;

		this._inEdgeList.push(edge);
	}

	/**
	 * Adds a new edge starting in the vertex. Its starting point is moved to the current position of the vertex.
	 * @param {Edge} edge Edge going from the vertex.
	 */
	addOutEdge(edge) {
		if (!(edge instanceof Edge)) {
			throw new TypeError(edge.toString() + ' is not an instance of Edge');
		}

		edge.from = this;

		this._outEdgeList.push(edge);
	}

	/**
	 * @returns {array<Edge>} Array of edges incoming to the vertex.
	 */
	get inEdgeList() {
		return this._inEdgeList;
	}

	/**
	 * @returns {array<Edge>} Array of edges outgoing from the vertex.
	 */
	get outEdgeList() {
		return this._outEdgeList;
	}

	/**
	 * @returns {integer} Number of incoming/outgoing edges.
	 */
	countEdges() {
		return this._inEdgeList.length + this._outEdgeList.length;
	}

	/**
	 * Increments counter of instances of a vertex archetype by one.
	 * @param {integer} archetypeIndex Index of the vertex archetype.
	 */
	incrementRelatedArchetype(archetypeIndex) {
		this._relatedArchetypeListComponent.add(archetypeIndex);
	}

	/**
	 * @returns {Group} Group this vertex is currently part of. If the vertex stands alone, null is returned.
	 */
	get group() {
		return this._group;
	}

	/**
	 * Sets a new group that the vertex is added to. If the vertex is currently excluded, its proxy is destroyed.
	 * @param {Group} newValue Group this vertex is a part of.
	 */
	set group(newValue) {
		if (!(newValue instanceof Group) && newValue !== null) {
			throw new TypeError(newValue.toString() + 'is neither instance of Group nor null');
		}

		this._group = newValue;

		if (newValue && this.isExcluded) {
			// remove proxy
			app.proxyList.splice(app.proxyList.indexOf(this._proxy), 1);
			this._proxy = null;
		}
	}

	/**
	 * @inheritdoc
	 */
	set isHighlightedAsRequired(newValue) {
		super.isHighlightedAsRequired = newValue;

		if (this._group !== null) {
			this._group.isHighlightedAsRequired = newValue;
		}
	}

	/**
	 * @inheritdoc
	 */
	set isHighlightedAsProvided(newValue) {
		super.isHighlightedAsProvided = newValue;

		if (this._group !== null) {
			this._group.isHighlightedAsProvided = newValue;
		}
	}

	/**
	 * @inheritdoc
	 */
	set isHighlightedAsArchetype(newValue) {
		super.isHighlightedAsArchetype = newValue;

		if (this._group !== null) {
			this._group.isHighlightedAsArchetype = newValue;
		}
	}

	/**
	 * Includes the vertex in the viewport. Afterwards, edges related to the vertex are moved to the current position of the vertex.
	 */
	include() {
		super.include();

		// set edges' ends
		let inEdgeList = this.inEdgeList;
		inEdgeList.forEach(edge => {
			edge.to = this;
			edge.end = this.center;
		});

		let outEdgeList = this.outEdgeList;
		outEdgeList.forEach(edge => {
			edge.from = this;
			edge.start = this.center;
		});
	}

	/**
	 * @returns {boolean} True if the vertex is not connected to any other nodes.
	 */
	get isUnconnected() {
		return this.inEdgeList.length === 0 && this.outEdgeList.length === 0;
	}

	/**
	 * Exports the vertex to a new, plain JS object.
	 * @returns {Object} exported vertex
	 */
	export() {
		return {
			archetype: this.archetype,
			attributes: this.attributes,
			id: this.id,
			text: '',
			name: this.name,
			position: this.position,
		};
	}

	/**
	 * @returns {SVGElement} SVG DOM element.
	 */
	_renderIncluded() {
		// root
		this._rootElement = DOM.s('g', {
			class: 'node vertex',
			transform: `translate(${this.position.x}, ${this.position.y})`,
			'data-id': this.id,
			'data-name': this.name,
			onClick: this._onNodeClick.bind(this),
			onDblClick: Utils.stopPropagation,
			onContextMenu: this._onNodeContextMenu.bind(this),
			onMouseDown: this._onNodeMouseDown.bind(this),
		}, [
			DOM.s('rect', {
				width: this.size.width + this._relatedArchetypeListComponent.size.width,
				height: this.size.height,
				x: 1,
				y: 1,
			}),
			// vertex archetype
			DOM.s('use', {
				href: '#vertexArchetypeIcon-' + app.archetype.vertex[this.archetype].name,
				class: 'archetype-icon',
				transform: 'translate(8, 8)',
				onClick: this._onArchetypeIconClick.bind(this),
			}),
			// vertex name
			DOM.s('text', {
				fill: 'black',
				x: 25,
				y: 20,
			}, [
				DOM.t(this.name),
			]),
			// symbol list
			this._symbolListComponent.render(),
			// related archetype list
			this._relatedArchetypeListComponent.render(),
		]);

		return this._rootElement;
	}

	/**
	 * @returns {HTMLElement} HTML DOM element.
	 */
	_renderExcluded() {
		// root
		this._rootElement = DOM.h('li', {
			class: 'node vertex',
			'data-id': this.id,
		}, [
			// related archetypes
			this._relatedArchetypeListComponent.render(),
			// name
			DOM.h('div', {
				class: 'vertex-name',
				title: this.name,
				innerText: this.name,
				onClick: this._onNodeClick.bind(this),
			}),
			// buttons
			DOM.h('div', {
				class: 'button-group',
			}, [
				DOM.h('button', {
					class: 'show-symbol-button button',
					style: 'background-color: ' + this.symbol.color + ';',
					title: 'Show symbol next to all neighbouring components',
					innerText: this.symbol.character,
					onClick: this._onShowNeighbourIconsClick.bind(this),
				}),
				DOM.h('button', {
					class: 'include-button button',
					title: 'Display node in viewport',
					onClick: this.include.bind(this),
				}, [
					DOM.h('img', {
						src: 'images/icomoon/cross.svg',
						alt: 'Icon of "Icon of "display node in viewport" action" action',
					}),
				]),
			]),
		]);

		// set proxy element
		this._proxy.element = this._rootElement;

		// set edges' ends
		let inEdgeList = this.inEdgeList;
		inEdgeList.forEach(edge => {
			this._proxy.addInEdge(edge);
		});

		let outEdgeList = this.outEdgeList;
		outEdgeList.forEach(edge => {
			this._proxy.addOutEdge(edge);
		});

		return this._rootElement;
	}

	/**
	 * Reveals vertex popover.
	 * @param {MouseEvent} e Click event.
	 */
	_onArchetypeIconClick(e) {
		e.stopPropagation();

		app.viewportComponent.vertexPopoverComponent.title = this.name + ` (${app.archetype.vertex[this.archetype].name})`;
		app.viewportComponent.vertexPopoverComponent.body = this.attributes;
		app.viewportComponent.vertexPopoverComponent.position = new Coordinates(e.clientX, e.layerY);
		app.viewportComponent.vertexPopoverComponent.open();
	}

	/**
	 * Vertex right click interaction. Displays context menu filled with items representing groups that the vertex can be added to.
	 * @param {Event} e Context menu event.
	 */
	_onNodeContextMenu(e) {
		e.preventDefault();

		let excludedNodeList = app.sidebarComponent.excludedNodeListComponent.nodeList;
		let includedGroupList = app.viewportComponent.groupList;

		let nodeList = [].concat(excludedNodeList, includedGroupList);
		if (nodeList.length === 0) return;

		app.viewportComponent.contextMenuComponent.vertex = this;
		app.viewportComponent.contextMenuComponent.position = new Coordinates(e.clientX, e.layerY);

		// fill list with items
		nodeList.forEach(node => {
			app.viewportComponent.contextMenuComponent.addNode(node);
		});

		app.viewportComponent.contextMenuComponent.open();
	}
}
