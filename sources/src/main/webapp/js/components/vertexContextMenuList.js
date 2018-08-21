/**
 * Class representing a context menu of a vertex displayed on right clicking the vertex in viewport. The menu displays a list of
 * groups and excluded vertices that the parental vertex can be added to.
 * @see Vertex
 * @constructor
 */
function VertexContextMenuList() {
	var rootElement;
	var listElement;

	var vertex;

	/**
	 * Sets a vertex that this context menu is bound to. The vertex is then added to a group.
	 * @param {Vertex} newValue Vertex this context menu is bound to.
	 */
	this.setVertex = function(newValue) {
		vertex = newValue;
	};

	/**
	 * Moves the context menu to the coordinates.
	 * @param {Coordinates} coords Coordinates to display the context menu at.
	 */
	this.setPosition = function(coords) {
		rootElement.style.top = coords.y + 'px';
		rootElement.style.left = coords.x + 'px';
	};

	/**
	 * Adds a new graph node (vertex or group) to be displayed in the context menu.
	 * @param {(Vertex|Group)} node Graph node to be displayed in the context menu.
	 */
	this.addNode = function(node) {
		if (node instanceof Vertex && node.getGroup() !== null) {
			throw new Error('Vertex is already a member of some group.');
		}

		var nodeListItemElement = app.utils.createHtmlElement('li', {
			'title': node.name,
		});
		nodeListItemElement.addEventListener('click', nodeListItemClick.bind(node));
		listElement.appendChild(nodeListItemElement);

		var nodeSymbolText = app.utils.createHtmlElement('span', {
			'class': 'group-symbol',
			'style': 'background-color: ' + node.symbol[1] + ';',
		});
		nodeSymbolText.appendChild(document.createTextNode(node.symbol[0]));
		nodeListItemElement.appendChild(nodeSymbolText);

		var nodeNameText = app.utils.createHtmlElement('span', {
			'class': 'group-name',
		});
		nodeNameText.appendChild(document.createTextNode(node.name));
		nodeListItemElement.appendChild(nodeNameText);
	};

	/**
	 * Opens the context menu.
	 */
	this.open = function() {
		rootElement.classList.remove('hidden');
	};

	/**
	 * Closes the menu and clears its content.
	 */
	this.close = function() {
		rootElement.classList.add('hidden');

		listElement.innerHTML = '';
	};

	/**
	 * Creates a new DOM element representing the context menu in memory.
	 * @returns {Element} HTML DOM element.
	 */
	this.render = function() {
		rootElement = app.utils.createHtmlElement('div', {
			'class': 'context-menu hidden',
		});
		rootElement.addEventListener('mousedown', stopPropagation.bind(this));

		listElement = app.utils.createHtmlElement('ul', {});
		rootElement.appendChild(listElement);

		return rootElement;
	};

	/**
	 * Stops propagation of the event which triggered this function to its parental elements.
	 * @param {Event} e The event.
	 */
	function stopPropagation(e) {
		e.stopPropagation();
	}

	/**
	 * Context menu item click interaction. The vertex this context menu is bound to is either added to the group or merged 
	 * with the vertex to created a new group.
	 * @param {Event} e Click event.
	 */
	function nodeListItemClick(e) {
		if (this instanceof Vertex) {
			// create a new group
			var group = new Group({});
			group.setExcluded(true);
			group.addVertex(this);

			app.nodeList.push(group);
			app.groupList.push(group);

			app.sidebarComponent.excludedNodeListComponent.add(group);
			app.sidebarComponent.excludedNodeListComponent.remove(this);

			this.remove(true);

		} else {
			var group = this;
		}

		// add the vertex to the group
		group.addVertex(vertex);

		app.viewportComponent.contextMenuComponent.close();
	}
}
