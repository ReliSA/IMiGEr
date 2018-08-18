<% if ( request.getSession().getAttribute("logged_user") == "1" ){ %>

	<div class="login_box">
		<%= request.getSession().getAttribute("logged_user_nick") %> <a href="log-out">Logout</a>
	</div>
				
<% } else { %>

	<% if ( request.getSession().getAttribute("logged_user_err") != null && request.getSession().getAttribute("logged_user_err").toString() == "1") { %>
		<script type="text/javascript">
			$(document).ready(function() {
				$('.login_popup .err_msg').html("Incorrect Login name or Password.");
				$('#login_name').val('<%= request.getSession().getAttribute("logged_user_err_name") %>');
		    	$('.login_popup').show();		    	
		    });
	     	
		</script>
	<% 
		request.getSession().setAttribute("logged_user_err", null);
		request.getSession().setAttribute("logged_user_err_name", null);
	} %>			
	<div class="login_box">
		<a href="#" onclick="$('.register_popup').hide(); $('.login_popup').toggle()">Login</a>
		<a href="#" onclick="$('.login_popup').hide(); $('.register_popup').toggle()">Register</a>
	</div>
	<div class="login_popup">
		<form action="log-in" method="post">
			<div class="err_msg"></div>
			<div class="not_msg"></div>
	  		<table>
	  			<tr>
					<td>Login name:</td>
					<td><input type="text" name="login_name" id="login_name"></td>
				</tr>
	  			<tr>
					<td>Password:</td>
					<td><input type="password" name="password"  id="login_password"></td>
				</tr>
	  			<tr>
					<td></td>
					<td><input type="submit" value="Login"></td>
				</tr>
	  		</table>
	  	</form>
	</div>
	<div class="register_popup">
		<form action="api/register" method="post">
			<div class="err_msg"></div>
			<div class="not_msg"></div>
	  		<table>	  		
	  			<tr>
					<td>Name:</td>
					<td><input type="text" name="user_name" id="user_name" ></td>
				</tr>
	  			<tr>
					<td>E-mail:</td>
					<td><input type="text" name="user_email" id="user_email"></td>
				</tr>
	  			<tr>
					<td>Login name:</td>
					<td><input type="text" name="user_nick" id="user_nick"></td>
				</tr>
	  			<tr>
					<td>Password:</td>
					<td><input type="password" name="user_password" id="user_password"></td>
				</tr>
	  			<tr>
					<td>Password again:</td>
					<td><input type="password" name="user_password_2" id="user_password_2"></td>
				</tr>
	  			<tr>
					<td></td>
					<td><input type="button" value="Register" onclick="send_register(); return false;"></td>
				</tr>
	  		</table>
	  	</form>
	</div>
	
<% } %>