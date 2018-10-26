class DiagramUpdatedEvent extends CustomEvent {
	constructor(diagram) {
		super(DiagramUpdatedEvent.name, {
			detail: diagram,
		});
	}
}

DiagramUpdatedEvent.name = 'imiger.diagramUpdated';
