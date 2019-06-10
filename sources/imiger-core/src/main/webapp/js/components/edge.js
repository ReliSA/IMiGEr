/**
 * Class representing an edge of a graph in viewport.
 */
class Edge {
	/**
	 * @constructor
	 * @param {object} props Properties of the edge.
	 */
	constructor(props) {
		/** @prop {integer} id Unique identifier of the edge. */
		this.id = props.id;
		/** @prop {array} subedgeInfo */
		this.subedgeInfo = props.subedgeInfo;

		this._isHidden = false;
		this._isDimmed = false;
		this._isHighlighted = false;
		this._isHighlightedAsRequired = false;
		this._isHighlightedAsProvided = false;

		this._fromNode = null;
		this._toNode = null;

		this._start = null;
		this._end = null;
	}

	/**
	 * Sets origin vertex of the edge without moving the starting point.
	 * @param {Vertex} node Vertex that this edge is going from.
	 */
	set from(node) {
		if (!(node instanceof Vertex)) {
			throw new TypeError(node.toString() + ' is not an instance of Vertex');
		}

		this._fromNode = node;
		this._start = node.center;
	}

	/**
	 * @returns {Vertex} origin vertex of the edge.
	 */
	get from() {
		return this._fromNode;
	}
	
	/**
	 * Sets target vertex of the edge without moving the ending point.
	 * @param {Vertex} node Vertex that this edge is going to.
	 */
	set to(node) {
		if (!(node instanceof Vertex)) {
			throw new TypeError(node.toString() + ' is not an instance of Vertex');
		}

		this._toNode = node;
		this._end = node.center;
	}
	
	/**
	 * @returns {Vertex} target vertex of the edge
	 */
	get to() {
		return this._toNode;
	}
	
	/**
	 * Moves starting point of the edge to new coordinates and rotates the lollipop.
	 * @param {Coordinates} coords New starting coordinates of the edge.
	 */
	set start(coords) {
		if (!(coords instanceof Coordinates)) {
			throw new TypeError(coords.toString() + ' is not an instance of Coordinates');
		}

		this._start = coords;

		this._lineElements.forEach(line => {
			line.setAttribute('x1', this._start.x);
			line.setAttribute('y1', this._start.y);
		});

		// icon position and rotation
		let position = this._iconPosition;
		let rotation = this._iconRotation;

		this._iconElement.setAttribute('transform', `rotate(${rotation}, ${position.x},${position.y}) translate(${position.x},${position.y})`);
	}

	/**
	 * Moved ending point of the edge to new coordinates and rotates the arrow.
	 * @param {Coordinates} coords New ending coordinates of the edge.
	 */
	set end(coords) {
		if (!(coords instanceof Coordinates)) {
			throw new TypeError(coords.toString() + ' is not an instance of Coordinates');
		}

		this._end = coords;

		this._lineElements.forEach(line => {
			line.setAttribute('x2', this._end.x);
			line.setAttribute('y2', this._end.y);
		});
		
		// icon position and rotation
		let position = this._iconPosition;
		let rotation = this._iconRotation;

		this._iconElement.setAttribute('transform', `rotate(${rotation}, ${position.x},${position.y}) translate(${position.x},${position.y})`);
	}

	/**
	 * Toggles visibility of the edge.
	 * @param {boolean} newValue True to hide the edge, false to display it.
	 */
	set isHidden(newValue) {
		this._isHidden = newValue;

		if (newValue) {
			this._rootElement.classList.add('hidden');
		} else {
			this._rootElement.classList.remove('hidden');
		}
	}

	/**
	 * Toggles transparency of the edge.
	 * @param {boolean} newValue True to set the edge semitransparent, false to display it normally.
	 */
	set isDimmed(newValue) {
		this._isDimmed = newValue;

		if (newValue) {
			this._rootElement.classList.add('edge--dimmed');
		} else {
			this._rootElement.classList.remove('edge--dimmed');
		}
	}

	/**
	 * @returns true if the edge is currently highlighted (in any way), otherwise false
	 */
	get isHighlighted() {
		return this._isHighlighted;
	}

	/**
	 * Toggles highlighting of the edge.
	 * @param {boolean} newValue True to highlight the edge, false to unhighlight.
	 */
	set isHighlighted(newValue) {
		this._isHighlighted = newValue;

		if (newValue) {
			this._rootElement.classList.add('edge--highlighted');
		} else {
			this._rootElement.classList.remove('edge--highlighted');
		}
	}
	
	/**
	 * Toggles highlighting of the edge between vertex and its requirement.
	 * @param {boolean} newValue True to highlight the edge as required, false to unhighlight.
	 */
	set isHighlightedAsRequired(newValue) {
		this._isHighlightedAsRequired = newValue;

		if (newValue) {
			this._rootElement.classList.add('edge--highlighted-as-required');
			this._rootElement.classList.remove('edge--highlighted-as-provided');

		} else {
			this._rootElement.classList.remove('edge--highlighted-as-required');
		}
	}
	
	/**
	 * Toggles highlighting of the edge between vertex and its dependent.
	 * @param {boolean} newValue True to highlight the edge as provided, false to unhighlight.
	 */
	set isHighlightedAsProvided(newValue) {
		this._isHighlightedAsProvided = newValue;

		if (newValue) {
			this._rootElement.classList.remove('edge--highlighted-as-required');
			this._rootElement.classList.add('edge--highlighted-as-provided');

		} else {
			this._rootElement.classList.remove('edge--highlighted-as-provided');
		}
	}

	/**
	 * Creates a new DOM element representing the edge in memory. Binds user interactions to local handler functions.
	 * @returns {Element} SVG DOM element.
	 */
	render() {
		// icon
		let position = this._iconPosition;
		let rotation = this._iconRotation;

		this._iconElement = DOM.s('g', {
			class: 'arrow',
			transform: `rotate(${rotation}, ${position.x},${position.y}) translate(${position.x},${position.y})`,
			onClick: this._onEdgeClick.bind(this),
		}, [
			DOM.s('polygon', {
				points: '0,-10 30,0 0,10',
			}),
		]);

		// lines
		this._lineElements = [
			DOM.s('line', {
				class: 'line',
				x1: this._start.x,
				y1: this._start.y,
				x2: this._end.x,
				y2: this._end.y,
				stroke: 'white',
				'stroke-width': 5,
			}),
			DOM.s('line', {
				class: 'line',
				x1: this._start.x,
				y1: this._start.y,
				x2: this._end.x,
				y2: this._end.y,
			}),
		];

		// root
		this._rootElement = DOM.s('g', {
			class: 'edge',
			'data-id': this.id,
			'data-from': this.from.name,
			'data-to': this.to.name,
		}, [].concat(this._lineElements, this._iconElement));

		return this._rootElement;
	}
	
	/**
	 * Removes the DOM element representing the edge from document.
	 */
	remove() {
		this._rootElement.remove();
	}

	/**
	 * Exports the edge to a new, plain JS object.
	 * @returns {Object} exported edge
	 */
	export() {
		return {
			subedgeInfo: this.subedgeInfo,
			from: this.from.id,
			to: this.to.id,
			text: '',
			id: this.id,
		};
	}

	/**
	 * Edge click interaction. Highlights the edge and vertices related to it. Reveals edge popover.
	 * @param {Event} e Click event.
	 */
	_onEdgeClick(e) {
		app.viewportComponent.edgePopoverComponent.body = this.subedgeInfo;
		app.viewportComponent.edgePopoverComponent.position = new Coordinates(e.clientX, e.layerY);
		app.viewportComponent.edgePopoverComponent.open();

		// unhighlight other edges
		app.edgeList.filter(edge => {
			return edge !== this;
		}).forEach(edge => {
			edge.from.isHighlighted = false;
			edge.to.isHighlighted = false;
			edge.isHighlighted = false;
		});

		// highlight this edge
		this.from.isHighlighted = !this.isHighlighted;
		this.to.isHighlighted = !this.isHighlighted;
		this.isHighlighted = !this.isHighlighted;
	}

	/**
	 * @returns {Coordinates} Current position of the icon.
	 */
	get _iconPosition() {
		// icon is placed at 2/3 of the distance from start to end
		return new Coordinates(
			(this._start.x + 2 * this._end.x) / 3,
			(this._start.y + 2 * this._end.y) / 3,
		);
	}

	/**
	 * @returns {float} Current rotation of the icon in degrees.
	 */
	get _iconRotation() {
		return -1 * Math.atan2(this._end.x - this._start.x, this._end.y - this._start.y) * 180 / Math.PI + 90;
	}
}
