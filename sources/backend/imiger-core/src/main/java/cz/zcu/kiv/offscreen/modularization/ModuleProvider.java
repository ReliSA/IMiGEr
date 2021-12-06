package cz.zcu.kiv.offscreen.modularization;

import cz.zcu.kiv.imiger.spi.IModule;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author Tomáš Šimandl
 */
public class ModuleProvider {

    private static final Logger logger = LogManager.getLogger();
    /** Path to folder with modules relative to resources */
    private static final String MODULES_PATH = "/../lib/";
    /** Instance of this class used for singleton pattern. */
    private static ModuleProvider instance = null;

    /** Queue containing actual loaded modules. */
    private Map<String, IModule> modules = new ConcurrentHashMap<>();


    /**
     * Static method for creating only one instance of this class.
     * Singleton pattern.
     *
     * @return one instance of this class for every call.
     */
    public static ModuleProvider getInstance() {
        if (instance == null) {
            instance = new ModuleProvider();
        }
        return instance;
    }

    /**
     * Private constructor is used for singleton pattern. Constructor loads (method moduleLoader.loadModules)
     * and store (method processModules) all modules from folder and start watcher on modules folder.
     * When watcher fails than is automatically starts new watcher after 5 minutes timeout.
     */
    private ModuleProvider() {
        DynamicServiceLoader<IModule> serviceLoader = new DynamicServiceLoader<>(IModule.class, MODULES_PATH);
        processModules(serviceLoader.load());
    }

    /**
     * Method is used for prepare loaded modules to be used in application. Result is stored in modules variable.
     * First of all is created new map where keys are hash of first arguments of input pairs and values are input pairs.
     * Than variable modules is cleared and all values from created map is insert to it.
     *
     * @param unprocessedModules Set of loaded modules where first argument is visible name and second is accessible method.
     */
    private void processModules(Iterator<IModule> unprocessedModules) {
        long startTime = System.nanoTime();
        logger.info("Processing modules.");

        modules.clear();
        unprocessedModules.forEachRemaining(module -> modules.put(String.valueOf(module.getModuleName().hashCode()), module));

        logger.debug("Modules were loaded and processed in " + (System.nanoTime() - startTime) / 1000000d + " milliseconds");
    }

    /**
     * Return all loaded modules in map where value is Pair of visible name and module accessible method and key is
     * hash code of visible name.
     *
     * @return all loaded modules.
     */
    public Map<String, IModule> getModules() {
        return modules;
    }
}
