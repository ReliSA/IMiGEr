package cz.zcu.kiv.offscreen.servlets;

import com.google.common.base.Strings;
import cz.zcu.kiv.offscreen.modularization.ModuleProvider;
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
        request.setAttribute("processingModules", ModuleProvider.getInstance().getModules());

        // render
        RequestDispatcher rd = getServletContext().getRequestDispatcher("/uploadFiles.jsp");
        rd.forward(request, response);
        logger.debug("Request processed");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.debug("Processing request");
        Map<String, String> data = new FileLoader().loadFile(request);

        if(!data.containsKey("file") || !data.containsKey("fileFormat")) {
            request.setAttribute("errorMessage", "<strong>Invalid request!</strong><br/>");
            logger.debug("Invalid request");
            doGet(request, response);

        } else if (Strings.isNullOrEmpty(data.get("file"))) {
            request.setAttribute("errorMessage", "<strong>Unsupported file</strong><br/>");
            logger.debug("Empty diagram string");
            doGet(request, response);
        } else {
            request.getSession().setAttribute("diagram_string", data.get("file"));
            request.getSession().setAttribute("diagram_type", data.get("fileFormat"));
            request.getSession().setAttribute("diagram_filename", data.get("filename"));
            response.sendRedirect(getServletContext().getInitParameter("APP_HOME_URL") + "graph");
            logger.debug("send redirect to /graph");
        }
        logger.debug("Request processed");
    }
}
