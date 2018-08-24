package cz.zcu.kiv.offscreen.servlets;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
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
 * @author Jindra PavlĂ­kovĂˇ <jindra.pav2@seznam.cz>
 */
public class ShowGraph extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	// render
        RequestDispatcher rd = getServletContext().getRequestDispatcher("/showGraph.jsp");
        rd.forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // should save button be displayed?
		boolean showSaveButton = request.getParameter("diagram_id") != null && request.getParameter("diagram_hash") != null;
		request.setAttribute("show_icon_save", showSaveButton);


/*
		// is it only a demo diagram?
		if (request.getParameter("demo_id") != null) {
			request.getSession().setAttribute("demo_id", request.getParameter("demo_id"));
		}

		if (request.getParameter("diagram_name") != null && request.getParameter("diagram_id") == null) {
			// save new diagram
        	String sessionValue = SessionManager.getSessionValue(request, "JSESSIONID");
        	String storageLocation = ConfigurationLoader.getStorageLocation(request.getServletContext());
			FileManager file_manage_without_id = new FileManager(sessionValue, storageLocation);

        	String isPublic = "0";
        	if (request.getParameter("public_diagram") != null && request.getParameter("public_diagram").compareTo("1") == 0) {
        		isPublic = "1";
        	}

			Map<String, String> item_map = new HashMap<>();
        	item_map.put("diagram_name", request.getParameter("diagram_name"));
        	item_map.put("hash", sessionValue);
        	item_map.put("user_id",  request.getSession().getAttribute("logged_user_id").toString());
        	item_map.put("component_count", Integer.toString(file_manage_without_id.getUploadedComponentsNames().size()));
        	item_map.put("public", isPublic);

			DB db = new DB(getServletContext());
			Diagram diagram = new Diagram(db);
			diagram.update(item_map);

            String file_directory = sessionValue + "_" + diagram.getIdStr();
        	FileManager file_manage = new FileManager(file_directory, storageLocation);
        	if (!file_manage.isExistStorage()) {
        		file_manage.createStorageDirectory();
        	}
        	
        	//copy directory to directory with postfix "_<id_diagram>"
        	file_manage_without_id.copyUploadedComponents(storageLocation + File.separator + file_directory);

        	response.sendRedirect( getServletContext().getInitParameter("HOME_URL") + "graph?diagram_id=" + diagram.getIdStr() + "&diagram_hash=" + sessionValue);
        	return;
        	
        } else if (request.getParameter("diagram_name") != null && request.getParameter("diagram_id") != null) {
        	// update existing diagram
        	Integer diagramId = Integer.parseInt(request.getParameter("diagram_id"));

        	String sessionValue = SessionManager.getSessionValue(request, "JSESSIONID");
        	String storageLocation = ConfigurationLoader.getStorageLocation(request.getServletContext());
        	
        	DB db = new DB(getServletContext());
        	Diagram diagram = new Diagram(db, diagramId);
            Map<String, String> diag_param = diagram.getDiagramParam(diagramId);

			if (request.getSession().getAttribute("logged_user_id") != null) {
				boolean doCopyDiagram = request.getParameter("copy_diag") != null && request.getParameter("copy_diag").compareTo("1") == 0;
				if (doCopyDiagram) {
					String diagramHash = diag_param.get("hash");
					String vertices_position = diag_param.get("vertices_position");

					FileManager copied_file_manage = new FileManager(diagramHash, storageLocation);
					if (!copied_file_manage.isExistStorage()) {
						copied_file_manage.createStorageDirectory();
					}
					copied_file_manage.copyUploadedComponents(storageLocation + File.separator + sessionValue);

					Map<String, String> new_item_map = new HashMap<>();
					new_item_map.put("diagram_name", request.getParameter("diagram_name"));
					new_item_map.put("hash", sessionValue);
					new_item_map.put("user_id", request.getSession().getAttribute("logged_user_id").toString());
					new_item_map.put("component_count", Integer.toString(copied_file_manage.getUploadedComponentsNames().size()));
					new_item_map.put("public", "0");
					new_item_map.put("vertices_position", vertices_position);

					Diagram newDiagram = new Diagram(db);
					newDiagram.update(new_item_map);

					FileManager file_manage = new FileManager(sessionValue, storageLocation);
					if (!file_manage.isExistStorage()) {
						file_manage.createStorageDirectory();
					}

					//copy directory to directory with postfix "_<id_diagram>"
					copied_file_manage.copyUploadedComponents(storageLocation + File.separator + sessionValue);

					response.sendRedirect(getServletContext().getInitParameter("HOME_URL") + "graph?diagram_id=" + newDiagram.getIdStr() + "&diagram_hash=" + sessionValue);
					return;
				}

				if (request.getSession().getAttribute("logged_user_id").toString().equals(diag_param.get("user_id"))) {
					String diagramHash = diag_param.get("hash");
					FileManager file_manage = new FileManager(diagramHash, storageLocation);

					String public_diag = "0";
					if (request.getParameter("public_diagram") != null && request.getParameter("public_diagram").compareTo("1") == 0) {
						public_diag = "1";
					}

					Map<String, String> item_map = new HashMap<>();
					item_map.put("component_count", Integer.toString(file_manage.getUploadedComponentsNames().size()));
					item_map.put("diagram_name", request.getParameter("diagram_name"));
					item_map.put("public", public_diag);

					diagram.update(item_map);
				}
			}

			request.getSession().setAttribute("id_diagram", request.getParameter("id_diagram"));
        }*/

        // render
		RequestDispatcher rd = getServletContext().getRequestDispatcher("/showGraph.jsp");
		rd.forward(request, response);
    }
}
