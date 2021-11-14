/**
 * Class representing a popover.
 */
class Popover {
	/**
	 * Creates a new HTML DOM element representing the popover. Binds user interactions to local handler functions.
	 * @public
	 * @returns newly created HTML DOM element
	 */
	render() {
		this._titleElement = DOM.h('span', {
			class: 'popover-title',
		});

		this._bodyElement = DOM.h('div', {
			class: 'popover-body',
		});

		this._rootElement = DOM.h('div', {
			class: 'popover',
			hidden: 'hidden',
			onWheel: Utils.stopPropagation,
			onMouseDown: Utils.stopPropagation,
			onMouseLeave: this.close.bind(this),
		}, [
			this._titleElement,
			this._bodyElement,
		]);

		return this._rootElement;
	}

	/**
	 * Moves the popover to the coordinates.
	 * @public
	 * @param {Coordinates} coords Coordinates to display the popover at.
	 */
	set position(coords) {
		this._rootElement.style.top = coords.y + 'px';
		this._rootElement.style.left = coords.x + 'px';
	}

	/**
	 * @public
	 * @returns {boolean} true if the DOM element has been instantiated using render() method, otherwise false
	 */
	get isInitialized() {
		return Utils.isDefined(this._rootElement);
	}

	/**
	 * @public
	 * @returns {boolean} true if the modal window is visible at the moment, otherwise false
	 */
	get isVisible() {
		return this._rootElement.hasAttribute('hidden');
	}

	/**
	 * Opens the modal window.
	 * @public
	 */
	open() {
		this._rootElement.removeAttribute('hidden');
	}

	/**
	 * Closes the modal window.
	 * @public
	 */
	close() {
		this._rootElement.setAttribute('hidden', 'hidden');
	}
}
