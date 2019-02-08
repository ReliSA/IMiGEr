class Zoom {
	/**
	 * @param {float} scale Default zoom scale.
	 */
	constructor(scale = 1) {
		this.scale = scale;

		this._steps = [ 0.1, 0.25, 0.4, 0.55, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.45, 1.6, 1.75, 1.9, 2.5, 3.5, 5 ];
		this._step = this._steps.indexOf(this.scale);
	}

	/**
	 * Zoom in. If the current scale is maximal, it does nothing.
	 */
	zoomIn() {
		if (this._step === this._steps.length - 1) return;

		if (this._step === 0) {
			document.querySelector('#zoomOut').classList.remove('disabled');
			document.querySelector('#zoomOut img').src = 'images/zoom_out.png';
		}

		this._step++;
		this._onChange();

		if (this._step === this._steps.length - 1) {
			document.querySelector('#zoomIn').classList.add('disabled');
			document.querySelector('#zoomIn img').src = 'images/zoom_in_disabled.png';
		}
	}
	
	/**
	 * Zoom out. If the current scale is minimal, it does nothing.
	 */
	zoomOut() {
		if (this._step === 0) return;

		if (this._step === this._steps.length - 1) {
			document.querySelector('#zoomIn').classList.remove('disabled');
			document.querySelector('#zoomIn img').src = 'images/zoom_in.png';
		}

		this._step--;
		this._onChange();

		if (this._step === 0) {
			document.querySelector('#zoomOut').classList.add('disabled');
			document.querySelector('#zoomOut img').src = 'images/zoom_out_disabled.png';
		}
	}
	
	/**
	 * Change current zoom scale according to currently selected step.
	 */
	_onChange() {
		this.scale = this._steps[this._step];
		
		document.getElementById('zoomValue').innerText = Math.round(this.scale * 100) + '%';
		document.getElementById('graph').setAttribute('transform', 'scale(' + this.scale + ')');

		// TODO: zoom to mouse position / center

		app.redrawEdges();
	}
}
