/**
 * @constructor
 */
function Sidebar() {
	var rootElement;
	var activeChangeElement;

	/** @prop {SidebarPostponedChangeList} postponedChangeListComponent */
	this.postponedChangeListComponent = null;
	/** @prop {SidebarUnconnectedNodeList} unconnectedNodeListComponent */
	this.unconnectedNodeListComponent = null;
	/** @prop {SidebarMissingClassList} missingClassListComponent */
	this.missingClassListComponent = null;
	/** @prop {SidebarExcludedNodeList} excludedNodeListComponent */
	this.excludedNodeListComponent = null;
	/** @prop {StatusBar} statusBarComponent */
	this.statusBarComponent = null;

	var activeChange = new Change;
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

	this.addToChange = function(node) {
		node.removeFromSidebarList();
		node.remove(true);

		activeChange.addVertex(node);
	};

	this.setChangeActive = function(change) {
		// postpone currently active change
		if (activeChange.getOldVertexList().length > 0) {
			activeChange.postpone();
			this.postponedChangeListComponent.add(activeChange);
		} else {
			activeChange.remove();
		}

		change.activate();
		activeChange = change;
		activeChangeElement.appendChild(activeChange.render());
	};

	this.setChangePostponed = function(change) {
		// postpone currently active change if there are some vertices in it
		if (change.getOldVertexList().length > 0) {
			this.postponedChangeListComponent.add(change);
		}

		// set a new active change
		activeChange = new Change;
		activeChangeElement.appendChild(activeChange.render());
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

		// change
		var changeButton = app.utils.createHtmlElement('button', {
			'class': 'button',
			'id': 'changeButton',
			'title': 'Active change',
			'data-tooltip': 'top',
		});
		changeButton.appendChild(app.dom.createHtmlElement('img', {
			'src': 'images/tochange/crce-call-trans.gif',
			'alt': 'Icon of "toggle active change" action',
		}));
		changeButton.appendChild(app.dom.createTextElement('List'));
		changeButton.addEventListener('click', function() {
			document.getElementById('activeChange').classList.toggle('hidden');
			app.redrawEdges();
		});
		sidebarNav.appendChild(changeButton);

		// postponed
		var postponedButton = app.utils.createHtmlElement('button', {
			'class': 'button',
			'id': 'postponedButton',
			'title': 'Postponed changes',
			'data-tooltip': 'top',
		});
		postponedButton.appendChild(app.dom.createHtmlElement('img', {
			'src': 'images/tochange/postpone-trans.gif',
			'alt': 'Icon of "toggle postponed changes list" action',
		}));
		postponedButton.appendChild(app.dom.createTextElement('List'));
		postponedButton.addEventListener('click', function() {
			document.getElementById('postponedChangeListComponent').classList.toggle('hidden');
			app.redrawEdges();
		});
		sidebarNav.appendChild(postponedButton);
		
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
		
		// missing
		var missingButton = app.utils.createHtmlElement('button', {
			'class': 'button',
			'id': 'missingButton',
			'title': 'Missing classes',
			'data-tooltip': 'top-left',
		});
		missingButton.appendChild(app.dom.createHtmlElement('img', {
			'src': 'images/tochange/accept-trans.gif',
			'alt': 'Icon of "toggle missing classes list" action',
		}));
		missingButton.appendChild(app.dom.createTextElement('List'));
		missingButton.addEventListener('click', function() {
			document.getElementById('missingClassListComponent').classList.toggle('hidden');
			app.redrawEdges();
		});
		sidebarNav.appendChild(missingButton);


		var sidebarContainer = app.utils.createHtmlElement('div', {
			'class': 'sidebar-container',
		});
		rootElement.appendChild(sidebarContainer);

		// active change
		activeChangeElement = app.utils.createHtmlElement('div', {
			'id': 'activeChange',
			'class': 'node-container change-nodes',
		});
		activeChangeElement.appendChild(app.dom.htmlStringToElement('<h2 class="node-container-title">Active change</h2>'));
		activeChangeElement.appendChild(activeChange.render());

		sidebarContainer.appendChild(activeChangeElement);

		// postponed changes
		this.postponedChangeListComponent = new SidebarPostponedChangeList({
			'id': 'postponedChangeListComponent',
			'class': 'hidden',
		});
		sidebarContainer.appendChild(this.postponedChangeListComponent.render());

		// unconnected components
		this.unconnectedNodeListComponent = new SidebarUnconnectedNodeList({
			'id': 'unconnectedNodeListComponent',
			'class': 'hidden',
		});
		sidebarContainer.appendChild(this.unconnectedNodeListComponent.render());

		// missing classes
		this.missingClassListComponent = new SidebarMissingComponentList({
			'id': 'missingClassListComponent',
			'class': 'hidden',
		});
		sidebarContainer.appendChild(this.missingClassListComponent.render());


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
		// remove active change
		activeChange.remove();

		// set a new active change
		activeChange = new Change;
		activeChangeElement.appendChild(activeChange.render());

		// reset lists
		this.postponedChangeListComponent.reset();
		this.unconnectedNodeListComponent.reset();
		this.missingClassListComponent.reset();
		this.excludedNodeListComponent.reset();

		// reset status bar
		this.statusBarComponent.reset();
	};
}
