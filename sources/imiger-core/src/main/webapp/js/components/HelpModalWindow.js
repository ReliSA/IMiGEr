/**
 * Class representing a modal window.
 */
class HelpModalWindow extends ModalWindow {
	/**
	 * @constructor
	 */
	constructor() {
		super();

		this.keyboardShortcuts = [{
			shortcut: '<kbd>ctrl</kbd> and <kbd>+</kbd>',
			action: 'Zoom in.',
		}, {
			shortcut: '<kbd>ctrl</kbd> and <kbd>-</kbd>',
			action: 'Zoom out.',
		}, {
			shortcut: '<kbd>ctrl</kbd> + <kbd>0</kbd>',
			action: 'Reset zoom.',
		}, {
			shortcut: '<kbd>ctrl</kbd> + <kbd>f</kbd>',
			action: 'Focus search field.',
		}, {
			shortcut: '<kbd>ctrl</kbd> + <kbd>s</kbd>',
			action: 'Open Save diagram dialog window.',
		}, {
			shortcut: '<kbd>ctrl</kbd> + <kbd>m</kbd>',
			action: 'Toggle minimap.',
		}, {
			shortcut: '<kbd>alt</kbd> + click node',
			action: 'Exclude node.',
		}, {
			shortcut: 'doubleclick graph',
			action: 'Zoom in.',
		}, {
			shortcut: 'highlight node + <kbd>arrows</kbd>',
			action: 'Move node.',
		}, {
			shortcut: '<kbd>F1</kbd>',
			action: 'Display this help.',
		}];
	}

	/**
	 * @inheritdoc
	 */
	render() {
		super.render();

		this._bodyElement.appendChild(DOM.h('table', {}, [
			DOM.h('thead', {}, [
				DOM.h('tr', {}, [
					DOM.h('th', {
						innerText: 'Keyboard shortcut',
					}),
					DOM.h('th', {
						innerText: 'Action',
					}),
				]),
			]),
			DOM.h('tbody', {}, this.keyboardShortcuts.map(keyboardShortcut => {
				return DOM.h('tr', {}, [
					DOM.h('td', {
						innerHTML: keyboardShortcut.shortcut,
					}),
					DOM.h('td', {
						innerText: keyboardShortcut.action,
					}),
				]);
			})),
		]));

		return this._rootElement;
	}
}
