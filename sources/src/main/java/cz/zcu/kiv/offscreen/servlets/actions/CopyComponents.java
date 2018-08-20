package cz.zcu.kiv.offscreen.servlets.actions;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import cz.zcu.kiv.offscreen.loader.configuration.ConfigurationLoader;
import cz.zcu.kiv.offscreen.session.SessionManager;
import cz.zcu.kiv.offscreen.storage.FileManager;

/**
 * @author Pavel Fidransky [jsem@pavelfidransky.cz]
 */
public class CopyComponents extends HttpServlet {

    /**
     * Makes a copy of components stored in the current graph version folder to the (current + 1) folder. Components to
     * be copied are set by input JSON.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // read input data
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        // parse the data as JSON
        JSONObject componentsJson;
        try {
            componentsJson = new JSONObject(sb.toString());
        } catch (ParseException e) {
            response.sendError(response.SC_BAD_REQUEST);
            return;
        }

        // get current graph version from cookie
        int version = Integer.parseInt(SessionManager.getSessionValue(request, "graphVersion"));

        // initialize file manager
        String workingDirectory;
        if (request.getParameter("diagram_hash") == null) {
            workingDirectory = SessionManager.getSessionValue(request, "JSESSIONID");
        } else {
            workingDirectory = request.getParameter("diagram_hash");
        }

        String storageLocation = ConfigurationLoader.getStorageLocation(request.getServletContext());

        FileManager oldFileManager = new FileManager(workingDirectory + File.separator + String.valueOf(version), storageLocation);
        FileManager newFileManager = new FileManager(workingDirectory + File.separator + String.valueOf(version + 1), storageLocation);

        List<String> currentComponents = oldFileManager.getUploadedComponentsNames();

        // copy components
        JSONArray components = componentsJson.getJSONArray("components");
        for (int i = 0; i < components.length(); i++) {
            JSONObject component = components.getJSONObject(i);
            String name = component.getString("name");

            if (!currentComponents.contains(name)) continue;

            String oldPath = storageLocation + File.separator + workingDirectory + File.separator + String.valueOf(version) + File.separator + name;
            newFileManager.saveFile(new FileInputStream( oldPath), name);
        }
    }
}
