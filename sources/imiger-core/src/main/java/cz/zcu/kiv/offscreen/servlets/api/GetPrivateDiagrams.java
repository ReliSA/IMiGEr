package cz.zcu.kiv.offscreen.servlets.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.dao.DiagramDAO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * This servlet is used to query all private diagrams of the currently
 * logged-in user via a RestAPI
 */
public class GetPrivateDiagrams extends BaseServlet {

    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.debug("Processing request");

        // Verify whether user is logged in
        if (!isLoggedIn(request)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            logger.debug("User is unauthorized");
            return;
        }

        // Get all user's private diagrams from the DAO
        DiagramDAO diagramDAO = new DiagramDAO();
        int loggedUserId = getUserId(request);
        List<Map<String, Object>> userDiagramList = diagramDAO.getDiagramsByUserId(loggedUserId);

        // Parse the list of the diagrams into a JSON
        JsonArray privateDiagramsJSON = new JsonArray();
        for (Map<String, Object> userDiagram : userDiagramList) {

            // Create a JSON object that represents one diagram and append it into the array of diagrams
            JsonObject diagramJSON = new JsonObject();
            diagramJSON.addProperty("id", String.valueOf(userDiagram.get("id")));
            diagramJSON.addProperty("name", String.valueOf(userDiagram.get("name")));
            diagramJSON.addProperty("created", String.valueOf(userDiagram.get("created")));
            diagramJSON.addProperty("last_update", String.valueOf(userDiagram.get("last_update")));
            privateDiagramsJSON.add(diagramJSON);
        }

        // Return the response
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(privateDiagramsJSON.toString());
        response.getWriter().flush();
        logger.debug("Response OK");

    }
}
