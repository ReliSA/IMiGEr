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
 * This servlet is used to query all public diagrams of the currently
 * logged-in user via a RestAPI
 */
public class GetPublicDiagrams extends BaseServlet {

    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.debug("Processing request");

        // Get all public diagrams from the DAO
        DiagramDAO diagramDAO = new DiagramDAO();
        List<Map<String, Object>> publicDiagramList = diagramDAO.getPublicDiagrams();

        // Parse the list of the diagrams into a JSON
        JsonArray publicDiagramsJSON = new JsonArray();
        for (Map<String, Object> diagram : publicDiagramList) {

            // Create a JSON object that represents one diagram and append it into the array of diagrams
            JsonObject diagramJSON = new JsonObject();
            diagramJSON.addProperty("id", String.valueOf(diagram.get("id")));
            diagramJSON.addProperty("name", String.valueOf(diagram.get("name")));
            diagramJSON.addProperty("created", String.valueOf(diagram.get("created")));
            diagramJSON.addProperty("last_update", String.valueOf(diagram.get("last_update")));
            publicDiagramsJSON.add(diagramJSON);
        }

        // Return the response
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(publicDiagramsJSON.toString());
        response.getWriter().flush();
        logger.debug("Response OK");

    }
}
