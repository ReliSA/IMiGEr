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
		componentCounterElement.appendChild(DOM.createTextElement('loaded components: ' + componentCount));
	};

	/**
	 * Creates a new DOM element representing the status bar in memory.
	 * @returns {Element} HTML DOM element.
	 */
	this.render = function() {
		rootElement = DOM.createHtmlElement('nav', {
			'class': 'status-bar',
		});

		componentCounterElement = DOM.createHtmlElement('span', {
			'class': 'component-counter',
		});
		rootElement.appendChild(componentCounterElement);

		minimapToggleElement = DOM.createHtmlElement('span', {
			'class': 'link',
		});
		minimapToggleElement.appendChild(DOM.createTextElement('toggle minimap'));
		minimapToggleElement.addEventListener('click', toggleMinimap.bind(this));
		rootElement.appendChild(minimapToggleElement);

		return rootElement;
	};

	/**
	 * Resets the information displayed in the status bar.
	 */
	this.reset = function() {
		componentCounterElement.innerHTML = '';
	};

	function toggleMinimap(e) {
		e.preventDefault();

		document.getElementById('minimapComponent').classList.toggle('hidden');
	}
}