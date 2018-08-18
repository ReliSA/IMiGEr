/**
 * @constructor
 * @param {object} props Properties of the change list.
 */
function SidebarPostponedChangeList(props) {
	/** @prop {string} id Identifier of the component. */
	this.id = props.id;

	var rootElement;
	var buttonGroup;
	var changeListElement;

	var changeList = [];

	this.getChangeList = function() {
		return changeList;
	};

	this.add = function(change) {
		if (!(change instanceof Change)) {
			throw new TypeError(change.toString() + 'is not instance of Change');
		}

		change.setPostponed(true);

		changeList.push(change);
		changeListElement.appendChild(change.render());

		app.redrawEdges();
	};

	this.remove = function(change) {
		if (!(change instanceof Change)) {
			throw new TypeError(change.toString() + 'is not instance of Change');
		}

		change.setPostponed(false);

		changeList.splice(changeList.indexOf(change), 1);
		change.remove();

		app.redrawEdges();
	};

	this.render = function() {
		rootElement = app.utils.createHtmlElement('div', {
			'id': props.id,
			'class': 'node-container postponed-nodes ' + (props.class ? props.class : ''),
		});
		rootElement.addEventListener('scroll', function() {
			app.redrawEdges();
		});

		// title
		rootElement.appendChild(app.dom.htmlStringToElement('<h2 class="node-container-title">Postponed changes</h2>'));

		// list
		changeListElement = app.utils.createHtmlElement('ul', {
			'class': 'change-list',
		});
		rootElement.appendChild(changeListElement);

		return rootElement;
	};

	this.reset = function() {
		console.log('TODO: should SidebarPostponedChangeList.reset() method do something?');
	};

	function includeAll() {
		var nodeListCopy = nodeList.slice(0);
		nodeListCopy.forEach(function(node) {
			node.include();
		}, this);

		toggleButtonGroup.call(this);
	}

	function toggleButtonGroup() {
		if (nodeList.length > 0) {
			buttonGroup.classList.remove('hidden');
		} else {
			buttonGroup.classList.add('hidden');
		}
	}
}
