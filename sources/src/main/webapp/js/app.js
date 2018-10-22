/**
 * Main class of the application.
 */
class App {
	/**
	 * @constructor
	 * @param {string} name Name of the application.
	 * @param {string} homeUrl Base URL of the application.
	 */
	constructor(name, homeUrl) {
		this.name = name;
		this.homeUrl = homeUrl;
	}

	/**
	 * @abstract
	 */
	run() {
		throw new AbstractMethodError;
	}
}
