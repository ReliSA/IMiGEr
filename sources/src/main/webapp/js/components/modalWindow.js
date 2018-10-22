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

		diagramForm.appendChild(DOM.createHtmlElement('div', { class: 'err_msg' }));
		diagramForm.appendChild(DOM.htmlStringToElement(`<table><tbody><tr><td><label for="diagramName">Diagram name:</label></td><td><input type="text" name="diagramName" value="${app.diagram !== null ? app.diagram.name : ''}" id="diagramName" required></td></tr><tr><td><label for="diagramPublic">Is public:</label></td><td><input type="checkbox" name="diagramPublic" value="1" id="diagramPublic" ${app.diagram !== null && app.diagram.public ? 'checked' : ''}></td></tr><tr><td></td><td><button type="submit" class="button">Save</button></td></tr></tbody></table>`));

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
		rootElement = DOM.createHtmlElement('div', {
			'class': 'modal hidden',
		});
		rootElement.addEventListener('click', this.close);

		var modalContent = DOM.createHtmlElement('div', {
			'class': 'modal-content',
		});
		modalContent.addEventListener('click', Utils.stopPropagation);
		rootElement.appendChild(modalContent);

		var closeButton = DOM.createHtmlElement('button', {
			'class': 'close-button button',
		});
		closeButton.appendChild(DOM.createTextElement('×'));
		closeButton.addEventListener('click', closeButtonClick.bind(this));
		modalContent.appendChild(closeButton);

		diagramForm = DOM.createHtmlElement('form');
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
	async function saveDiagram(e) {
		e.preventDefault();

		const body = new URLSearchParams;
		body.set('id', app.diagram === null ? '' : app.diagram.id);
		body.set('name', e.target.diagramName.value);
		body.set('graphJson', JSON.stringify(app.graphExporter.run()));
		body.set('public', (e.target.diagramPublic.checked | 0).toString());

		try {
			const response = await AJAX.post(app.API.saveDiagram, body);
			const data = await response.json();

			app.diagram = new Diagram(data);

			document.title = app.NAME + ' - ' + app.diagram.name;
			history.replaceState({} , document.title, app.HOME_URL + 'graph?diagramId=' + app.diagram.id);

			this.close();
			alert('Diagram was successfully saved.');

		} catch (error) {
			if (error instanceof HttpError) {
				switch (error.response.status) {
					case 401:
						alert('You are either not logged in or not an owner of this diagram.');
						break;
					default:
						alert('Something went wrong.');
				}
			} else {
				alert('Server has probably gone away.');
			}
		}
	}
}
