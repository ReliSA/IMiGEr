/**
 * Error thrown when AJV JSON validation fails.
 */
class AJVValidationError extends Error {
	constructor(message, errors) {
		super(message);
		this.name = new.target.name;
		this.errors = errors;
	}
}
