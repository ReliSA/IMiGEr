package cz.zcu.kiv.offscreen.servlets;

import com.google.common.base.Strings;
import cz.zcu.kiv.offscreen.storage.FileLoader;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Jindra PavlĂ­kovĂˇ <jindra.pav2@seznam.cz>
 */
public class UploadFiles extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db);

        List<Map<String, String>> userDiagramList = new ArrayList<>();
        if (isLoggedIn(request)) {
            int loggedUserId = getUserId(request);

            userDiagramList = diagram.getDiagramListByUserId(loggedUserId);
        }
        request.setAttribute("diagramsPrivate", userDiagramList);

        List<Map<String, String>> publicDiagramList = diagram.getDiagramPublicList();
        request.setAttribute("diagramsPublic", publicDiagramList);

        // render
        RequestDispatcher rd = getServletContext().getRequestDispatcher("/uploadFiles.jsp");
        rd.forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jsonGraph = new FileLoader().loadFile(request);

        if (Strings.isNullOrEmpty(jsonGraph)) {
            request.setAttribute("errorMessage", "<strong>Unsupported file</strong><br/>");
            doGet(request, response);
        } else {
            request.getSession().setAttribute("json_graph", jsonGraph);
            response.sendRedirect(getServletContext().getInitParameter("HOME_URL") + "graph");
        }
    }
}
