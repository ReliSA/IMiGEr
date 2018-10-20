/**
 * Class containing Document Object Model utility functions.
 * @constructor
 */
function DOM() {
	var htmlTags = JSON.parse(document.getElementById('htmlTags').textContent);
	var svgTags = JSON.parse(document.getElementById('svgTags').textContent);

	/**
	 * Creates a new HTML DOM element from HTML string. Since only the first HTML element in the set is returned, the input 
	 * string should contain a wrapping element that would hold all inner elements.
	 * 
	 * @param {string} html HTML string.
	 * @returns {Element} HTML element.
	 */
	this.htmlStringToElement = function(html) {
		var template = document.createElement('template');
		template.innerHTML = html;

		return template.content.firstChild;
	};

	/**
	 * Creates a new HTML DOM element. If the tagName passed as a parameter is not a valid HTML tag, exception is thrown.
	 *
	 * @param {string} tagName Type of the newly created element (div, span, ...).
	 * @param {object} attributes Attributes of the element.
	 * @returns {Element} HTML DOM element.
	 * @throws {InvalidArgumentError} Thrown when tagName is not a valid HTML tag.
	 */
	this.createHtmlElement = function(tagName, attributes) {
		if (htmlTags.indexOf(tagName) === -1) {
			throw new InvalidArgumentError(tagName + 'is not a valid HTML element');
		}

		var element = document.createElement(tagName);
		for (let key in attributes) {
			element.setAttribute(key, attributes[key]);
		}

		return element;
	};
	
	/**
	 * Creates a new SVG DOM element. If the tagName passed as a parameter is not a valid SVG tag, exception is thrown.
	 *
	 * @param {string} tagName Type of the element (circle, rect, ...).
	 * @param {object} attributes Attributes of the element.
	 * @returns {Element} SVG DOM element.
	 * @throws {InvalidArgumentError} Thrown when tagName is not a valid SVG tag.
	 */
	this.createSvgElement = function(tagName, attributes) {
		if (svgTags.indexOf(tagName) === -1) {
			throw new InvalidArgumentError(tagName + 'is not a valid SVG element');
		}

		var element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
		for (let key in attributes) {
			element.setAttribute(key, attributes[key]);
		}

		return element;
	};

	/**
	 * Creates a new DOM node containing the text.
	 * 
	 * @param {string} text Text to create the element for.
	 */
	this.createTextElement = function(text) {
		return document.createTextNode(text);
	};
}
