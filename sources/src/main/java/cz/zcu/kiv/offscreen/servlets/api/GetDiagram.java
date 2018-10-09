package cz.zcu.kiv.offscreen.servlets.api;

import com.google.common.base.Strings;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class GetDiagram extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String diagramId = request.getParameter("diagramId");

        if (Strings.isNullOrEmpty(diagramId)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db, Integer.parseInt(diagramId));

        JSONObject json = null;

        if (diagram.isPublic()) {
            json = new JSONObject(diagram.getDiagram());

        } else {
            if (isLoggedIn(request)) {
                int loggedUserId = getUserId(request);

                if (diagram.getUserId() == loggedUserId) {
                    json = new JSONObject(diagram.getDiagram());
                }
            }
        }

        if (json == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } else {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(json.toString());
            response.getWriter().flush();
        }
    }
}
