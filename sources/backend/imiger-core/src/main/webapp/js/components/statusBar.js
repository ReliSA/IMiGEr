/**
 * Class representing the sidebar status bar. It displays number of components loaded in the diagram.
 */
class StatusBar {
	/**
	 * Creates a new DOM element representing the status bar in memory.
	 * @public
	 * @returns {HTMLElement} HTML DOM element.
	 */
	render() {
		this._componentCounterElement = DOM.h('span', {
			class: 'component-counter',
		});

		this._rootElement = DOM.h('nav', {
			class: 'status-bar',
		}, [
			this._componentCounterElement,
			DOM.h('span', {
				class: 'link',
				innerText: 'toggle minimap',
				title: 'toggle minimap [ctrl + m]',
				onClick: this._toggleMinimap.bind(this),
			}),
		]);

		return this._rootElement;
	}

	/**
	 * Sets a new count of components loaded in the diagram.
	 * @public
	 * @param {integer} count New count of components.
	 */
	set componentCount(count) {
		this._componentCounterElement.innerText = 'loaded components: ' + count;
	}

	/**
	 * Resets the information displayed in the status bar.
	 * @public
	 */
	reset() {
		this._componentCounterElement.innerText = '';
	}

	/**
	 * @private
	 */
	_toggleMinimap(e) {
		e.preventDefault();
		app.sidebarComponent.minimapComponent.toggle();
	}
}