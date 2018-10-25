class LoginPopup extends Popup {
	/**
	 * @inheritdoc
	 */
	render() {
		super.render();

		this._rootElement.classList.add('login_popup');

		this._usernameInput = DOM.h('input', {
			type: 'text',
			name: 'username',
			id: 'loginUsername',
		});

		this._rootElement.appendChild(DOM.h('form', {
			action: Constants.API.logIn,
			method: 'post',
			onSubmit: this._onFormSubmit.bind(this),
		}, [
			DOM.h('table', {}, [
				DOM.h('tr', {}, [
					DOM.h('td', {}, [
						DOM.h('label', {
							for: 'loginUsername',
							innerText: 'Login name:',
						}),
					]),
					DOM.h('td', {}, [
						this._usernameInput,
					]),
				]),
				DOM.h('tr', {}, [
					DOM.h('td', {}, [
						DOM.h('label', {
							for: 'loginPassword',
							innerText: 'Password:',
						}),
					]),
					DOM.h('td', {}, [
						DOM.h('input', {
							type: 'password',
							name: 'password',
							id: 'loginPassword',
						}),
					]),
				]),
				DOM.h('tr', {}, [
					DOM.h('td'),
					DOM.h('td', {}, [
						DOM.h('button', {
							type: 'submit',
							class: 'button',
							innerText: 'Log in',
						})
					]),
				]),
			]),
		]));

		return this._rootElement;
	}

	/**
	 * Opens the popup and sets focus on username field.
	 */
	open() {
		super.open();

		this._usernameInput.focus();
	}

	/**
	 * Logs the user in.
	 * @param {Event} e Form submit event.
	 */
	async _onFormSubmit(e) {
		e.preventDefault();

		const body = new URLSearchParams;
		body.set('username', e.target.username.value);
		body.set('password', e.target.password.value);

		try {
			const response = await AJAX.do(e.target.action, {
				method: e.target.method,
				credentials: 'same-origin',
				body,
			});
			const data = await response.json();

			document.dispatchEvent(new CustomEvent('imiger.userLoggedIn', {
				detail: data,
			}));

			document.body.classList.remove('loggedOut');
			document.body.classList.add('loggedIn');

			this.close();

		} catch (error) {
			if (error instanceof HttpError) {
				switch (error.response.status) {
					case 400:
						this._printErrors(error.response);
						break;
					case 401:
						alert('Invalid credentials.');
						break;
					default:
						alert('Something went wrong.');
				}
			} else {
				alert('Something went wrong. Check console for more details.');
				console.error(error);
			}
		}
	}

	async _printErrors(response) {
		const data = await response.json();
		for (let key in data.error) {
			if (data.error.hasOwnProperty(key) === false) continue;

			alert(data.error[key]);
		}
	}
}
