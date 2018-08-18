/**
 * Class representing the sidebar status bar. It displays number of components loaded in the diagram and the current graph version.
 * @constructor
 */
function StatusBar() {
	var rootElement;
	var componentCounterElement;
	var graphVersionElement;

	/**
	 * Sets a new count of components loaded in the diagram.
	 * @param {integer} componentCount New count of components.
	 */
	this.setComponentCount = function(componentCount) {
		componentCounterElement.innerHTML = '';
		componentCounterElement.appendChild(app.utils.createTextElement('loaded components: ' + componentCount));
	};

	/**
	 * Sets a new graph version.
	 * @param {string|integer} graphVersion New graph version.
	 */
	this.setGraphVersion = function(graphVersion) {
		graphVersionElement.innerHTML = '';
		graphVersionElement.appendChild(app.utils.createTextElement('graph version: ' + graphVersion));
	};

	/**
	 * Creates a new DOM element representing the status bar in memory.
	 * @returns {Element} HTML DOM element.
	 */
	this.render = function() {
		rootElement = app.utils.createHtmlElement('nav', {
			'class': 'status-bar',
		});

		componentCounterElement = app.utils.createHtmlElement('span', {
			'class': 'component-counter',
		});
		rootElement.appendChild(componentCounterElement);

		graphVersionElement = app.utils.createHtmlElement('span', {
			'class': 'graph-version',
		});
		rootElement.appendChild(graphVersionElement);

		return rootElement;
	};

	/**
	 * Resets the information displayed in the status bar.
	 */
	this.reset = function() {
		componentCounterElement.innerHTML = '';
		graphVersionElement.innerHTML = '';
	};
}