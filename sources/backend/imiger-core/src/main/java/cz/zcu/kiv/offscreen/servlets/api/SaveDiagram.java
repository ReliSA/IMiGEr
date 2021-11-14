package cz.zcu.kiv.offscreen.servlets.api;

import com.google.gson.Gson;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.dao.DiagramDAO;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class SaveDiagram extends BaseServlet {
    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.debug("Processing request");

        if (!isLoggedIn(request)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            logger.debug("User is unauthorized");
            return;
        }

        request.setCharacterEncoding("UTF-8");

        int loggedUserId = getUserId(request);

        String diagramId = request.getParameter("id");
        String name = request.getParameter("name");
        String graphJson = request.getParameter("graphJson");
        String isPublic = request.getParameter("public");

        // input parameters are invalid
        if (StringUtils.isBlank(name) || StringUtils.isBlank(graphJson)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            logger.debug("Input name or json is empty");
            return;
        }

        DiagramDAO diagramDAO = new DiagramDAO();

        int intDiagramId;

        if (StringUtils.isBlank(diagramId)) {
            logger.debug("Creating new diagram");
            intDiagramId = diagramDAO.createDiagram(name, Integer.toString(loggedUserId), isPublic, graphJson);
            logger.debug("Diagram created or updated.");

        } else {
            logger.debug("Getting existing diagram from database");
            intDiagramId = Integer.parseInt(diagramId);
            int diagramUserId = diagramDAO.getDiagramUserId(intDiagramId);

            if (loggedUserId != diagramUserId) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                logger.debug("User is not owner of diagram");
                return;
            }

            diagramDAO.updateDiagram(intDiagramId, name, isPublic, graphJson);
            logger.debug("Diagram updated.");
        }

        // send response

        String json = new Gson().toJson(diagramDAO.getDiagram(intDiagramId));

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(json);
        response.getWriter().flush();
        logger.debug("Response OK");
    }
}
