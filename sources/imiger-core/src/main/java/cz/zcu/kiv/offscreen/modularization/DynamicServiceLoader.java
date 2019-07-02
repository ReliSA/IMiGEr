package cz.zcu.kiv.offscreen.modularization;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Iterator;
import java.util.ServiceLoader;

/**
 * @author Tomáš Šimandl
 */
class DynamicServiceLoader<S> {

    private static final Logger logger = LogManager.getLogger();
    /** Instance of static SPI loader. */
    private ServiceLoader<S> serviceLoader;

    /**
     * @param service Interface or abstract class representing the service to be loaded.
     * @param servicesPath Path to folder to load services from. Path is relative to resources.
     */
    DynamicServiceLoader(Class<S> service, String servicesPath) {
        this.serviceLoader = ServiceLoader.load(service);

        logger.info("Initialized new DynamicServiceLoader with folder path: " + servicesPath);
    }

    /**
     * Loads services implements {@link S} interface.
     * @return Iterator of loaded services.
     */
    public Iterator<S> load() {
        return serviceLoader.iterator();
    }
}
