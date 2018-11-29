package cz.zcu.kiv.offscreen.servlets;

import com.google.common.base.Strings;
import cz.zcu.kiv.offscreen.storage.FileLoader;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
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
    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.debug("Processing request");
        DB db = new DB(getServletContext());
        Diagram diagram = new Diagram(db);

        List<Map<String, String>> userDiagramList = new ArrayList<>();
        if (isLoggedIn(request)) {
            logger.debug("Logged user");
            int loggedUserId = getUserId(request);

            userDiagramList = diagram.getDiagramListByUserId(loggedUserId);
        }
        request.setAttribute("diagramsPrivate", userDiagramList);

        List<Map<String, String>> publicDiagramList = diagram.getDiagramPublicList();
        request.setAttribute("diagramsPublic", publicDiagramList);

        // render
        RequestDispatcher rd = getServletContext().getRequestDispatcher("/uploadFiles.jsp");
        rd.forward(request, response);
        logger.debug("Request processed");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.debug("Processing request");
        Map<String, String> jsonData = new FileLoader().loadFile(request);

        if(!jsonData.containsKey("file") || !jsonData.containsKey("jsonFileFormat")) {
            request.setAttribute("errorMessage", "<strong>Invalid request!</strong><br/>");
            logger.debug("Invalid request");
            doGet(request, response);

        } else if (Strings.isNullOrEmpty(jsonData.get("file"))) {
            request.setAttribute("errorMessage", "<strong>Unsupported file</strong><br/>");
            logger.debug("Empty diagram json");
            doGet(request, response);
        } else {
            request.getSession().setAttribute("json_graph", jsonData.get("file"));
            request.getSession().setAttribute("json_graph_type", jsonData.get("jsonFileFormat"));
            request.getSession().setAttribute("graph_filename", jsonData.get("filename"));
            response.sendRedirect(getServletContext().getInitParameter("APP_HOME_URL") + "graph");
            logger.debug("send redirect to /graph");
        }
        logger.debug("Request processed");
    }
}
