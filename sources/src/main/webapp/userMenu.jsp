<c:if test="${isLoggedIn}">
	<div class="login_box">
		${user.username} <a href="api/log-out" id="logoutButton">Log out</a>
	</div>
</c:if>

<c:if test="${!isLoggedIn}">
	<div class="login_box">
		<button id="toggleLoginPopupButton">Log in</a>
		<button id="toggleRegisterPopupButton">Register</a>
	</div>
</c:if>

<div class="login_popup hidden" id="loginPopup">
	<form action="api/log-in" method="post" name="loginForm">
		<div class="err_msg"></div>
		<div class="not_msg"></div>
		<table>
			<tr>
				<td>
					Login name:
				</td>
				<td>
					<input type="text" name="username">
				</td>
			</tr>
			<tr>
				<td>
					Password:
				</td>
				<td>
					<input type="password" name="password">
				</td>
			</tr>
			<tr>
				<td></td>
				<td>
					<button type="submit">Login</button>
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
					Name:
				</td>
				<td>
					<input type="text" name="user_name" id="user_name">
				</td>
			</tr>
			<tr>
				<td>
					E-mail:
				</td>
				<td>
					<input type="text" name="user_email" id="user_email">
				</td>
			</tr>
			<tr>
				<td>
					Login name:
				</td>
				<td>
					<input type="text" name="user_nick" id="user_nick">
				</td>
			</tr>
			<tr>
				<td>
					Password:
				</td>
				<td>
					<input type="password" name="user_password" id="user_password">
				</td>
			</tr>
			<tr>
				<td>
					Password again:
				</td>
				<td>
					<input type="password" name="user_password_2" id="user_password_2">
				</td>
			</tr>
			<tr>
				<td></td>
				<td>
					<button type="submit">Register</button>
				</td>
			</tr>
		</table>
	</form>
</div>
