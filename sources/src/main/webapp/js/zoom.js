/**
 * @constructor
 * @param {float} defaultScale Default zoom scale.
 */
function Zoom(defaultScale) {
	/** @prop {float} scale Current zoom scale. */
	this.scale = defaultScale || 1;
	
	var steps = [ 0.1, 0.25, 0.4, 0.55, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.45, 1.6, 1.75, 1.9, 2.5, 3.5, 5 ];
	var step = steps.indexOf(this.scale);
	
	/**
	 * Zoom in. If the current scale is maximal, it does nothing.
	 */
	this.zoomIn = function() {
		if (step === steps.length - 1) return;

		if (step === 0) {
			document.querySelector('#zoomOut').classList.remove('disabled');
			document.querySelector('#zoomOut img').src = 'images/zoom_out.png';
		}

		step++;
		zoomChanged.call(this);

		if (step === steps.length - 1) {
			document.querySelector('#zoomIn').classList.add('disabled');
			document.querySelector('#zoomIn img').src = 'images/zoom_in_disabled.png';
		}
	};
	
	/**
	 * Zoom out. If the current scale is minimal, it does nothing.
	 */
	this.zoomOut = function() {
		if (step === 0) return;

		if (step === steps.length - 1) {
			document.querySelector('#zoomIn').classList.remove('disabled');
			document.querySelector('#zoomIn img').src = 'images/zoom_in.png';
		}

		step--;
		zoomChanged.call(this);

		if (step === 0) {
			document.querySelector('#zoomOut').classList.add('disabled');
			document.querySelector('#zoomOut img').src = 'images/zoom_out_disabled.png';
		}
	};
	
	/**
	 * Change current zoom scale according to currently selected step.
	 */
	function zoomChanged() {
		this.scale = steps[step];
		
		document.getElementById('zoomValue').innerText = Math.round(this.scale * 100) + '%';
		document.getElementById('graph').setAttribute('transform', 'scale(' + this.scale + ')');

		// TODO: zoom to mouse position / center
		
		app.redrawEdges();
	}
}
