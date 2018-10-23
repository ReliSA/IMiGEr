document.addEventListener('DOMContentLoaded', function() {
	const loginPopup = new LoginPopup;
	const registerPopup = new RegisterPopup;

	const header = document.getElementById('header');
	header.appendChild(loginPopup.render());
	header.appendChild(registerPopup.render());

	document.getElementById('toggleLoginPopupButton').addEventListener('click', function() {
		registerPopup.close();
		loginPopup.toggle();
	});

	document.getElementById('toggleRegisterPopupButton').addEventListener('click', function() {
		loginPopup.close();
		registerPopup.toggle();
	});

	document.getElementById('logoutButton').addEventListener('click', async function(e) {
		e.preventDefault();

		try {
			await AJAX.get(Constants.API.logOut);

			document.dispatchEvent(new CustomEvent('imiger.userLoggedOut'));

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
});
