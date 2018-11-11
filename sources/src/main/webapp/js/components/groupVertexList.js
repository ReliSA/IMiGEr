/**
 * Class representing a list of vertices added to a group.
 * @see Group
 */
class GroupVertexList {
	/**
	 * @constructor
	 * @param {Group} group Group this vertex list is bound to.
	 */
	constructor(group) {
		this._group = group;
		this._vertexList = [];

		this._lineHeight = 18;
	}

	/**
	 * Adds a new vertex to the list. Binds user interactions to local handler functions.
	 * @public
	 * @param {vertex} vertex Vertex to be added to this list.
	 */
	add(vertex) {
		this._vertexList.push(vertex);

		if (this.isRendered) {
			this._rootElement.appendChild(this._renderVertex(vertex));
		}
	}

	/**
	 * Removes a vertex from the list.
	 * @public
	 * @param {Vertex} vertex Vertex to be removed from this list.
	 */
	remove(vertex) {
		this._vertexList.splice(this._vertexList.indexOf(vertex), 1);

		if (this.isRendered) {
			this._rootElement.childNodes.forEach(child => {
				if (child.getAttribute('data-id') === vertex.id) {
					child.remove();
				}
			});
		}
	}

	/**
	 * @returns {array<Vertex>} List of vertices added to the related group.
	 */
	get data() {
		return this._vertexList;
	}

	/**
	 * Creates a new DOM element representing the list in memory.
	 * @public
	 * @returns {Element} HTML or SVG DOM element depending on whether the group is excluded.
	 */
	render() {
		this._rootElement = this._renderRoot();

		this._vertexList.forEach(vertex => {
			this._rootElement.appendChild(this._renderVertex(vertex));
		});

		return this._rootElement;
	}

	/**
	 * @returns {boolean} true if this component has been already rendered, otherwise false
	 */
	get isRendered() {
		return Utils.isDefined(this._rootElement);
	}

	_renderRoot() {
		if (this._group.isExcluded) {
			return DOM.h('ul', {
				class: 'group-vertex-list',
			});

		} else {
			return DOM.s('g', {
				transform: 'translate(70, 30)',
				class: 'group-vertex-list',
			});
		}
	}

	_renderVertex(vertex) {
		if (this._group.isExcluded) {
			return DOM.h('li', {
				'data-id': vertex.id,
				innerText: vertex.name,
				onClick: this._group.onVertexClick.bind(this._group),
			});

		} else {
			return DOM.s('text', {
				y: this._rootElement.childNodes.lenght * this._lineHeight,
				'data-id': vertex.id,
				onClick: this._group.onVertexClick.bind(this._group),
			}, [
				DOM.t(vertex.name),
			]);
		}
	}
}
