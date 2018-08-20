package cz.zcu.kiv.offscreen.servlets.actions;

import java.io.File;
import java.io.IOException;
import java.util.Map;
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
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public class DeleteComponent extends HttpServlet {

    /**
     * Deleted a single component from either the current graph version or the version set in query parameter. For AJAX
     * requests, 204 NO_CONTENT status code is returned.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String workingDirectory;
        if (request.getParameter("diagram_hash") == null) {
            workingDirectory = SessionManager.getSessionValue(request, "JSESSIONID");
        } else {
            workingDirectory = request.getParameter("diagram_hash");
        }

        if (request.getParameter("graphVersion") != null) {
            workingDirectory += File.separator + request.getParameter("graphVersion");
        } else {
            workingDirectory += File.separator + SessionManager.getSessionValue(request, "graphVersion");
        }

        String storageLocation = ConfigurationLoader.getStorageLocation(request.getServletContext());

        boolean doDeleteComponent = true;
        String redirectUrlParams = "";

        if (request.getParameter("diagram_id") != null && request.getParameter("diagram_hash") != null) {
            Integer diagramId = Integer.parseInt(request.getParameter("id_diagram"));

            DB db = new DB(getServletContext());
            Diagram diagram = new Diagram(db, diagramId);
            Map<String, String> diag_param = diagram.getDiagramParam(diagramId);

            if (request.getSession().getAttribute("logged_user_id") == null) {
        		doDeleteComponent = false;
            } else if (request.getSession().getAttribute("logged_user_id").toString().equals(diag_param.get("user_id"))) {
            	doDeleteComponent = true;
        	} else {
        		doDeleteComponent = false;
        	}

            redirectUrlParams = "?diagram_id=" + request.getParameter("diagram_id") + "&diagram_hash=" + request.getParameter("diagram_hash");
        }
        
        if (doDeleteComponent) {
	        FileManager fileManager = new FileManager(workingDirectory, storageLocation);
	        fileManager.deleteFile(request.getParameter("name"));

	        request.setAttribute("componentNames", fileManager.getUploadedComponentsNames());
        }

        String requestedWith = request.getHeader("X-Requested-With");
        if (requestedWith != null && requestedWith.equals("XMLHttpRequest")) {
            // AJAX request, send response
            response.setStatus(response.SC_NO_CONTENT);

        } else {
            // redirect
            response.sendRedirect(getServletContext().getInitParameter("HOME_URL") + "upload-files" + redirectUrlParams);
        }
    }
}
