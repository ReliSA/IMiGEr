/**
 * Class representing list of related archetypes displayed next to a node to mark its relation to another, excluded node.
 * @see Node
 */
class NodeRelatedArchetypeList {
	/**
	 * @constructor
	 */
	constructor(node) {
		this._node = node;
		this._map = new Map;
		this._iconSize = 20;
	}

	get map() {
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
		
		this._renderIcons();
	}

	remove(key, value = 1) {
		let currentValue;
		if (this._map.has(key) === true) {
			currentValue = this._map.get(key);
		} else {
			currentValue = 0;
		}

		this._map.set(key, currentValue - value);

		this._renderIcons();
	}

	render() {
		if (this._node.isExcluded === true) {
			this._rootElement = DOM.s('g', {
				transform: 'translate(10, 15)',
			});
		} else {
			this._rootElement = DOM.s('g', {
				transform: `translate(${this._node.size.width}, 0)`,
			});
		}

		this._renderIcons();

		return this._rootElement;
	}
	
	_renderIcons() {
		if (Utils.isUndefined(this._rootElement)) return;
		
		this._rootElement.innerHTML = '';

		let iconOrder = 0;
		this._map.forEach((value, key) => {
			if (this._node.isExcluded === true) {
				this._rootElement.appendChild(DOM.s('g', {
					class: 'related-archetype',
					transform: `translate(0, ${iconOrder * this._iconSize})`,
				}, [
					// counter
					DOM.s('text', {}, [
						DOM.t(value),
					]),
					// icon
					DOM.s('use', {
						href: '#vertexArchetypeIcon-' + app.archetype.vertex[key].name,
						class: 'archetype-icon',
						transform: `translate(15, -10)`,
						onClick: this._node.onRelatedArchetypeIconClick.bind(this._node, key), // TODO: when icon == null can not click on item
					}),
					// line
					DOM.s('line', {
						x1: 30,
						y1: -5,
						x2: 36,
						y2: -5,
					}),
				]));
			} else {
				this._rootElement.appendChild(DOM.s('use', {
					href: '#vertexArchetypeIcon-' + app.archetype.vertex[key].name,
					class: 'archetype-icon',
					transform: `translate(${iconOrder * this._iconSize}, 8)`,
					onClick: this._node.onRelatedArchetypeIconClick.bind(this._node, key), // TODO: when icon == null can not click on item
				}));
			}

			iconOrder++;
		});
	}
}
