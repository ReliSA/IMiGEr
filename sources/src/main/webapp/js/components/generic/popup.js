class Popup {
	/**
	 * @public
	 * @returns {HTMLElement} newly created HTML DOM element
	 */
	render() {
		this._rootElement = DOM.h('div', {
			class: 'popup',
			hidden: 'hidden',
		});

		return this._rootElement;
	}

	/**
	 * @public
	 * @returns {boolean} true if the DOM element has been instantiated using render() method, otherwise false
	 */
	get isInitialized() {
		return Utils.isDefined(this._rootElement);
	}

	/**
	 * @returns {boolean} true if the popup is visible at the moment, otherwise false
	 */
	get isVisible() {
		return this._rootElement.hasAttribute('hidden');
	}

	/**
	 * Opens the popup.
	 */
	open() {
		this._rootElement.removeAttribute('hidden');
	}

	/**
	 * Closes the popup.
	 */
	close() {
		this._rootElement.setAttribute('hidden', 'hidden');
	}

	/**
	 * Toggles visibility of the popup.
	 */
	toggle() {
		if (this.isVisible) {
			this.open();
		} else {
			this.close();
		}
	}
}
