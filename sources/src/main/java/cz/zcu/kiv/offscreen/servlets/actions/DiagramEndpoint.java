package cz.zcu.kiv.offscreen.servlets.actions;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cz.zcu.kiv.offscreen.loader.configuration.ConfigurationLoader;
import cz.zcu.kiv.offscreen.storage.FileManager;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;

public class DiagramEndpoint extends HttpServlet {

    /**
     * Returns position of components in diagram by id and hash code.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // diagram ID is not set
        if (request.getParameter("id_diagram") == null) {
            response.sendError(response.SC_BAD_REQUEST);
            return;
        }

        Integer diagramId = Integer.parseInt(request.getParameter("diagram_id"));

        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db, diagramId);
        Map<String, String> diag_param = diagram.getDiagram();

        // user is not owner of the diagram
        if (!request.getSession().getAttribute("logged_user_id").toString().equals(diag_param.get("user_id"))) {
            response.sendError(response.SC_UNAUTHORIZED);
            return;
        }

        // send response
        response.setContentType("application/json");

        PrintWriter out = response.getWriter();
        out.write(diag_param.get("vertices_position"));
        out.flush();
    }

    /**
     * Method saves position of component, which are send by parameter in post method.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // user is not logged in
        if (request.getSession().getAttribute("logged_user_id") == null) {
            response.sendError(response.SC_UNAUTHORIZED);
            return;
        }

        // diagram ID is not set
        if (request.getParameter("id_diagram") == null) {
            response.sendError(response.SC_BAD_REQUEST);
            return;
        }

        Integer diagramId = Integer.parseInt(request.getParameter("diagram_id"));

        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db, diagramId);
        Map<String, String> diag_param = diagram.getDiagram();

        // user is not owner of the diagram
        if (!request.getSession().getAttribute("logged_user_id").toString().equals(diag_param.get("user_id"))) {
            response.sendError(response.SC_UNAUTHORIZED);
            return;
        }

        String verticesPosition = request.getParameter("vertices_position");
        //diagram.updateVerticesPosition(verticesPosition); REMOVED FROM DATABASE

        // send response
        response.setContentType("application/json");

        PrintWriter out = response.getWriter();
        out.write(verticesPosition);
        out.flush();
    }

    /**
     * Deletes diagram from database and from file system.
     * Id of diagrams is loaded from get parameter in url.
     * In method is controlled logged user and user, who uploaded diagram.
     */
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // user is not logged in
        if (request.getSession().getAttribute("logged_user_id") == null) {
            response.sendError(response.SC_UNAUTHORIZED);
            return;
        }

        // diagram ID is not set
        if (request.getParameter("id_diagram") == null) {
            response.sendError(response.SC_BAD_REQUEST);
            return;
        }

        Integer diagramId = Integer.parseInt(request.getParameter("id_diagram"));

        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db, diagramId);
        Map<String, String> diag_param = diagram.getDiagram();

        // user is not owner of the diagram
        if (!request.getSession().getAttribute("logged_user_id").toString().equals(diag_param.get("user_id"))) {
            response.sendError(response.SC_UNAUTHORIZED);
            return;
        }

        String workingDirectory = diag_param.get("hash") + "_" + diag_param.get("id");
        String storageLocation = ConfigurationLoader.getStorageLocation(request.getServletContext());

        FileManager fileManager = new FileManager(workingDirectory, storageLocation);
        fileManager.deleteAllFiles();
        fileManager.deleteDirectory();

        diagram.delete();

        // send response
        response.setStatus(response.SC_NO_CONTENT);
    }
}
