/**
 * Main class of the application.
 * @constructor
 */
function ShowGraphApp(appName, appHomeUrl) {
	/** @prop {Constants} constants */
	this.constants = new Constants;
	/** @prop {GraphLoader} graphLoader */
	this.graphLoader = new GraphLoader;
	/** @prop {GraphExporter} graphExporter */
	this.graphExporter = new GraphExporter;
	/** @prop {Loader} loader */
	this.loader = new Loader;
	/** @prop {Zoom} zoom */
	this.zoom = new Zoom(0.8);
	/** @prop {MarkSymbol} markSymbol */
	this.markSymbol = new MarkSymbol;

	/** @prop {string} NAME Application name. */
	this.NAME = appName;
	/** @prop {string} HOME_URL Application home URL. */
	this.HOME_URL = appHomeUrl;

	/** @prop {Sidebar} sidebarComponent */
	this.sidebarComponent = null;
	/** @prop {Viewport} viewportComponent */
	this.viewportComponent = null;
	/** @prop {SaveDiagramModalWindow} modalWindowComponent */
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

	/** @prop {object} archetype Object containing all vertex and edge archetypes used in currently displayed diagram. */
	this.archetype = {
		vertex: [],
		edge: [],
	};

	/** @prop {array} attributeTypeList Array containing all possible types of vertex/edge attributes. */
	this.attributeTypeList = [];
	/** @prop {array} possibleEnumValues Array containing all possible values of attributes with datatype ENUM. */
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
		this.loader.enable();

		this.headerComponent = new Header;
		this.navbarComponent = new Navbar;
		this.viewportComponent = new Viewport;
		this.sidebarComponent = new Sidebar;
		this.modalWindowComponent = new SaveDiagramModalWindow;

		const appElement = document.getElementById('app');
		appElement.appendChild(this.headerComponent.render());
		appElement.appendChild(this.navbarComponent.render());
		appElement.appendChild(DOM.h('main', {
			class: 'graph-content',
			id: 'content',
		}, [
			this.viewportComponent.render(),
			this.sidebarComponent.render(),
		]));
		appElement.appendChild(this.modalWindowComponent.render());

		this.sidebarComponent.minimapComponent.setViewportSize(this.viewportComponent.getSize());

		// diagram
		document.addEventListener('imiger.diagramUpdated', e => {
			this.diagram = new Diagram(e.detail);

			document.title = this.NAME + ' - ' + this.diagram.name;
			history.replaceState({} , document.title, this.HOME_URL + 'graph?diagramId=' + this.diagram.id);
		});

		// context menu
		document.body.addEventListener('mousedown', () => {
			this.closeFloatingComponents();
		});

		// zoom
		document.getElementById('zoomValue').innerText = Math.round(this.zoom.scale * 100) + '%';
		document.getElementById('graph').setAttribute('transform', 'scale(' + this.zoom.scale + ')');

		// window resize
		window.addEventListener('resize', e => {
			this.redrawEdges();
			this.sidebarComponent.minimapComponent.setViewportSize(this.viewportComponent.getSize());
		});
	}

	/**
	 * Loads graph data of a diagram.
	 * @param {string} diagramId Identifier of the diagram to be loaded.
	 */
	async function loadGraphData(diagramId) {
		this.loader.enable();

		let loadGraphDataPromise;

		if (diagramId === '') {
			loadGraphDataPromise = AJAX.getJSON(Constants.API.loadGraphData);

		} else {
			const diagramData = await AJAX.getJSON(Constants.API.getDiagram + '?id=' + diagramId);

			this.diagram = new Diagram(diagramData);

			document.title = this.NAME + ' - ' + this.diagram.name;

			loadGraphDataPromise = Promise.resolve(JSON.parse(diagramData.graph_json));
		}

		try {
			// get vertex position data
			const graphData = await loadGraphDataPromise;

			// construct graph
			this.graphLoader.run(graphData);

			this.loader.disable();

		} catch (error) {
			if (error instanceof HttpError) {
				switch (error.response.status) {
					case 401:
						alert('You are not allowed to view the diagram.');
						break;
					default:
						alert('Something went wrong.');
				}
			} else {
				alert('Something went wrong. Check console for more details.');
				console.error(error);
			}

			// go to the upload page
			window.location.replace('./');
		}
	}
}
