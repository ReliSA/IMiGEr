package cz.zcu.kiv.offscreen.servlets.api;

import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class RemoveDiagram extends BaseServlet {
    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.debug("Processing request");
        if (!isLoggedIn(request)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            logger.debug("User is unauthorized");
            return;
        }

        int loggedUserId = getUserId(request);

        String diagramId = request.getParameter("diagramId");

        if (StringUtils.isBlank(diagramId)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            logger.debug("Empty diagram id");
            return;
        }

        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db, Integer.parseInt(diagramId));

        if (diagram.getUserId() != loggedUserId) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            logger.debug("User is not owner of diagram");
            return;
        }

        diagram.delete();
        logger.debug("Diagram removed");

        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }
}
