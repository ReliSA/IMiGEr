package cz.zcu.kiv.offscreen.servlets.api;

import com.google.common.base.Strings;
import cz.zcu.kiv.offscreen.api.GraphExport;
import cz.zcu.kiv.offscreen.graph.Graph;
import cz.zcu.kiv.offscreen.graph.GraphManager;
import cz.zcu.kiv.offscreen.graph.loader.DemoDiagramLoader;
import cz.zcu.kiv.offscreen.graph.loader.GraphJSONDataLoader;
import cz.zcu.kiv.offscreen.graph.loader.JSONConfigLoader;
import cz.zcu.kiv.offscreen.loader.configuration.ConfigurationLoader;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

/**
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public class LoadGraphData extends BaseServlet {

    /**
     * Constructs graph data using either the current graph version or the version set in query parameter. Resulting
     * graph is returned as JSON in response body.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (request.getSession().getAttribute("demo_id") == null) {

            String diagram_id = request.getParameter("diagramId");

            if (diagram_id == null) {
                response.getWriter().write(getDiagramFromSession(request));
            } else {
                response.getWriter().write(getDiagramById(request, Integer.parseInt(diagram_id)));
            }
            
        } else {
            response.getWriter().write(getDemoDiagram(request));
        }
    }

    /**
     * Return json of file which was uploaded and is stored in session.
     */
    private String getDiagramFromSession(HttpServletRequest request) throws IOException {

        String jsonToDisplay = (String)request.getSession().getAttribute("json_graph");
        request.getSession().removeAttribute("json_graph");

        if (!Strings.isNullOrEmpty(jsonToDisplay)) {
            GraphManager graphManager = new GraphJSONDataLoader(jsonToDisplay).LoadData();
            String configLocation = ConfigurationLoader.getConfigLocation(request.getServletContext());
            JSONConfigLoader configLoader = new JSONConfigLoader(graphManager, configLocation);
            Graph graph = graphManager.createGraph(configLoader);
            GraphExport export = new GraphExport(graph);
            JSONObject json = JSONObject.fromObject(export);

            return json.toString();
        }
        return "";
    }

    /**
     * Return json of diagram which is taken from database. Permissions of user to this diagram is checked.
     */
    private String getDiagramById(HttpServletRequest request, int diagramId){

        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db, diagramId);

        if(!diagram.isPublic()){
            // Diagram is not public

            Integer loggedUserId = (Integer) request.getSession().getAttribute("logged_user_id");
            if(loggedUserId == null || diagram.getUserId() != loggedUserId) {
                return ""; // User is not logged in or is not owner of diagram
            }
        }

        return diagram.getJsonDiagram();
    }

    /**
     * Return demo diagram from file system.
     */
    private String getDemoDiagram(HttpServletRequest request){
        String demoId = request.getSession().getAttribute("demo_id").toString();
        String path = "/WEB-INF" + File.separator + "demoDiagram" + File.separator + demoId + ".json";

        DemoDiagramLoader loader = new DemoDiagramLoader();
        InputStream in = this.getServletContext().getResourceAsStream(path);

        request.getSession().setAttribute("demo_id", null);

        return loader.readDemoJSONFromFile(in);
    }
}
