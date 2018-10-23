/**
 * Class representing a popover revealed on vertex interface symbol click to display its attributes.
 * @see Vertex
 */
class VertexPopover extends Popover {
	/**
	 * @inheritdoc
	 */
	render() {
		super.render();

		this._detailsListElement = DOM.h('ul');
		this._bodyElement.appendChild(this._detailsListElement);

		return this._rootElement;
	}

	/**
	 * Sets the title of the popover.
	 * @public
	 * @param {array} attributeList List of attributes.
	 */
	set title(name) {
		this._titleElement.innerText = name;
	}

	/**
	 * Sets the body of the popover.
	 * @public
	 * @param {array} attributeList List of attributes.
	 */
	set body(attributeList) {
		if (attributeList.length === 0) return;

		attributeList.forEach(attribute => {
			this._detailsListElement.appendChild(new Attribute(attribute).render());
		});
	}
}
