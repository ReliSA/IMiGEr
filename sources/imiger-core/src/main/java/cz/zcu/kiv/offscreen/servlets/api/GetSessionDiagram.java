package cz.zcu.kiv.offscreen.servlets.api;

import com.google.gson.JsonObject;
import cz.zcu.kiv.imiger.spi.IModule;
import cz.zcu.kiv.offscreen.modularization.ModuleProvider;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

/**
 * This class is used for loading diagrams from session.
 */
public class GetSessionDiagram extends BaseServlet {
    private static final Logger logger = LogManager.getLogger();

    /**
     * Constructs graph data using either the current graph version or the version set in query parameter. Resulting
     * graph is returned as JSON in response body.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.debug("Processing request");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        getDiagramFromSession(request, response);
    }

    /**
     * Add file which was uploaded and is stored in session to response or set http status code to BAD_REQUEST.
     */
    private void getDiagramFromSession(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String diagramToDisplay = (String) request.getSession().getAttribute("diagram_string");
        String diagramType = (String) request.getSession().getAttribute("diagram_type");
        String filename = (String) request.getSession().getAttribute("diagram_filename");

        if (StringUtils.isNotBlank(diagramToDisplay) && diagramType != null) {

            String rawJson;

            if (diagramType.equals("raw")) {
                logger.debug("Processing Raw json");
                rawJson = diagramToDisplay;
            } else {
                Optional<String> optional = callModuleConverter(diagramType, diagramToDisplay);
                if(optional.isPresent()){
                    rawJson = optional.get();
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
                    return;
                }
            }

            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("graph_json", rawJson);
            jsonObject.addProperty("name", filename);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(jsonObject.toString());
            response.getWriter().flush();
            logger.debug("Response OK");
            return;
        }

        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        logger.debug("Response BAD REQUEST");
    }

    /**
     * Method find module by type and call method for getting RAW JSON from module. If result is null, empty or
     * blank, method returns empty Optional.
     *
     * @param type type of converter which is key to map of modules
     * @param stringToConvert string which will be converted
     * @return Optional of RAW JSON or empty Optional
     */
    private Optional<String> callModuleConverter(String type, String stringToConvert){
        logger.debug("Processing json with module");

        IModule module = ModuleProvider.getInstance().getModules().get(type);
        if (module == null) {
            logger.debug("No loader available for type: " + type + ". Response BAD REQUEST");
            return Optional.empty();
        }

        try {
            String rawJson = String.valueOf(module.getRawJson(stringToConvert));

            if (StringUtils.isBlank(rawJson)){
                return Optional.empty();
            } else {
                return Optional.of(rawJson);
            }

        } catch (Exception e) {
            logger.error("Can not call convert method in module. Module name: " + module.getModuleName(), e);
            return Optional.empty();
        }
    }
}
