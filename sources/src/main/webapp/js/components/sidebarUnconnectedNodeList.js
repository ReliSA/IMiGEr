/**
 * @constructor
 * @param {object} props Properties of the node list.
 */
function SidebarUnconnectedNodeList(props) {
	/** @prop {string} id Identifier of the component. */
	this.id = props.id;

	var rootElement;
	var buttonGroup;
	var nodeListElement;

	var nodeList = [];

	this.getNodeList = function() {
		return nodeList;
	};

	this.add = function(node) {
		if (!(node instanceof Vertex)) {
			throw new TypeError(node.toString() + 'is not instance of Vertex');
		}

		// set remove hook
		node.removeFromSidebarList = this.remove.bind(this, node);

		nodeList.push(node);
		nodeListElement.appendChild(node.render());

		app.redrawEdges();
	};

	this.remove = function(node) {
		if (!(node instanceof Vertex)) {
			throw new TypeError(node.toString() + 'is not instance of Vertex');
		}

		// unset remove hook
		node.removeFromSidebarList = app.utils.noop;

		nodeList.splice(nodeList.indexOf(node), 1);

		node.remove(false);

		app.redrawEdges();
	};

	this.render = function() {
		rootElement = app.utils.createHtmlElement('div', {
			'id': props.id,
			'class': 'node-container unconnected-nodes ' + (props.class ? props.class : ''),
		});
		rootElement.addEventListener('scroll', function() {
			app.redrawEdges();
		});

		// title
		rootElement.appendChild(app.dom.htmlStringToElement('<h2 class="node-container-title">Unconnected vertices</h2>'));

		// buttons
		buttonGroup = app.utils.createHtmlElement('div', {
			'class': 'button-group',
		});
		rootElement.appendChild(buttonGroup);

		// include all button
		var includeAllButton = app.utils.createHtmlElement('button', {
			'class': 'include-all-button button',
			'title': 'Display all unconnected nodes in viewport',
		});
		includeAllButton.appendChild(app.utils.createHtmlElement('img', {
			'src': 'images/unconnected/uncon_left.png',
			'alt': 'Icon of "display all unconnected nodes in viewport" action',
		}));
		includeAllButton.addEventListener('click', includeAll.bind(this));
		buttonGroup.appendChild(includeAllButton);

		// exclude all button
		var excludeAllButton = app.utils.createHtmlElement('button', {
			'class': 'exclude-all-button button',
			'title': 'Display all unconnected nodes in sidebar',
		});
		excludeAllButton.appendChild(app.utils.createHtmlElement('img', {
			'src': 'images/unconnected/uncon_right.png',
			'alt': 'Icon of "display all unconnected nodes in sidebar" action',
		}));
		excludeAllButton.addEventListener('click', excludeAll.bind(this));
		buttonGroup.appendChild(excludeAllButton);

		// list
		nodeListElement = app.utils.createHtmlElement('ul', {
			'class': 'node-list',
		});
		rootElement.appendChild(nodeListElement);

		return rootElement;
	};

	this.reset = function() {
		nodeList = [];

		$(nodeListElement).empty();
	};

	function includeAll() {
		var nodeListCopy = nodeList.slice(0);
		nodeListCopy.forEach(function(node) {
			node.include();
		}, this);
	}

	function excludeAll() {
		app.vertexList.filter(function(vertex) {
			return vertex.isUnconnected();
		}).forEach(function(vertex) {
			vertex.exclude();
			this.add(vertex);
		}, this);
	}
}
