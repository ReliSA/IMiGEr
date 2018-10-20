/**
 * Class representing a list of vertices added to a group.
 * @see Group
 * @constructor
 * @param {Group} parentalGroup Group this vertex list is bound to.
 */
function GroupVertexList(parentalGroup) {
	const lineHeight = 18;

	var rootElement;
	var listItemCounter = 0;

	/**
	 * Adds a new vertex to the list. Binds user interactions to local handler functions.
	 * @param {vertex} vertex Vertex to be added to this list.
	 */
	this.appendChild = function(vertex) {
		var listItemElement;
		if (parentalGroup.isExcluded()) {
			listItemElement = DOM.createHtmlElement('li');
		} else {
			listItemElement = DOM.createSvgElement('text', {
				'y': listItemCounter * lineHeight,
			});
		}

		listItemElement.setAttribute('data-id', vertex.id);
		listItemElement.appendChild(document.createTextNode(vertex.name));
		listItemElement.addEventListener('click', listItemClick.bind(vertex));

		rootElement.appendChild(listItemElement);

		listItemCounter++;
	};

	/**
	 * Removes a vertex from the list.
	 * @param {Vertex} vertex Vertex to be removed from this list.
	 */
	this.removeChild = function(vertex) {
		var listItemElement = rootElement.querySelector('[data-id="' + vertex.id + '"]');

		listItemElement.remove();
	};

	/**
	 * Creates a new DOM element representing the list in memory.
	 * @returns {Element} HTML or SVG DOM element depending on whether the group is excluded.
	 */
	this.render = function() {
		if (parentalGroup.isExcluded()) {
			rootElement = DOM.createHtmlElement('ul');
		} else {
			rootElement = DOM.createSvgElement('g', {
				'transform': 'translate(70, 30)',
			});
		}

		rootElement.setAttribute('class', 'group-vertex-list');

		return rootElement;
	};

	/**
	 * Vertex list item click interaction.
	 * @param {Event} e Click event.
	 */
	function listItemClick(e) {
		e.stopPropagation();

		console.log('TODO: highlight vertex on click');
	}
}
