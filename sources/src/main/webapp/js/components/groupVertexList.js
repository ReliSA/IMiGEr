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

		this._lineHeight = 18;
		this._listItemCounter = 0;
	}

	/**
	 * Creates a new DOM element representing the list in memory.
	 * @public
	 * @returns {Element} HTML or SVG DOM element depending on whether the group is excluded.
	 */
	render() {
		if (this._group.isExcluded) {
			this._rootElement = DOM.h('ul');
		} else {
			this._rootElement = DOM.s('g', {
				transform: 'translate(70, 30)',
			});
		}

		let vertexList = this._group.vertexList;
		vertexList.forEach(vertex => {
			this.appendChild(vertex);
		});

		this._rootElement.setAttribute('class', 'group-vertex-list');

		return this._rootElement;
	}

	/**
	 * Adds a new vertex to the list. Binds user interactions to local handler functions.
	 * @public
	 * @param {vertex} vertex Vertex to be added to this list.
	 */
	appendChild(vertex) {
		let listItemElement;
		if (this._group.isExcluded) {
			listItemElement = DOM.h('li');
		} else {
			listItemElement = DOM.s('text', {
				y: this._listItemCounter * this._lineHeight,
			});
		}

		listItemElement.setAttribute('data-id', vertex.id);
		listItemElement.appendChild(document.createTextNode(vertex.name));
		listItemElement.addEventListener('click', this._listItemClick.bind(vertex));

		this._rootElement.appendChild(listItemElement);

		this._listItemCounter++;
	}

	/**
	 * Removes a vertex from the list.
	 * @public
	 * @param {Vertex} vertex Vertex to be removed from this list.
	 */
	removeChild(vertex) {
		let listItemElement = this._rootElement.querySelector('[data-id="' + vertex.id + '"]');

		listItemElement.remove();
	}

	/**
	 * Vertex list item click interaction.
	 * @private
	 * @param {Event} e Click event.
	 */
	_listItemClick(e) {
		e.stopPropagation();

		console.log('TODO: highlight vertex on click');
	}
}
