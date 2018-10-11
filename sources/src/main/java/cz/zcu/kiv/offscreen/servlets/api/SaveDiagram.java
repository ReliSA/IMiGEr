package cz.zcu.kiv.offscreen.servlets.api;

import com.google.common.base.Strings;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class SaveDiagram extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!isLoggedIn(request)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        request.setCharacterEncoding("UTF-8");

        int loggedUserId = getUserId(request);

        String diagramId = request.getParameter("diagramId");
        String name = request.getParameter("name");
        String graphJson = request.getParameter("graphJson");
        String isPublic = request.getParameter("public");

        // input parameters are invalid
        if (Strings.isNullOrEmpty(name) || Strings.isNullOrEmpty(graphJson)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        DB db = new DB(getServletContext());
        Diagram diagram;

        if (Strings.isNullOrEmpty(diagramId)) {
            // new diagram
            diagram = new Diagram(db);

        } else {
            // diagram exists
            diagram = new Diagram(db, Integer.parseInt(diagramId));

            // user is not owner of the diagram
            if (loggedUserId != diagram.getUserId()) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        Map<String, String> diagramParams = new HashMap<>();
        diagramParams.put("name", name);
        diagramParams.put("public", isPublic);
        diagramParams.put("graph_json", graphJson);
        diagramParams.put("user_id", Integer.toString(loggedUserId));

        diagram.update(diagramParams);

        // send response
        JSONObject json = new JSONObject(diagram.getDiagram());

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(json.toString());
        response.getWriter().flush();
    }
}
