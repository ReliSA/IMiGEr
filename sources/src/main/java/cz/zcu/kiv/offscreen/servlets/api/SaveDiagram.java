package cz.zcu.kiv.offscreen.servlets.api;

import com.google.common.base.Strings;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

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
        if (Strings.isNullOrEmpty(name) || Strings.isNullOrEmpty(graphJson)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            logger.debug("Input name or json is empty");
            return;
        }

        DB db = new DB(getServletContext());
        Diagram diagram;

        if (Strings.isNullOrEmpty(diagramId)) {
            logger.debug("Creating new diagram");
            diagram = new Diagram(db);

        } else {
            logger.debug("Getting existing diagram from database");
            diagram = new Diagram(db, Integer.parseInt(diagramId));

            if (loggedUserId != diagram.getUserId()) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                logger.debug("User is not owner of diagram");
                return;
            }
        }

        Map<String, String> diagramParams = new HashMap<>();
        diagramParams.put("name", name);
        diagramParams.put("public", isPublic);
        diagramParams.put("graph_json", graphJson);
        diagramParams.put("user_id", Integer.toString(loggedUserId));

        diagram.update(diagramParams);
        logger.debug("Diagram created or updated.");

        // send response

        String json = new Gson().toJson(diagram.getDiagram());

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(json);
        response.getWriter().flush();
        logger.debug("Response OK");
    }
}
