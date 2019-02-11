package cz.zcu.kiv.offscreen.modularization;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.ParameterizedMessage;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileSystem;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.spi.FileSystemProvider;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author Tomáš Šimandl
 */
class DynamicServiceLoader<S> {

    private static final Logger logger = LogManager.getLogger();
    /** Valid file extension of Java module. */
    private static final String VALID_MODULE_EXTENSION = "jar";
    /** Filter to get only jar files from modules folder. */
    private static final Predicate<Path> MODULE_FILTER = path -> path.toString().toLowerCase().endsWith(VALID_MODULE_EXTENSION);
    /** Interface or abstract class representing the service to be loaded. */
    private final Class<S> service;
    /** Instance of static SPI loader. */
    private ServiceLoader<S> serviceLoader;
    /** Path to folder where are modules. Path is relative to resources. */
    private final String servicesPath;
    /** Instance of file system provider capable of exploring jar files. */
    private final FileSystemProvider provider;

    /**
     * @param service Interface or abstract class representing the service to be loaded.
     * @param servicesPath Path to folder to load services from. Path is relative to resources.
     */
    DynamicServiceLoader(Class<S> service, String servicesPath) {
        this.service = service;
        this.serviceLoader = ServiceLoader.load(service);
        this.servicesPath = servicesPath;
        this.provider = getZipFileSystemProvider();

        logger.info("Initialized new DynamicServiceLoader with folder path: " + servicesPath);
    }

    /**
     * Loads services implements {@link S} interface.
     * @return Iterator of loaded services.
     */
    public Iterator<S> load() {
        return serviceLoader.iterator();
    }

    /**
     * Dynamically reloads services from services path.
     */
    public void reload() {
        logger.info("Reloading all modules from path.");

        Optional<Path> servicesPath = getServicesPath();
        if (servicesPath.isPresent()) {
            List<URL> serviceURLs = new ArrayList<>();
            List<String> implementationsToLoad = new ArrayList<>();

            try (Stream<Path> paths = Files.walk(servicesPath.get())) {
                List<Path> jarPaths = paths.filter(MODULE_FILTER).collect(Collectors.toList());
                for (Path jarPath : jarPaths) {
                    FileSystem fileSystem = provider.newFileSystem(jarPath, new HashMap<>());
                    Path serviceFilePath = fileSystem.getPath("/META-INF", "services", service.getCanonicalName());

                    if (Files.exists(serviceFilePath)) {
                        serviceURLs.add(jarPath.toUri().toURL());

                        List<String> serviceLines = Files.readAllLines(serviceFilePath, StandardCharsets.UTF_8);
                        serviceLines.removeIf(line -> line.startsWith("#"));
                        implementationsToLoad.addAll(serviceLines);
                    }
                }
            } catch (IOException e) {
                logger.warn("Can not open services directory or service jar file.", e);
            }

            ClassLoader classLoader = URLClassLoader.newInstance(serviceURLs.toArray(new URL[0]), getClass().getClassLoader());
            implementationsToLoad.forEach(className -> loadClass(classLoader, className));

            serviceLoader = ServiceLoader.load(service, classLoader);
            serviceLoader.reload();
        }
    }

    /**
     * Checks if modules path exists and if it is a directory.
     * On success return Optional of opened folder otherwise returns empty optional.
     * @return Optional of opened folder otherwise returns empty optional.
     */
    Optional<Path> getServicesPath() {
        final URL servicesURL = getClass().getClassLoader().getResource(servicesPath);
        if (servicesURL == null) {
            logger.warn("Cannot open services directory.");
            return Optional.empty();
        }

        try {
            final Path servicesPath = Paths.get(servicesURL.toURI());

            if (!Files.exists(servicesPath) || !Files.isDirectory(servicesPath)) {
                logger.warn("Services path does not exist or it is not a directory.");
                return Optional.empty();
            }
            return Optional.of(servicesPath);

        } catch (URISyntaxException e) {
            logger.warn("Can not open services directory", e);
            return Optional.empty();
        }
    }

    /**
     * @return File system provider capable of exploring jar files.
     */
    private FileSystemProvider getZipFileSystemProvider() {
        for (FileSystemProvider provider : FileSystemProvider.installedProviders()) {
            if (VALID_MODULE_EXTENSION.equals(provider.getScheme())) {
                return provider;
            }
        }
        return null;
    }

    /**
     * Dynamically loads class using classloader.
     * @param classLoader Class loader used for loading class.
     * @param className Fully qualified class name.
     */
    private void loadClass(ClassLoader classLoader, String className) {
        try {
            classLoader.loadClass(className);
        } catch (ClassNotFoundException e) {
            logger.warn(new ParameterizedMessage("Cannot load class {}.", className), e);
        }
    }
}
