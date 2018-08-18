/**
 * Class representing a list of vertices in a change. It can be either the list of components to be changed or the list of proposals.
 * @see Change
 * @constructor
 * @param {Change} parentalChange Change this vertex list is bound to.
 */
function ChangeVertexList(parentalChange) {
	var rootElement;

	/**
	 * Adds a new vertex to the list.
	 * @param {vertex} vertex Vertex to be added to this list.
	 */
	this.appendChild = function(vertex) {
		if (parentalChange.isPostponed()) {
			var listItemElement = app.utils.createHtmlElement('li', {
				'class': 'node vertex',
				'data-id': vertex.id,
			});
			listItemElement.appendChild(document.createTextNode(vertex.name));

		} else {
			listItemElement = vertex.render();
		}

		rootElement.appendChild(listItemElement);
	};

	/**
	 * Removes a vertex from the list.
	 * @param {vertex} vertex Vertex to be removed from this list.
	 */
	this.removeChild = function(vertex) {
		var listItemElement = rootElement.querySelector('[data-id="' + vertex.id + '"]');

		listItemElement.remove();
	};

	/**
	 * Creates a new DOM element representing the list in memory.
	 * @returns {Element} HTML DOM element.
	 */
	this.render = function() {
		rootElement = app.utils.createHtmlElement('ul', {});
		rootElement.setAttribute('class', 'node-list');

		return rootElement;
	};
}
