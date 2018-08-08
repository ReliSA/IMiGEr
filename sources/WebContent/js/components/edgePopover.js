/**
 * Class representing a popover revealed on edge click to display its compatibility information.
 * @see Edge
 * @constructor
 */
function EdgePopover() {
	var rootElement;
	var popoverContentElement;

	/**
	 * Sets compatibility information held by the edge.
	 * @param {object} compatibilityInfo Compatibility information of the edge.
	 */
	this.setContent = function(compatibilityInfo) {
		popoverContentElement.appendChild(createHtmlTree(compatibilityInfo));

		$.jstree.create(popoverContentElement, {
			core : {
				'animation': 25,
			},
			themes : {
				'theme': 'classic',
				'dots': true,
				'icons': false,
			},
			plugins : [ 'themes', 'html_data' ],
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

		$.jstree.destroy(popoverContentElement);

		popoverContentElement.innerHTML = '';
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
		popoverTitle.appendChild(document.createTextNode('Incompatibility details'));
		rootElement.appendChild(popoverTitle);

		popoverContentElement = app.utils.createHtmlElement('div', {
			'class': 'popover-content',
		});
		rootElement.appendChild(popoverContentElement);

		return rootElement;
	};

	/**
	 * Stops propagation of the event which triggered this function to its parental elements.
	 * @param {Event} e The event.
	 */
	function stopPropagation(e) {
		e.stopPropagation();
	}

	/**
	 * Creates a new list displaying the compatibility information as tree in memory.
	 * @param {array<object>} compatibilityInfoList List of compatibility information held by the edge.
	 * @returns {Element} HTML DOM element.
	 */
	function createHtmlTree(compatibilityInfoList) {
		var incompatibilityNameList = [];
		var list = app.utils.createHtmlElement('ul', {});

		compatibilityInfoList.forEach(function(compatibilityInfo) {
			if (compatibilityInfo.incomps.length === 0) return;

			compatibilityInfo.incomps.forEach(function(incompatibility) {
				if (!incompatibility.desc.isIncompCause && incompatibility.subtree.length === 0) return;

				if (incompatibilityNameList.indexOf(incompatibility.desc.name) > -1) return;
				incompatibilityNameList.push(incompatibility.desc.name);

				var label;
				if (incompatibility.desc.isIncompCause) {
					label = app.dom.htmlStringToElement(`<span>${incompatibility.desc.incompName}</span>`);
				} else {
					label = document.createTextNode(incompatibility.desc.name);
				}

				var listItem = app.utils.createHtmlElement('li', {});
				listItem.appendChild(label);
				list.appendChild(listItem);

				var subList = app.utils.createHtmlElement('ul', {});
				listItem.appendChild(subList);

				appendHtmlSubtree(subList, incompatibility.subtree);
			});
		});

		return list;
	}

	/**
	 * Appends a new list item displaying a single incompatibility to the list passed as a parameter.
	 * @param {Element} list HTML DOM element to append this tree to.
	 * @param {array<object>} incompatibilityList List of incompatibility information.
	 */
	function appendHtmlSubtree(list, incompatibilityList) {
		incompatibilityList.forEach(function(incompatibility) {
			if (!incompatibility.desc.isIncompCause && incompatibility.subtree.length === 0) return;

			var label;
			if (incompatibility.desc.isIncompCause) {
				label = app.dom.htmlStringToElement(`<span>${incompatibility.desc.incompName}</span>`);
			} else {
				label = document.createTextNode(incompatibility.desc.name);
			}

			var listItem = app.utils.createHtmlElement('li', {});
			listItem.appendChild(label);
			list.appendChild(listItem);

			if (incompatibility.desc.isIncompCause && incompatibility.desc.difference !== 'DEL') {
				var subList = app.utils.createHtmlElement('ul', {});
				listItem.appendChild(subList);

				var subListItemProvided = app.utils.createHtmlElement('li', {});
				subListItemProvided.appendChild(app.dom.htmlStringToElement(`<span><img src="images/efp_qtip/provided.png"> <span class="second">${incompatibility.desc.objectNameSecond}</span></span>`));
				subList.appendChild(subListItemProvided);

				var subListItemRequired = app.utils.createHtmlElement('li', {});
				subListItemRequired.appendChild(app.dom.htmlStringToElement(`<span><img src="images/efp_qtip/required.png"> <span class="first">${incompatibility.desc.objectNameFirst}</span></span>`));
				subList.appendChild(subListItemRequired);
			}

			if (incompatibility.subtree.length !== 0) {
				var subList = app.utils.createHtmlElement('ul', {});
				listItem.appendChild(subList);

				appendHtmlSubtree(subList, incompatibility.subtree);
			}
		});
	}

}
