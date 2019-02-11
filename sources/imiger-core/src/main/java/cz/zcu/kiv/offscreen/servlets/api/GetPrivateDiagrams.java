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

public class GetPrivateDiagrams extends BaseServlet {

    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.debug("Processing request");

        if (!isLoggedIn(request)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            logger.debug("User is unauthorized");
            return;
        }

        DiagramDAO diagramDAO = new DiagramDAO();

        int loggedUserId = getUserId(request);
        List<Map<String, Object>> userDiagramList = diagramDAO.getDiagramsByUserId(loggedUserId);

        JsonArray jsonArray = new JsonArray();
        for (Map<String, Object> userDiagram : userDiagramList) {

            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("id", String.valueOf(userDiagram.get("id")));
            jsonObject.addProperty("name", String.valueOf(userDiagram.get("name")));
            jsonObject.addProperty("created", String.valueOf(userDiagram.get("created")));
            jsonObject.addProperty("last_update", String.valueOf(userDiagram.get("last_update")));
            jsonArray.add(jsonObject);
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(jsonArray.toString());
        response.getWriter().flush();
        logger.debug("Response OK");

    }
}
