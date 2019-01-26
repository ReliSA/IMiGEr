package cz.zcu.kiv.offscreen.modularization;

import javafx.util.Pair;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.*;

public class ModuleProvider {

    public static final String METHOD_NAME = "getRawJson";
    public static final Class METHOD_PARAMETER_CLASS = String.class;

    private static final Logger logger = LogManager.getLogger();
    private static final String MODULES_PATH = "modules";
    private static ModuleProvider instance = null;

    private ConcurrentMap<String, Pair<String, Class>> modules = new ConcurrentHashMap<>();
    private final ModuleLoader loader;
    private boolean watch = true;

    private ScheduledExecutorService executor;
    private ScheduledFuture scheduledFuture;
    private WatchService watcher = null;


    public static ModuleProvider getInstance() {
        if (instance == null) {
            instance = new ModuleProvider();
        }
        return instance;
    }

    private ModuleProvider() {
        this.loader = new ModuleLoader(MODULES_PATH, METHOD_NAME, METHOD_PARAMETER_CLASS);

        processModules(loader.loadModules());

        executor = Executors.newSingleThreadScheduledExecutor();
        Runnable task = this::initModulesWatcher;
        logger.debug("Scheduling Modules Watcher thread.");
        // task will be scheduled after 1 minute
        // When task ends (on failure) after one minute will be planed again
        scheduledFuture = executor.scheduleWithFixedDelay(task, 0, 1, TimeUnit.MINUTES);
    }

    public void stopWatcher() {
        logger.debug("Stopping WatcherProvider");
        watch = false;

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

    private void initModulesWatcher() {
        try {
            logger.debug("Initializing new WatcherService for modules directory");

            Optional<File> folderFileOptional = loader.getModulesFolder();
            if (!folderFileOptional.isPresent()) {
                return;
            }

            Path path = folderFileOptional.get().toPath();
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

                if (!key.reset() || !watch) {
                    logger.warn("Stopping modules directory watcher");
                    break;
                }
            }

        } catch (IOException | InterruptedException e) {
            logger.error("Modules directory watcher throw an exception: ", e);
        }
    }

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

    public Map<String, Pair<String, Class>> getModules() {
        return modules;
    }
}
