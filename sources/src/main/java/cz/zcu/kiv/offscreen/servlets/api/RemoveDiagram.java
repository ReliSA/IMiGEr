package cz.zcu.kiv.offscreen.servlets.api;

import com.google.common.base.Strings;
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

        int loggedUserId = getUserId(request);

        String diagramId = request.getParameter("diagram_id");

        if (Strings.isNullOrEmpty(diagramId)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db, Integer.parseInt(diagramId));

        if (diagram.getUserId() != loggedUserId) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        diagram.delete();

        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }
}
