/**
 * @constructor
 */
function Sidebar() {
	var rootElement;
	var activeChangeElement;

	/** @prop {SidebarUnconnectedNodeList} unconnectedNodeListComponent */
	this.unconnectedNodeListComponent = null;
	/** @prop {SidebarExcludedNodeList} excludedNodeListComponent */
	this.excludedNodeListComponent = null;
	/** @prop {Minimap} minimapComponent */
	this.minimapComponent = null;
	/** @prop {StatusBar} statusBarComponent */
	this.statusBarComponent = null;

	var floaterList = [];

	this.getFloaters = function() {
		return floaterList;
	};

	this.refreshFloaters = function() {
		floaterList.forEach(floater => {
			floater.setPosition();
		});
	};

	this.addFloater = function(floater) {
		floaterList.push(floater);
	};

	this.removeFloater = function(floater) {
		floaterList.splice(floaterList.indexOf(floater), 1);
	};

	this.render = function() {
		rootElement = DOM.createHtmlElement('div', {
			'class': 'sidebar',
			'id': 'sidebar',
		});

		var sidebarNav = DOM.createHtmlElement('nav', {
			'class': 'sidebar-navbar',
			'id': 'uploadMenu',
		});
		rootElement.appendChild(sidebarNav);

		// unconnected
		var unconnectedButton = DOM.createHtmlElement('button', {
			'class': 'button',
			'id': 'unconnectedButton',
			'title': 'Unconnected vertices',
		});
		unconnectedButton.appendChild(DOM.createHtmlElement('img', {
			'src': 'images/tochange/unconnected.gif',
			'alt': 'Icon of "toggle unconnected vertices list" action',
		}));
		unconnectedButton.appendChild(DOM.createTextElement('Unconnected vertices'));
		unconnectedButton.addEventListener('click', function() {
			document.getElementById('unconnectedNodeListComponent').classList.toggle('hidden');
			app.redrawEdges();
		});
		sidebarNav.appendChild(unconnectedButton);
		

		var sidebarContainer = DOM.createHtmlElement('div', {
			'class': 'sidebar-container',
		});
		rootElement.appendChild(sidebarContainer);

		// unconnected components
		this.unconnectedNodeListComponent = new SidebarUnconnectedNodeList({
			'id': 'unconnectedNodeListComponent',
			'class': 'hidden',
		});
		sidebarContainer.appendChild(this.unconnectedNodeListComponent.render());

		// excluded nodes
		this.excludedNodeListComponent = new SidebarExcludedNodeList({
			'id': 'excludedNodeListComponent',
		});
		rootElement.appendChild(this.excludedNodeListComponent.render());


		var sidebarBottom = DOM.createHtmlElement('div', {
			'class': 'sidebar-bottom',
		});
		rootElement.appendChild(sidebarBottom);

		// minimap
		this.minimapComponent = new Minimap('#graph');
		sidebarBottom.appendChild(this.minimapComponent.render());

		// status bar
		this.statusBarComponent = new StatusBar;
		sidebarBottom.appendChild(this.statusBarComponent.render());

		return rootElement;
	};

	this.reset = function() {
		// reset lists
		this.unconnectedNodeListComponent.reset();
		this.excludedNodeListComponent.reset();

		// reset status bar
		this.statusBarComponent.reset();
	};
}
