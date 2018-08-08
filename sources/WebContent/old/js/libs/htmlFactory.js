function htmlFactory() {
	function copy(object) {
		return jQuery.extend({}, object);
	}

	function Text(text) {
		this.text = text;

		this.render = function() {
			return document.createTextNode(text);
		};
	}

	function Element(element) {
		this.element = element;

		this.render = function() {
			return document.createElement(element);
		};
	}

	function Component(element, attributes) {
		this.element = element;
		this.attributes = attributes;

		this.components = [];

		this.addComponent = function(component) {
			this.components.push(component);
		};

		this.render = function() {
			var element = new Element(this.element).render();

			for (key in this.attributes) {
				if (this.attributes.hasOwnProperty(key)) {
					element.setAttribute(key, this.attributes[key]);
				}
			}

			this.components.forEach(function(component) {
				element.appendChild(component.render());
			});

			return element;
		};

		return copy(this);
	}

	function List(element, attributes) {
		Component.call(this, element, attributes);

		this.items = [];

		this.add = function(item) {
			this.items.push(item);
		};

		return copy(this);
	}

	function UnorderedList(attributes) {
		List.call(this, 'ul', attributes);

		return copy(this);
	}

	function OrderedList(attributes) {
		List.call(this, 'ol', attributes);

		return copy(this);
	}

	function ListItem(attributes) {
		Component.call(this, 'li', attributes);

		return copy(this);
	}

	// public API
	return {
		text: Text,
		element: Element,
		component: Component,
		unorderedList: UnorderedList,
		orderedList: OrderedList,
		listItem: ListItem,
	};
};
