import App from './app.js';
import SpinLoader from './components/spinLoader.js';

/**
 * Application running on the ShowGraph page.
 */
class ShowGraphApp extends App {
	/**
	 * @inheritdoc
	 */
	constructor(appName, appHomeUrl) {
		super(appName, appHomeUrl);

		this.constants = new Constants;
		this.graphLoader = new GraphLoader;
		this.graphExporter = new GraphExporter;
		this.zoom = new Zoom(0.8);
		this.markSymbol = new MarkSymbol;

		/** @prop {array<Edge>} edgeList */
		this.edgeList = [];
		/** @prop {array<(Vertex|Group)>} nodeList */
		this.nodeList = [];
		/** @prop {array<Vertex>} vertexList */
		this.vertexList = [];
		/** @prop {array<Group>} groupList */
		this.groupList = [];
		/** @prop {array<NodeProxy>} proxyList */
		this.proxyList = [];
		/** @prop {Node} activeNode */
		this.activeNode = null;

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
	}

	/**
	 * Initiates the application.
	 * @param {function} startFn Function to be run to load graph data.
	 */
	run(diagramId) {
		console.log('running...');

		this._bootstrap();
		this._loadGraphData(diagramId);
	}

	/**
	 * Resets the application to the state as it was when the graph was loaded for the first time.
	 */
	reset() {
		this.viewportComponent.reset();
		this.sidebarComponent.reset();

		this.edgeList = [];
		this.nodeList = [];
		this.vertexList = [];
		this.groupList = [];
		this.proxyList = [];
	}

	/**
	 * Closes components floating above viewport (context menu and popovers).
	 */
	closeFloatingComponents() {
		this.viewportComponent.contextMenuComponent.close();
		this.viewportComponent.vertexPopoverComponent.close();
		this.viewportComponent.edgePopoverComponent.close();
	}

	/**
	 * Redraws edges leading from viewport to sidebar.
	 */
	redrawEdges() {
		this.proxyList.forEach(proxy => {
			proxy.updatePosition();
		});
	}

	/**
	 * Binds user interactions to local handler functions.
	 */
	_bootstrap() {
		this.headerComponent = new Header;
		this.navbarComponent = new Navbar;
		this.viewportComponent = new Viewport;
		this.sidebarComponent = new Sidebar;
		this.saveDiagramModalWindowComponent = new SaveDiagramModalWindow;
		this.filterModalWindowComponent = new FilterModalWindow;
		this.spinLoaderComponent = new SpinLoader;
		this.helpModalWindowComponent = new HelpModalWindow;

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
		appElement.appendChild(this.saveDiagramModalWindowComponent.render());
		appElement.appendChild(this.filterModalWindowComponent.render());
		appElement.appendChild(this.spinLoaderComponent.render());
		appElement.appendChild(this.helpModalWindowComponent.render());

		this.sidebarComponent.minimapComponent.viewportSize = this.viewportComponent.size;

		// diagram
		document.addEventListener(DiagramUpdatedEvent.name, e => {
			this.diagram = new Diagram(e.detail);

			if (this.diagram.name !== null) {
				document.title = this.name + ' - ' + this.diagram.name;
			}

			if (this.diagram.id !== null) {
				history.replaceState({} , document.title, this.homeUrl + 'graph?diagramId=' + this.diagram.id);
			}
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
			this.sidebarComponent.minimapComponent.viewportSize = this.viewportComponent.size;
		});

		// keyboard shortcuts
		document.body.addEventListener('keydown', e => {
			// zoom in
			if (e.ctrlKey === true && e.key === '+') {
				e.preventDefault();
				app.zoom.zoomIn();
			}

			// zoom out
			if (e.ctrlKey === true && e.key === '-') {
				e.preventDefault();
				app.zoom.zoomOut();
			}

			// reset zoom
			if (e.ctrlKey === true && e.key === '0') {
				e.preventDefault();
				app.zoom.reset();
			}

			// search
			if (e.ctrlKey === true && e.key === 'f') {
				e.preventDefault();
				const searchInput = document.getElementById('searchText');
				if (searchInput === document.activeElement) {
					searchInput.blur();
				} else {
					searchInput.focus();
				}
			}

			// save diagram
			if (e.ctrlKey === true && e.key === 's') {
				e.preventDefault();
				if (Auth.isLoggedIn()) {
					app.saveDiagramModalWindowComponent.open();
				}
			}

			// toggle minimap
			if (e.ctrlKey === true && e.key === 'm') {
				e.preventDefault();
				app.sidebarComponent.minimapComponent.toggle();
			}

			// move active node
			if (e.key === 'ArrowUp' && app.activeNode !== null) {
				e.preventDefault();
				this._moveActiveNode(new Coordinates(0, -10));
			}
			if (e.key === 'ArrowDown' && app.activeNode !== null) {
				e.preventDefault();
				this._moveActiveNode(new Coordinates(0, 10));
			}
			if (e.key === 'ArrowLeft' && app.activeNode !== null) {
				e.preventDefault();
				this._moveActiveNode(new Coordinates(-10, 0));
			}
			if (e.key === 'ArrowRight' && app.activeNode !== null) {
				e.preventDefault();
				this._moveActiveNode(new Coordinates(10, 0));
			}

			// help modal
			if (e.key === 'F1') {
				e.preventDefault();
				this.helpModalWindowComponent.open();
			}
		});
	}

	/**
	 * Moves the currently active node by the coordinates from its current location.
	 * @param {Coordinates} offsetCoords Offset coordinates.
	 */
	_moveActiveNode(offsetCoords) {
		const coords = new Coordinates(
			app.activeNode.position.x + offsetCoords.x,
			app.activeNode.position.y + offsetCoords.y,
		);

		app.activeNode.position = coords;
		app.activeNode.move(coords);
	}

	/**
	 * Loads graph data of a diagram.
	 * @param {string} diagramId Identifier of the diagram to be loaded.
	 */
	async _loadGraphData(diagramId) {
		this.spinLoaderComponent.enable();

		let loadGraphDataPromise;
		if (diagramId === '') {
			loadGraphDataPromise = AJAX.getJSON(Constants.API.loadGraphData);
		} else {
			loadGraphDataPromise = AJAX.getJSON(Constants.API.getDiagram + '?id=' + diagramId);
		}

		try {
			// get graph data
			const graphData = await loadGraphDataPromise;

			// update diagram information in the app
			document.dispatchEvent(new DiagramUpdatedEvent(graphData));

			// construct graph
			let initialElimination = (graphData.initial_elimination === undefined)
					? true : graphData.initial_elimination == 'true';
			this.graphLoader.run(JSON.parse(graphData.graph_json), initialElimination);

			this.spinLoaderComponent.disable();

		} catch (error) {
			if (error instanceof HttpError) {
				switch (error.response.status) {
					case 401:
						alert('You are not allowed to view the diagram.');
						break;
					case 406:
						alert('There was a problem in graph source file.');
						break;
					default:
						console.error(error);
						alert('Something went wrong. Check console for more details.');
				}

			} else if (error instanceof AJVValidationError) {
				console.error(error);
				alert('Invalid input data: ' + error.message + '. Check console for more details.');

			} else {
				console.error(error);
				alert('Something went wrong. Check console for more details.');
			}

			// go to the upload page
			window.location.replace('./');
		}
	}
}

export default ShowGraphApp;
