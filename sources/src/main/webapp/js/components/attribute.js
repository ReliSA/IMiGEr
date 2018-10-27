/**
 * Class representing an attribute of vertex/edge. Output is formatted based on attribute name and datatype of its value.
 */
class Attribute {
	/**
	 * @constructor
	 * @param {array} props Details of the attribute.
	 */
	constructor(props) {
		let attributeType = app.attributeTypeList.find(attributeType => attributeType.name === props[0]);

		this.name = props[0];
		this.value = props[1];
		this.dataType = attributeType.dataType;
	}

	/**
	 * @public
	 * @returns {HTMLElement} HTML DOM element.
	 */
	render() {
		this._rootElement = DOM.h('li', {}, [
			DOM.t(this.name + ': '),
			this._renderValue(),
		]);

		return this._rootElement;
	};

	/**
	 * @private
	 */
	_renderValue() {
		switch (this.name) {
			case 'URL':
				return DOM.h('a', {
					href: this.value,
					target: '_blank',
					innerText: this.value,
				});
			case 'Size':
				return DOM.t(this._formatValue() + ' B');
			case 'Estimate':
			case 'Spent':
				return DOM.t(this._formatValue() + ' h');
			case 'Progress':
				return DOM.t(this._formatValue() + '%');
			default:
				return DOM.t(this._formatValue());
		}
	}

	/**
	 * @private
	 */
	_formatValue() {
		switch (this.dataType) {
			case 'DATE':
				var date = new Date(parseInt(this.value));
				return date.toLocaleString();
			default:
			case 'STRING':
				if (Array.isArray(this.value)) {
					return this.value.filter(value => value !== '').join(', ');
				} else {
					return this.value;
				}
		}
	}
}
