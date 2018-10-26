/**
 * Class representing a modal window.
 */
class SaveDiagramModalWindow extends ModalWindow {
	/**
	 * @inheritdoc
	 */
	render() {
		super.render();

		this._form = DOM.h('form', {
			action: Constants.API.saveDiagram,
			method: 'post',
			onSubmit: this._saveDiagram.bind(this),
		}, [
			DOM.h('table', {}, [
				DOM.h('tr', {}, [
					DOM.h('td', {}, [
						DOM.h('label', {
							for: 'name',
							innerText: 'Diagram name:',
						}),
					]),
					DOM.h('td', {}, [
						DOM.h('input', {
							type: 'text',
							name: 'diagramName',
							value: '',
							id: 'name',
							required: 'required',
						}),
					]),
				]),
				DOM.h('tr', {}, [
					DOM.h('td', {}, [
						DOM.h('label', {
							for: 'isPublic',
							innerText: 'Is public:',
						}),
					]),
					DOM.h('td', {}, [
						DOM.h('input', {
							type: 'checkbox',
							name: 'diagramPublic',
							value: '1',
							id: 'isPublic',
						}),
					]),
				]),
				DOM.h('tr', {}, [
					DOM.h('td'),
					DOM.h('td', {}, [
						DOM.h('button', {
							type: 'submit',
							class: 'button',
							innerText: 'Save',
						}),
					]),
				]),
			]),
		])
		this._bodyElement.appendChild(this._form);

		return this._rootElement;
	}

	/**
	 * @inheritdoc
	 */
	open() {
		super.open();

		if (app.diagram !== null) {
			this._form.diagramName.value = app.diagram.name;
			this._form.diagramPublic.checked = app.diagram.public;
		}

		this._form.diagramName.focus();
	}

	/**
	 * @inheritdoc
	 */
	close() {
		super.close();

		this._form.reset();
	}

	/**
	 * Saves diagram.
	 * @param {Event} e Submit event.
	 */
	async _saveDiagram(e) {
		e.preventDefault();

		const body = new URLSearchParams;
		body.set('id', app.diagram === null ? '' : app.diagram.id);
		body.set('name', e.target.diagramName.value);
		body.set('graphJson', JSON.stringify(app.graphExporter.run()));
		body.set('public', (e.target.diagramPublic.checked | 0).toString());

		try {
			const response = await AJAX.do(e.target.action, {
				method: e.target.method,
				credentials: 'same-origin',
				body,
			});
			const data = await response.json();

			document.dispatchEvent(new DiagramUpdatedEvent(data));

			this.close();
			alert('Diagram was successfully saved.');

		} catch (error) {
			if (error instanceof HttpError) {
				switch (error.response.status) {
					case 401:
						alert('You are either not logged in or not an owner of this diagram.');
						break;
					default:
						console.error(error);
						alert('Something went wrong. Check console for more details.');
				}
			} else {
				console.error(error);
				alert('Something went wrong. Check console for more details.');
			}
		}
	}
}
