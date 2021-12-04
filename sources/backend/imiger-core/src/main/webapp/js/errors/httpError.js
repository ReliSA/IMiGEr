/**
 * Error thrown when AJAX request fails due to HTTP error.
 */
class HttpError extends Error {
	constructor(response) {
		super(`${response.status} for ${response.url}`);
		this.name = new.target.name;
		this.response = response;
	}
}
