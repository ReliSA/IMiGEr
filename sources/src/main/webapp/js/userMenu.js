document.addEventListener('DOMContentLoaded', function() {
	var toggleLoginPopupButton = document.getElementById('toggleLoginPopupButton');
	var loginPopup = document.getElementById('loginPopup');

	var toggleRegisterPopupButton = document.getElementById('toggleRegisterPopupButton');
	var registerPopup = document.getElementById('registerPopup');

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
});
