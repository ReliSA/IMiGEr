class RegisterPopup extends Popup {
	/**
	 * @inheritdoc
	 */
	render() {
		super.render();

		this._rootElement.classList.add('register_popup');

		this._nameInput = DOM.h('input', {
			'type': 'text',
			'name': 'name',
			'id': 'registerName',
		});

		this._rootElement.appendChild(DOM.h('form', {
			'action': Constants.API.register,
			'method': 'post',
			'onSubmit': this._onFormSubmit.bind(this),
		}, [
			DOM.h('table', {}, [
				DOM.h('tr', {}, [
					DOM.h('td', {}, [
						DOM.h('label', {
							for: 'registerName',
							innerText: 'Name:',
						}),
					]),
					DOM.h('td', {}, [
						this._nameInput,
					]),
				]),
				DOM.h('tr', {}, [
					DOM.h('td', {}, [
						DOM.h('label', {
							for: 'registerEmail',
							innerText: 'Email:',
						}),
					]),
					DOM.h('td', {}, [
						DOM.h('input', {
							type: 'email',
							name: 'email',
							id: 'registerEmail',
						}),
					]),
				]),
				DOM.h('tr', {}, [
					DOM.h('td', {}, [
						DOM.h('label', {
							for: 'registerUsername',
							innerText: 'Username:',
						}),
					]),
					DOM.h('td', {}, [
						DOM.h('input', {
							type: 'text',
							name: 'username',
							id: 'registerUsername',
						}),
					]),
				]),
				DOM.h('tr', {}, [
					DOM.h('td', {}, [
						DOM.h('label', {
							for: 'registerPassword',
							innerText: 'Password:',
						}),
					]),
					DOM.h('td', {}, [
						DOM.h('input', {
							type: 'password',
							name: 'password',
							id: 'registerPassword',
						}),
					]),
				]),
				DOM.h('tr', {}, [
					DOM.h('td', {}, [
						DOM.h('label', {
							for: 'registerPasswordCheck',
							innerText: 'Password again:',
						}),
					]),
					DOM.h('td', {}, [
						DOM.h('input', {
							type: 'password',
							name: 'passwordCheck',
							id: 'registerPasswordCheck',
						}),
					]),
				]),
				DOM.h('tr', {}, [
					DOM.h('td'),
					DOM.h('td', {}, [
						DOM.h('button', {
							type: 'submit',
							class: 'button',
							innerText: 'Register',
						})
					]),
				]),
			]),
		]));

		return this._rootElement;
	}

	/**
	 * Opens the popup and sets focus on name field.
	 */
	open() {
		super.open();

		this._nameInput.focus();
	}

	/**
	 * Signs the user up.
	 * @param {Event} e Form submit event.
	 */
	async _onFormSubmit(e) {
		e.preventDefault();

		const body = new URLSearchParams;
		body.set('name', e.target.name.value);
		body.set('email', e.target.email.value);
		body.set('username', e.target.username.value);
		body.set('password', e.target.password.value);
		body.set('passwordCheck', e.target.passwordCheck.value);

		try {
			await AJAX.do(e.target.action, {
				method: e.target.method,
				credentials: 'same-origin',
				body,
			});

			document.dispatchEvent(new CustomEvent('imiger.userRegistered'));

			this.close();
			alert('You were successfully registered.');

		} catch (error) {
			if (error instanceof HttpError) {
				switch (error.response.status) {
					case 400:
						this._printErrors(error.response);
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