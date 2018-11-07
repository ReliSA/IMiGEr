package cz.zcu.kiv.offscreen.configuration;

import javax.servlet.ServletContext;

/**
 * 
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public class ConfigurationLoader {

	private static final String PROP_CONFIG_LOCATION = "configLocation";

	/**
	 * Get configuration location property from web.xml.
	 *
	 * @param context App context.
	 * @return Storage location path.
	 */
	public static String getConfigLocation(ServletContext context) {
		return context.getInitParameter(PROP_CONFIG_LOCATION);
	}
}
