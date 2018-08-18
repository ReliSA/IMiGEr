/**
 * Light version of the vertex to be used inside of a change as a placeholder until full change details are loaded.
 * @see Vertex
 * @see Change
 * @constructor
 * @param {object} props Properties of the vertex.
 */
function VertexLight(props) {
	/** @prop {string} id Identifier of the component in CRCE. */
	this.id = props.uuid;
	/** @prop {string} name Name of the component. */
	this.name = props['external-id'] + ' v' + props.version;

	/**
	 * Removes the DOM element representing the vertex from document.
	 */
	this.exclude = function() {
		this.remove();
	};

	/**
	 * Creates a new DOM element representing the vertex in memory.
	 * @returns {Element} HTML DOM element.
	 */
	this.render = function() {
		rootElement = app.utils.createHtmlElement('li', {
			'class': 'node vertex',
			'data-id': this.id,
		});

		// name
		var nameText = app.utils.createHtmlElement('div', {
			'class': 'vertex-name',
			'title': this.name,
		});
		nameText.appendChild(document.createTextNode(this.name));
		rootElement.appendChild(nameText);

		return rootElement;
	};
	
	/**
	 * Removes the DOM element representing the vertex from document.
	 */
	this.remove = function() {
		rootElement.remove();
	};
}