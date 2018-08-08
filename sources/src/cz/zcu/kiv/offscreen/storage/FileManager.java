package cz.zcu.kiv.offscreen.storage;

import java.io.*;
import java.net.URI;
import java.util.LinkedList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FileDeleteStrategy;
import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;

/**
 *
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public class FileManager {

    private int MAX_FILE_SIZE = 512000000;
    private int MAX_MEM_SIZE = 4 * 1024;
    private static final String ACCEPTED_EXTENSION_FILE = "json";
    private String storagePath;
    private Logger logger = Logger.getLogger(FileManager.class);

    public FileManager(String directoryName, String storageLocation) {
        logger.trace("ENTRY");
        this.storagePath = storageLocation + File.separator + directoryName;
        logger.trace("EXIT");
    }

    public void createStorageDirectory() throws IOException {
        logger.trace("ENTRY");
        File storageDirectory = new File(this.storagePath);
        FileUtils.forceMkdir(storageDirectory);
        logger.trace("EXIT");
    }

    public boolean isExistStorage() {
        logger.trace("ENTRY");
        logger.trace("EXIT");
        return new File(this.storagePath).isDirectory();
    }

    private boolean isAcceptedExtension(String componentName) {
        return componentName.endsWith("." + ACCEPTED_EXTENSION_FILE);
    }

    public String saveFile(HttpServletRequest request) {
        logger.trace("ENTRY");

        boolean firstErr = true;
        StringBuilder sb = new StringBuilder();
        DiskFileItemFactory factory = new DiskFileItemFactory();
        factory.setSizeThreshold(MAX_MEM_SIZE);
        factory.setRepository(new File(this.storagePath));

        ServletFileUpload upload = new ServletFileUpload(factory);
        upload.setSizeMax(MAX_FILE_SIZE);

        try {
            // Parse the request to get file items.
            List<FileItem> fileItems = upload.parseRequest(request);
            File file;
            for (FileItem fileItem : fileItems) {
                if (isAcceptedExtension(fileItem.getName()) && fileItem.getSize() > 0) {
                    logger.debug(fileItem.getName() + " - " + fileItem.getContentType());
                    file = new File(this.storagePath + File.separator + fileItem.getName());
                    fileItem.write(file);

                } else if (fileItem.getSize() <= 0) {
                	if (firstErr) {
                        sb.append("<strong>Unsupported files:</strong><br/>");
                        firstErr = false;
                    }
                	
                	sb.append("&nbsp;&nbsp;&nbsp;File ");
                    sb.append(fileItem.getName());
                    sb.append(" was't uploaded. (File size is 0 B)<br/>");
                	
                } else {
                    if (firstErr) {
                        sb.append("<strong>Unsupported files:</strong><br/>");
                        firstErr = false;
                    }
                    sb.append("&nbsp;&nbsp;&nbsp;File ");
                    sb.append(fileItem.getName());
                    sb.append(" was't uploaded.<br/>");
                }
            }

        } catch (Exception ex) {
            System.out.println(ex);
        }

        logger.trace("EXIT");
        return sb.toString();
    }

    public void saveFile(InputStream inputStream, String fileName) throws IOException {
        File file = new File(this.storagePath + File.separator + fileName);

        if (isAcceptedExtension(file.getName())) {
            BufferedInputStream in = new BufferedInputStream(inputStream);
            FileOutputStream out = new FileOutputStream(file);

            int length;
            byte[] buffer = new byte[1024];

            while ((length = in.read(buffer)) > -1) {
                out.write(buffer, 0, length);
            }

            in.close();
            out.close();
        }
    }

    /**
     * Gets list of uploded components file names in designated directory for
     * current session.
     *
     * @return list of filenames
     */
    public List<String> getUploadedComponentsNames() {
        logger.trace("ENTRY");
        String[] extension = {ACCEPTED_EXTENSION_FILE};
        logger.info(this.storagePath);

        LinkedList<File> fileNames = (LinkedList<File>) FileUtils.listFiles(new File(this.storagePath), extension, false);
        List<String> bundleNames = new LinkedList<String>();
        for (File file : fileNames) {
            bundleNames.add(file.getName());
        }

        logger.trace("EXIT");
        return bundleNames;
    }

    /**
     * Deletes file from storage.
     *
     * @param fileName
     */
    public void deleteFile(String fileName) {
        logger.trace("ENTRY");
        if (fileName == null) {
            throw new NullPointerException("The parameter fileName is null!");
        }
        String path = this.storagePath + File.separator + fileName;
        logger.debug("All path to delete file: " + path);
        File filePath = new File(path);

        if (filePath.isDirectory()) {
            throw new IllegalArgumentException("The parameter fileName " + fileName + " can not be directory!");
        }

        if (!FileDeleteStrategy.NORMAL.deleteQuietly(filePath)) {
            throw new IllegalStateException("The file " + fileName + " can not be deleted!");
        }
        logger.debug("File " + fileName + " was deleted.");

        logger.trace("EXIT");
    }

    /**
     * Deletes all files from storage.
     *
     * @throws IOException
     */
    public void deleteAllFiles() throws IOException {
        logger.trace("ENTRY");

        File dir = new File(this.storagePath);
        if (dir.exists()){
        	FileUtils.cleanDirectory(dir);
        }

        logger.trace("EXIT");
    }

    /**
     * Convert file to URI.
     * @return Return list of URI.
     */
    public URI[] convertFileToURI() {
        List<File> files = this.getUploadedComponents();
        logger.trace("ENTRY");
        if (files == null) {
            throw new IllegalArgumentException("Parameter List<File> files is null.");
        }

        URI[] filesURI = new URI[files.size()];
        int i = 0;
        for (File file : files) {
            filesURI[i] = file.toURI();
            i++;
        }

        logger.trace("EXIT");
        return filesURI;
    }

    /**
     * Gets list of absolute path uploaded components in designated directory
     * for current session.
     *
     * @return list of absolute path uploaded bundles
     */
    public List<File> getUploadedComponents() {
        logger.trace("ENTRY");
        String[] extension = {ACCEPTED_EXTENSION_FILE};
        logger.info(this.storagePath);
        LinkedList<File> fileNames = (LinkedList<File>) FileUtils.listFiles(
                new File(this.storagePath), extension, false);
        logger.trace("EXIT");
        return fileNames;
    }
    
    /**
     * Gets list of absolute path uploaded components in designated directory
     * for current session.
     *
     * @return list of absolute path uploaded bundles
     */
    public List<File> copyUploadedComponents(String directory_name) {
        logger.trace("ENTRY");

        String[] extension = {ACCEPTED_EXTENSION_FILE};
        logger.info(this.storagePath);
        LinkedList<File> fileNames = (LinkedList<File>) FileUtils.listFiles(
                new File(this.storagePath), extension, false);
        List<String> bundleNames = new LinkedList<String>();
        for (File file : fileNames) {
        	
        	File f2 = new File(directory_name + File.separator + file.getName());
        	InputStream in;
			try {
					in = new FileInputStream(file);
				
	        	OutputStream out = new FileOutputStream(f2);
	        	
	        	byte[] buf = new byte[1024];
	            int len;
	            while ((len = in.read(buf)) > 0){
	            out.write(buf, 0, len);
	            }
	            in.close();
	            out.close();
            
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
        
        logger.trace("EXIT");
        return fileNames;
    }
    
    
    /**
     *
     *
     * @return list of absolute path uploaded bundles
     */
    public List<File> copyUploadedComponentsTo(String directory_name) {
        logger.trace("ENTRY");

        String[] extension = {ACCEPTED_EXTENSION_FILE};
        logger.info(this.storagePath);

        LinkedList<File> fileNames = (LinkedList<File>) FileUtils.listFiles(new File(this.storagePath), extension, false);
        List<String> bundleNames = new LinkedList<String>();
        for (File file : fileNames) {
        	File f2 = new File(directory_name + File.separator + file.getName());
        	InputStream in;

			try {
                in = new FileInputStream(file);
	        	OutputStream out = new FileOutputStream(f2);
	        	
	        	byte[] buf = new byte[1024];
	            int len;
	            while ((len = in.read(buf)) > 0){
	                out.write(buf, 0, len);
	            }

	            in.close();
	            out.close();
            
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
        
        logger.trace("EXIT");
        return fileNames;
    }
    
    /**
     *  Deletes a directory recursively from storage.
     *
     * @throws IOException in case deletion is unsuccessful
     */
    public void deleteDirectory() throws IOException {
        logger.trace("ENTRY");

        File dir = new File(this.storagePath);
        if (dir.exists()) {
        	FileUtils.deleteDirectory(dir);
        }

        logger.trace("EXIT");
    }
    
}
