package cz.zcu.kiv.offscreen.servlets.api;

import com.google.gson.JsonObject;
import cz.zcu.kiv.imiger.spi.IModule;
import cz.zcu.kiv.offscreen.modularization.ModuleProvider;
import cz.zcu.kiv.offscreen.services.IInitialEliminationService;
import cz.zcu.kiv.offscreen.services.impl.InitialEliminationService;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.storage.FileLoader;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * This servlet is used to upload a new graph to the server
 */
public class UploadDiagram extends BaseServlet {

    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.debug("Processing request");
        try {
            // Read in the data from the form
            FileLoader fileLoader = new FileLoader(request);
            Map<String, String> formFields = fileLoader.loadFormFields();
            String visualisation = formFields.get("visualisation");
            String fileType = formFields.get("fileFormat");
            String fileName = formFields.get("filename");
            String initialElimination = formFields.get("enableInitialElimination");

            // Check for presence of all the parameters
            if (fileType == null || fileName == null || fileName.isEmpty()) {
                sendErrorResponse(HttpServletResponse.SC_BAD_REQUEST, "Missing parameter", response);
                return;
            }

            // Check whether the filename pattern matches the selected format
            Pattern pattern = getFileNamePatternForType(fileType);
            Matcher matcher = pattern.matcher(fileName);
            if (!matcher.matches()) {
                sendErrorResponse(
                        HttpServletResponse.SC_BAD_REQUEST,
                        "Filename '" + fileName + "' does not match file type pattern: " + pattern,
                        response);
                return;
            }

            // Check whether the file with graph data is not empty
            String fileContent = fileLoader.loadFileAsString(fileName);
            if (fileContent == null || StringUtils.isBlank(fileContent)) {
                sendErrorResponse(HttpServletResponse.SC_BAD_REQUEST, "Provided file is empty", response);
                return;
            }

            // Check whether the user has selected to perform an initial
            boolean doInitialElimination = (initialElimination != null && initialElimination.equals("true"));

            // Process the diagram data and send user the processed version of the data
            processDiagram(fileContent, fileType, fileName, doInitialElimination, response);
            logger.debug("Request processed - file uploaded and converted");

        } catch (IllegalArgumentException | UnsupportedEncodingException e) {
            logger.debug("Invalid request");
            sendErrorResponse(HttpServletResponse.SC_BAD_REQUEST, e.getMessage(), response);
            return;
        } catch (FileUploadException e) {
            logger.debug("Invalid request", e);
            sendErrorResponse(HttpServletResponse.SC_BAD_REQUEST, e.getMessage(), response);
            return;
        }
        logger.debug("Request processed");
    }

    /**
     * Get regex pattern for a file name acceptable for the selected format converter
     * @param fileType data format for which the pattern shall be determined
     * @return Pattern of a file acceptable by the given formatter
     */
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

    /**
     * Process the diagram data
     *  - check whether the diagram is OK
     *  - convert it into the Raw JSON format
     *  - send user the data back again
     * @param diagramToDisplay diagram textual data to be processed
     * @param diagramType format of the diagram
     * @param filename name of the uploaded diagram file
     * @param initialElimination flag indicating whether to run the initial elimination
     * @param response HttpServletResponse into which the result will be written
     * @throws IOException in case of error while writing to HttpServletResponse
     */
    private void processDiagram(String diagramToDisplay, String diagramType,
                                String filename, boolean initialElimination,
                                HttpServletResponse response) throws IOException {

        // Check whether the diagram is not empty
        if (StringUtils.isNotBlank(diagramToDisplay) && diagramType != null) {

            String rawJson;

            // if the diagram comes in row format, no conversion is required
            if (diagramType.equals("raw")) {
                logger.debug("Processing Raw json");
                rawJson = diagramToDisplay;
            }
            // otherwise, the conversion module shall be invoked
            else {
                Optional<String> optional = callModuleConverter(diagramType, diagramToDisplay);
                if(optional.isPresent()){ // conversion OK
                    rawJson = optional.get();
                } else { // handle conversion error
                    sendErrorResponse(HttpServletResponse.SC_NOT_ACCEPTABLE,
                            "Module converter failed converting this file. " +
                                    "This is probably due to the fact that the specified graph type does not correspond to the " +
                                    "selected file.", response);
                    return;
                }
            }

            if (initialElimination) {
                IInitialEliminationService initialEliminationService = new InitialEliminationService();
                rawJson = initialEliminationService.computeInitialElimination(rawJson);
            }

            // prepare JSON response
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("graph_json", rawJson);
            jsonObject.addProperty("name", filename);
            jsonObject.addProperty("initial_elimination", initialElimination);

            // write out the response
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
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

    /**
     * Send an error response with the given return code and error message
     * @param returnCode return code of the response
     * @param errorMessage error message that shall be returned in JSON
     * @param response response into which the data will be written
     * @throws IOException in case of error while writing to HttpServletResponse
     */
    private void sendErrorResponse(int returnCode, String errorMessage,
                                   HttpServletResponse response) throws IOException {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("error_message", errorMessage);

        // write out the response
        response.setStatus(returnCode);
        response.getWriter().write(jsonObject.toString());
        response.getWriter().flush();
    }
}
