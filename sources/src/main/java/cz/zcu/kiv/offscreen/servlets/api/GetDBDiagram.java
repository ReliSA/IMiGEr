package cz.zcu.kiv.offscreen.servlets.api;

import com.google.common.base.Strings;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * This class is used for loading diagrams from database.
 */
public class GetDBDiagram extends BaseServlet {

    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.debug("Processing request");
        String diagramId = request.getParameter("id");

        if (Strings.isNullOrEmpty(diagramId)) {
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

        JSONObject json = new JSONObject(diagram.getDiagram());

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(json.toString());
        response.getWriter().flush();
        logger.debug("Response OK");
    }
}
