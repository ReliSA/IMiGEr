package cz.zcu.kiv.offscreen.servlets.rest;

import com.google.common.base.Strings;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author Tomáš Šimandl
 */
public class RawInput extends BaseServlet {
    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.debug("Processing request");
        request.setCharacterEncoding("UTF-8");
        String diagram = request.getParameter("rawDiagram");
        String type = "raw";

        if (Strings.isNullOrEmpty(diagram)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            logger.debug("Diagram json is empty");
            return;
        }

        request.getSession().setAttribute("json_graph", diagram);
        request.getSession().setAttribute("json_graph_type", type);
        response.sendRedirect(getServletContext().getInitParameter("HOME_URL") + "graph");
        logger.debug("Send redirect to /graph");
    }
}
