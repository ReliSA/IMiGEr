package cz.zcu.kiv.offscreen.servlets.api;

import com.google.common.base.Strings;
import cz.zcu.kiv.offscreen.api.Graph;
import cz.zcu.kiv.offscreen.graph.GraphManager;
import cz.zcu.kiv.offscreen.graph.loader.DemoDiagramLoader;
import cz.zcu.kiv.offscreen.graph.loader.GraphJSONDataLoader;
import cz.zcu.kiv.offscreen.graph.loader.JSONConfigLoader;
import cz.zcu.kiv.offscreen.configuration.ConfigurationLoader;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
import net.sf.json.JSONObject;

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
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (request.getSession().getAttribute("demo_id") == null) {
            String diagram_id = request.getParameter("diagramId");

            if (diagram_id == null) {
                getDiagramFromSession(request, response);
            } else {
                getDiagramById(request, response, Integer.parseInt(diagram_id));
            }
        } else {
            getDemoDiagram(request, response);
        }
    }

    /**
     * Add file which was uploaded and is stored in session to response or set http status code to BAD_REQUEST.
     */
    private void getDiagramFromSession(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String jsonToDisplay = (String) request.getSession().getAttribute("json_graph");
        String jsonType = (String) request.getSession().getAttribute("json_graph_type");

        if (!Strings.isNullOrEmpty(jsonToDisplay) && jsonType != null) {

            String rawJson;

            switch (jsonType) {
                case "spade":
                    String configLocation = ConfigurationLoader.getConfigLocation(request.getServletContext());
                    rawJson = convertSpadeToRawJson(jsonToDisplay, configLocation);
                    break;
                default:
                    rawJson = jsonToDisplay;
            }

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(rawJson);
            response.getWriter().flush();
            return;
        }

        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    }

    /**
     * Convert input spade JSON to frontend backend JSON and return it.
     */
    private String convertSpadeToRawJson(String spadeJson, String configLocation){
        GraphManager graphManager = new GraphJSONDataLoader(spadeJson).LoadData();

        JSONConfigLoader configLoader = new JSONConfigLoader(graphManager, configLocation);

        Graph graph = graphManager.createGraph(configLoader);
        JSONObject json = JSONObject.fromObject(graph);

        return json.toString();
    }

    /**
     * Add json of diagram which is taken from database to response or set http status code to UNAUTHORIZED.
     * Permissions of user to this diagram is checked.
     */
    private void getDiagramById(HttpServletRequest request, HttpServletResponse response, int diagramId) throws IOException {
        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db, diagramId);

        String json = "";

        if (diagram.isPublic()) {
            json =  diagram.getJsonDiagram();

        } else {
            if (isLoggedIn(request)) {
                int loggedUserId = getUserId(request);

                if (diagram.getUserId() == loggedUserId) {
                    json = diagram.getJsonDiagram();
                }
            }
        }

        if (Strings.isNullOrEmpty(json)){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } else {
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(json);
            response.getWriter().flush();
        }
    }

    /**
     * Add demo diagram from file system to response.
     */
    private void getDemoDiagram(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String demoId = request.getSession().getAttribute("demo_id").toString();
        String path = "/WEB-INF" + File.separator + "demoDiagram" + File.separator + demoId + ".json";

        DemoDiagramLoader loader = new DemoDiagramLoader();
        InputStream in = this.getServletContext().getResourceAsStream(path);

        request.getSession().setAttribute("demo_id", null);

        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(loader.readDemoJSONFromFile(in));
        response.getWriter().flush();
    }
}
