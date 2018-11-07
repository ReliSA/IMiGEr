/**
 * Loader animation displayed when running some expensive operation.
 * 
 * @constructor
 * @param {object} options 
 */
function Loader(options) {
	var defaultOptions = {
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

	var opts = $.extend(defaultOptions, options);

	/**
	 * Spin jQuery plugin.
	 */
	$.fn.spin = function(opts) {
		this.each(function() {
			var $this = $(this),
			data = $this.data();
			
			if (data.spinner) {
				data.spinner.stop();
				delete data.spinner;
			}

			if (opts !== false) {
				data.spinner = new Spinner($.extend({
					color: $this.css('color')
				}, opts)).spin(this);
			}
		});
		return this;
	};

	/**
	* Enables loader.
	*/
	this.enable = function() {
		$('#loader').show();
		$('#spinLoader').spin(opts);
	};

	/**
	* Disables loader.
	*/
	this.disable = function() {
		$('#loader').hide();
		$('#spinLoader').spin(false);
	};
}
