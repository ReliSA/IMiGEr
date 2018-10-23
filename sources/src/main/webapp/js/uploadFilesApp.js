/**
 * Application running on the Upload files page.
 * @constructor
 */
class UploadFilesApp extends App {
	/**
	 * Application startup method. It hooks event listeners to elements already present on the page and add listeners of auth events.
	 */
	run() {
		console.log('running...');

		let privateDiagramList = document.getElementById('privateDiagramList');
		privateDiagramList.querySelectorAll('.remove-diagram-button').forEach(button => {
			button.addEventListener('click', this._removeDiagram);
		});

		// auth events
		const usernameLabel = document.getElementById('usernameLabel');

		document.addEventListener('imiger.userLoggedIn', e => {
			this._loadPrivateDiagrams();
			usernameLabel.innerText = e.detail.user.username;
		});
		document.addEventListener('imiger.userLoggedOut', () => {
			privateDiagramList.innerHTML = '';
			usernameLabel.innerText = '';
		});
	}

	/**
	 * Loads private diagrams of the logged in user and adds them to a list.
	 */
	async _loadPrivateDiagrams() {
		try {
			const data = await AJAX.getJSON(Constants.API.getPrivateDiagrams);

			data.forEach(function(diagram) {
				var openDiagramLink = document.createElement('a');
				openDiagramLink.setAttribute('href', './graph?diagramId=' + diagram.id);
				openDiagramLink.innerText = diagram.name;

				var removeDiagramIcon = document.createElement('img');
				removeDiagramIcon.setAttribute('src', 'images/button_cancel.png');
				removeDiagramIcon.setAttribute('alt', 'odstranit');

				var removeDiagramButton = document.createElement('button');
				removeDiagramButton.setAttribute('class', 'remove-diagram-button');
				removeDiagramButton.setAttribute('data-id', diagram.id);
				removeDiagramButton.setAttribute('data-name', diagram.name);
				removeDiagramButton.addEventListener('click', this._removeDiagram);
				removeDiagramButton.appendChild(removeDiagramIcon);

				var diagramListItem = document.createElement('li');
				diagramListItem.appendChild(openDiagramLink);
				diagramListItem.appendChild(removeDiagramButton);

				privateDiagramList.appendChild(diagramListItem);
			});
		} catch (error) {
			if (error instanceof HttpError) {
				alert('Something went wrong.');
			} else {
				alert('Server has probably gone away.');
			}
		}
	}

	/**
	 * Removes diagram from DB and reloads the page.
	 */
	async _removeDiagram() {
		let diagramId = this.getAttribute('data-id');
		let diagramName = this.getAttribute('data-name');

		if (confirm('Do you really want to delete ' + diagramName + '?')) {
			try {
				await AJAX.delete(Constants.API.removeDiagram + '?diagramId=' + diagramId);

				location.reload(true);

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
}
