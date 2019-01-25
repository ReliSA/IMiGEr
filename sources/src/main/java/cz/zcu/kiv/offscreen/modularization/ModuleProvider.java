package cz.zcu.kiv.offscreen.modularization;

import javafx.util.Pair;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.*;

public class ModuleProvider {

    private static final Logger logger = LogManager.getLogger();
    private static final String MODULES_PATH = "modules";
    private static ModuleProvider instance = null;

    private ConcurrentMap<String, Pair<String, IModule>> modules = new ConcurrentHashMap<>();
    private final ModuleLoader loader;
    private boolean watch = true;


    public static ModuleProvider getInstance() {
        if (instance == null) {
            instance = new ModuleProvider();
        }
        return instance;
    }

    private ModuleProvider() {
        this.loader = new ModuleLoader(MODULES_PATH);

        processModules(loader.loadModules());

        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
        Runnable task = this::initModulesWatcher;
        logger.debug("Scheduling Modules Watcher thread.");
        // task will be scheduled after 1 minute
        // When task ends (on failure) after one minute will be planed again
        executor.scheduleWithFixedDelay(task, 1, 1, TimeUnit.MINUTES);
    }

    private void initModulesWatcher() {
        try {
            logger.debug("Initializing new WatcherService for modules directory");

            Optional<File> folderFileOptional = loader.getModulesFolder();
            if (!folderFileOptional.isPresent()) {
                return;
            }

            Path path = folderFileOptional.get().toPath();
            WatchService watcher = FileSystems.getDefault().newWatchService();
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

    private void processModules(Set<Pair<String, IModule>> unprocessedModules) {
        Map<String, Pair<String, IModule>> localModules = new HashMap<>();

        logger.info("Processing " + localModules.size() + " modules.");

        for (Pair<String, IModule> pair : unprocessedModules) {
            localModules.put(String.valueOf(pair.getKey().hashCode()), pair);
        }

        modules.clear();
        modules.putAll(localModules);
        logger.debug("Modules were processed");
    }

    public Map<String, Pair<String, IModule>> getModules() {
        return modules;
    }
}
