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
		
		// arrow position and rotation
		var position = getArrowPosition.call(this);
		var rotation = getArrowRotation.call(this);

		var arrow = rootElement.querySelector('.arrow');
		arrow.setAttribute('transform', `rotate(${rotation}, ${position.x},${position.y}) translate(${position.x},${position.y})`);
	};
	
	/**
	 * Moved ending point of the edge to new coordinates and rotates the arrow.
	 * @param {Coordinates} coords New ending coordinates of the edge.
	 */
	this.moveEnd = function(coords) {
		setEnd(coords);
		
		var lines = rootElement.querySelectorAll('.line');
		lines.forEach(function(line) {
			line.setAttribute('x2', end.x);
			line.setAttribute('y2', end.y);
		});
		
		// arrow position and rotation
		var position = getArrowPosition.call(this);
		var rotation = getArrowRotation.call(this);

		var arrow = rootElement.querySelector('.arrow');
		arrow.setAttribute('transform', `rotate(${rotation}, ${position.x},${position.y}) translate(${position.x},${position.y})`);
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
     * @returns true if the edge is currently highlighted (in any way), otherwise false
     */
	this.isHighlighted = function () {
		return highlighted;
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

		// arrow position and rotation
		var position = getArrowPosition.call(this);
		var rotation = getArrowRotation.call(this);
		
		// arrow
		var arrow = app.utils.createSvgElement('g', {
			'class': 'arrow',
			'data-edgeId': this.id,
			'transform': `rotate(${rotation}, ${position.x},${position.y}) translate(${position.x},${position.y})`,
		});
		arrow.appendChild(app.utils.createSvgElement('polygon', {
			'points': '0,-10 30,0 0,10',

		}));
		arrow.addEventListener('click', click.bind(this));
		rootElement.appendChild(arrow);

		return rootElement;
	};
	
	/**
	 * Removes the DOM element representing the edge from document.
	 */
	this.remove = function() {
		rootElement.remove();
	};

	/**
	 * Exports the edge to a new, plain JS object.
	 * @returns {Object} exported edge
	 */
	this.export = function() {
		return {
			subedgeInfo: props.subedgeInfo,
			from: this.getFrom().id,
			to: this.getTo().id,
			text: '',
			id: this.id,
		};
	};

	/**
	 * Edge click interaction. Highlights the edge and vertices related to it. Reveals edge popover.
	 * @param {Event} e Click event.
	 */
	function click(e) {
		app.viewportComponent.edgePopoverComponent.setContent(props.subedgeInfo);
		app.viewportComponent.edgePopoverComponent.setPosition(new Coordinates(e.clientX, e.clientY));
		app.viewportComponent.edgePopoverComponent.open();

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
	 * @returns {Coordinates} Current position of the arrow.
	 */
	function getArrowPosition() {
		// arrow is placed at 2/3 of the distance from start to end
		return new Coordinates(
			(start.x + 2 * end.x) / 3,
			(start.y + 2 * end.y) / 3,
		);
	}
	
	/**
	 * @returns {float} Current rotation of the arrow in degrees.
	 */
	function getArrowRotation() {
		return -1 * Math.atan2(end.x - start.x, end.y - start.y) * 180 / Math.PI + 90;
	}
}
