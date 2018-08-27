package cz.zcu.kiv.offscreen.servlets;

import com.google.common.base.Strings;
import cz.zcu.kiv.offscreen.storage.FileManager;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
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
        doPost(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        if (ServletFileUpload.isMultipartContent(request)) {
            String jsonGraph = new FileManager("","").loadFile(request);

            if(Strings.isNullOrEmpty(jsonGraph)){
                request.setAttribute("errorMessage", "<strong>Unsupported file</strong><br/>");
            } else {
                request.getSession().setAttribute("json_graph", jsonGraph);
                response.sendRedirect(getServletContext().getInitParameter("HOME_URL") + "graph");
                return;
            }
        }

        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db);

        List<Map<String, String>> userDiagramList = new ArrayList<>();
        if (request.getSession().getAttribute("logged_user") == "1") {
            int loggedUserId = (int) request.getSession().getAttribute("logged_user_id");

            userDiagramList = diagram.getDiagramListByUserId(loggedUserId);
        }
        request.setAttribute("diagramsPrivate", userDiagramList);

        List<Map<String, String>> publicDiagramList = diagram.getDiagramPublicList();
        request.setAttribute("diagramsPublic", publicDiagramList);

        // render
        RequestDispatcher rd = getServletContext().getRequestDispatcher("/uploadFiles.jsp");
        rd.forward(request, response);
    }
}
