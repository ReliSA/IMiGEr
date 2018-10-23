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

		const privateDiagramList = document.getElementById('privateDiagramList');
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

			data.forEach(diagram => {
				privateDiagramList.appendChild(DOM.h('li', {}, [
					DOM.h('a', {
						href: app.homeUrl + 'graph?diagramId=' + diagram.id,
						innerText: diagram.name,
					}),
					DOM.h('button', {
						class: 'button remove-diagram-button',
						'data-id': diagram.id,
						'data-name': diagram.name,
						onClick: this._removeDiagram,
					}, [
						DOM.h('img', {
							src: 'images/button_cancel.png',
							alt: 'Odstranit',
						}),
					]),
				]));
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