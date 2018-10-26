/**
 * Class representing a floating point connecting a node present in the viewport with a node excluded to the sidebar. Position 
 * of a floating point is changed every time when graph is moved or zoomed, node is moved in viewport or sidebar is scrolled.
 * @constructor
 */
function FloatingPoint() {
	var rootElement;

	var node;
	var position = new Coordinates(0, 0);

	var inEdgeList = [];
	var outEdgeList = [];

	/**
	 * Sets a DOM element in sidebar that this floating point is bound to. It is used to calculate floating point position
	 * when sidebar is scrolled.
	 * @param {Element} newValue DOM element in sidebar the floating point is bound to.
	 */
	this.setElement = function(newValue) {
		rootElement = newValue;
	};

	/**
	 * Sets a graph node (vertex or group) that this floating point is bound to. This node is then highlighted when the other
	 * node of the edge is clicked.
	 * @param {(Vertex|Group)} newValue Graph node the floating point is bound to.
	 */
	this.setNode = function(newValue) {
		node = newValue;
	};
	
	/**
	 * Adds a new edge ending in this floating point. Its ending point is moved to the current position of the floating point.
	 * @param {Edge} edge Edge going to the floating point.
	 */
	this.addInEdge = function(edge) {
		if (!(edge instanceof Edge)) {
			throw new TypeError(edge.toString() + 'is not instance of Edge');
		}

		edge.moveEnd(this.getPosition());
		
		inEdgeList.push(edge);
	};
	
	/**
	 * Adds a new edge starting in this floating point. Its starting point is moved to the current position of the floating point.
	 * @param {Edge} edge Edge going from the floating point.
	 */
	this.addOutEdge = function(edge) {
		if (!(edge instanceof Edge)) {
			throw new TypeError(edge.toString() + 'is not instance of Edge');
		}

		edge.moveStart(this.getPosition());
		
		outEdgeList.push(edge);
	};

	/**
	 * @returns {array<Edge>} Array of edges going to the floating point.
	 */
	this.getInEdgeList = function() {
		return inEdgeList;
	};

	/**
	 * @returns {array<Edge>} Array of edges going from the floating point.
	 */
	this.getOutEdgeList = function() {
		return outEdgeList;
	};

	/**
	 * @returns {Coordinates} Current position of the floating point.
	 */
	this.getPosition = function() {
		return position;
	};

	/**
	 * Updates the current position of vertices related to the floating point.
	 */
	this.setPosition = function() {
		var bbox = rootElement.getBoundingClientRect();
		var viewportPosition = app.viewportComponent.getPosition();

		position.x = (bbox.left - viewportPosition.x);
		position.y = (bbox.top - viewportPosition.y - app.headerComponent.height - app.navbarComponent.height);

		if (node instanceof Vertex) {
			var edgeOffsetY = 10;
		} else if (node instanceof Group) {
			var edgeOffsetY = 35;
		} else {
			var edgeOffsetY = 0;
		}

		var archetypeList = Object.keys(node.getRelatedArchetypeMap()).map(function(archetypeIndex) {
			return parseInt(archetypeIndex);
		});
		var archetypeIconOrder;

		// redraw dependent edges
		inEdgeList.forEach(function(edge) {
			archetypeIconOrder = archetypeList.indexOf(edge.getFrom().archetype);

			edge.moveEnd(new Coordinates(
				position.x / app.zoom.scale,
				(position.y + edgeOffsetY + archetypeIconOrder * 20) / app.zoom.scale,
			));
		}, this);

		outEdgeList.forEach(function(edge) {
			archetypeIconOrder = archetypeList.indexOf(edge.getTo().archetype);

			edge.moveStart(new Coordinates(
				position.x / app.zoom.scale,
				(position.y + edgeOffsetY + archetypeIconOrder * 20) / app.zoom.scale,
			));
		}, this);
	};

	/**
	 * @returns {Coordinates} Centre of this floating point.
	 */
	this.getCenter = function() {
		return position;
	};

	/**
	 * Always returns false as floating points may never be excluded. It is here for FloatingPoint to be compatible with API of Vertex.
	 * @see Vertex
	 * @returns {boolean} Always false.
	 */
	this.isExcluded = function() {
		return false;
	};

	/**
	 * Does nothing as floating points may never be dimmed. It is here for FloatingPoint to be compatible with API of Vertex.
	 * @see Vertex
	 * @param {boolean} newValue Anything.
	 */
	this.setDimmed = function(newValue) {
		// do nothing
	};

	/**
	 * Toggles highlighting of the depedent node.
	 * @param {boolean} newValue True to highlight the node as required, otherwise false.
	 */
	this.setHighlightedRequired = function(newValue) {
		node.setHighlightedRequired(newValue);
	};

	/**
	 * Toggles highlighting of the depedent node.
	 * @param {boolean} newValue True to highlight the node as provided, otherwise false.
	 */
	this.setHighlightedProvided = function(newValue) {
		node.setHighlightedProvided(newValue);
	};
}
