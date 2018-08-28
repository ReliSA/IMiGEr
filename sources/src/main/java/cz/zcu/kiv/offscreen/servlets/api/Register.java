package cz.zcu.kiv.offscreen.servlets.api;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.common.base.Strings;
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

		if (Strings.isNullOrEmpty(name)) {
			errors.put("name", "Please enter name.");
		}

		if (Strings.isNullOrEmpty(email)) {
			errors.put("email", "Please enter e-mail address.");
		} else if (!isEmailAddressValid(email)) {
			errors.put("email", "Please enter valid e-mail address.");
		} else if (user.existsEmail(email)) {
			errors.put("email", "E-mail already exists.");
		}

		if (Strings.isNullOrEmpty(username)) {
			errors.put("username", "Please enter username.");
		} else if (user.existsNick(username)) {
			errors.put("username", "Nickname already exists.");
		}
    	
    	if (Strings.isNullOrEmpty(password) || Strings.isNullOrEmpty(passwordCheck)) {
    		errors.put("password", "Please enter password.");
    	} else if (password.length() < 5) {
    		errors.put("password", "Passwords must be at least 5 characters long.");
		} else if (!password.equals(passwordCheck)) {
			errors.put("passwordCheck", "Passwords must be equal.");
    	}

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
			JSONObject json = new JSONObject();
			json.put("error", new JSONObject(errors));

			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.setContentType("application/json");
			response.getWriter().write(json.toString());
			response.getWriter().flush();
		}
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
