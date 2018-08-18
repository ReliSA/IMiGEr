/**
 * Class representing a modal window displaying a change separately from viewport and sidebar.
 * @see Change
 * @constructor
 * @param {Change} change Change to be displayed in the modal window.
 */
function ChangeModalWindow(change) {
	var rootElement;

	var change;

	/**
	 * Sets a change to be displayed in the modal window.
	 * @param {Change} newValue Change to be displayed in this modal window.
	 */
	this.setChange = function(newValue) {
		change = newValue;
	};

	this.open = function() {
		rootElement.classList.remove('hidden');
	};

	/**
	 * Closes this modal window.
	 */
	this.close = function() {
		rootElement.classList.add('hidden');
	};

	/**
	 * Creates a new HTML DOM element representing the modal window in memory. Binds user interactions to local handler functions.
	 * @returns {Element} HTML DOM element.
	 */
	this.render = function() {
		rootElement = app.utils.createHtmlElement('div', {
			'class': 'change-modal modal hidden',
		});

		var modalContent = app.utils.createHtmlElement('div', {
			'class': 'modal-content',
		});
		rootElement.appendChild(modalContent);

		var closeButton = app.utils.createHtmlElement('button', {
			'class': 'close-button button',
		});
		closeButton.appendChild(app.utils.createTextElement('×'));
		closeButton.addEventListener('click', closeButtonClick.bind(this));
		modalContent.appendChild(closeButton);

		return rootElement;
	};

	/**
	 * Close button click interaction. Closes the modal window.
	 * @param {Event} e Click event.
	 */
	function closeButtonClick(e) {
		this.close();
	}
}
