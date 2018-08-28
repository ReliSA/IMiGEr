document.addEventListener('DOMContentLoaded', function() {
	var toggleLoginPopupButton = document.getElementById('toggleLoginPopupButton');
	var toggleRegisterPopupButton = document.getElementById('toggleRegisterPopupButton');
	var logoutButton = document.getElementById('logoutButton');

	var loginPopup = document.getElementById('loginPopup');
	var registerPopup = document.getElementById('registerPopup');

	var loginForm = document.forms['loginForm'];
	var registerForm = document.forms['registerForm'];

	if (toggleLoginPopupButton) {
		toggleLoginPopupButton.addEventListener('click', function() {
			loginPopup.classList.toggle('hidden');
		});
	}

	if (toggleRegisterPopupButton) {
		toggleRegisterPopupButton.addEventListener('click', function() {
			registerPopup.classList.toggle('hidden');
		});
	}

	if (logoutButton) {
		logoutButton.addEventListener('click', function(e) {
			e.preventDefault();

			$.ajax({
				'type': 'GET',
				'url': logoutButton.href,
				'success': function() {
					location.reload(true);
				},
				'error': function() {
					alert('Something went wrong.');
				},
			});
		});
	}

	if (loginForm) {
		loginForm.addEventListener('submit', function(e) {
			e.preventDefault();

			$.ajax({
				'type': loginForm.method,
				'url': loginForm.action,
				'data': {
					'username': loginForm.username.value,
					'password': loginForm.password.value,
				},
				'success': function() {
					location.reload(true);
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
	}

	if (registerForm) {
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
					location.reload(true);
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
	}
});

function printErrors(xhr) {
	var data = JSON.parse(xhr.responseText);

	for (var key in data.error) {
		if (!data.error.hasOwnProperty(key)) continue;

		alert(data.error[key]);
	}
}
