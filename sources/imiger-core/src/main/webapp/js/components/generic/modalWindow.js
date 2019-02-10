/**
 * Class representing a modal window.
 */
class ModalWindow {
	/**
	 * Creates a new HTML DOM element representing the modal window. Binds user interactions to local handler functions.
	 * @public
	 * @returns newly created HTML DOM element
	 */
	render() {
		this._bodyElement = DOM.h('div', {
			class: 'modal-body',
		});

		this._rootElement = DOM.h('div', {
			class: 'modal',
			hidden: 'hidden',
			onClick: this.close.bind(this),
		}, [
			DOM.h('div', {
				class: 'modal-content',
				onClick: Utils.stopPropagation,
			}, [
				DOM.h('button', {
					class: 'close-button button',
					innerText: '×',
					onClick: this.close.bind(this),
				}),
				this._bodyElement,
			]),
		]);

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

		document.body.addEventListener('keydown', this._closeOnEscapeKeyPressed.bind(this), {
			once: true,
		});
	}

	/**
	 * Closes the modal window.
	 * @public
	 */
	close() {
		this._rootElement.setAttribute('hidden', 'hidden');
	}

	/**
	 * Toggles visibility of the modal window.
	 * @public
	 */
	toggle() {
		if (this.isVisible) {
			this.open();
		} else {
			this.close();
		}
	}

	/**
	 * Closes the modal window when Escape key is pressed.
	 * @param {KeyboardEvent} e Keyboard event triggered by keydown event listener.
	 */
	_closeOnEscapeKeyPressed(e) {
		if (e.key === 'Escape') {
			e.preventDefault();
			this.close();
		}
	}
}
