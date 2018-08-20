/**
 * Class representing a popover revealed on edge click to display its compatibility information.
 * @see Edge
 * @constructor
 */
function EdgePopover() {
	var rootElement;
	var detailsListElement;

	/**
	 * Sets the contents of the popover.
	 * @param {array} subedgeInfoList List of various edge information.
	 */
	this.setContent = function(subedgeInfoList) {
		if (subedgeInfoList.length === 0) return;

		subedgeInfoList.filter(function(subedgeInfo) {
			return subedgeInfo.attributes.length > 0;
		}).forEach(function(subedgeInfo) {
			var listItem = app.dom.createHtmlElement('li', {});
			listItem.appendChild(app.dom.createTextElement(app.archetype.edge[subedgeInfo.archetype].name));

			var sublist = app.dom.createHtmlElement('ul', {});
			listItem.appendChild(sublist);

			detailsListElement.appendChild(listItem);

			subedgeInfo.attributes.forEach(function(attribute) {
				var listItem = app.dom.createHtmlElement('li', {});
				listItem.appendChild(app.dom.createTextElement(`${attribute[0]}: ${attribute[1]}`));

				sublist.appendChild(listItem);
			});
		});
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
			'class': 'popover edge-popover hidden',
		});
		rootElement.addEventListener('wheel', stopPropagation.bind(this));
		rootElement.addEventListener('mousedown', stopPropagation.bind(this));
		rootElement.addEventListener('mouseleave', this.close.bind(this));

		var popoverTitle = app.utils.createHtmlElement('span', {
			'class': 'popover-title',
		});
		popoverTitle.appendChild(document.createTextNode('Edge details'));
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
