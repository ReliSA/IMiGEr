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

        if (request.getSession().getAttribute("logged_user_id") == null) {
            response.sendError(response.SC_UNAUTHORIZED);
            return;
        }

        if(request.getParameter("diagram_id") == null){
            response.sendError(response.SC_BAD_REQUEST);
            return;
        }

        Integer loggedUserId = Integer.parseInt(request.getSession().getAttribute("logged_user_id").toString());
        Integer diagramId = Integer.parseInt(request.getParameter("diagram_id"));

        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db, diagramId);

        if(diagram.getUserId() != loggedUserId){
            response.sendError(response.SC_UNAUTHORIZED);
            return;
        }

        diagram.delete();
        response.sendRedirect("/");
    }
}
