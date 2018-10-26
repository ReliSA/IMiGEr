class RegisteredEvent extends CustomEvent {
	constructor() {
		super(RegisteredEvent.name);
	}
}

RegisteredEvent.name = 'imiger.userRegistered';
