/**
 * Class representing list of related archetypes displayed next to a node to mark its relation to another, excluded node.
 * @see Node
 */
class NodeRelatedArchetypeList {
	/**
	 * @constructor
	 * @param {Node} node Node this archetype list is bound to.
	 */
	constructor(node) {
		this._node = node;
		this._map = new Map;

		this._iconSize = 20;
	}

	get data() {
		return this._map;
	}

	get size() {
		return new Dimensions(
			this._node.isExcluded === true ? this._iconSize : (this._map.size * this._iconSize),
			this._node.isExcluded === true ? (this._map.size * this._iconSize) : this._iconSize,
		);
	}

	add(key, value = 1) {
		let currentValue;
		if (this._map.has(key) === true) {
			currentValue = this._map.get(key);
		} else {
			currentValue = 0;
		}

		this._map.set(key, currentValue + value);

		if (this.isRendered) {
			this._rerender();
		}
	}

	remove(key, value = 1) {
		let currentValue;
		if (this._map.has(key) === true) {
			currentValue = this._map.get(key);
		} else {
			currentValue = 0;
		}

		this._map.set(key, currentValue - value);

		if (this.isRendered) {
			this._rerender();
		}
	}

	/**
	 * Creates a new DOM element representing the list in memory.
	 * @public
	 * @returns {SVGElement} SVG DOM element
	 */
	render() {
		this._rootElement = this._renderRoot();

		this._map.forEach((value, key) => {
			this._rootElement.appendChild(this._renderArchetypeIcon(key, value));
		});

		return this._rootElement;
	}

	/**
	 * @returns {boolean} true if this component has been already rendered, otherwise false
	 */
	get isRendered() {
		return Utils.isDefined(this._rootElement);
	}

	_rerender() {
		this._rootElement.innerHTML = '';

		this._map.forEach((value, key) => {
			this._rootElement.appendChild(this._renderArchetypeIcon(key, value));
		});
		
		if (this._node.isExcluded) {
			this._rootElement.setAttribute('height', this.size.height);
		}
	}

	_renderRoot() {
		if (this._node.isExcluded) {
			return DOM.s('svg', {
				height: this.size.height,
				width: 46,
			});

		} else {
			return DOM.s('g', {
				transform: `translate(${this._node.size.width}, 0)`,
			});
		}
	}

	_renderArchetypeIcon(archetypeIndex, counter) {
		if (this._node.isExcluded) {
			return DOM.s('g', {
				class: 'related-archetype',
				'data-index': archetypeIndex,
				transform: `translate(10, ${15 + this._rootElement.childNodes.length * this._iconSize})`,
			}, [
				// counter
				DOM.s('text', {}, [
					DOM.t(counter),
				]),
				// icon
				DOM.s('use', {
					href: '#vertexArchetypeIcon-' + app.archetype.vertex[archetypeIndex].name,
					class: 'archetype-icon',
					transform: `translate(15, -10)`,
					onClick: this._node.onRelatedArchetypeIconClick.bind(this._node, archetypeIndex), // TODO: when icon == null can not click on item
				}),
				// line
				DOM.s('line', {
					x1: 30,
					y1: -5,
					x2: 36,
					y2: -5,
				}),
			]);

		} else {
			// icon
			return DOM.s('use', {
				href: '#vertexArchetypeIcon-' + app.archetype.vertex[archetypeIndex].name,
				class: 'archetype-icon',
				'data-index': archetypeIndex,
				transform: `translate(${this._rootElement.childNodes.length * this._iconSize}, 8)`,
				onClick: this._node.onRelatedArchetypeIconClick.bind(this._node, archetypeIndex), // TODO: when icon == null can not click on item
			});
		}
	}
}
