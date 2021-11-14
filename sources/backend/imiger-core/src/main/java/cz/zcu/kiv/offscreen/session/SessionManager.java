package cz.zcu.kiv.offscreen.session;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.*;
import java.util.Arrays;

/**
 *
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public class SessionManager implements HttpSessionListener {

    private static final Logger logger = LogManager.getLogger();

    /**
     * Get session value.
     * @param request request
     * @param sessionName session name
     * @return Returns value which correspond sessionName
     */
    public static String getSessionValue(HttpServletRequest request, String sessionName) {
        String sessionValue = "";
        Cookie[] cookies = request.getCookies();
        logger.debug("*" + Arrays.toString(cookies)+ "*");

        if (cookies != null) {
            logger.debug(cookies.length);
            for (Cookie cookie : cookies) {
                logger.debug(cookie);
                if ((cookie.getName()).equals(sessionName)) {
                    sessionValue = cookie.getValue();
                }
            }
        }
        return sessionValue;
    }

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        HttpSession session = se.getSession();
        logger.info("Session " + session.getId() + " was created with timeout " + session.getMaxInactiveInterval());
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        HttpSession session = se.getSession();
        logger.info("Session " + session.getId() + " was invalidated.");
    }
}
