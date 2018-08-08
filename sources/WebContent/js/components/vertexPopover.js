/**
 * Class representing a popover revealed on vertex interface symbol click to display its required and provided interfaces.
 * @see Vertex
 * @constructor
 */
function VertexPopover() {
	var rootElement;
	var popoverTitle;
	var exportedPackagesContainer;
	var exportedPackagesListElement;
	var importedPackagesContainer;
	var importedPackagesListElement;

	/**
	 * Sets the contents of the popover.
	 * @param {string} name Title of the popover.
	 * @param {array} exportedPackages List of exported interfaces.
	 * @param {array} importedPackages List of provided interfaces.
	 */
	this.setContent = function(name, exportedPackages, importedPackages) {
		popoverTitle.innerText = name;

		if (exportedPackages.length === 0) {
			exportedPackagesContainer.classList.add('hidden');
		} else {
			exportedPackagesContainer.classList.remove('hidden');

			exportedPackages.forEach(function(pakkage) {
				var listItem = app.utils.createHtmlElement('li', {});
				listItem.appendChild(document.createTextNode(pakkage));

				exportedPackagesListElement.appendChild(listItem);
			});
		}

		if (importedPackages.length === 0) {
			importedPackagesContainer.classList.add('hidden');
		} else {
			importedPackagesContainer.classList.remove('hidden');

			importedPackages.forEach(function(pakkage) {
				var listItem = app.utils.createHtmlElement('li', {});
				listItem.appendChild(document.createTextNode(pakkage));

				importedPackagesListElement.appendChild(listItem);
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

		exportedPackagesListElement.innerHTML = '';
		importedPackagesListElement.innerHTML = '';
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

		exportedPackagesContainer = app.utils.createHtmlElement('div', {});
		exportedPackagesContainer.appendChild(document.createTextNode('Exported packages'));
		popoverContent.appendChild(exportedPackagesContainer);

		exportedPackagesListElement = app.utils.createHtmlElement('ul', {});
		exportedPackagesContainer.appendChild(exportedPackagesListElement);

		importedPackagesContainer = app.utils.createHtmlElement('div', {});
		importedPackagesContainer.appendChild(document.createTextNode('Imported packages'));
		popoverContent.appendChild(importedPackagesContainer);

		importedPackagesListElement = app.utils.createHtmlElement('ul', {});
		importedPackagesContainer.appendChild(importedPackagesListElement);

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