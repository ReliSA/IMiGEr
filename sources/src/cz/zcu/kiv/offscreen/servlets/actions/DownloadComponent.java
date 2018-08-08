package cz.zcu.kiv.offscreen.servlets.actions;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONObject;

import cz.zcu.kiv.offscreen.loader.configuration.ConfigurationLoader;
import cz.zcu.kiv.offscreen.session.SessionManager;
import cz.zcu.kiv.offscreen.storage.FileManager;

/**
 * @author Pavel Fidransky [jsem@pavelfidransky.cz]
 */
public class DownloadComponent extends HttpServlet {

    private String crceApiBase;
    private FileManager fileManager;

    private Logger logger = Logger.getLogger(DownloadComponent.class);

    /**
     * Downloads component by its UUID set in query parameter. The component is then stored in the current graph version
     * folder. As a response, JSON containing component's UUID and filename is returned.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.error("Method is no longer supported because CRCE is removed from project.");
//        // there was no uuid passed in the request
//        if (request.getParameter("uuid") == null) {
//            response.sendError(response.SC_BAD_REQUEST);
//            return;
//        }
//
//        // initialize file manager
//        String workingDirectory;
//        if (request.getParameter("diagram_hash") == null) {
//            workingDirectory = SessionManager.getSessionValue(request, "JSESSIONID");
//        } else {
//            workingDirectory = request.getParameter("diagram_hash");
//        }
//
//        if (request.getParameter("graphVersion") != null) {
//            workingDirectory += File.separator + request.getParameter("graphVersion");
//        } else {
//            workingDirectory += File.separator + SessionManager.getSessionValue(request, "graphVersion");
//        }
//
//        String storageLocation = ConfigurationLoader.getStorageLocation(request.getServletContext());
//
//        fileManager = new FileManager(workingDirectory, storageLocation);
//        if (!fileManager.isExistStorage()) {
//            fileManager.createStorageDirectory();
//        }
//
//        // download component
//        crceApiBase = ConfigurationLoader.getCrceApiBase(request.getServletContext());
//
//        String uuid = request.getParameter("uuid");
//        String name = downloadComponent(uuid);
//
//        JSONObject componentJson = new JSONObject();
//        componentJson.put("uuid", uuid);
//        componentJson.put("name", name);
//
//        // send response
//        response.setContentType("application/json");
//        response.getWriter().write(componentJson.toString());
    }

    /*
    PRIVATE METHODS
     */

    private String downloadComponent(String uuid) throws IOException {
        URL url = new URL(this.crceApiBase + "/resources/" + uuid);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setConnectTimeout(60 * 1000);
        connection.setReadTimeout(60 * 1000);

        InputStream inputStream = connection.getInputStream();

        String contentDisposition = connection.getHeaderField("Content-Disposition");
        String fileName = contentDisposition.replaceFirst("(?i)^.*filename = ([^\"]+).*$", "$1");
        File file = new File(fileName);

        fileManager.saveFile(inputStream, file.getName());

        inputStream.close();

        return file.getName();
    }

}
