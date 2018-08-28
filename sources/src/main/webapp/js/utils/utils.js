/**
 * Class containing common utility functions.
 * @constructor
 */
function Utils() {
	/**
	 * No operation function.
	 */
	this.noop = function() {};

	/**
	 * Stops propagation of the mouse interaction to parental elements.
	 * @param {MouseEvent} e Click/double-click event.
	 */
	this.stopPropagation = function(e) {
		e.stopPropagation();
	};

	/**
	 * Checks whether the variable passed as parameter is defined.
	 * 
	 * @param {boolean} variable Variable to be checked.
	 * @return true if the variable is defined, otherwise false
	 */
	this.isDefined = function(variable) {
		return typeof variable !== 'undefined';
	};

	/**
	 * Checks whether the variable passed as parameter is not defined.
	 * 
	 * @param {boolean} variable Variable to be checked.
	 * @return true if the variable is NOT defined, otherwise false
	 */
	this.isUndefined = function(variable) {
		return typeof variable === 'undefined';
	};

	// TODO: move to DOM class
	this.createHtmlElement = function(tagName, attributes) {
		return app.dom.createHtmlElement(tagName, attributes);
	};

	// TODO: move to DOM class
	this.createSvgElement = function(tagName, attributes) {
		return app.dom.createSvgElement(tagName, attributes);
	};
	
	// TODO: move to DOM class
	this.createTextElement = function(text) {
		return app.dom.createTextElement(text);
	};

	/**
	 * Returns a new promise that is resolved at the moment when all promises passed as function parameter are resolved.
	 * https://stackoverflow.com/a/35825493
	 * 
	 * @param promises Array of promises to wait for.
	 * @return New promise.
	 */
	this.promiseAll = function(promises) {
		if (!Array.isArray(promises)) {
			throw new TypeError('Parameter must be an array.');
		}

		return $.when.apply($, promises).then(function () {
			// if single argument was expanded into multiple arguments, then put it back into an array for consistency
			if (promises.length === 1 && arguments.length > 1) {
				return [ Array.prototype.slice.call(arguments, 0) ];
			} else {
				return Array.prototype.slice.call(arguments, 0);
			}
		})
	};

	/**
	 * Extracts value of a query parameter from the current URL.
	 * {@link https://css-tricks.com/snippets/javascript/get-url-variables/}
	 * 
	 * @param {string} variable 
	 * @returns value of the query parameter or false if the parameter does not exist
	 */
	this.getQueryVariable = function(variable) {
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
