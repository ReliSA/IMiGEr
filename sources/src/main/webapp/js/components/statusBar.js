/**
 * Class representing the sidebar status bar. It displays number of components loaded in the diagram.
 * @constructor
 */
function StatusBar() {
	var rootElement;
	var componentCounterElement;

	/**
	 * Sets a new count of components loaded in the diagram.
	 * @param {integer} componentCount New count of components.
	 */
	this.setComponentCount = function(componentCount) {
		componentCounterElement.innerHTML = '';
		componentCounterElement.appendChild(app.utils.createTextElement('loaded components: ' + componentCount));
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

		return rootElement;
	};

	/**
	 * Resets the information displayed in the status bar.
	 */
	this.reset = function() {
		componentCounterElement.innerHTML = '';
	};
}