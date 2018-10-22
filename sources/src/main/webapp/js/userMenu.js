document.addEventListener('DOMContentLoaded', function() {
	var toggleLoginPopupButton = document.getElementById('toggleLoginPopupButton');
	var toggleRegisterPopupButton = document.getElementById('toggleRegisterPopupButton');
	var usernameLabel = document.getElementById('usernameLabel');
	var logoutButton = document.getElementById('logoutButton');

	var loginPopup = document.getElementById('loginPopup');
	var registerPopup = document.getElementById('registerPopup');

	var loginForm = document.forms['loginForm'];
	var registerForm = document.forms['registerForm'];

	toggleLoginPopupButton.addEventListener('click', function() {
		registerPopup.classList.add('hidden');
		loginPopup.classList.toggle('hidden');

		loginForm.username.focus();
	});

	toggleRegisterPopupButton.addEventListener('click', function() {
		loginPopup.classList.add('hidden');
		registerPopup.classList.toggle('hidden');

		registerForm.name.focus();
	});

	logoutButton.addEventListener('click', async function(e) {
		e.preventDefault();

		try {
			await AJAX.get(logoutButton.href);

			document.dispatchEvent(new CustomEvent('imiger.userLoggedOut'));

			usernameLabel.innerText = '';

			document.body.classList.remove('loggedIn');
			document.body.classList.add('loggedOut');

		} catch (error) {
			if (error instanceof HttpError) {
				alert('Something went wrong.');
			} else {
				alert('Server has probably gone away.');
			}
		}
	});

	loginForm.addEventListener('submit', async function(e) {
		e.preventDefault();

		const body = new URLSearchParams;
		body.set('username', loginForm.username.value);
		body.set('password', loginForm.password.value);

		try {
			const response = await AJAX.do(loginForm.action, {
				method: loginForm.method,
				credentials: 'same-origin',
				body,
			});
			const data = await response.json();

			document.dispatchEvent(new CustomEvent('imiger.userLoggedIn'));

			usernameLabel.innerText = data.user.username;

			document.body.classList.remove('loggedOut');
			document.body.classList.add('loggedIn');

			loginPopup.classList.add('hidden');

		} catch (error) {
			if (error instanceof HttpError) {
				switch (error.response.status) {
					case 400:
						printErrors(error.response);
						break;
					case 401:
						alert('Invalid credentials.');
						break;
					default:
						alert('Something went wrong.');
				}
			} else {
				alert('Server has probably gone away.');
			}
		}
	});

	registerForm.addEventListener('submit', async function(e) {
		e.preventDefault();

		const body = new URLSearchParams;
		body.set('name', registerForm.name.value);
		body.set('email', registerForm.email.value);
		body.set('username', registerForm.username.value);
		body.set('password', registerForm.password.value);
		body.set('passwordCheck', registerForm.passwordCheck.value);

		try {
			await AJAX.do(registerForm.action, {
				method: registerForm.method,
				credentials: 'same-origin',
				body,
			});

			document.dispatchEvent(new CustomEvent('imiger.userRegistered'));

			registerPopup.classList.add('hidden');
			alert('You were successfully registered.');

		} catch (error) {
			if (error instanceof HttpError) {
				switch (error.response.status) {
					case 400:
						printErrors(error.response);
						break;
					default:
						alert('Something went wrong.');
				}
			} else {
				alert('Server has probably gone away.');
			}
		}
	});
});

async function printErrors(response) {
	const data = await response.json();
	for (let key in data.error) {
		if (data.error.hasOwnProperty(key) === false) continue;

		alert(data.error[key]);
	}
}
