package cz.zcu.kiv.offscreen.storage;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FileLoader {

    private static final int MAX_FILE_SIZE = 512000000;
    private static final String ACCEPTED_EXTENSION_FILE = "json";

    private static final Logger logger = LogManager.getLogger();

    /**
     * Get multipart data from request which was send and return it as a map where key is field name from form and
     * second value are data as string.
     *
     * @return loaded multipart data in map or empty map.
     */
    public Map<String, String> loadFile(HttpServletRequest request){

        DiskFileItemFactory factory = new DiskFileItemFactory();

        ServletFileUpload upload = new ServletFileUpload(factory);
        upload.setSizeMax(MAX_FILE_SIZE);

        Map<String, String> resultMap = new HashMap<>();

        try {

            List<FileItem> fileItems = upload.parseRequest(request);
            for (FileItem item : fileItems) {
                if (item.isFormField()) {
                    resultMap.put(item.getFieldName(), item.getString());
                } else {
                    resultMap.put("filename", item.getName());
                    if (isAcceptedExtension(item.getName()) && item.getSize() > 0) {
                        logger.debug(item.getName() + " - " + item.getContentType());
                        resultMap.put(item.getFieldName(), item.getString("UTF-8"));
                    } else {
                        resultMap.put(item.getFieldName(), "");
                    }
                }
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return resultMap;
    }

    /**
     * Check if input string ends with allowed extension.
     *
     * @param componentName all name of file
     * @return true - if extension is allowed, false - otherwise.
     */
    private boolean isAcceptedExtension(String componentName) {
        return componentName.endsWith("." + ACCEPTED_EXTENSION_FILE);
    }
}
