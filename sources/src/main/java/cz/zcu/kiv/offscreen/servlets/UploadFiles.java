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
                response.sendRedirect("/graph");
                return;
            }
        }

//        String diagram_id = request.getParameter("diagram_id");
//        if (diagram_id != null) {
//            Integer diagramId = Integer.parseInt(diagram_id);
//
//	        Diagram diagram_edit = new Diagram(db, diagramId);
//	        Map<String, String> diag_param = diagram_edit.getDiagramParam(diagramId);
//
//	        request.setAttribute("diagram_name", diag_param.get("name"));
//	        request.setAttribute("diagram_user_id", diag_param.get("user_id"));
//	        request.setAttribute("diagram_public_checked", (diag_param.get("public").compareTo("1") == 0 ? " checked=\"checked\" " : ""));
//        } else {
//        	request.setAttribute("diagram_name", "");
//        	request.setAttribute("diagram_public_checked", "");
//        	request.setAttribute("diagram_user_id", "-1");
//        }

        // initialize file manager
//        String workingDirectory;
//        if (request.getParameter("diagram_hash") == null) {
//            workingDirectory = SessionManager.getSessionValue(request, "JSESSIONID");
//        } else {
//            workingDirectory = request.getParameter("diagram_hash");
//        }
//
//        int version = 1;
//        workingDirectory += File.separator + String.valueOf(version);
//
//        String storageLocation = ConfigurationLoader.getStorageLocation(request.getServletContext());

//        FileManager fileManager = new FileManager(workingDirectory, storageLocation);
//        if (!fileManager.isExistStorage()) {
//            fileManager.createStorageDirectory();
//        }

        // save files from request
//        String result;
//        if (ServletFileUpload.isMultipartContent(request)) {
//            result = fileManager.saveFile(request);
//        } else {
//            result = "";
//        }

//        response.addCookie(new Cookie("graphVersion", String.valueOf(version)));


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
