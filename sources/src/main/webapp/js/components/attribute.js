/**
 * Class representing an attribute of vertex/edge. Output is formatted based on attribute name and datatype of its value.
 * @constructor
 * @param {array} props Details of the attribute.
 */
function Attribute(props) {
	var attributeType = app.attributeTypeList.find(function(attributeType) {
		return attributeType.name === props[0];
	});

	this.name = props[0];
	this.value = props[1];
	this.dataType = attributeType.dataType;

	var rootElement;

	this.render = function() {
		rootElement = app.utils.createHtmlElement('li', {});

		rootElement.appendChild(app.dom.createTextElement(this.name + ': '));
		rootElement.appendChild(renderValue.call(this));

		return rootElement;
	};

	function renderValue() {
		switch (this.name) {
			case 'URL':
				return app.dom.htmlStringToElement(`<a href="${this.value}" target="_blank">${this.value}</a>`);
			case 'Size':
				return app.dom.createTextElement(formatValue.call(this) + ' B');
			case 'Estimate':
			case 'Spent':
				return app.dom.createTextElement(formatValue.call(this) + ' h');
			case 'Progress':
				return app.dom.createTextElement(formatValue.call(this) + '%');
			default:
				return app.dom.createTextElement(formatValue.call(this));
		}
	}

	function formatValue() {
		switch (this.dataType) {
			case 'DATE':
				var date = new Date(parseInt(this.value));
				return date.toLocaleString();
			default:
			case 'STRING':
				if (Array.isArray(this.value)) {
					return this.value.filter(function(value) {
						return value !== '';
					}).join(', ');
				} else {
					return this.value;
				}
			}
	}
}
