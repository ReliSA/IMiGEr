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
		loginPopup.classList.toggle('hidden');
	});

	toggleRegisterPopupButton.addEventListener('click', function() {
		registerPopup.classList.toggle('hidden');
	});

	logoutButton.addEventListener('click', function(e) {
		e.preventDefault();

		$.ajax({
			'type': 'GET',
			'url': logoutButton.href,
			'success': function() {
				document.dispatchEvent(new CustomEvent('imiger.userLoggedOut'));

				usernameLabel.innerText = '';

				document.body.classList.remove('loggedIn');
				document.body.classList.add('loggedOut');
			},
			'error': function() {
				alert('Something went wrong.');
			},
		});
	});

	loginForm.addEventListener('submit', function(e) {
		e.preventDefault();

		$.ajax({
			'type': loginForm.method,
			'url': loginForm.action,
			'data': {
				'username': loginForm.username.value,
				'password': loginForm.password.value,
			},
			'success': function(data) {
				document.dispatchEvent(new CustomEvent('imiger.userLoggedIn'));

				usernameLabel.innerText = data.user.username;

				document.body.classList.remove('loggedOut');
				document.body.classList.add('loggedIn');

				loginPopup.classList.add('hidden');
			},
			'error': function(xhr) {
				switch (xhr.status) {
					case 400:
						printErrors(xhr);
						break;
					case 401:
						alert('Invalid credentials.');
						break;
					default:
						alert('Something went wrong.');
				}
			},
		});
	});

	registerForm.addEventListener('submit', function(e) {
		e.preventDefault();

		$.ajax({
			'type': registerForm.method,
			'url': registerForm.action,
			'data': {
				'name': registerForm.name.value,
				'email': registerForm.email.value,
				'username': registerForm.username.value,
				'password': registerForm.password.value,
				'passwordCheck': registerForm.passwordCheck.value,
			},
			'success': function() {
				document.dispatchEvent(new CustomEvent('imiger.userRegistered'));

				registerPopup.classList.add('hidden');
			},
			'error': function(xhr) {
				switch (xhr.status) {
					case 400:
						printErrors(xhr);
						break;
					default:
						alert('Something went wrong.');
				}
			},
		});
	});
});

function printErrors(xhr) {
	var data = JSON.parse(xhr.responseText);

	for (var key in data.error) {
		if (!data.error.hasOwnProperty(key)) continue;

		alert(data.error[key]);
	}
}
