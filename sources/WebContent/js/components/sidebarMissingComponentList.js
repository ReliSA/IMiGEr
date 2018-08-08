/**
 * @constructor
 * @param {object} props Properties of the components list.
 */
function SidebarMissingComponentList(props) {
	/** @prop {string} id Identifier of the component. */
	this.id = props.id;

	var rootElement;
	var componentListElement;

	var componentList = [];

	this.getComponentList = function() {
		return componentList;
	};

	this.add = function(componentName) {
		if (componentList.indexOf(componentName) > -1) return;

		componentList.push(componentName);

		var listItem = app.utils.createHtmlElement('li', {
			'title': componentName,
		});
		listItem.appendChild(document.createTextNode(componentName));
		componentListElement.appendChild(listItem);
	};

	this.render = function() {
		rootElement = app.utils.createHtmlElement('div', {
			'id': props.id,
			'class': 'node-container missing-components ' + (props.class ? props.class : ''),
		});
		rootElement.addEventListener('scroll', function() {
			app.redrawEdges();
		});

		// title
		rootElement.appendChild(app.dom.htmlStringToElement('<h2 class="node-container-title">Missing classes</h2>'));

		// component list
		componentListElement = app.utils.createHtmlElement('ul', {
			'class': 'node-list',
		});
		rootElement.appendChild(componentListElement);

		return rootElement;
	};

	this.reset = function() {
		componentList = [];

		$(componentListElement).empty();
	};
}
