class Header {
	constructor() {
		document.addEventListener(LoggedInEvent.name, e => {
			this._loggedInUserLabel.innerText = e.detail.username;
		});

		document.addEventListener(LoggedOutEvent.name, () => {
			this._loggedInUserLabel.innerText = '';
		});
	}

	render() {
		this._loggedInUserLabel = DOM.h('span', {
			class: 'username',
		});
		this._loginPopup = new LoginPopup;
		this._registerPopup = new RegisterPopup;

		this._rootElement = DOM.h('div', {
			class: 'header',
		}, [
			DOM.h('img', {
				src: 'images/logo.png',
				class: 'header-logo',
				alt: 'logo of University of West Bohemia',
				title: 'University of West Bohemia',
			}),
			DOM.h('h2', {
				class: 'header-title',
				innerText: 'Interactive Multimodal Graph Explorer',
			}),
			DOM.h('div', {
				class: 'user-menu loggedInOnly',
			}, [
				this._loggedInUserLabel,
				DOM.h('a', {
					href: Constants.API.logOut,
					class: 'button',
					innerText: 'Log out',
					onClick: this._onLogoutButtonClick.bind(this),
				}),
			]),
			DOM.h('div', {
				class: 'user-menu loggedOutOnly',
			}, [
				DOM.h('button', {
					class: 'button',
					innerText: 'Log in',
					onClick: () => {
						this._registerPopup.close();
						this._loginPopup.toggle();
					},
				}),
				DOM.h('button', {
					class: 'button',
					innerText: 'Register',
					onClick: () => {
						this._loginPopup.close();
						this._registerPopup.toggle();
					},
				}),
			]),
			this._loginPopup.render(),
			this._registerPopup.render(),
		]);

		return this._rootElement;
	}

	get height() {
		return this._rootElement.offsetHeight;
	}

	async _onLogoutButtonClick(e) {
		e.preventDefault();

		try {
			await AJAX.get(e.target.href);

			document.dispatchEvent(new LoggedOutEvent);

			document.body.classList.remove('loggedIn');
			document.body.classList.add('loggedOut');

		} catch (error) {
			alert('Something went wrong. Check console for more details.');
			console.error(error);
	}
	}
}
