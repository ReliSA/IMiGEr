/**
 * Class representing a popover revealed on edge click to display its compatibility information.
 * @see Edge
 */
class EdgePopover extends Popover {
	/**
	 * @inheritdoc
	 */
	render() {
		super.render();

		this._titleElement.innerText = 'Edge details';

		this._detailsListElement = DOM.h('ul');
		this._bodyElement.appendChild(this._detailsListElement);

		return this._rootElement;
	}

	/**
	 * Sets the contents of the popover.
	 * @param {array} subedgeInfoList List of various edge information.
	 */
	set body(subedgeInfoList) {
		if (subedgeInfoList.length === 0) return;

		subedgeInfoList.filter(subedgeInfo => {
			return subedgeInfo.attributes.length > 0;
		}).forEach(subedgeInfo => {
			const sublistElement = DOM.h('ul');
			subedgeInfo.attributes.forEach(attribute => {
				sublistElement.appendChild(new Attribute(attribute).render());
			});

			this._detailsListElement.appendChild(DOM.h('li', {
				innerText: app.archetype.edge[subedgeInfo.archetype].name,
			}, [
				sublistElement,
			]));
		});
	}
}
