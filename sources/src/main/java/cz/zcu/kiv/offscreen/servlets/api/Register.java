package cz.zcu.kiv.offscreen.servlets.api;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.User;

public class Register extends BaseServlet {
    
    private static final String EMAIL_ADDRESS_PATTERN = "^[A-Za-z0-9-\\+_]+(\\.[A-Za-z0-9-_]+)*@" +
    											"[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*" +
    											"(\\.[A-Za-z]{2,})$";
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String name = request.getParameter("name");
		String email = request.getParameter("email");
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		String passwordCheck = request.getParameter("passwordCheck");

		DB db = new DB(getServletContext());
		User user = new User(db);

		Map<String, String> errors = new HashMap<>();

		if (name == null || name.length() == 0) {
			errors.put("user_name", "Please enter name.");
		}

		if (email == null || email.length() == 0) {
			errors.put("user_email", "Please enter e-mail address.");
		} else if (!isEmailAddressValid(email)) {
			errors.put("user_email", "Please enter valid e-mail address.");
		} else if (user.existsEmail(email)) {
			errors.put("user_email", "E-mail already exists.");
		}

		if (username == null || username.length() == 0) {
			errors.put("user_nick", "Please enter username.");
		} else if (user.existsNick(username)) {
			errors.put("user_nick", "Nickname already exists.");
		}
    	
    	if (password == null || password.length() == 0 || passwordCheck == null || passwordCheck.length() == 0) {
    		errors.put("user_password", "Please enter password.");
    	} else if (!password.equals(passwordCheck)) {
    		errors.put("user_password", "Passwords must be equal.");
    	} else if (password.length() < 5) {
    		errors.put("user_password", "Passwords must be at least 5 characters long.");
    	}

    	JSONObject json = new JSONObject();
    	
    	if (errors.isEmpty()) {
    		Map<String, String> userMap = new HashMap<>();
    		userMap.put("name", name);
    		userMap.put("email", email);
    		userMap.put("nick", username);
    		userMap.put("password", password);
    		userMap.put("session", request.getSession().getId());

    		user.register(userMap);

			response.setStatus(HttpServletResponse.SC_CREATED);

    	} else {
    		json.put("error", errors);
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    	}

		response.setContentType("application/json");
		response.getWriter().write(json.toString());
		response.getWriter().flush();
    }
    
    /**
     * Method verify validity of email address
     * 
     * @param emailAddress - email address
     * @return true - email address is ok
     * 		   false - email address is not correct
     */
    private boolean isEmailAddressValid(String emailAddress) {
    	Pattern pattern = Pattern.compile(EMAIL_ADDRESS_PATTERN);
    	Matcher matcher = pattern.matcher(emailAddress);
		return matcher.matches();
    }
	
}
