class SidebarUnconnectedNodeList extends SidebarNodeList {
	/**
	 * @constructor
	 */
	constructor() {
		super({
			title: 'Unconnected vertices',
			class: 'node-container unconnected-nodes',
			id: 'unconnectedNodeListComponent',
		});
	}

	render() {
		this._rootElement = super.render();
		this._displayControls();

		return this._rootElement;
	}

	toggle() {
		if (this._rootElement.hasAttribute('hidden')) {
			this._rootElement.removeAttribute('hidden');
		} else {
			this._rootElement.setAttribute('hidden', 'hidden');
		}
	}

	_renderButtons() {
		return [
			// include all button
			DOM.h('button', {
				class: 'button include-all-button',
				title: 'Display all unconnected nodes in viewport',
				onClick: this._onIncludeAllClick.bind(this),
			}, [
				DOM.h('img', {
					src: 'images/unconnected/uncon_left.png',
					alt: 'Icon of "display all unconnected nodes in viewport" action',
				}),
			]),
			// exclude all button
			DOM.h('button', {
				class: 'exclude-all-button button',
				title: 'Display all unconnected nodes in sidebar',
				onClick: this._onExcludeAllClick.bind(this),
			}, [
				DOM.h('img', {
					src: 'images/unconnected/uncon_right.png',
					alt: 'Icon of "display all unconnected nodes in sidebar" action',
				})
			]),
		];
	}

	_toggleControls() {
		// do nothing
	}

	_onIncludeAllClick() {
		let nodeListCopy = this.nodeList.slice(0);
		nodeListCopy.forEach(node => {
			node.include();
		});
	}

	_onExcludeAllClick() {
		app.vertexList.filter(vertex => {
			return vertex.isUnconnected;
		}).forEach(vertex => {
			vertex.exclude();
			this.addNode(vertex);
		});
	}
}
