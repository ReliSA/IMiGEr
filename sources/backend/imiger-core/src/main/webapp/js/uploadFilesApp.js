import App from './app.js';

/**
 * Application running on the UploadFiles page.
 */
class UploadFilesApp extends App {
	/**
	 * Application startup method. It hooks event listeners to elements already present on the page and add listeners of auth events.
	 */
	run() {
		console.log('running...');

		// auth popup
		const header = document.getElementById('header');

		const loginPopup = new LoginPopup;
		header.appendChild(loginPopup.render());

		const registerPopup = new RegisterPopup;
		header.appendChild(registerPopup.render());

		document.getElementById('toggleLoginPopupButton').addEventListener('click', () => {
			registerPopup.close();
			loginPopup.toggle();
		});

		document.getElementById('toggleRegisterPopupButton').addEventListener('click', () => {
			loginPopup.close();
			registerPopup.toggle();
		});

		document.getElementById('logoutButton').addEventListener('click', e => {
			e.preventDefault();
			this._logOut();
		});

		// private diagrams list
		const privateDiagramList = document.getElementById('privateDiagramList');
		privateDiagramList.querySelectorAll('.delete-diagram-button').forEach(button => {
			button.addEventListener('click', this._removeDiagram);
		});

		// auth events
		const usernameLabel = document.getElementById('usernameLabel');

		document.addEventListener(LoggedInEvent.name, e => {
			this._loadPrivateDiagrams();
			usernameLabel.innerText = e.detail.username;
		});
		document.addEventListener(LoggedOutEvent.name, () => {
			privateDiagramList.innerHTML = '';
			usernameLabel.innerText = '';
		});
	}

	/**
	 * Logs user out.
	 */
	async _logOut() {
		try {
			await AJAX.get(Constants.API.logOut);

			document.dispatchEvent(new LoggedOutEvent);

			document.body.classList.remove('loggedIn');
			document.body.classList.add('loggedOut');

		} catch (error) {
			console.error(error);
			alert('Something went wrong. Check console for more details.');
		}
	}

	/**
	 * Loads private diagrams of the logged in user and adds them to a list.
	 */
	async _loadPrivateDiagrams() {
		try {
			const data = await AJAX.getJSON(Constants.API.getPrivateDiagrams);

			data.forEach(diagram => {
				privateDiagramList.appendChild(DOM.h('li', {
					class: 'diagram-list-item',
				}, [
					DOM.h('a', {
						href: app.homeUrl + 'graph?diagramId=' + diagram.id,
						innerText: diagram.name,
					}),
					DOM.h('dl', {
						class: 'diagram-details',
					}, [
						DOM.h('dt', {
							innerText: 'created:',
						}),
						DOM.h('dd', {}, [
							DOM.h('time', {
								innerText: diagram.created,
							}),
						]),
						DOM.h('dt', {
							innerText: 'updated:',
						}),
						DOM.h('dd', {}, [
							DOM.h('time', {
								innerText: diagram.last_update,
							}),
						]),
					]),
					DOM.h('ul', {
						class: 'diagram-button-group',
					}, [
						DOM.h('li', {}, [
							DOM.h('a', {
								href: app.homeUrl + 'api/get-diagram-data?id=' + diagram.id,
								download: diagram.name + '.json',
								title: 'download diagram as raw JSON',
								class: 'button download-diagram-button',
							}, [
								DOM.h('img', {
									src: 'images/icomoon/download3.svg',
									alt: 'download diagram icon',
								}),
							]),
						]),
						DOM.t(' '),
						DOM.h('li', {}, [
							DOM.h('button', {
								class: 'button delete-diagram-button',
								title: 'delete diagram',
								'data-id': diagram.id,
								'data-name': diagram.name,
								onClick: this._removeDiagram,
							}, [
								DOM.h('img', {
									src: 'images/icomoon/cross.svg',
									alt: 'delete diagram icon',
								}),
							]),
						]),
					]),
				]));
			});

		} catch (error) {
			console.error(error);
			alert('Something went wrong. Check console for more details.');
		}
	}

	/**
	 * Removes diagram from DB and reloads the page.
	 */
	async _removeDiagram() {
		let diagramId = this.dataset.id;
		let diagramName = this.dataset.name;

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
							console.error(error);
							alert('Something went wrong. Check console for more details.');
					}
				} else {
					console.error(error);
					alert('Something went wrong. Check console for more details.');
				}
			}
		}
	}
}

export default UploadFilesApp;
