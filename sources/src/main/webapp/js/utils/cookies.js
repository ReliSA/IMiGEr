/**
 * Class containing cookie utility functions.
 * @constructor
 */
function Cookies() {
	/**
	 * Gets the value of a cookie.
	 * 
	 * @param {string} name Name of the cookie.
	 */
	this.get = function(name) {
		var cookies = document.cookie.split('; ');

		var cookie = cookies.find(function(cookie) {
			return cookie.startsWith(name + '=');
		});

		if (typeof cookie === 'undefined') return null;

		return cookie.split('=')[1];
	};

	/**
	 * Sets a new cookie.
	 * 
	 * @param {string} name Name of the cookie.
	 * @param {string} value Value of the cookie.
	 */
	this.set = function(name, value) {
		var date = new Date();

		document.cookie = name + "=" + value + "; path=/imiger";
	};
}
