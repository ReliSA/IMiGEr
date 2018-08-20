package cz.zcu.kiv.offscreen.servlets;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.User;

public class Register extends HttpServlet {
    
    private static final String EMAIL_ADDRESS_PATTERN = "^[A-Za-z0-9-\\+_]+(\\.[A-Za-z0-9-_]+)*@" +
    											"[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*" +
    											"(\\.[A-Za-z]{2,})$";
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	DB db = new DB(getServletContext());
    	User user = new User(db);
    	
    	String err = "";
    	if (request.getParameter("user_name") == null || request.getParameter("user_name").length() == 0) {
    		err += "Please fill name.";
		}

    	if (request.getParameter("user_email") == null || request.getParameter("user_email").length() == 0) {
    		err += "Please fill e-mail address.";
    	} else if (user.existsEmail(request.getParameter("user_email"))) {
    		err += "E-mail already exists.";
    	} else if (!isEmailAddressValid(request.getParameter("user_email"))) {
    		err += "Please correct e-mail address.";
    	}

    	if (request.getParameter("user_nick") == null || request.getParameter("user_nick").length() == 0) {
    		err += "Please fill nickname.";
    	} else if (user.existsNick(request.getParameter("user_nick"))) {
    		err += "Nickname already exists.";
    	}
    	
    	if (request.getParameter("user_password") == null || request.getParameter("user_password").length() == 0 ||
    	     request.getParameter("user_password_2") == null || request.getParameter("user_password_2").length() == 0) {
    		err += "Please fill password.";
    	} else if (request.getParameter("user_password").compareTo(request.getParameter("user_password_2")) != 0) {
    		err += "Passwords must be same.";    		
    	} else if (request.getParameter("user_password").length() <= 4) {
    		err += "Passwords must be at least 5 characters long.";
    	}

		JSONObject jsonObject = new JSONObject();
    	
    	if (err.length() == 0) {
    		Map<String, String> user_param = new HashMap<>();
    		user_param.put("name", request.getParameter("user_name"));
    		user_param.put("email", request.getParameter("user_email"));
    		user_param.put("nick", request.getParameter("user_nick"));
    		user_param.put("password", request.getParameter("user_password"));
    		user_param.put("session", request.getSession().getId());

    		user.register(user_param);
    		
    		jsonObject.put("ok", "ok");

    	} else {
    		jsonObject.put("err", err);
    		response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    	}

		response.setContentType("application/json");
		response.getWriter().write(jsonObject.toString());
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
