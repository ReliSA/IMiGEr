package cz.zcu.kiv.offscreen.servlets;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class UploadFiles extends BaseServlet {
    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.debug("Processing request");

        // render
        // TODO: Return main page of the Vue.JS application as soon as it's available
        RequestDispatcher rd = getServletContext().getRequestDispatcher("/welcome_page.html");
        rd.forward(request, response);
        logger.debug("Request processed");
    }
}
