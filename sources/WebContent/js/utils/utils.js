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

}
