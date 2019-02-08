package cz.zcu.kiv.offscreen.modularization;

import javafx.util.Pair;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.*;

/**
 * @author Tomáš Šimandl
 */
public class ModuleProvider {

    /** Name of accessed method in every module. */
    public static final String METHOD_NAME = "getRawJson";
    /** Class of input parameter to accessed method in every module. */
    public static final Class METHOD_PARAMETER_CLASS = String.class;

    private static final Logger logger = LogManager.getLogger();
    /** Instance of this class used for singleton pattern. */
    private static ModuleProvider instance = null;

    /**
     * Map containing actual loaded modules. Key is hash of visible name and value is pair of
     * visible name na accessed method.
     */
    private ConcurrentMap<String, Pair<String, Class>> modules = new ConcurrentHashMap<>();
    /** Instance of class ModuleLoader. */
    private final ModuleLoader loader;

    /** Instance of ScheduledExecutorService used for scheduling of module folder watcher. */
    private ScheduledExecutorService executor;
    /** Instance of ScheduledFuture used for scheduling of module folder watcher. */
    private ScheduledFuture scheduledFuture;
    /** Instance of WatchService used for watching of folder with modules. */
    private WatchService watcher = null;

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
        this.loader = new ModuleLoader(METHOD_NAME, METHOD_PARAMETER_CLASS);

        processModules(loader.loadModules());

        executor = Executors.newSingleThreadScheduledExecutor();
        Runnable task = this::initModulesWatcher;
        logger.debug("Scheduling Modules Watcher thread.");
        // task will be scheduled after 1 minute
        // When task ends (on failure) after one minute will be planed again
        scheduledFuture = executor.scheduleWithFixedDelay(task, 0, 5, TimeUnit.MINUTES);
    }

    /**
     * Method is used for stopping watcher on modules folder and thread associate with it.
     */
    public void stopWatcher() {
        logger.debug("Stopping WatcherProvider");

        try {
            logger.info("Closing WatcherService");
            if (watcher != null) watcher.close();
        } catch (IOException e) {
            logger.debug("Closing watcher throw exception: ", e);
        }

        logger.info("Canceling scheduler");
        if (scheduledFuture != null) scheduledFuture.cancel(true);

        logger.info("Shutting down an ScheduledExecutorService");
        if (executor != null) executor.shutdown();
    }

    /**
     * Method open folder with modules and starts watcher on folder. Watcher is activated when any file is created,
     * deleted of modified in modules folder. Activation of watcher run loading (method moduleLoader.loadModules)
     * and storing (method processModules) of all modules.
     */
    private void initModulesWatcher() {
        try {
            logger.debug("Initializing new WatcherService for modules directory");

            Path path = Paths.get(getClass().getClassLoader().getResource("/../lib/").toURI());
            watcher = FileSystems.getDefault().newWatchService();
            path.register(watcher,
                    StandardWatchEventKinds.ENTRY_CREATE,
                    StandardWatchEventKinds.ENTRY_DELETE,
                    StandardWatchEventKinds.ENTRY_MODIFY);

            while (true) {
                WatchKey key = watcher.take();
                logger.debug("Watcher events was detected");

                for (WatchEvent<?> event : key.pollEvents()) {
                    WatchEvent.Kind<?> kind = event.kind();

                    if (kind == StandardWatchEventKinds.OVERFLOW) {
                        logger.debug("Overflow watcher event was detected");
                        continue;
                    }

                    processModules(loader.loadModules());
                    break; // watching only one folder and loading all files every loop => Only one iteration is needed.
                }

                if (!key.reset()) {
                    logger.warn("Stopping modules directory watcher");
                    break;
                }
            }

        } catch (URISyntaxException | IOException | InterruptedException e) {
            logger.error("Modules directory watcher throw an exception: ", e);
        }
    }

    /**
     * Method is used for prepare loaded modules to be used in application. Result is stored in modules variable.
     * First of all is created new map where keys are hash of first arguments of input pairs and values are input pairs.
     * Than variable modules is cleared and all values from created map is insert to it.
     *
     * @param unprocessedModules Set of loaded modules where first argument is visible name and second is accessible method.
     */
    private void processModules(Set<Pair<String, Class>> unprocessedModules) {
        long startTime = System.nanoTime();
        Map<String, Pair<String, Class>> localModules = new HashMap<>();

        logger.info("Processing " + unprocessedModules.size() + " modules.");

        for (Pair<String, Class> pair : unprocessedModules) {
            localModules.put(String.valueOf(pair.getKey().hashCode()), pair);
        }

        modules.clear();
        modules.putAll(localModules);
        logger.debug("Modules were loaded and processed in " + (System.nanoTime() - startTime) / 1000000d + " milliseconds");
    }

    /**
     * Return all loaded modules in map where value is Pair of visible name and module accessible method and key is
     * hash code of visible name.
     * 
     * @return all loaded modules.
     */
    public Map<String, Pair<String, Class>> getModules() {
        return modules;
    }
}
