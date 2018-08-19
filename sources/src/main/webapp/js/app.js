/**
 * Main class of the application.
 * @constructor
 */
function App() {
	/** @prop {Constants} constants */
	this.constants = new Constants;
	/** @prop {GraphLoader} graphLoader */
	this.graphLoader = new GraphLoader;
	/** @prop {GraphExporter} graphExporter */
	this.graphExporter = new GraphExporter;
	/** @prop {GraphHistory} graphHistory */
	this.graphHistory = new GraphHistory;
	/** @prop {Loader} loader */
	this.loader = new Loader;
	/** @prop {Zoom} zoom */
	this.zoom = new Zoom(0.8);
	/** @prop {Utils} utils */
	this.utils = new Utils;
	/** @prop {DOM} dom */
	this.dom = new DOM;
	/** @prop {Cookies} cookies */
	this.cookies = new Cookies;
	/** @prop {MarkSymbol} markSymbol */
	this.markSymbol = new MarkSymbol;

	/** @prop {string} HOME_URL Application home URL. */
	this.HOME_URL = null;
	/** @prop {object} API Application programming interface paths. */
	this.API = {
		loadGraph: 'api/graph-data',
		loadDiagram: 'api/diagram',
	};

	/** @prop {float} headerHeight Current height of the application header. */
	this.headerHeight = getHeaderHeight();

	/** @prop {Sidebar} sidebarComponent */
	this.sidebarComponent = null;
	/** @prop {Viewport} viewportComponent */
	this.viewportComponent = null;

	/** @prop {array<Edge>} edgeList */
	this.edgeList = [];
	/** @prop {array<(Vertex|Group)>} nodeList */
	this.nodeList = [];
	/** @prop {array<Vertex>} vertexList */
	this.vertexList = [];
	/** @prop {array<Group>} groupList */
	this.groupList = [];

	/**
	 * Loads graph using diagram (if available).
	 * @param diagramId Diagram identifier.
	 * @param diagramHash Diagram hash.
	 */
	this.diagramLoader = function(diagramId, diagramHash) {
		return loadGraphData.bind(this, diagramId, diagramHash, null, null);
	};

	/**
	 * Loads graph using EFP data.
	 * @param {boolean} withEfps Is EFPs in graph?
	 * @param {object} efpSettings EFP settings.
	 */
	this.efpLoader = function(withEfps, efpSettings) {
		return loadGraphData.bind(this, null, null, withEfps, efpSettings);
	};

	/**
	 * Initiates the application.
	 * @param {function} startFn Function to be run to load graph data.
	 */
	this.run = function(startFn) {
		console.log('running...');

		bootstrap.call(this);
		startFn.call(this);
	};

	/**
	 * Resets the application to the state as it was when the graph was loaded for the first time.
	 */
	this.reset = function() {
		app.viewportComponent.reset();
		app.sidebarComponent.reset();

		app.edgeList = [];
		app.nodeList = [];
		app.vertexList = [];
		app.groupList = [];
	};

	/**
	 * Finds a vertex by its name.
	 * @param {string} name Name of the searched vertex.
	 */
	this.findVertexByName = function(name) {
		return app.vertexList.find(function(existingVertex) {
			return existingVertex.name == this;
		}, name);
	}

	/**
	 * Closes components floating above viewport (context menu and popovers).
	 */
	this.closeFloatingComponents = function() {
		app.viewportComponent.contextMenuComponent.close();
		app.viewportComponent.vertexPopoverComponent.close();
		app.viewportComponent.edgePopoverComponent.close();
	};

	/**
	 * Redraws edges leading from viewport to sidebar.
	 */
	this.redrawEdges = function() {
		app.sidebarComponent.refreshFloaters();
	};

	/**
	 * Binds user interactions to local handler functions.
	 */
	function bootstrap() {
		var self = this;

		self.loader.enable();

		var content = document.getElementById('content');

		self.viewportComponent = new Viewport;
		content.appendChild(self.viewportComponent.render());

		self.sidebarComponent = new Sidebar;
		content.appendChild(self.sidebarComponent.render());

		// context menu
		document.body.addEventListener('mousedown', function() {
			self.closeFloatingComponents();
		});

		// zoom
		document.getElementById('zoomIn').addEventListener('click', function(e) {
			self.zoom.zoomIn();
		});
		
		document.getElementById('zoomOut').addEventListener('click', function(e) {
			self.zoom.zoomOut();
		});

		document.getElementById('zoomValue').innerText = Math.round(self.zoom.scale * 100) + '%';
		document.getElementById('graph').setAttribute('transform', 'scale(' + self.zoom.scale + ')');

		// search
		document.getElementById('searchText').addEventListener('keyup', function(e) {
			// enter key
			if (e.keyCode === 13) {
				search(this.value);
				return;
			}

			// escape key
			if (e.keyCode === 27) {
				resetSearch();
				return;
			}
		});
		
		document.getElementById('search').addEventListener('click', function(e) {
			search(document.getElementById('searchText').value);
		});
		
		document.getElementById('countOfFound').addEventListener('click', resetSearch);
		
		function search(term) {
			if (term.length < 2) return;

			var found = 0;
			
			var vertexList = self.viewportComponent.getVertexList();
			vertexList.forEach(function(vertex) {
				if (!vertex.name.toLowerCase().includes(term.toLowerCase())) {
					vertex.setFound(false);
					return;
				}

				found++;

				vertex.setFound(true);
			});
			
			document.getElementById('countOfFound').innerText = found;
		}

		function resetSearch(e) {
			var vertexList = self.viewportComponent.getVertexList();
			vertexList.forEach(function(vertex) {
				vertex.setFound(false);
			});

			document.getElementById('searchText').value = '';
			document.getElementById('countOfFound').innerText = 0;
		}
		
		// exclude vertices with most edges button
		document.getElementById('mostEdge').addEventListener('click', function(e) {
			var vertexList = self.viewportComponent.getVertexList();
			if (vertexList.length === 0) return;

			var vertexWithMostEdges = vertexList.reduce(function(prev, vertex) {
				return vertex.countEdges() > prev.countEdges() ? vertex : prev;
			});
			
			if (vertexWithMostEdges !== null) {
				vertexWithMostEdges.exclude();
				self.sidebarComponent.excludedNodeListComponent.add(vertexWithMostEdges);
			}
		});
		
		// exclude vertices with most edges to group button
		document.getElementById('vertexToGroup').addEventListener('click', function(e) {
			var vertexList = self.viewportComponent.getVertexList();
			if (vertexList.length === 0) return;

			var vertexWithMostEdges = vertexList.reduce(function(prev, vertex) {
				return vertex.countEdges() > prev.countEdges() ? vertex : prev;
			});

			var verticesWithMostEdges = vertexList.filter(function(vertex) {
				return vertex.countEdges() === vertexWithMostEdges.countEdges();
			});

			if (verticesWithMostEdges.length > 0) {
				var group = new Group;

				verticesWithMostEdges.forEach(function(vertex) {
					group.addVertex(vertex);
				});

				self.nodeList.push(group);
				self.groupList.push(group);

				self.viewportComponent.addGroup(group);
			}
		});

		// apply force-directed layout
		var layouting = false;
		var layoutingInterval;

		document.getElementById('applyLayout').addEventListener('click', function() {
			if (layouting) {
				document.getElementById('applyLayoutImg').setAttribute('src', 'images/layout_off.png');

				layouting = false;
				clearInterval(layoutingInterval);

			} else {
				document.getElementById('applyLayoutImg').setAttribute('src', 'images/layout_on.png');

				layouting = true;
				layoutingInterval = window.setInterval(app.viewportComponent.forceDirected.run, 10);
			}
		});
		
		// save as PNG button
		document.getElementById('btnSaveDiagram').addEventListener('click', function(e) {
			saveSvgAsPng(document.getElementById('svg1'), 'diagram.png', {
				scale: 1,
			});
		});
		
		// window resize
		window.addEventListener('resize', function(e) {
			self.headerHeight = getHeaderHeight();
			self.redrawEdges();
		});
	}

	/**
	 * Loads graph data of a diagram.
	 * @param {string} diagramId Identifier of the diagram to be loaded.
	 * @param {string} diagramHash Hash of the diagram to be loaded.
	 * @param {boolean} withEfps Load diagram with extra-functional properties.
	 * @param {object} efpSettings Settings of EFP graph.
	 */
	function loadGraphData(diagramId, diagramHash, withEfps, efpSettings) {
		var self = this;

		self.loader.enable();

		var loadGraphURL = self.API.loadGraph;
		var loadDiagramURL = self.API.loadDiagram;

		if (diagramId !== 'null') {
			loadGraphURL += '?diagramId=' + diagramId;
			loadDiagramURL += '?diagramId=' + diagramId;
		}

		if (diagramHash !== 'null') {
			loadGraphURL +=  '&diagramHash=' + diagramHash;
			loadDiagramURL += '&diagramHash=' + diagramHash;
		}

		// TODO: how to handle EFPs? see old code for details
		if (withEfps !== null) {
			// Build graph with EFPs
			//GraphManager.isEfpGraph = true;
	
			// set EFP settings
			//GraphManager.efpMinIntDiameter = efpSettings.minInterfaceDiameter;
			//GraphManager.efpMaxIntDiameter = efpSettings.maxInterfaceDiameter;
		}

		// exported data of graph
		var graphExportData = null;

		// get vertex position data
		$.getJSON(loadDiagramURL).then(function(data) {
			graphExportData = JSON.parse(data.vertices_position);

			// get graph data
			return $.getJSON(loadGraphURL);

		}, function() {
			// get graph data
			return $.getJSON(loadGraphURL);

		}).then(function(data) {
			// construct graph
			self.graphLoader.run(data, graphExportData);

			self.loader.disable();

		}, function() {
			// go to the upload page
			window.location.replace('./upload-files');
		});
	}

	/**
	 * @returns {integer} Height of the header.
	 */
	function getHeaderHeight() {
		return document.getElementById('header').offsetHeight;
	}
}
