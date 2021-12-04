/**
 * Class representing a group of vertices in graph. A group is composed from one or more vertices.
 */
class Group extends Node {
	/**
	 * @constructor
	 * @param {object} props Properties of the group.
	 */
	constructor(props) {
		super(props);

		// components
		this._vertexListComponent = new GroupVertexList(this);

		this._size = new Dimensions(70, 70);
	}

	/**
	 * @returns {Group} newly created group
	 */
	static create() {
		return new Group({
			id: app.groupList.length + 1,
			name: 'Group ' + (app.groupList.length + 1),
		});
	}

	/**
	 * Adds a new vertex to the group. The vertex is set as excluded and its DOM element is removed from document. Its edges are moved so that they end at the group.
	 * @param {Vertex} vertex Vertex to be added to the group.
	 */
	addVertex(vertex) {
		if (!(vertex instanceof Vertex)) {
			throw new TypeError(vertex.toString() + ' is not an instance of Vertex');
		}

		if (this.position === null && this.vertexList.length === 0) {
			this.position = vertex.position;
		}

		vertex.group = this;
		vertex.isExcluded = this.isExcluded;
		vertex.remove(this.isExcluded);	// edges of the vertex should be removed from DOM only if group is excluded

		let inEdgeList = vertex.inEdgeList;
		inEdgeList.forEach(edge => {
			if (this.isExcluded) {
				this._proxy.addInEdge(edge);
			} else {
				edge.end = this.center;
			}
		});

		let outEdgeList = vertex.outEdgeList;
		outEdgeList.forEach(edge => {
			if (this.isExcluded) {
				this._proxy.addOutEdge(edge);
			} else {
				edge.start = this.center;
			}
		});

		let vertexRelatedArchetypeMap = vertex.relatedArchetypeMap;
		vertexRelatedArchetypeMap.forEach((value, key) => {
			this._relatedArchetypeListComponent.add(key, value);
		});

		app.viewportComponent.removeNode(vertex);
		this._vertexListComponent.add(vertex);
	}

	/**
	 * Removes a vertex from the group. The vertex is returned back to the viewport and its edges are moved to it.
	 * @param {Vertex} vertex Vertex to be removed from the group.
	 */
	removeVertex(vertex) {
		if (!(vertex instanceof Vertex)) {
			throw new TypeError(vertex.toString() + ' is not an instance of Vertex');
		}

		vertex.group = null;

		let inEdgeList = vertex.inEdgeList;
		inEdgeList.forEach(edge => {
			edge.end = vertex.center;
		});

		let outEdgeList = vertex.outEdgeList;
		outEdgeList.forEach(edge => {
			edge.start = vertex.center;
		});

		let vertexRelatedArchetypeMap = vertex.relatedArchetypeMap;
		vertexRelatedArchetypeMap.forEach((value, key) => {
			this._relatedArchetypeListComponent.remove(key, value);
		});

		app.viewportComponent.addNode(vertex);
		this._vertexListComponent.remove(vertex);
	}

	/**
	 * @returns {array<Vertex>} List of vertices added to this group.
	 */
	get vertexList() {
		return this._vertexListComponent.data;
	}

	/**
	 * @returns {array<Edge>} List of edges going to vertices added to the group.
	 */
	get inEdgeList() {
		let edgeList = [];

		this.vertexList.forEach(vertex => {
			let inEdgeList = vertex.inEdgeList;
			inEdgeList.filter(edge => {
				return edgeList.indexOf(edge) === -1;
			}).forEach(edge => {
				edgeList.push(edge);
			});
		});

		return edgeList;
	}

	/**
	 * @returns {array<Edge>} List of edges going from vertices added to the group.
	 */
	get outEdgeList() {
		let edgeList = [];

		this.vertexList.forEach(vertex => {
			let outEdgeList = vertex.outEdgeList;
			outEdgeList.filter(edge => {
				return edgeList.indexOf(edge) === -1;
			}).forEach(edge => {
				edgeList.push(edge);
			});
		});

		return edgeList;
	}

	/**
	 * For some reason must be here to work.
	 * @inheritdoc
	 */
	get isExcluded() {
		return super.isExcluded;
	}

	/**
	 * Toggles excluded state of the group. All vertices currently added to the group are excluded as well.
	 * @param {boolean} newValue True to set the group as excluded, otherwise false.
	 */
	set isExcluded(newValue) {
		super.isExcluded = newValue;

		this.vertexList.forEach(vertex => {
			vertex.isExcluded = newValue;
		});
	}

	/**
	 * Includes the group in the viewport. Afterwards, edges related to the group are moved to the current position of the group.
	 */
	include() {
		super.include();

        this.vertexList.forEach(vertex => {
            var notifyTimeline = new CustomEvent('imigerInclude', { detail: { entityID: vertex.id } });
            document.dispatchEvent(notifyTimeline);
        });

		// set edges' ends
		let inEdgeList = this.inEdgeList;
		inEdgeList.forEach(edge => {
			edge.end = this.center;
		});

		let outEdgeList = this.outEdgeList;
		outEdgeList.forEach(edge => {
			edge.start = this.center;
		});
	}

	/**
	 * Exports the group to a new, plain JS object.
	 * @returns {Object} exported group
	 */
	export() {
		return {
			id: this.id,
			name: this.name,
			verticesId: this.vertexList.map(vertex => vertex.id),
			verticesEdgeFromId: [],	// TODO: what to put in here? ids of vertices which outgoing edges are visible in graph
			verticesEdgeToId: [],	// TODO: what to put in here? ids of vertices which incoming edges are visible in graph
			position: this.position,
		};
	}

	/**
	 * @returns {SVGElement} SVG DOM element.
	 */
	_renderIncluded() {
		// root
		this._rootElement = DOM.s('g', {
			class: 'node group',
			transform: `translate(${this.position.x}, ${this.position.y})`,
			'data-id': this.id,
			onClick: this._onNodeClick.bind(this),
			onMouseDown: this._onNodeMouseDown.bind(this),
		}, [
			DOM.s('rect', {
				width: this.size.width,
				height: this.size.height,
				x: 1,
				y: 1,
				fill: this.symbol.color,
				stroke: 'black',
				'stroke-width': 1,
			}),
			// name
			DOM.s('foreignObject', {
				x: 4,
				y: 4,
				width: 46,
				height: 16,
				onClick: this._onNameClick.bind(this),
			}, [
				DOM.h('span', {
					class: 'group-name',
					innerText: this.name,
				}),
			]),
			// symbol
			DOM.s('text', {
				class: 'group-symbol',
				x: 10,
				y: 60,
			}, [
				DOM.t(this.symbol.character),
			]),
			// dissolve button
			DOM.s('g', {
				class: 'button dissolve-button',
				onClick: this._onDissolveClick.bind(this),
			}, [
				DOM.s('rect', {
					rx: 4,
					ry: 4,
					x: 54,
					y: 4,
					height: 14,
					width: 14,
				}),
				DOM.s('line', {
					x1: 57,
					y1: 7,
					x2: 65,
					y2: 15,
				}),
				DOM.s('line', {
					x1: 65,
					y1: 7,
					x2: 57,
					y2: 15,
				}),
			]),
			// symbol list
			this._symbolListComponent.render(),
		]);

		return this._rootElement;
	}

	/**
	 * @returns {HTMLElement} HTML DOM element.
	 */
	_renderExcluded() {
		// root
		this._rootElement = DOM.h('li', {
			class: 'node group',
			'data-id': this.id,
		}, [
			// related archetypes
			this._relatedArchetypeListComponent.render(),
			// symbol
			DOM.h('span', {
				class: 'group-symbol',
				style: 'background-color: ' + this.symbol.color + ';',
				x: 10,
				y: 55,
				innerText: this.symbol.character,
				onClick: this._onNodeClick.bind(this),
			}),
			// name
			DOM.h('span', {
				class: 'group-name',
				innerText: this.name,
				onClick: this._onNameClick.bind(this),
			}),
			// vertex list
			this._vertexListComponent.render(),
			// buttons
			DOM.h('div', {
				class: 'button-group',
			}, [
				// show symbol button
				DOM.h('button', {
					class: 'show-symbol-button button',
					style: 'background-color: ' + this.symbol.color + ';',
					title: 'Show symbol next to all neighbouring components',
					innerText: this.symbol.character,
					onClick: this._onShowNeighbourIconsClick.bind(this),
				}),
				// include button
				DOM.h('button', {
					class: 'include-button button',
					title: 'Display group in viewport',
					onClick: this.include.bind(this),
				}, [
					DOM.h('img', {
						src: 'images/icomoon/cross.svg',
						alt: 'Icon of "display group in viewport" action',
					}),
				]),
			]),
		]);

		// set proxy
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
	 * Group name click interaction. Reveals a prompt for new group name.
	 * @param {Event} e Click event.
	 */
	_onNameClick(e) {
		e.stopPropagation();

		let newValue = prompt('Enter new group name:', this.name);
		if (newValue !== null) {
			this.name = newValue;

			this._rootElement.querySelector('.group-name').innerText = this.name;
		}
	}

	/**
	 * Dissolves the group so that its vertices are displayed separately again. The group itself is destroyed.
	 * @param {Event} e Click event.
	 */
	_onDissolveClick(e) {
		e.stopPropagation();

		this.remove(false);

		let vertexListCopy = this.vertexList.slice(0);
		vertexListCopy.forEach(vertex => {
			this.removeVertex(vertex);
		});

		app.viewportComponent.removeNode(this);

		app.groupList.splice(app.groupList.indexOf(this), 1);
	}

	/**
	 * Vertex list item click interaction.
	 * @param {Event} e Click event.
	 */
	onVertexClick(e) {
		e.stopPropagation();

		console.log('TODO: highlight vertex on click');
	}
}
