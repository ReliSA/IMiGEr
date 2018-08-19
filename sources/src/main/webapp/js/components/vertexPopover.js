/**
 * Class representing a popover revealed on vertex interface symbol click to display its attributes.
 * @see Vertex
 * @constructor
 */
function VertexPopover() {
	var rootElement;
	var popoverTitle;
	var detailsListElement;

	/**
	 * Sets the contents of the popover.
	 * @param {string} name Title of the popover.
	 * @param {array} attributes List of attributes.
	 */
	this.setContent = function(name, attributes) {
		popoverTitle.innerText = name;

		if (attributes.length > 0) {
			attributes.forEach(function(attributes) {
				var listItem = app.utils.createHtmlElement('li', {});
				listItem.appendChild(document.createTextNode(attributes));

				detailsListElement.appendChild(listItem);
			});
		}
	};

	/**
	 * Moves the popover to the coordinates.
	 * @param {Coordinates} coords Coordinates to display the popover at.
	 */
	this.setPosition = function(coords) {
		rootElement.style.top = coords.y + 'px';
		rootElement.style.left = coords.x + 'px';
	};

	/**
	 * Opens the popover.
	 */
	this.open = function() {
		rootElement.classList.remove('hidden');
	};

	/**
	 * Closes the popover.
	 */
	this.close = function() {
		rootElement.classList.add('hidden');

		detailsListElement.innerHTML = '';
	};

	/**
	 * Creates a new DOM element representing the popover in memory. Binds user interactions to local handler functions.
	 * @returns {Element} HTML DOM element.
	 */
	this.render = function() {
		rootElement = app.utils.createHtmlElement('div', {
			'class': 'popover vertex-popover hidden',
		});
		rootElement.addEventListener('wheel', stopPropagation.bind(this));
		rootElement.addEventListener('mousedown', stopPropagation.bind(this));
		rootElement.addEventListener('mouseleave', this.close.bind(this));

		popoverTitle = app.utils.createHtmlElement('span', {
			'class': 'popover-title',
		});
		rootElement.appendChild(popoverTitle);

		var popoverContent = app.utils.createHtmlElement('div', {
			'class': 'popover-content',
		});
		rootElement.appendChild(popoverContent);

		detailsListElement = app.utils.createHtmlElement('ul', {});
		popoverContent.appendChild(detailsListElement);

		return rootElement;
	};

	/**
	 * Stops propagation of the event which triggered this function to its parental elements.
	 * @param {Event} e The event.
	 */
	function stopPropagation(e) {
		e.stopPropagation();
	}
}