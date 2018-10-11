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
	/** @prop {Filter} filter */
	this.filter = new Filter;

	/** @prop {string} NAME Application name. */
	this.NAME = document.title;
	/** @prop {string} HOME_URL Application home URL. */
	this.HOME_URL = null;
	/** @prop {object} API Application programming interface paths. */
	this.API = {
		loadGraphData: 'api/load-graph-data',
		getDiagram: 'api/get-diagram',
		saveDiagram: 'api/save-diagram',
		removeDiagram: 'api/remove-diagram',
	};

	/** @prop {float} headerHeight Current height of the application header. */
	this.headerHeight = getHeaderHeight();

	/** @prop {Sidebar} sidebarComponent */
	this.sidebarComponent = null;
	/** @prop {Viewport} viewportComponent */
	this.viewportComponent = null;
	/** @prop {ModalWindow} modalWindowComponent */
	this.modalWindowComponent = null;

	/** @prop {array<Edge>} edgeList */
	this.edgeList = [];
	/** @prop {array<(Vertex|Group)>} nodeList */
	this.nodeList = [];
	/** @prop {array<Vertex>} vertexList */
	this.vertexList = [];
	/** @prop {array<Group>} groupList */
	this.groupList = [];

	/** @prop {Diagram} diagram */
	this.diagram = null;

	/** TODO: jsDoc */
	this.archetype = {
		vertex: [],
		edge: [],
	};

	/** TODO: jsDoc */
	this.attributeTypeList = [];

	/** TODO: jsDoc */
	this.possibleEnumValues = {};

	/**
	 * Loads graph using diagram (if available).
	 * @param diagramId Diagram identifier.
	 */
	this.diagramLoader = function(diagramId) {
		return loadGraphData.bind(this, diagramId);
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
        app.filter.resetSelectors();

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
		self.sidebarComponent.minimapComponent.setViewportSize(self.viewportComponent.getSize());

		self.modalWindowComponent = new ModalWindow;
		content.appendChild(self.modalWindowComponent.render());

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

		// filters
		document.getElementById('toggleFilters').addEventListener('click', function(e) {
			document.getElementById('filters').classList.toggle('hidden');
		});


		document.getElementById('filterTypeSelection').addEventListener('change', function (e) {
			var selected = this.value;
			if(selected === 'Archetype') {
                document.getElementById('vertexArchetypeSelection').classList.remove('hidden');
                document.getElementById('logicOperationSelection').classList.add('hidden');
                document.getElementById('attributeTypeSelection').classList.add('hidden');
                document.getElementById('matchTypeSelection').classList.remove('hidden');

            } else if (selected === 'Attribute') {
                document.getElementById('vertexArchetypeSelection').classList.add('hidden');
                document.getElementById('logicOperationSelection').classList.add('hidden');
                document.getElementById('attributeTypeSelection').classList.remove('hidden');
                document.getElementById('matchTypeSelection').classList.remove('hidden');

			} else if (selected === 'Logical') {
                document.getElementById('vertexArchetypeSelection').classList.add('hidden');
				document.getElementById('logicOperationSelection').classList.remove('hidden');
                document.getElementById('attributeTypeSelection').classList.add('hidden');
                document.getElementById('matchTypeSelection').classList.add('hidden');
            }
        });

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
			
			var nodeList = self.viewportComponent.getNodeList();
			nodeList.forEach(function(node) {
				if (!node.name.toLowerCase().includes(term.toLowerCase())) {
					node.setFound(false);

				} else {
					node.setFound(true);

					found++;
				}
			});
			
			document.getElementById('countOfFound').innerText = found;
		}

		function resetSearch(e) {
			var nodeList = self.viewportComponent.getNodeList();
			nodeList.forEach(function(node) {
				node.setFound(false);
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
				var group = new Group({});

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
				layoutingInterval = window.setInterval(self.viewportComponent.forceDirected.run, 10);
			}
		});
		
		// save as PNG button
		document.getElementById('btnSaveDiagram').addEventListener('click', function(e) {
			saveSvgAsPng(document.getElementById('svg1'), 'diagram.png', {
				scale: 1,
			});
		});

		// save to database button
		document.getElementById('btnSaveDiagramToDatabase').addEventListener('click', function(e) {
			self.modalWindowComponent.open();
		});

		// window resize
		window.addEventListener('resize', function(e) {
			self.headerHeight = getHeaderHeight();
			self.redrawEdges();

			self.sidebarComponent.minimapComponent.setViewportSize(self.viewportComponent.getSize());
		});
	}

	/**
	 * Loads graph data of a diagram.
	 * @param {string} diagramId Identifier of the diagram to be loaded.
	 */
	function loadGraphData(diagramId) {
		var self = this;

		self.loader.enable();

		var loadGraphDataPromise;

		if (diagramId === '') {
			loadGraphDataPromise = $.getJSON(self.API.loadGraphData);

		} else {
			getDiagramPromise = $.getJSON(self.API.getDiagram + '?id=' + diagramId);

			loadGraphDataPromise = getDiagramPromise.then(function(data) {
				self.diagram = new Diagram(data);

				document.title = self.NAME + ' - ' + self.diagram.name;

				return $.getJSON(self.API.loadGraphData + '?diagramId=' + diagramId);
			});
		}

		// get vertex position data
		loadGraphDataPromise.then(function(data) {
			// construct graph
			self.graphLoader.run(data);

			self.loader.disable();

			self.filter.initializeSelectors(self.archetype.vertex);

		}, function(xhr) {
			switch (xhr.status) {
				case 401:
					alert('You are not allowed to view the diagram.');
					break;
				default:
					alert('Something went wrong.');
			}

			// go to the upload page
			window.location.replace('./');
		});
	}

	/**
	 * @returns {integer} Height of the header.
	 */
	function getHeaderHeight() {
		return document.getElementById('header').offsetHeight;
	}
}
