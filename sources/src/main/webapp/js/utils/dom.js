/**
 * Class containing Document Object Model utility functions.
 */
class DOM {
	/**
	 * Creates a new HTML DOM element from HTML string. Since only the first HTML element in the set is returned, the input 
	 * string should contain a wrapping element that would hold all inner elements.
	 * 
	 * @param {string} html HTML string.
	 * @returns {Element} HTML element.
	 */
	static htmlStringToElement(html) {
		const template = document.createElement('template');
		template.innerHTML = html;

		return template.content.firstChild;
	}

	/**
	 * Creates a new HTML DOM element. If the tagName passed as a parameter is not a valid HTML tag, exception is thrown.
	 *
	 * @param {string} tagName Type of the newly created element (div, span, ...).
	 * @param {object} attributes Attributes of the element.
	 * @returns {Element} HTML DOM element.
	 * @throws {InvalidArgumentError} Thrown when tagName is not a valid HTML tag.
	 */
	static createHtmlElement(tagName, attributes = {}) {
		if (DOM.validHTMLTags.indexOf(tagName) === -1) {
			throw new InvalidArgumentError(tagName + ' is not a valid HTML element');
		}

		const element = document.createElement(tagName);
		for (let key in attributes) {
			element.setAttribute(key, attributes[key]);
		}

		return element;
	}
	
	/**
	 * Creates a new SVG DOM element. If the tagName passed as a parameter is not a valid SVG tag, exception is thrown.
	 *
	 * @param {string} tagName Type of the element (circle, rect, ...).
	 * @param {object} attributes Attributes of the element.
	 * @returns {Element} SVG DOM element.
	 * @throws {InvalidArgumentError} Thrown when tagName is not a valid SVG tag.
	 */
	static createSvgElement(tagName, attributes = {}) {
		if (DOM.validSVGTags.indexOf(tagName) === -1) {
			throw new InvalidArgumentError(tagName + ' is not a valid SVG element');
		}

		const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
		for (let key in attributes) {
			element.setAttribute(key, attributes[key]);
		}

		return element;
	}

	/**
	 * Creates a new DOM node containing the text.
	 * 
	 * @param {string} text Text to create the element for.
	 */
	static createTextElement(text) {
		return document.createTextNode(text);
	}

	/**
	 * Creates a new HTML DOM element. If the tagName passed as a parameter is not a valid HTML tag, exception is thrown.
	 *
	 * @param {string} tagName Type of the newly created element (div, span, ...).
	 * @param {object} attributes Attributes of the element.
	 * @param {array<HTMLElement>} children Elements to be append to the newly created element.
	 * @param {object} options Options to be used while creating the element.
	 * @returns {HTMLElement} HTML DOM element.
	 * @throws {InvalidArgumentError} Thrown when tagName is not a valid HTML tag.
	 */
	static h(tagName, attributes = {}, children = [], options = null) {
		if (DOM.validHTMLTags.indexOf(tagName) === -1) {
			throw new InvalidArgumentError(tagName + ' is not a valid HTML element');
		}

		const element = document.createElement(tagName, options);

		for (let key in attributes) {
			let value = attributes[key];

			if (key.startsWith('on') && typeof value === 'function') {
				element.addEventListener(key.substring(2).toLowerCase(), value);
			} else if (key === 'innerText') {
				element.innerText = value;
			} else if (key === 'innerHTML') {
				element.innerHTML = value;
			} else {
				element.setAttribute(key, value);
			}
		}

		for (let child of children) {
			element.appendChild(child);
		}

		return element;
	}
	
	/**
	 * Creates a new SVG DOM element. If the tagName passed as a parameter is not a valid SVG tag, exception is thrown.
	 *
	 * @param {string} tagName Type of the element (circle, rect, ...).
	 * @param {object} attributes Attributes of the element.
	 * @param {array<SVGElement>} children Elements to be append to the newly created element.
	 * @param {object} options Options to be used while creating the element.
	 * @returns {SVGElement} SVG DOM element.
	 * @throws {InvalidArgumentError} Thrown when tagName is not a valid SVG tag.
	 */
	static s(tagName, attributes = {}, children = [], options = null) {
		if (DOM.validSVGTags.indexOf(tagName) === -1) {
			throw new InvalidArgumentError(tagName + ' is not a valid SVG element');
		}

		const element = document.createElementNS('http://www.w3.org/2000/svg', tagName, options);

		for (let key in attributes) {
			let value = attributes[key];

			if (key.startsWith('on') && typeof value === 'function') {
				element.addEventListener(key.substring(2).toLowerCase(), value);
			} else if (key === 'innerText') {
				element.innerText = value;
			} else if (key === 'innerHTML') {
				element.innerHTML = value;
			} else {
				element.setAttribute(key, value);
			}
		}

		for (let child of children) {
			element.appendChild(child);
		}

		return element;
	}

	/**
	 * Creates a new DOM node containing the text.
	 * 
	 * @param {string} text Text to create the element for.
	 */
	static t(text) {
		return document.createTextNode(text);
	}
}

DOM.validHTMLTags = JSON.parse(document.getElementById('htmlTags').textContent);
DOM.validSVGTags = JSON.parse(document.getElementById('svgTags').textContent);
