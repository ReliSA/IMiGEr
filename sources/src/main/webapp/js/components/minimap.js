/**
 * Class representing minimap of the viewport displayed in sidebar. It is used to have a quick overview of the current viewport layout.
 */
class Minimap {
	/**
	 * @constructor
	 * @param {string} useElement ID of SVG element to display in minimap.
	 * @param {float} scale Ratio to scale down the displayed element.
	 */
	constructor(useElement, scale = 0.1) {
		this._width = 350;
		this._height = 200;
		this._useElement = useElement;
		this._scale = scale;
	}

	/**
	 * Creates a new DOM element representing the minimap in memory.
	 * @public
	 * @returns {SVGElement} SVG DOM element.
	 */
	render() {
		this._viewportElement = DOM.s('rect', {
			class: 'minimap-viewport',
			onMouseDown: this._onViewportMouseDown.bind(this),
		});

		this._rootElement = DOM.s('svg', {
			class: 'minimap',
			id: 'minimapComponent',
			viewBox: `-100 -50 ${this._width} ${this._height}`,
			onMouseDown: this._onRootMouseDown.bind(this),
		}, [
			DOM.s('use', {
				transform: `scale(${this._scale})`,
				href: this._useElement,
			}),
			this._viewportElement,
		]);

		return this._rootElement;
	}

	/**
	 * Resizes the minimap viewport using current viewport size and minimap scale.
	 * @public
	 * @param {Dimensions} dimensions Object holding current dimensions of the viewport component.
	 */
	set viewportSize(dimensions) {
		this._viewportElement.setAttribute('width', dimensions.width * this._scale);
		this._viewportElement.setAttribute('height', dimensions.height * this._scale);
	}

	/**
	 * @public
	 * @returns {Coordinates} Current coordinates of the viewport.
	 */
	get viewportPosition() {
		return new Coordinates(
			+this._viewportElement.getAttribute('x'),
			+this._viewportElement.getAttribute('y'),
		);
	}

	/**
	 * Moves the minimap viewport to a new position based on current viewport position and minimap scale.
	 * @public
	 * @param {Coordinates} coords Coordinates of the viewport.
	 */
	set viewportPosition(coords) {
		this._viewportElement.setAttribute('x', coords.x * -1 * this._scale);
		this._viewportElement.setAttribute('y', coords.y * -1 * this._scale);
	}

	/**
	 * @private
	 */
	_onRootMouseDown(e) {
		let start = new Coordinates(e.clientX, e.clientY);

		let viewBox = this._rootElement.getAttribute('viewBox').split(' ');
		let minimapRootPosition = new Coordinates(parseInt(viewBox[0]), parseInt(viewBox[1]));

		let that = this;

		document.body.addEventListener('mousemove', mouseMove);
		document.body.addEventListener('mouseup', mouseUp);

		function mouseMove(e) {
			e.preventDefault();

			let offset = new Coordinates(start.x - e.clientX, start.y - e.clientY);

			that._rootElement.setAttribute('viewBox', `${minimapRootPosition.x + offset.x} ${minimapRootPosition.y + offset.y} ${that._width} ${that._height}`);
		}

		function mouseUp() {
			document.body.removeEventListener('mousemove', mouseMove);
			document.body.removeEventListener('mouseup', mouseUp);
		}
	}

	/**
	 * @private
	 */
	_onViewportMouseDown(e) {
		e.stopPropagation();

		let start = new Coordinates(e.clientX, e.clientY);
		let minimapViewportPosition = this.viewportPosition;
		let viewportPosition = app.viewportComponent.getPosition();

		let that = this;

		document.body.addEventListener('mousemove', mouseMove);
		document.body.addEventListener('mouseup', mouseUp);

		function mouseMove(e) {
			e.preventDefault();

			let offset = new Coordinates(start.x - e.clientX, start.y - e.clientY);

			that._viewportElement.setAttribute('x', minimapViewportPosition.x - offset.x);
			that._viewportElement.setAttribute('y', minimapViewportPosition.y - offset.y);

			app.viewportComponent.setPosition(new Coordinates(viewportPosition.x + (1 / that._scale) * offset.x, viewportPosition.y + (1 / that._scale) * offset.y));
		}

		function mouseUp() {
			document.body.removeEventListener('mousemove', mouseMove);
			document.body.removeEventListener('mouseup', mouseUp);
			
			app.redrawEdges();
		}
	}
}
