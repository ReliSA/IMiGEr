package cz.zcu.kiv.offscreen.servlets;

import cz.zcu.kiv.imiger.spi.IModule;
import cz.zcu.kiv.offscreen.modularization.ModuleProvider;
import cz.zcu.kiv.offscreen.storage.FileLoader;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UploadFiles extends BaseServlet {
    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.debug("Processing request");

        // render
        // TODO: Return main page of the Vue.JS application as soon as it's available
        RequestDispatcher rd = getServletContext().getRequestDispatcher("/main.html");
        rd.forward(request, response);
        logger.debug("Request processed");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.debug("Processing request");
        try {
            FileLoader fileLoader = new FileLoader(request);
            Map<String, String> formFields = fileLoader.loadFormFields();
            String visualisation = formFields.get("visualisation");
            String fileType = formFields.get("fileFormat");
            String fileName = formFields.get("filename");
            String initialElimination = formFields.get("enableInitialElimination");

            if (fileType == null || fileName == null || fileName.isEmpty()) {
                throw new IllegalArgumentException("Missing parameter");
            }

            Pattern pattern = getFileNamePatternForType(fileType);
            Matcher matcher = pattern.matcher(fileName);
            if (!matcher.matches()) {
                throw new IllegalArgumentException(
                        "Filename '" + fileName + "' does not match file type pattern: " + pattern);
            }

            String fileContent = fileLoader.loadFileAsString(fileName);
            if (fileContent == null || StringUtils.isBlank(fileContent)) {
                throw new IllegalArgumentException("Empty file!");
            }

            request.getSession().setAttribute("diagram_string", fileContent);
            request.getSession().setAttribute("diagram_type", fileType);
            request.getSession().setAttribute("diagram_filename", fileName);

            if(visualisation != null && visualisation.equals("timeline")) {
                request.getSession().setAttribute("showTimeline", true);
            } else  {
                request.getSession().setAttribute("showTimeline", false);
            }

            request.getSession().setAttribute("diagram_initial_elimination",
                    initialElimination != null ? initialElimination : "false");

            // TODO Do we want redirect here or will we create SPA?
            response.sendRedirect(getServletContext().getInitParameter("APP_HOME_URL") + "graph");
            logger.debug("send redirect to /graph");

        } catch (IllegalArgumentException | UnsupportedEncodingException e) {
            logger.debug("Invalid request");
            request.setAttribute("errorMessage", "<strong>" + e.getMessage() + "</strong><br/>");
            doGet(request, response);
        } catch (FileUploadException e) {
            logger.debug("Invalid request");
            request.setAttribute("errorMessage", "<strong>File upload failed!</strong><br/>");
            doGet(request, response);
        }
        logger.debug("Request processed");
    }

    private Pattern getFileNamePatternForType(String fileType) {
        if (fileType.equals("raw")) {
            return Pattern.compile("(?s).+\\.json");
        } else {
            IModule module = ModuleProvider.getInstance().getModules().get(fileType);
            if (module != null) {
                return module.getFileNamePattern();
            } else {
                throw new IllegalArgumentException("No loader available for type: " + fileType);
            }
        }
    }

}
