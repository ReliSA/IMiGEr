package cz.zcu.kiv.offscreen.servlets.api;

import com.google.gson.JsonObject;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.vo.UserVO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * This servlet is used to query details of the logged-in user via Rest API
 */
public class GetLoggedInUser extends BaseServlet {

    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.debug("Processing request");

        // default values if the user is not logged in
        boolean loggedIn = false;
        UserVO user = null;

        // check if the user is logged and if yes, collect his details
        if (isLoggedIn(request)) {
            logger.debug("Logged user");
            loggedIn = true;
            user = getUserVO(request);
        }

        // build the JSON response
        JsonObject loggedInUserJSON = new JsonObject();
        loggedInUserJSON.addProperty("isLoggedIn", loggedIn);
        if (user != null) {
            loggedInUserJSON.addProperty("userId", user.getId());
            loggedInUserJSON.addProperty("userName", user.getUsername());
        }

        // return the response
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(loggedInUserJSON.toString());
        response.getWriter().flush();

        logger.debug("Request processed");
    }
}
