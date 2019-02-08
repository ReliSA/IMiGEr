class LoggedOutEvent extends CustomEvent {
	constructor() {
		super(LoggedOutEvent.name);
	}
}

LoggedOutEvent.name = 'imiger.userLoggedOut';
