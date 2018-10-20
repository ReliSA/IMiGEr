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
	 * Returns a new promise that is resolved at the moment when all promises passed as function parameter are resolved.
	 * {@link https://stackoverflow.com/a/35825493}
	 * 
	 * @param promises Array of promises to wait for.
	 * @return New promise.
	 */
	static promiseAll(promises) {
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

    /**
     * @param {(Vertex|Group)} node Graph node.
     * @returns {string} Unique identifier of a graph node (group or vertex).
     */
    static getUniqueId(node) {
    	if (Utils.isUndefined(node)) return '';

    	var prefix;
        if (node instanceof Vertex) {
            prefix = 'vertex-';
        } else if (node instanceof Group) {
            prefix = 'group-';
        } else {
            prefix = '';
        }

        return prefix + node.id;
    }
}
