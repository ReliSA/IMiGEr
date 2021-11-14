/**
 * Class containing common utility functions.
 */
class Utils {
	/**
	 * No operation function.
	 */
	static noop() {}

	/**
	 * Stops propagation of the mouse interaction to parental elements.
	 * @param {MouseEvent} e Click/double-click event.
	 */
	static stopPropagation(e) {
		e.stopPropagation();
	}

	/**
	 * Checks whether the variable passed as parameter is defined.
	 * 
	 * @param variable Variable to be checked.
	 * @return {boolean} true if the variable is defined, otherwise false
	 */
	static isDefined(variable) {
		return typeof variable !== 'undefined';
	}

	/**
	 * Checks whether the variable passed as parameter is not defined.
	 * 
	 * @param variable Variable to be checked.
	 * @return {boolean} true if the variable is NOT defined, otherwise false
	 */
	static isUndefined(variable) {
		return typeof variable === 'undefined';
	}

	/**
	 * Extracts value of a query parameter from the current URL.
	 * {@link https://css-tricks.com/snippets/javascript/get-url-variables/}
	 * 
	 * @param {string} variable 
	 * @returns value of the query parameter or false if the parameter does not exist
	 */
	static getQueryVariable(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split('&');

		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');

			if (pair[0] == variable) {
				return pair[1];
			}
		}

		return false;
	}
}
