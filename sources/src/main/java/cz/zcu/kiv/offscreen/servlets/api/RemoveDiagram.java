package cz.zcu.kiv.offscreen.servlets.api;

import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class RemoveDiagram extends BaseServlet {

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!isLoggedIn(request)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        if (request.getParameter("diagram_id") == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        int loggedUserId = getUserId(request);

        Integer diagramId = Integer.parseInt(request.getParameter("diagram_id"));
        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db, diagramId);

        if (diagram.getUserId() != loggedUserId) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        diagram.delete();

        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }
}
