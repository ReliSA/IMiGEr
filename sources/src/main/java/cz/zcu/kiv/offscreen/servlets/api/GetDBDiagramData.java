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

/**
 * This class is used for loading diagram's graph JSON from database.
 */
public class GetDBDiagramData extends BaseServlet {

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

        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db, Integer.parseInt(diagramId));

        if (!diagram.isPublic() && (!isLoggedIn(request) || (isLoggedIn(request) && diagram.getUserId() != getUserId(request)))) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            logger.debug("User is unauthorized");
            return;
        }

        String json = diagram.getDiagram().get("graph_json");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(json);
        response.getWriter().flush();
        logger.debug("Response OK");
    }
}
