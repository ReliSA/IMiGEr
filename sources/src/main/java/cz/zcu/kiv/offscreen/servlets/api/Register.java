package cz.zcu.kiv.offscreen.servlets.api;

import com.google.gson.JsonObject;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.User;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.validator.routines.EmailValidator;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class Register extends BaseServlet {

	private static final Logger logger = LogManager.getLogger();

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

		JsonObject errors = new JsonObject();

		if (StringUtils.isBlank(name)) {
			errors.addProperty("name", "Please enter name.");
			logger.debug("Empty name");
		}

		if (StringUtils.isBlank(email)) {
			errors.addProperty("email", "Please enter e-mail address.");
			logger.debug("Empty e-mail address");

		} else if (!EmailValidator.getInstance().isValid(email)) {
			errors.addProperty("email", "Please enter valid e-mail address.");
			logger.debug("Invalid e-mail address");

		} else if (user.isEmailExists(email)) {
			errors.addProperty("email", "E-mail already exists.");
			logger.debug("E-mail exists");
		}

		if (StringUtils.isBlank(username)) {
			errors.addProperty("username", "Please enter username.");
			logger.debug("Empty user name");

		} else if (user.isNickExists(username)) {
			errors.addProperty("username", "Nickname already exists.");
			logger.debug("Username(nickname) exists");
		}
    	
    	if (StringUtils.isBlank(password) || StringUtils.isBlank(passwordCheck)) {
    		errors.addProperty("password", "Please enter password.");
			logger.debug("Empty password");

		} else if (password.length() < 5) {
    		errors.addProperty("password", "Passwords must be at least 5 characters long.");
			logger.debug("Invalid password");

		} else if (!password.equals(passwordCheck)) {
			errors.addProperty("passwordCheck", "Passwords must be equal.");
			logger.debug("Passwords not match");
		}

    	if (errors.size() == 0) {
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
    		JsonObject json = new JsonObject();
    		json.add("error", errors);

			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.setContentType("application/json");
			response.getWriter().write(json.toString());
			response.getWriter().flush();
			logger.debug("Response BAD REQUEST");
		}
    }
	
}
