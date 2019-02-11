package cz.zcu.kiv.offscreen.servlets.api;

import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.dao.DiagramDAO;
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

        DiagramDAO diagramDAO = new DiagramDAO();

        if (diagramDAO.getDiagramUserId(Integer.parseInt(diagramId)) != loggedUserId) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            logger.debug("User is not owner of diagram");
            return;
        }

        diagramDAO.deleteDiagram(Integer.parseInt(diagramId));
        logger.debug("Diagram removed");

        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }
}
