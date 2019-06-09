class Sidebar {
	/**
	 * @constructor
	 */
	constructor() {
		/** @prop {SidebarUnconnectedNodeList} unconnectedNodeListComponent */
		this.unconnectedNodeListComponent = new SidebarUnconnectedNodeList;
		/** @prop {SidebarExcludedNodeList} excludedNodeListComponent */
		this.excludedNodeListComponent = new SidebarExcludedNodeList;
		/** @prop {Minimap} minimapComponent */
		this.minimapComponent = new Minimap('#graph');
		/** @prop {StatusBar} statusBarComponent */
		this.statusBarComponent = new StatusBar;
	}

	render() {
		this._rootElement = DOM.h('div', {
			class: 'sidebar',
			id: 'sidebar',
		}, [
			this.unconnectedNodeListComponent.render(),
			this.excludedNodeListComponent.render(),
			DOM.h('div', {
				class: 'sidebar-bottom affix-bottom',
			}, [
				this.minimapComponent.render(),
				this.statusBarComponent.render(),
			]),
		]);

		return this._rootElement;
	}

	reset() {
		// reset lists
		this.unconnectedNodeListComponent.reset();
		this.excludedNodeListComponent.reset();

		// reset status bar
		this.statusBarComponent.reset();
	}
}
