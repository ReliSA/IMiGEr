package cz.zcu.kiv.offscreen.servlets.api;

import com.google.common.base.Strings;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * This class is used for loading diagrams from database.
 */
public class GetDBDiagram extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String diagramId = request.getParameter("id");

        if (Strings.isNullOrEmpty(diagramId)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db, Integer.parseInt(diagramId));

        if (!diagram.isPublic() && (!isLoggedIn(request) || (isLoggedIn(request) && diagram.getUserId() != getUserId(request)))) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        JSONObject json = new JSONObject(diagram.getDiagram());

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(json.toString());
        response.getWriter().flush();
    }
}
