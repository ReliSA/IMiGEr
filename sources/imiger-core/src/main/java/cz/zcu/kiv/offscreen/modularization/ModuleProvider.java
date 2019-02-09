package cz.zcu.kiv.offscreen.modularization;

import cz.zcu.kiv.imiger.spi.IModule;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.ServiceLoader;
import java.util.concurrent.*;

/**
 * @author Tomáš Šimandl
 */
public class ModuleProvider {

    private static final Logger logger = LogManager.getLogger();
    /** Instance of this class used for singleton pattern. */
    private static ModuleProvider instance = null;

    /** Queue containing actual loaded modules. */
    private Map<String, IModule> modules = new ConcurrentHashMap<>();
    /** Instance of ServiceLoader. */
    private final ServiceLoader<IModule> loader;

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
        this.loader = ServiceLoader.load(IModule.class);

        processModules(loader.iterator());

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

                    loader.reload();
                    processModules(loader.iterator());
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
    private void processModules(Iterator<IModule> unprocessedModules) {
        long startTime = System.nanoTime();
        Map<String, IModule> localModules = new HashMap<>();

        logger.info("Processing modules.");

        unprocessedModules.forEachRemaining(module -> localModules.put(String.valueOf(module.getModuleName().hashCode()), module));

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
    public Map<String, IModule> getModules() {
        return modules;
    }
}
