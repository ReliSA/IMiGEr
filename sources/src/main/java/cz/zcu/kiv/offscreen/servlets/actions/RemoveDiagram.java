package cz.zcu.kiv.offscreen.servlets.actions;

import com.google.common.base.Strings;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
import org.apache.commons.lang.StringUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class RemoveDiagram extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

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
