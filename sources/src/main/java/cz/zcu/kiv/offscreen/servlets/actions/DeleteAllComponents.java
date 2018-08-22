package cz.zcu.kiv.offscreen.servlets.actions;

import java.io.File;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cz.zcu.kiv.offscreen.loader.configuration.ConfigurationLoader;
import cz.zcu.kiv.offscreen.session.SessionManager;
import cz.zcu.kiv.offscreen.storage.FileManager;

/**
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public class DeleteAllComponents extends HttpServlet {

    /**
     * Delete all components from the graph. Optionally, only components of a particular graph version set in query
     * parameter can be deleted. For AJAX requests, 204 NO_CONTENT status code is returned.
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
        }

        String storageLocation = ConfigurationLoader.getStorageLocation(request.getServletContext());
        
        FileManager fileManager = new FileManager(workingDirectory, storageLocation);
        fileManager.deleteAllFiles();

        String requestedWith = request.getHeader("X-Requested-With");
        if (requestedWith != null && requestedWith.equals("XMLHttpRequest")) {
            // AJAX request, send response
            response.setStatus(response.SC_NO_CONTENT);

        } else {
            request.setAttribute("componentNames", fileManager.getUploadedComponentsNames());

            // redirect
            response.sendRedirect(getServletContext().getInitParameter("HOME_URL"));
        }
    }
}
