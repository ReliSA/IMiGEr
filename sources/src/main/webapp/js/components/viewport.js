/**
 * @constructor
 */
function Viewport() {
	/** @prop {VertexContextMenuList} contextMenuComponent */
	this.contextMenuComponent = null;
	/** @prop {VertexPopoverComponent} vertexPopoverComponent */
	this.vertexPopoverComponent = null;
	/** @prop {EdgePopoverComponent} edgePopoverComponent */
	this.edgePopoverComponent = null;

	/** @prop {ForceDirected} forceDirected */
	this.forceDirected = new ForceDirected;

	var rootElement;
	var innerSvgElement;
	var edgesContainer;
	var verticesContainer;
	var groupsContainer;

	var pan = false;

	var edgeList = [];
	var nodeList = [];
	var vertexList = [];
	var groupList = [];

	this.addEdge = function(edge) {
		if (!(edge instanceof Edge)) {
			throw new TypeError(edge.toString() + 'is not instance of Edge');
		}

		edgeList.push(edge);

		if (edge.getFrom() === null || edge.getFrom().isExcluded()) return;
		if (edge.getTo() === null || edge.getTo().isExcluded()) return;

		edgesContainer.appendChild(edge.render());
	};

	this.addVertex = function(vertex) {
		if (!(vertex instanceof Vertex)) {
			throw new TypeError(vertex.toString() + 'is not instance of Vertex');
		}

		nodeList.push(vertex);
		vertexList.push(vertex);

		verticesContainer.appendChild(vertex.render());
	};

	this.removeVertex = function(vertex) {
		if (!(vertex instanceof Vertex)) {
			throw new TypeError(vertex.toString() + 'is not instance of Vertex');
		}

		nodeList.splice(nodeList.indexOf(vertex), 1);
		vertexList.splice(vertexList.indexOf(vertex), 1);
	};

	this.addGroup = function(group) {
		if (!(group instanceof Group)) {
			throw new TypeError(group.toString() + 'is not instance of Group');
		}

		nodeList.push(group);
		groupList.push(group);

		groupsContainer.appendChild(group.render());
	};

	this.removeGroup = function(group) {
		if (!(group instanceof Group)) {
			throw new TypeError(group.toString() + 'is not instance of Group');
		}

		nodeList.splice(nodeList.indexOf(group), 1);
		groupList.splice(vertexList.indexOf(group), 1);
	};
	
	this.getEdgeList = function() {
		return edgeList;
	};
	
	this.getNodeList = function() {
		return nodeList;
	};
	
	this.getVertexList = function() {
		return vertexList;
	};
	
	this.getGroupList = function() {
		return groupList;
	};

	this.getPosition = function() {
		return new Coordinates(
			+innerSvgElement.getAttribute('x'),
			+innerSvgElement.getAttribute('y'),
		);
	};

	this.center = function() {
		var sumOfCenters = new Coordinates(0, 0);
		var bbox = rootElement.getBoundingClientRect();

		var vertexList = app.viewportComponent.getVertexList();
		vertexList.forEach(function(vertex) {
			var center = vertex.getCenter();

			sumOfCenters.x += center.x;
			sumOfCenters.y += center.y;
		});

		innerSvgElement.setAttribute('x', -1 * sumOfCenters.x / vertexList.length + bbox.width / 2);
		innerSvgElement.setAttribute('y', -1 * sumOfCenters.y / vertexList.length + bbox.height / 2);
	};
	
	this.render = function() {
		rootElement = app.utils.createHtmlElement('div', {
			'class': 'viewport',
			'id': 'viewport',
		});
		rootElement.addEventListener('wheel', onMouseWheel.bind(this));
		rootElement.addEventListener('mousedown', onMouseDown.bind(this));

		var mainSvg = app.utils.createSvgElement('svg', {
			'xmlns': 'http://www.w3.org/2000/svg',
			'width': '100%',
			'height': '100%',
			'style': 'margin-bottom: -4px;',
		})
		rootElement.appendChild(mainSvg);
		
		innerSvgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		innerSvgElement.setAttribute('x', 0);
		innerSvgElement.setAttribute('y', 0);
		innerSvgElement.setAttribute('id', 'svg1');
		innerSvgElement.setAttribute('style', 'overflow: visible;');
		mainSvg.appendChild(innerSvgElement);
		
		var graph = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		graph.setAttribute('id', 'graph');
		innerSvgElement.appendChild(graph);
		
		edgesContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		edgesContainer.setAttribute('data-id', 'edges');
		graph.appendChild(edgesContainer);

		verticesContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		verticesContainer.setAttribute('data-id', 'vertices');
		graph.appendChild(verticesContainer);

		groupsContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		groupsContainer.setAttribute('data-id', 'groups');
		graph.appendChild(groupsContainer);

		var defs = app.utils.createSvgElement('defs', {});
		mainSvg.appendChild(defs);

		var linearGradient = app.utils.createSvgElement('linearGradient', {
			'id': 'node--highlighted-required-provided',
		});
		linearGradient.appendChild(app.utils.createSvgElement('stop', {
			'offset': '0%',
			'stop-color': 'red',
		}));
		linearGradient.appendChild(app.utils.createSvgElement('stop', {
			'offset': '100%',
			'stop-color': '#5896ff',
		}));
		defs.appendChild(linearGradient);

		this.contextMenuComponent = new VertexContextMenuList;
		rootElement.appendChild(this.contextMenuComponent.render());

		this.vertexPopoverComponent = new VertexPopover;
		rootElement.appendChild(this.vertexPopoverComponent.render());

		this.edgePopoverComponent = new EdgePopover;
		rootElement.appendChild(this.edgePopoverComponent.render());

		return rootElement;
	};

	this.reset = function() {
		edgeList = [];
		nodeList = [];
		vertexList = [];
		groupList = [];

		$(edgesContainer).empty();
		$(verticesContainer).empty();
		$(groupsContainer).empty();
	};

	function onMouseWheel(e) {
		app.closeFloatingComponents();

		// prevent pinch-to-zoom gesture from zooming the whole page
		if (e.ctrlKey) {	// pinch gesture is mapped as mouse wheel with control key pressed
			e.preventDefault();
		}

		if (e.deltaY < 0) {
			app.zoom.zoomIn(new Coordinates(e.offsetX, e.offsetY));
		} else {
			app.zoom.zoomOut(new Coordinates(e.offsetX, e.offsetY));
		}
	}

	function onMouseDown(e) {
		pan = true;

		var start = new Coordinates(e.clientX, e.clientY);
		var position = this.getPosition();

		document.body.addEventListener('mousemove', mouseMove);
		document.body.addEventListener('mouseup', mouseUp);
		
		function mouseMove(e) {
			if (!pan) return;
			
			e.preventDefault();
			
			innerSvgElement.setAttribute('x', position.x - (start.x - e.clientX));
			innerSvgElement.setAttribute('y', position.y - (start.y - e.clientY));
		}

		function mouseUp(e) {
			pan = false;
			
			start = null;
			position = null;

			document.body.removeEventListener('mousemove', mouseMove);
			document.body.removeEventListener('mouseup', mouseUp);
			
			app.redrawEdges();
		}
	}
}
