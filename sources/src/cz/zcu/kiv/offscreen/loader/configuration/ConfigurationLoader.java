package cz.zcu.kiv.offscreen.loader.configuration;

import java.io.IOException;
import javax.servlet.ServletContext;

/**
 * 
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public class ConfigurationLoader {

	public static final String PROP_STORAGE_LOCATION = "storageLocation";
	public static final String CRCE_API_BASE = "crceApiBase";

	/**
	 * Get storage location property from web.xml.
	 * 
	 * @param context App context.
	 * @return Storage location path.
	 * @throws IOException
	 */
	public static String getStorageLocation(ServletContext context) throws IOException {
		return context.getInitParameter(PROP_STORAGE_LOCATION);
	}

	/**
	 * Get CRCE API base path from web.xml.
	 *
	 * @param context App context.
	 * @return Storage location path.
	 * @throws IOException
	 */
	public static String getCrceApiBase(ServletContext context) throws IOException {
		return context.getInitParameter(CRCE_API_BASE);
	}
}
