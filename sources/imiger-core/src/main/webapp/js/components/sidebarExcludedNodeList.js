/**
 * @constructor
 * @param {object} props Properties of the node list.
 */
class SidebarExcludedNodeList extends SidebarNodeList {
	/**
	 * @constructor
	 */
	constructor() {
		super({
			title: 'Excluded nodes',
			class: 'node-container excluded-nodes',
			id: 'excludedNodeListComponent',
		});
	}

	_renderButtons() {
		return [
			DOM.h('button', {
				class: 'button include-all-button',
				title: 'Display all excluded nodes in viewport',
				onClick: this._onIncludeAllClick.bind(this),
			}, [
				DOM.h('img', {
					src: 'images/icomoon/cross.svg',
					alt: 'Icon of "display all excluded nodes in viewport" action',
				}),
			])
		];
	}

	_onIncludeAllClick() {
		let nodeListCopy = this.nodeList.slice(0);
		nodeListCopy.forEach(node => {
			node.include();
		});

		this._toggleControls();
	}
}
