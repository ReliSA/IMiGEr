package cz.zcu.kiv.offscreen.servlets;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 *
 * @author Jindra PavlĂ­kovĂˇ <jindra.pav2@seznam.cz>
 */
public class ShowGraph extends BaseServlet {
    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.debug("Processing request");

        // render
        // TODO: Return graph display page of the Vue.JS application as soon as it's available
        // TODO: It is also possible that this page will be removed completely and the app will be a SPA
        RequestDispatcher rd = getServletContext().getRequestDispatcher("/graph_display.html");
        rd.forward(request, response);
        logger.debug("Request processed");
    }

}
