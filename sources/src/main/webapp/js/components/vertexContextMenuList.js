/**
 * Class representing a context menu of a vertex displayed on right clicking the vertex in viewport. The menu displays a list of
 * groups and excluded vertices that the parental vertex can be added to.
 * @see Vertex
 */
class VertexContextMenuList {
	/**
	 * @constructor
	 */
	constructor() {
		this._vertex = null;
	}

	/**
	 * Creates a new DOM element representing the context menu in memory.
	 * @public
	 * @returns {HTMLElement} HTML DOM element.
	 */
	render() {
		this._listElement = DOM.h('ul');

		this._rootElement = DOM.h('div', {
			class: 'context-menu hidden',
			onMouseDown: Utils.stopPropagation,
		}, [
			this._listElement,
		]);

		return this._rootElement;
	}

	/**
	 * Sets a vertex that this context menu is bound to. The vertex is then added to a group.
	 * @public
	 * @param {Vertex} newValue Vertex this context menu is bound to.
	 */
	set vertex(newValue) {
		this._vertex = newValue;
	}

	/**
	 * Moves the context menu to the coordinates.
	 * @public
	 * @param {Coordinates} coords Coordinates to display the context menu at.
	 */
	set position(coords) {
		this._rootElement.style.top = coords.y + 'px';
		this._rootElement.style.left = coords.x + 'px';
	}

	/**
	 * Adds a new graph node (vertex or group) to be displayed in the context menu.
	 * @public
	 * @param {(Vertex|Group)} node Graph node to be displayed in the context menu.
	 */
	addNode(node) {
		if (node instanceof Vertex && node.group !== null) {
			throw new Error('Vertex is already a member of some group.');
		}

		this._listElement.appendChild(DOM.h('li', {
			title: node.name,
			onClick: this._nodeListItemClick.bind(this, node),
		}, [
			DOM.h('span', {
				class: 'group-symbol',
				style: 'background-color: ' + node.symbol[1] + ';',
				innerText: node.symbol[0],
			}),
			DOM.h('span', {
				class: 'group-name',
				innerText: node.name,
			}),
		]));
	}

	/**
	 * Opens the context menu.
	 * @public
	 */
	open() {
		this._rootElement.classList.remove('hidden');
	}

	/**
	 * Closes the menu and clears its content.
	 * @public
	 */
	close() {
		this._rootElement.classList.add('hidden');

		this._listElement.innerHTML = '';
	}

	/**
	 * Context menu item click interaction. The vertex this context menu is bound to is either added to the group or merged 
	 * with the vertex to created a new group.
	 * @private
	 */
	_nodeListItemClick(node) {
		let group;
		if (node instanceof Vertex) {
			// create a new group
			group = Group.create();
			group.setExcluded(true);
			group.addVertex(node);

			app.nodeList.push(group);
			app.groupList.push(group);

			app.sidebarComponent.excludedNodeListComponent.addNode(group);
			app.sidebarComponent.excludedNodeListComponent.removeNode(node);

			node.remove(true);

		} else {
			group = node;
		}

		// add the vertex to the group
		group.addVertex(this._vertex);

		app.viewportComponent.contextMenuComponent.close();
	}
}
