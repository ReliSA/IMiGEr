/**
 * Class containing cookie utility functions.
 */
class Cookies {
	/**
	 * Gets the value of a cookie.
	 * 
	 * @param {string} name Name of the cookie.
	 */
	static get(name) {
		const cookies = document.cookie.split('; ');

		const cookie = cookies.find(cookie => {
			return cookie.startsWith(name + '=');
		});

		if (typeof cookie === 'undefined') return null;

		return cookie.split('=')[1];
	}

	/**
	 * Sets a new cookie.
	 * 
	 * @param {string} name Name of the cookie.
	 * @param {string} value Value of the cookie.
	 */
	static set(name, value) {
		const date = new Date();

		document.cookie = name + "=" + value + "; path=/imiger";
	}
}
