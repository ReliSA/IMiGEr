package cz.zcu.kiv.offscreen.servlets.api;

import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Logout extends BaseServlet {
    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        logger.debug("Processing request");
        request.getSession().setAttribute("isLoggedIn", false);
        request.getSession().setAttribute("userId", null);
        request.getSession().setAttribute("user", null);

        response.setStatus(HttpServletResponse.SC_RESET_CONTENT);
        logger.debug("Response RESET CONTENT");
    }
}
