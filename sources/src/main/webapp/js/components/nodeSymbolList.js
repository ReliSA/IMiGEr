/**
 * Class representing list of symbols displayed next to a node to mark its relation to another, excluded node.
 * @see Node
 */
class NodeSymbolList {
	/**
	 * @constructor
	 */
	constructor() {
		this._width = 20;
		this._height = 20;
	}

	/**
	 * Creates a new DOM element representing the list of symbols in memory.
	 * @public
	 * @returns {SVGElement} SVG DOM element.
	 */
	render() {
		this._rootElement = DOM.s('g', {
			transform: 'translate(0, 30)',
		});

		return this._rootElement;
	}

	/**
	 * Adds a new symbol to the list.
	 * @public
	 * @param {array} symbol Symbol to be added to the list.
	 */
	appendChild(symbol) {
		this._rootElement.appendChild(DOM.s('g', {
			class: 'neighbour-node-symbol ' + symbol[2],
		}, [
			DOM.s('rect', {
				x: 0,
				y: 0,
				width: this._width,
				height: this._height,
				fill: symbol[1],
			}),
			DOM.s('text', {
				x: 6,
				y: 15,
			}, [
				DOM.t(symbol[0]),
			]),
		]));

		this._reorderSymbols();
	}

	/**
	 * Removes a symbol from the list.
	 * @public
	 * @param {array} symbol Symbol to be removed from the list.
	 */
	removeChild(symbol) {
		let symbolGroup = this._rootElement.querySelector('.' + symbol[2]);

		symbolGroup.remove();

		this._reorderSymbols();
	}

	/**
	 * Changes the order of symbols displayed in the list. It is used to refresh their position after one is added or removed.
	 * @private
	 */
	_reorderSymbols() {
		for (var i = 0; i < this._rootElement.children.length; i++) {
			let symbolGroup = this._rootElement.children[i];

			symbolGroup.setAttribute('transform', `translate(${i * this._width + 1}, 1)`);
		}
	}
}
