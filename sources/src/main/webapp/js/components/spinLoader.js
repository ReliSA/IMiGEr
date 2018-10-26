import {Spinner} from '../../node_modules/spin.js/spin.js';

/**
 * Loader animation displayed when running some expensive operation.
 */
class SpinLoader {
	/**
	 * @constructor
	 * @param {object} options 
	 */
	constructor(options) {
		let defaultOptions = {
			lines: 16, // The number of lines to draw
			length: 21, // The length of each line
			width: 8, // The line thickness
			radius: 40, // The radius of the inner circle
			rotate: 0, // The rotation offset
			color: '#000', // #rgb or #rrggbb
			speed: 1.2, // Rounds per second
			trail: 58, // Afterglow percentage
			shadow: true, // Whether to render a shadow
			hwaccel: true, // Whether to use hardware acceleration
			className: 'loader-spinner', // The CSS class to assign to the spinner
			zIndex: 2, // The z-index (defaults to 2000000000)
		};

		this._options = Object.assign(defaultOptions, options);
	}

	/**
	 * @returns {HTMLElement} 
	 */
	render() {
		this._rootElement = DOM.h('div', {
			class: 'spinloader',
			id: 'loader',
			hidden: 'hidden',
		});

		return this._rootElement;
	}

	/**
	 * Enables loader.
	 * @public
	 */
	enable() {
		this._rootElement.removeAttribute('hidden');
		this._spinner = new Spinner(this._options).spin(this._rootElement);
	}

	/**
	 * Disables loader.
	 * @public
	 */
	disable() {
		this._rootElement.setAttribute('hidden', 'hidden');
		this._spinner.stop();
	}
}

export default SpinLoader;
