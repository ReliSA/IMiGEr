package cz.zcu.kiv.offscreen.servlets;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cz.zcu.kiv.ccu.ApiCheckersFactory;
import cz.zcu.kiv.ccu.ApiCheckersSetting;
import cz.zcu.kiv.ccu.ApiInterCompatibilityChecker;
import cz.zcu.kiv.ccu.ApiInterCompatibilityResult;
import cz.zcu.kiv.offscreen.api.GraphInterface;
import cz.zcu.kiv.offscreen.graph.GraphExport;
import cz.zcu.kiv.offscreen.graph.GraphManager;
import cz.zcu.kiv.offscreen.graph.creator.GraphMaker;
import cz.zcu.kiv.offscreen.graph.loader.DemoDiagramLoader;
import cz.zcu.kiv.offscreen.graph.loader.GraphJSONDataLoader;
import cz.zcu.kiv.offscreen.graph.loader.JSONConfigLoader;
import cz.zcu.kiv.offscreen.loader.configuration.ConfigurationLoader;
import cz.zcu.kiv.offscreen.session.SessionManager;
import cz.zcu.kiv.offscreen.storage.FileManager;
import net.sf.json.JSONObject;

/**
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public class LoadGraphData extends HttpServlet {

    /**
     * Constructs graph data using either the current graph version or the version set in query parameter. Resulting
     * graph is returned as JSON in response body.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // initialize file manager
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

        FileManager fileManager = new FileManager(workingDirectory, storageLocation);
        response.setContentType("application/json");

        if (request.getSession().getAttribute("demo_id") == null) {
            // it doesn't have EFPs -> read from ComAV
            if (request.getSession().getAttribute("graph_json_data") == null) {
                File[] uploadedFiles = fileManager.getUploadedComponents().toArray(new File[0]);
                File fileToDisplay = uploadedFiles[0];

                GraphManager graphManager = new GraphJSONDataLoader(fileToDisplay).LoadData();
                String configLocation = ConfigurationLoader.getConfigLocation(request.getServletContext());
                JSONConfigLoader configLoader = new JSONConfigLoader(graphManager, configLocation);
                GraphInterface graph = graphManager.createGraph(configLoader);
                GraphExport export = new GraphExport(graph);
                JSONObject json = JSONObject.fromObject(export);

                String resultJsonString = json.toString();

                response.getWriter().write(resultJsonString);

            } else {
                // it has EFPs -> read from the session
                response.getWriter().write(request.getSession().getAttribute("graph_json_data").toString());

                request.getSession().removeAttribute("graph_json_data");
            }

        } else {
            String demoId = request.getSession().getAttribute("demo_id").toString();
            String path = "/WEB-INF" + File.separator + "demoDiagram" + File.separator + demoId + ".json";

            DemoDiagramLoader loader = new DemoDiagramLoader();
            InputStream in = this.getServletContext().getResourceAsStream(path);

            response.getWriter().write(loader.readDemoJSONFromFile(in));

            request.getSession().setAttribute("demo_id", null);
        }
    }
}
