package cz.zcu.kiv.offscreen.session;

import cz.zcu.kiv.offscreen.loader.configuration.ConfigurationLoader;
import cz.zcu.kiv.offscreen.storage.FileManager;
import java.io.IOException;
import java.util.logging.Level;
import javax.servlet.http.*;
import org.apache.log4j.Logger;

/**
 *
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public class SessionManager implements HttpSessionListener {

    private static Logger logger = Logger.getLogger(SessionManager.class);

    /**
     * Get session value.
     * @param request request
     * @param sessionName session name
     * @return Returns value which correspond sessionName
     */
    public static String getSessionValue(HttpServletRequest request, String sessionName) {
        logger.trace("ENTRY");
        logger.debug("*" + request.getCookies() + "*");
        Cookie[] cookie = null;
        String sessionValue = "";

        if (request.getCookies() != null) {
            cookie = request.getCookies();
            logger.debug(cookie.length);
            for (int i = 0; i < cookie.length; i++) {
                logger.debug(cookie[i]);
                if ((cookie[i].getName()).equals(sessionName)) {
                    sessionValue = cookie[i].getValue();
                }
            }
        }
        logger.trace("EXIT");
        return sessionValue;
    }

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        logger.trace("ENTRY");
        HttpSession session = se.getSession();
        logger.info("Session " + session.getId()
                + " was created with timeout " + session.getMaxInactiveInterval());
        logger.trace("EXIT");
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        try {
            logger.trace("ENTRY");
            HttpSession session = se.getSession();
            logger.info("Session " + session.getId() + " was invalidated.");

            String storageLocation = ConfigurationLoader.getStorageLocation(session.getServletContext());
            FileManager storage = new FileManager(session.getId(), storageLocation);
            try {
                storage.deleteDirectory();
            } catch (IOException ex) {
                logger.error("Directory " + session.getId() + " was not deleted. " + ex.getMessage());
            }
            logger.trace("EXIT");
        } catch (IOException ex) {
            java.util.logging.Logger.getLogger(SessionManager.class.getName()).log(Level.SEVERE, null, ex);
        }

    }
}
