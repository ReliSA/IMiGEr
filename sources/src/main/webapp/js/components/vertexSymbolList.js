/**
 * Class representing list of symbols displayed next to a vertex to marks its relation to other an other, excluded vertices.
 * @see Vertex
 * @constructor
 */
function VertexSymbolList() {
	var rootElement;

	var width = 20;

	/**
	 * Adds a new symbol to the list.
	 * @param {array} symbol Symbol to be added to the list.
	 */
	this.appendChild = function(symbol) {
		var symbolGroup = DOM.createSvgElement('g', {
			'class': `neighbour-node-symbol symbol-${symbol[0]}`,
		});
		rootElement.appendChild(symbolGroup);

		symbolGroup.appendChild(DOM.createSvgElement('rect', {
			'x': 0,
			'y': 0,
			'width': width,
			'height': 20,
			'fill': symbol[1],
		}));

		var symbolText = DOM.createSvgElement('text', {
			'x': 6,
			'y': 15,
		});
		symbolText.appendChild(document.createTextNode(symbol[0]));
		symbolGroup.appendChild(symbolText);

		reorderSymbols();
	};

	/**
	 * Removes a symbol from the list.
	 * @param {array} symbol Symbol to be removed from the list.
	 */
	this.removeChild = function(symbol) {
		var symbolGroup = rootElement.querySelector(`.symbol-${symbol[0]}`)

		symbolGroup.remove();

		reorderSymbols();
	};

	/**
	 * Creates a new DOM element representing the list of symbols in memory.
	 * @param {Element} symbol SVG DOM element.
	 */
	this.render = function(symbol) {
		rootElement = DOM.createSvgElement('g', {
			'transform': 'translate(0, 30)',
		});

		return rootElement;
	};

	/**
	 * Changes the order of symbols displayed in the list. It is used to refresh their position after one is added or removed.
	 */
	function reorderSymbols() {
		for (var i = 0; i < rootElement.children.length; i++) {
			var symbolGroup = rootElement.children[i];

			symbolGroup.setAttribute('transform', `translate(${i * width + 1}, 1)`);
		}
	}
}
