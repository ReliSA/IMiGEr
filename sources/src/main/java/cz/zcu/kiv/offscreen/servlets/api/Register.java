package cz.zcu.kiv.offscreen.servlets.api;

import com.google.common.base.Strings;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Register extends BaseServlet {
	private static final Logger logger = LogManager.getLogger();
	private static final String EMAIL_ADDRESS_PATTERN = "^[A-Za-z0-9-\\+_]+(\\.[A-Za-z0-9-_]+)*@" +
    											"[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*" +
    											"(\\.[A-Za-z]{2,})$";
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		logger.debug("Processing request");
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
			logger.debug("Empty name");
		}

		if (Strings.isNullOrEmpty(email)) {
			errors.put("email", "Please enter e-mail address.");
			logger.debug("Empty e-mail address");

		} else if (!isEmailAddressValid(email)) {
			errors.put("email", "Please enter valid e-mail address.");
			logger.debug("Invalid e-mail address");

		} else if (user.isEmailExists(email)) {
			errors.put("email", "E-mail already exists.");
			logger.debug("E-mail exists");
		}

		if (Strings.isNullOrEmpty(username)) {
			errors.put("username", "Please enter username.");
			logger.debug("Empty user name");

		} else if (user.isNickExists(username)) {
			errors.put("username", "Nickname already exists.");
			logger.debug("Username(nickname) exists");
		}
    	
    	if (Strings.isNullOrEmpty(password) || Strings.isNullOrEmpty(passwordCheck)) {
    		errors.put("password", "Please enter password.");
			logger.debug("Empty password");

		} else if (password.length() < 5) {
    		errors.put("password", "Passwords must be at least 5 characters long.");
			logger.debug("Invalid password");

		} else if (!password.equals(passwordCheck)) {
			errors.put("passwordCheck", "Passwords must be equal.");
			logger.debug("Passwords not match");
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
			logger.debug("User created");

		} else {
			JSONObject json = new JSONObject();
			json.put("error", new JSONObject(errors));

			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.setContentType("application/json");
			response.getWriter().write(json.toString());
			response.getWriter().flush();
			logger.debug("Response BAD REQUEST");
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
