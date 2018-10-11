/**
 * Class representing a modal window.
 * @constructor
 */
function ModalWindow() {
	var rootElement;
	var diagramForm;

	/**
	 * Opens this modal window.
	 */
	this.open = function() {
		rootElement.classList.remove('hidden');

		diagramForm.appendChild(app.dom.createHtmlElement('div', { class: 'err_msg' }));
		diagramForm.appendChild(app.dom.htmlStringToElement(`<table><tbody><tr><td><label for="diagramName">Diagram name:</label></td><td><input type="text" name="diagramName" value="${app.diagram !== null ? app.diagram.name : ''}" id="diagramName" required></td></tr><tr><td><label for="diagramPublic">Is public:</label></td><td><input type="checkbox" name="diagramPublic" value="1" id="diagramPublic" ${app.diagram !== null && app.diagram.public ? 'checked' : ''}></td></tr><tr><td></td><td><button type="submit" class="button">Save</button></td></tr></tbody></table>`));

		diagramForm.diagramName.focus();
	};

	/**
	 * Closes this modal window.
	 */
	this.close = function() {
		rootElement.classList.add('hidden');

		diagramForm.innerHTML = '';
	};

	/**
	 * Creates a new HTML DOM element representing the modal window in memory. Binds user interactions to local handler functions.
	 * @returns {Element} HTML DOM element.
	 */
	this.render = function() {
		rootElement = app.utils.createHtmlElement('div', {
			'class': 'modal hidden',
		});
		rootElement.addEventListener('click', this.close);

		var modalContent = app.utils.createHtmlElement('div', {
			'class': 'modal-content',
		});
		modalContent.addEventListener('click', app.utils.stopPropagation);
		rootElement.appendChild(modalContent);

		var closeButton = app.utils.createHtmlElement('button', {
			'class': 'close-button button',
		});
		closeButton.appendChild(app.utils.createTextElement('×'));
		closeButton.addEventListener('click', closeButtonClick.bind(this));
		modalContent.appendChild(closeButton);

		diagramForm = app.dom.createHtmlElement('form', {});
		diagramForm.addEventListener('submit', saveDiagram.bind(this));
		modalContent.appendChild(diagramForm);

		return rootElement;
	};

	/**
	 * Close button click interaction. Closes the modal window.
	 * @param {Event} e Click event.
	 */
	function closeButtonClick(e) {
		this.close();
	}

	/**
	 * Saves diagram.
	 * @param {Event} e Submit event.
	 */
	function saveDiagram(e) {
		e.preventDefault();

		var self = this;

		$.ajax({
			'type': 'POST',
			'url': app.API.saveDiagram,
			'data': {
				'id': app.diagram === null ? null : app.diagram.id,
				'name': e.target.diagramName.value,
				'graphJson': JSON.stringify(app.graphExporter.run()),
				'public': (e.target.diagramPublic.checked | 0).toString(),
			},
			'success': function(data) {
				app.diagram = new Diagram(data);

				document.title = app.NAME + ' - ' + app.diagram.name;
				history.replaceState({} , document.title, app.HOME_URL + 'graph?diagramId=' + app.diagram.id);

				self.close();
				alert('Diagram was successfully saved.');
			},
			'error': function(xhr) {
				switch (xhr.status) {
					case 401:
						alert('You are either not logged in or not an owner of this diagram.');
						break;
					default:
						alert('Something went wrong.');
				}
			},
		});
	}
}
