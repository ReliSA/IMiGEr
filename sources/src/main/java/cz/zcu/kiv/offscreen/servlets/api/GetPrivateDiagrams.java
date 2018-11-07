package cz.zcu.kiv.offscreen.servlets.api;

import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public class GetPrivateDiagrams extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!isLoggedIn(request)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db);

        int loggedUserId = getUserId(request);
        List<Map<String, String>> userDiagramList = diagram.getDiagramListByUserId(loggedUserId);

        JSONArray json = new JSONArray();
        for (Map<String, String> userDiagram : userDiagramList) {
            json.put(new JSONObject(userDiagram));
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(json.toString());
        response.getWriter().flush();
    }
}
