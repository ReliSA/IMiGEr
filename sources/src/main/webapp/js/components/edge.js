/**
 * Class representing an edge of a graph in viewport.
 * @constructor
 * @param {object} props Properties of the edge.
 */
function Edge(props) {
	/** @prop {integer} id Unique identifier of the edge. */
	this.id = props.id;

	var rootElement;

	var hidden = false;
	var dimmed = false;
	var highlighted = false;
	var highlightedRequired = false;
	var highlightedProvided = false;

	var fromNode = null;
	var toNode = null;

	var start = new Coordinates(0, 0);
	var end = new Coordinates(0, 0);
	
	/**
	 * Sets origin vertex of the edge without moving the starting point.
	 * @param {Vertex} node Vertex that this edge is going from.
	 */
	this.setFrom = function(node) {
		if (!(node instanceof Vertex)) {
			throw new TypeError(node.toString() + 'is not instance of Vertex');
		}

		fromNode = node;

		setStart(node.getCenter());
	};
	
	/**
	 * Returns origin vertex of the edge.
	 */
	this.getFrom = function() {
		return fromNode;
	};
	
	/**
	 * Sets target vertex of the edge without moving the ending point.
	 * @param {Vertex} node Vertex that this edge is going to.
	 */
	this.setTo = function(node) {
		if (!(node instanceof Vertex)) {
			throw new TypeError(node.toString() + 'is not instance of Vertex');
		}

		toNode = node;

		setEnd(node.getCenter());
	};
	
	/**
	 * Returns target vertex of the edge.
	 */
	this.getTo = function() {
		return toNode;
	};
	
	/**
	 * Moves starting point of the edge to new coordinates and rotates the lollipop.
	 * @param {Coordinates} coords New starting coordinates of the edge.
	 */
	this.moveStart = function(coords) {
		setStart(coords);
		
		var lines = rootElement.querySelectorAll('.line');
		lines.forEach(function(line) {
			line.setAttribute('x1', start.x);
			line.setAttribute('y1', start.y);
		});
		
		// lollipop position and rotation
		var position = getLollipopPosition.call(this);
		var rotation = getLollipopRotation.call(this);

		var lollipop = rootElement.querySelector('.lollipop');
		lollipop.setAttribute('transform', `rotate(${rotation}, ${position.x},${position.y}) translate(${position.x},${position.y})`);
	};
	
	/**
	 * Moved ending point of the edge to new coordinates and rotates the lollipop.
	 * @param {Coordinates} coords New ending coordinates of the edge.
	 */
	this.moveEnd = function(coords) {
		setEnd(coords);
		
		var lines = rootElement.querySelectorAll('.line');
		lines.forEach(function(line) {
			line.setAttribute('x2', end.x);
			line.setAttribute('y2', end.y);
		});
		
		// lollipop position and rotation
		var position = getLollipopPosition.call(this);
		var rotation = getLollipopRotation.call(this);

		var lollipop = rootElement.querySelector('.lollipop');
		lollipop.setAttribute('transform', `rotate(${rotation}, ${position.x},${position.y}) translate(${position.x},${position.y})`);
	};

	/**
	 * Toggles visibility of the edge.
	 * @param {boolean} newValue True to hide the edge, false to display it.
	 */
	this.setHidden = function(newValue) {
		hidden = newValue;

		if (newValue) {
			rootElement.classList.add('hidden');
		} else {
			rootElement.classList.remove('hidden');
		}
	};

	/**
	 * Toggles transparency of the edge.
	 * @param {boolean} newValue True to set the edge semitransparent, false to display it normally.
	 */
	this.setDimmed = function(newValue) {
		dimmed = newValue;

		if (newValue) {
			rootElement.classList.add('edge--dimmed');
		} else {
			rootElement.classList.remove('edge--dimmed');
		}
	};

	/**
	 * Toggles highlighting of the edge.
	 * @param {boolean} newValue True to highlight the edge, false to unhighlight.
	 */
	this.setHighlighted = function(newValue) {
		highlighted = newValue;

		if (newValue) {
			rootElement.classList.add('edge--highlighted');
		} else {
			rootElement.classList.remove('edge--highlighted');
		}
	};
	
	/**
	 * Toggles highlighting of the edge between vertex and its requirement.
	 * @param {boolean} newValue True to highlight the edge as required, false to unhighlight.
	 */
	this.setHighlightedRequired = function(newValue) {
		highlightedRequired = newValue;

		if (newValue) {
			rootElement.classList.add('edge--highlighted-required');
			rootElement.classList.remove('edge--highlighted-provided');

		} else {
			rootElement.classList.remove('edge--highlighted-required');
		}
	};
	
	/**
	 * Toggles highlighting of the edge between vertex and its dependent.
	 * @param {boolean} newValue True to highlight the edge as provided, false to unhighlight.
	 */
	this.setHighlightedProvided = function(newValue) {
		highlightedProvided = newValue;

		if (newValue) {
			rootElement.classList.remove('edge--highlighted-required');
			rootElement.classList.add('edge--highlighted-provided');

		} else {
			rootElement.classList.remove('edge--highlighted-provided');
		}
	};
	
	/**
	 * Creates a new DOM element representing the edge in memory. Binds user interactions to local handler functions.
	 * @returns {Element} SVG DOM element.
	 */
	this.render = function() {
		rootElement = app.utils.createSvgElement('g', {
			'class': 'edge',
			'data-id': props.id,
			'data-from': props.from,
			'data-to': props.to,
		});

		rootElement.appendChild(app.utils.createSvgElement('line', {
			'class': 'line',
			'x1': start.x,
			'y1': start.y,
			'x2': end.x,
			'y2': end.y,
			'stroke': 'white',
			'stroke-width': 5,
		}));
		
		rootElement.appendChild(app.utils.createSvgElement('line', {
			'class': 'line',
			'x1': start.x,
			'y1': start.y,
			'x2': end.x,
			'y2': end.y,
		}));

		// lollipop position and rotation
		var position = getLollipopPosition.call(this);
		var rotation = getLollipopRotation.call(this);
		
		// lollipop
		var lollipop = app.utils.createSvgElement('g', {
			'class': 'lollipop lollipop--cross',
			'transform': `rotate(${rotation}, ${position.x},${position.y}) translate(${position.x},${position.y})`,
		});
		lollipop.appendChild(app.utils.createSvgElement('path', {
			'd': 'M0,-12 C16,-12 16,12 0,12',
		}));
		lollipop.appendChild(app.utils.createSvgElement('circle', {
			'cx': 0,
			'cy': 0,
			'r': 8,
		}));
		lollipop.addEventListener('click', click.bind(this));
		rootElement.appendChild(lollipop);

		if (compatible) {
			// tick
			lollipop.appendChild(app.utils.createSvgElement('line', {
				'x1': 6,
				'y1': -4,
				'x2': -4,
				'y2': 6,
				'transform': 'rotate(90)',
			}));
			lollipop.appendChild(app.utils.createSvgElement('line', {
				'x1': -5,
				'y1': -3,
				'x2': -4,
				'y2': 5,
				'transform': 'rotate(90)',
			}));

		} else {
			// cross
			lollipop.appendChild(app.utils.createSvgElement('line', {
				'x1': -5,
				'y1': -5,
				'x2': 5,
				'y2': 5,
			}));
			lollipop.appendChild(app.utils.createSvgElement('line', {
				'x1': -5,
				'y1': 5,
				'x2': 5,
				'y2': -5,
			}));
		}

		return rootElement;
	};
	
	/**
	 * Removes the DOM element representing the edge from document.
	 */
	this.remove = function() {
		rootElement.remove();
	};

	/**
	 * Edge click interaction. Highlights the edge and vertices related to it. Reveals edge popover.
	 * @param {Event} e Click event.
	 */
	function click(e) {

		// unhighlight other edges
		app.edgeList.filter(function(edge) {
			return edge !== this;
		}, this).forEach(function(edge) {
			edge.setHighlighted(false);
			edge.getFrom().setHighlighted(false);
			edge.getTo().setHighlighted(false);
		});

		// highlight this edge
		this.setHighlighted(!highlighted);
		this.getFrom().setHighlighted(highlighted);
		this.getTo().setHighlighted(highlighted);
	}
	
	/**
	 * Sets new coordinates of the starting point of the edge.
	 * @param {Coordinates} coords New starting coordinates of the edge.
	 */
	function setStart(coords) {
		if (!(coords instanceof Coordinates)) {
			throw new TypeError(coords.toString() + 'is not instance of Coordinates');
		}

		start = coords;
	}
	
	/**
	 * Sets new coordinates of the ending point of the edge.
	 * @param {Coordinates} coords New ending coordinates of the edge.
	 */
	function setEnd(coords) {
		if (!(coords instanceof Coordinates)) {
			throw new TypeError(coords.toString() + 'is not instance of Coordinates');
		}

		end = coords;
	}
	
	/**
	 * @returns {Coordinates} Current position of the lollipop.
	 */
	function getLollipopPosition() {
		// lollipop is placed at 1/3 of the distance from start to end
		return new Coordinates(
			(2 * start.x + end.x) / 3,
			(2 * start.y + end.y) / 3,
		);
	}
	
	/**
	 * @returns {float} Current rotation of the lollipop in degrees.
	 */
	function getLollipopRotation() {
		return -1 * Math.atan2(end.x - start.x, end.y - start.y) * 180 / Math.PI + 90;
	}
}
