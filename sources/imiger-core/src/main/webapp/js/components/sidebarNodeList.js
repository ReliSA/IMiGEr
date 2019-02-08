class SidebarNodeList {

	constructor(props) {
		this._properties = props;

		this._nodeList = [];
	}

	get nodeList() {
		return this._nodeList;
	}

	addNode(node) {
		if (!(node instanceof Node)) {
			throw new TypeError(node.toString() + ' is not an instance of Node');
		}

		// set remove hook
		node.removeFromSidebarList = this.removeNode.bind(this, node);

		this._nodeList.push(node);
		this._nodeListElement.appendChild(node.render());

		app.redrawEdges();
		this._toggleControls();
	}

	removeNode(node) {
		if (!(node instanceof Node)) {
			throw new TypeError(node.toString() + ' is not an instance of Node');
		}

		// unset remove hook
		node.removeFromSidebarList = Utils.noop;

		this._nodeList.splice(this._nodeList.indexOf(node), 1);

		node.remove(false);

		app.redrawEdges();
		this._toggleControls();
	}

	render() {
		// buttons
		this._buttonGroupElement = DOM.h('div', {
			class: 'button-group',
			hidden: 'hidden',
		}, this._renderButtons());

		// sorting options
		this._sortOptionsElement = DOM.h('ul', {
			class: 'sort-list',
			hidden: 'hidden',
		}, [
			DOM.h('li', {
				class: 'sort-asc',
				innerText: 'name',
				onClick: this._sortByName.bind(this, 1),
			}),
			DOM.h('li', {
				class: 'sort-desc',
				innerText: 'name',
				onClick: this._sortByName.bind(this, -1),
			}),
			DOM.h('li', {
				class: 'sort-asc',
				innerText: '#components',
				onClick: this._sortByCount.bind(this, 1),
			}),
			DOM.h('li', {
				class: 'sort-desc',
				innerText: '#components',
				onClick: this._sortByCount.bind(this, -1),
			}),
		]);

		// node list
		this._nodeListElement = DOM.h('ul', {
			class: 'node-list',
		});
		
		// content
		const containerContent = DOM.h('div', {
			class: 'node-container-content',
		}, [
			this._buttonGroupElement,
			this._sortOptionsElement,
			this._nodeListElement,
		]);

		// root
		this._rootElement = DOM.h('div', {
			class: this._properties.class,
			id: this._properties.id,
			onScroll: () => app.redrawEdges(),
		}, [
			// title
			DOM.h('h2', {
				class: 'node-container-title',
				innerText: this._properties.title,
				onClick: () => {
					if (containerContent.hasAttribute('hidden')) {
						containerContent.removeAttribute('hidden');
					} else {
						containerContent.setAttribute('hidden', 'hidden');
					}

					app.redrawEdges();
				},
			}),
			// content
			containerContent,
		]);

		return this._rootElement;
	}

	reset() {
		this._nodeList = [];
		this._nodeListElement.innerHTML = '';

		this.toggleControls();
	}

	_sortByName(sortOrder) {
		this._nodeList.sort((a, b) => {
			return sortOrder * a.name.localeCompare(b.name);
		});

		this._sort();
	}

	_sortByCount(sortOrder) {
		this._nodeList.sort((a, b) => {
			var aCount = (a instanceof Group) ? a.vertexList.length : 1;
			var bCount = (b instanceof Group) ? b.vertexList.length : 1;

			return sortOrder * (aCount - bCount);
		});

		this._sort();
	}

	_sort() {
		this._nodeList.forEach(node => {
			node.remove(true);
			this._nodeListElement.appendChild(node.render());
		});
	}

	_renderButtons() {
		throw new AbstractMethodError;
	}

	_displayControls() {
		this._buttonGroupElement.removeAttribute('hidden');
		this._sortOptionsElement.removeAttribute('hidden');
	}

	_hideControls() {
		this._buttonGroupElement.setAttribute('hidden', 'hidden');
		this._sortOptionsElement.setAttribute('hidden', 'hidden');
	}

	_toggleControls() {
		if (this._nodeList.length > 0) {
			this._displayControls();
		} else {
			this._hideControls();
		}
	}
}
