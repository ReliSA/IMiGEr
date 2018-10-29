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
		this.minimapComponent = new Minimap;
		/** @prop {StatusBar} statusBarComponent */
		this.statusBarComponent = new StatusBar;
	}

	render() {
		this._rootElement = DOM.h('div', {
			class: 'sidebar',
			id: 'sidebar',
		}, [
			DOM.h('nav', {
				class: 'sidebar-navbar',
				id: 'uploadMenu',
			}, [
				// toggle unconnected list button
				DOM.h('button', {
					class: 'button',
					id: 'unconnectedButton',
					title: 'Unconnected nodes',
					innerText: 'Unconnected nodes',
					onClick: () => {
						this.unconnectedNodeListComponent.toggle();
						app.redrawEdges();
					},
				}, [
					DOM.h('img', {
						src: 'images/tochange/unconnected.gif',
						alt: 'Icon of "toggle unconnected nodes list" action',
					}),
				]),
			]),
			DOM.h('div', {
				class: 'sidebar-container',
			}, [
				this.unconnectedNodeListComponent.render(),
			]),
			this.excludedNodeListComponent.render(),
			DOM.h('div', {
				class: 'sidebar-bottom',
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
