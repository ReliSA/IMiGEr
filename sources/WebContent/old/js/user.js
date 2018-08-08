
/**
* Funkce odesle registracni formular
*/
function send_register() {

	// var viewport_html = $('#viewport').html();
	// var rightpanel_html = $('#rightPanel').html();
	
	$.post('api/register', { user_name:  $('#user_name').val(),
		user_email: $('#user_email').val(),
		user_nick: $('#user_nick').val(),
		user_password: $('#user_password').val(),
		user_password_2: $('#user_password_2').val()},
	function(data){
		if (data.ok != null && data.ok == "ok"){
			$('.register_popup .err_msg').html("");
			$('.register_popup .err_msg').hide();
			
			$('.register_popup').hide();
			$('.login_popup').show();
			var user_login_name = $('#user_nick').val();
			clear_register_form();
			$('.login_popup .not_msg').html("User registered.<br />Please login.");
			$('#login_name').val(user_login_name);
			
			}else if (data.err != null){
			$('.register_popup .err_msg').html(data.err.replace(/\./g,".<br />"));
		}
	});
}

/**
 * Vycisti registracni formular
 */
function clear_register_form(){
	$('#user_name').val('');
	$('#user_email').val('');
	$('#user_nick').val('');
	$('#user_password').val('');
	$('#user_password_2').val('');
}