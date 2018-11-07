<div class="user-menu loggedInOnly">
	<span id="usernameLabel">${user.username}</span> <a href="api/log-out" class="button" id="logoutButton">Log out</a>
</div>

<div class="user-menu loggedOutOnly">
	<button class="button" id="toggleLoginPopupButton">Log in</a>
	<button class="button" id="toggleRegisterPopupButton">Register</a>
</div>

<div class="login_popup hidden" id="loginPopup">
	<form action="api/log-in" method="post" name="loginForm">
		<div class="err_msg"></div>
		<div class="not_msg"></div>
		<table>
			<tr>
				<td>
					<label for="loginUsername">Login name:</label>
				</td>
				<td>
					<input type="text" name="username" id="loginUsername">
				</td>
			</tr>
			<tr>
				<td>
					<label for="loginPassword">Password:</label>
				</td>
				<td>
					<input type="password" name="password" id="loginPassword">
				</td>
			</tr>
			<tr>
				<td></td>
				<td>
					<button type="submit" class="button">Login</button>
				</td>
			</tr>
		</table>
	</form>
</div>

<div class="register_popup hidden" id="registerPopup">
	<form action="api/register" method="post" name="registerForm">
		<table>	  		
			<tr>
				<td>
					<label for="registerName">Name:</label>
				</td>
				<td>
					<input type="text" name="name" id="registerName">
				</td>
			</tr>
			<tr>
				<td>
					<label for="registerEmail">E-mail:</label>
				</td>
				<td>
					<input type="text" name="email" id="registerEmail">
				</td>
			</tr>
			<tr>
				<td>
					<label for="registerUsername">Login name:</label>
				</td>
				<td>
					<input type="text" name="username" id="registerUsername">
				</td>
			</tr>
			<tr>
				<td>
					<label for="registerPassword">Password:</label>
				</td>
				<td>
					<input type="password" name="password" id="registerPassword">
				</td>
			</tr>
			<tr>
				<td>
					<label for="registerPasswordCheck">Password again:</label>
				</td>
				<td>
					<input type="password" name="passwordCheck" id="registerPasswordCheck">
				</td>
			</tr>
			<tr>
				<td></td>
				<td>
					<button type="submit" class="button">Register</button>
				</td>
			</tr>
		</table>
	</form>
</div>
