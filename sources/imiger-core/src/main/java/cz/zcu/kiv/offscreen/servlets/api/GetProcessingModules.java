package cz.zcu.kiv.offscreen.servlets.api;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import cz.zcu.kiv.imiger.spi.IModule;
import cz.zcu.kiv.offscreen.modularization.ModuleProvider;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.dao.DiagramDAO;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * This servlet is used to query all available graphs format plugins
 * using a RestAPI
 */
public class GetProcessingModules extends BaseServlet {

    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.debug("Processing request");

        // Get all modules as a map of <module id> -> <module name>
        Map<String, String> modules = new HashMap<>();
        ModuleProvider.getInstance().getModules().forEach((key, module) -> modules.put(key, module.getModuleName()));

        // Create the JSON response
        String modulesJson = new Gson().toJson(modules);
        JsonObject jsonResponse = new JsonObject();
        jsonResponse.addProperty("processingModules", modulesJson);

        // Sent out the  reponse
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(jsonResponse.toString());
        response.getWriter().flush();
        logger.debug("Response OK");
    }
}