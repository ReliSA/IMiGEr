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
import java.util.Map;

/**
 * This class is used for loading diagrams from database.
 */
public class GetDBDiagram extends BaseServlet {

    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.debug("Processing request");
        String diagramId = request.getParameter("id");

        if (StringUtils.isBlank(diagramId)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            logger.debug("Diagram id is empty");
            return;
        }

        DiagramDAO diagramDAO = new DiagramDAO();
        Map<String, Object> diagram = diagramDAO.getDiagram(Integer.parseInt(diagramId));

        if (!(boolean)diagram.get("public") && (!isLoggedIn(request) || (isLoggedIn(request) && (int)diagram.get("user_id") != getUserId(request)))) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            logger.debug("User is unauthorized");
            return;
        }

        String json = new Gson().toJson(diagram);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(json);
        response.getWriter().flush();
        logger.debug("Response OK");
    }
}
