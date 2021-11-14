/**
 * Class representing list of symbols displayed next to a node to mark its relation to another, excluded node.
 * @see Node
 */
class NodeSymbolList {
	/**
	 * @constructor
	 * @param {Node} node Node this symbol list is bound to.
	 */
	constructor(node) {
		this._node = node;
		this._symbolList = new Set;

		this._symbolSize = 20;
	}

	/**
	 * Adds a new symbol to the list.
	 * @public
	 * @param {array} symbol Symbol to be added to the list.
	 */
	add(symbol) {
		this._symbolList.add(symbol);

		this._rerender();
	}

	/**
	 * Removes a symbol from the list.
	 * @public
	 * @param {array} symbol Symbol to be removed from the list.
	 */
	remove(symbol) {
		this._symbolList.delete(symbol);

		this._rerender();
	}

	/**
	 * Creates a new DOM element representing the list of symbols in memory.
	 * @public
	 * @returns {SVGElement} SVG DOM element.
	 */
	render() {
		this._rootElement = DOM.s('g', {
			transform: `translate(0, ${this._node.size.height})`,
		});

		return this._rootElement;
	}

	_rerender() {
		this._rootElement.innerHTML = '';

		this._symbolList.forEach(symbol => {
			this._rootElement.appendChild(this._renderNodeSymbol(symbol));
		});
	}

	_renderNodeSymbol(symbol) {
		return DOM.s('g', {
			class: 'neighbour-node-symbol ' + symbol.cssClass,
			transform: `translate(${1 + this._rootElement.childNodes.length * this._symbolSize}, 1)`,
		}, [
			DOM.s('rect', {
				x: 0,
				y: 0,
				width: this._symbolSize,
				height: this._symbolSize,
				fill: symbol.color,
			}),
			DOM.s('text', {
				x: 6,
				y: 15,
			}, [
				DOM.t(symbol.character),
			]),
		]);
	}
}
