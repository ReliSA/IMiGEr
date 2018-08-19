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
	/** @prop {StatusBar} statusBarComponent */
	this.statusBarComponent = null;

	var floaterList = [];

	this.getFloaters = function() {
		return floaterList;
	};

	this.refreshFloaters = function() {
		floaterList.forEach(function(floater) {
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
		rootElement = app.utils.createHtmlElement('div', {
			'class': 'sidebar',
			'id': 'sidebar',
		});


		var sidebarNav = app.utils.createHtmlElement('nav', {
			'class': 'sidebar-navbar',
			'id': 'uploadMenu',
		});
		rootElement.appendChild(sidebarNav);

		// unconnected
		var unconnectedButton = app.utils.createHtmlElement('button', {
			'class': 'button',
			'id': 'unconnectedButton',
			'title': 'Unconnected components',
			'data-tooltip': 'top',
		});
		unconnectedButton.appendChild(app.dom.createHtmlElement('img', {
			'src': 'images/tochange/unconnected.gif',
			'alt': 'Icon of "toggle unconnected components list" action',
		}));
		unconnectedButton.appendChild(app.dom.createTextElement('List'));
		unconnectedButton.addEventListener('click', function() {
			document.getElementById('unconnectedNodeListComponent').classList.toggle('hidden');
			app.redrawEdges();
		});
		sidebarNav.appendChild(unconnectedButton);
		

		var sidebarContainer = app.utils.createHtmlElement('div', {
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


		// status bar
		this.statusBarComponent = new StatusBar;
		rootElement.appendChild(this.statusBarComponent.render());


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
