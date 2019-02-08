package cz.zcu.kiv.offscreen.servlets.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
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

        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db);

        int loggedUserId = getUserId(request);
        List<Map<String, String>> userDiagramList = diagram.getDiagramListByUserId(loggedUserId);

        JsonArray jsonArray = new JsonArray();
        for (Map<String, String> userDiagram : userDiagramList) {

            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("id", userDiagram.get("id"));
            jsonObject.addProperty("name", userDiagram.get("name"));

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
