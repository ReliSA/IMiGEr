class LoggedInEvent extends CustomEvent {
	constructor(user) {
		super(LoggedInEvent.name, {
			detail: user,
		});
	}
}

LoggedInEvent.name = 'imiger.userLoggedIn';
