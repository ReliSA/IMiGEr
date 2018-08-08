package cz.zcu.kiv.offscreen.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cz.zcu.kiv.offscreen.loader.configuration.ConfigurationLoader;
import cz.zcu.kiv.offscreen.session.SessionManager;
import cz.zcu.kiv.offscreen.storage.FileManager;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;

/**
 *
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public class DefaultPage extends HttpServlet {

    /**
     * Loads currently uploaded components and renders uploadFiles.jsp.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String sessionValue = SessionManager.getSessionValue(request, "JSESSIONID");
        if (sessionValue != null && !"".equals(sessionValue)) {
            String storageLocation = ConfigurationLoader.getStorageLocation(request.getServletContext());

            FileManager fileManager = new FileManager(sessionValue, storageLocation);
            if (!fileManager.isExistStorage()) {
                fileManager.createStorageDirectory();
            }

            request.setAttribute("componentNames", fileManager.getUploadedComponentsNames());
        }
        
        DB db = new DB(getServletContext()); 
        Diagram diagram_list = new Diagram(db);

        List<Map<String, String>> list = new ArrayList<>();
        if (request.getSession().getAttribute("logged_user") == "1") {
			list = diagram_list.getDiagramListByUserId((int) request.getSession().getAttribute("logged_user_id"));
        }

        List<Map<String, String>> diagram_public_list = diagram_list.getDiagramPublicList();

        request.setAttribute("diagramPublic", diagram_public_list);
        request.setAttribute("diagramNames", list);

        // render
        RequestDispatcher rd = getServletContext().getRequestDispatcher("/uploadFiles.jsp");
        rd.forward(request, response);
    }
}
