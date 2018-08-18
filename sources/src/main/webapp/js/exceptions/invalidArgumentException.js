/**
 * Exception thrown when an argument of the function call is not valid.
 * @constructor
 * @param {string} message Message of the exception.
 */
function InvalidArgumentException(message) {
	/** @prop {string} message */
	this.message = message;
}
