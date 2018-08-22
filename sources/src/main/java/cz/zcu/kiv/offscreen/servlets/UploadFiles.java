package cz.zcu.kiv.offscreen.servlets;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.servlet.ServletFileUpload;

import cz.zcu.kiv.offscreen.loader.configuration.ConfigurationLoader;
import cz.zcu.kiv.offscreen.session.SessionManager;
import cz.zcu.kiv.offscreen.storage.FileManager;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;

/**
 *
 * @author Jindra PavlĂ­kovĂˇ <jindra.pav2@seznam.cz>
 */
public class UploadFiles extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        DB db = new DB(getServletContext());

        String diagram_id = request.getParameter("diagram_id");
        if (diagram_id != null) {
            Integer diagramId = Integer.parseInt(diagram_id);

	        Diagram diagram_edit = new Diagram(db, diagramId);
	        Map<String, String> diag_param = diagram_edit.getDiagramParam(diagramId);
	        
	        request.setAttribute("diagram_name", diag_param.get("name"));
	        request.setAttribute("diagram_user_id", diag_param.get("user_id"));
	        request.setAttribute("diagram_public_checked", (diag_param.get("public").compareTo("1") == 0 ? " checked=\"checked\" " : ""));
        } else {
        	request.setAttribute("diagram_name", "");
        	request.setAttribute("diagram_public_checked", "");
        	request.setAttribute("diagram_user_id", "-1");
        }

        // initialize file manager
        String workingDirectory;
        if (request.getParameter("diagram_hash") == null) {
            workingDirectory = SessionManager.getSessionValue(request, "JSESSIONID");
        } else {
            workingDirectory = request.getParameter("diagram_hash");
        }

        int version = 1;
        workingDirectory += File.separator + String.valueOf(version);

        String storageLocation = ConfigurationLoader.getStorageLocation(request.getServletContext());

        FileManager fileManager = new FileManager(workingDirectory, storageLocation);
        if (!fileManager.isExistStorage()) {
            fileManager.createStorageDirectory();
        }

        // save files from request
        String result;
        if (ServletFileUpload.isMultipartContent(request)) {
            result = fileManager.saveFile(request);
        } else {
            result = "";
        }

        response.addCookie(new Cookie("graphVersion", String.valueOf(version)));

        // response
        List<Map<String, String>> userDiagramList = new ArrayList<>();
        if (request.getSession().getAttribute("logged_user") == "1") {
            int loggedUserId = (int) request.getSession().getAttribute("logged_user_id");

			userDiagramList = new Diagram(db).getDiagramListByUserId(loggedUserId);
        }
        request.setAttribute("diagramNames", userDiagramList);

        List<Map<String, String>> publicDiagramList = new Diagram(db).getDiagramPublicList();
        request.setAttribute("diagramPublic", publicDiagramList);
        
        request.setAttribute("componentNames", fileManager.getUploadedComponentsNames());
        request.setAttribute("errorMessage", result);

        // render
        RequestDispatcher rd = getServletContext().getRequestDispatcher("/uploadFiles.jsp");
        rd.forward(request, response);
    }
}
