package cz.zcu.kiv.offscreen.modularization;

import javafx.util.Pair;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.jar.Attributes;
import java.util.jar.JarInputStream;
import java.util.jar.Manifest;
import java.util.stream.Collectors;

/**
 * @author Tomáš Šimandl
 */
class ModuleLoader {

    private static final Logger logger = LogManager.getLogger();
    /** Filter to get only jar files from modules folder. */
    private static final FilenameFilter MODULE_FILTER = (file, name) -> name.contains(".jar");
    /** Identification of class name in modules manifest. */
    private static final String MODULE_CLASS_IDENTIFIER = "Module-Class";
    /** Identification of modules visible name in modules manifest. */
    private static final String MODULE_NAME_IDENTIFIER = "Module-Name";

    /** Path to folder where are modules. Path is relative to resources. */
    private final String modulesPath;
    /** Name of method which must contains every module. */
    private final String methodName;
    /** Class type of parameter to method which must contains every module. */
    private final Class methodParamClass;


    /**
     * Only story  input parameters
     * @param modulesPath Path to folder where are modules. Path is relative to resources.
     * @param methodName Name of method which must contains every module.
     * @param methodParamClass Class type of parameter to method which must contains every module.
     */
    ModuleLoader(String modulesPath, String methodName, Class methodParamClass) {
        this.modulesPath = modulesPath;
        this.methodName = methodName;
        this.methodParamClass = methodParamClass;
        logger.info("Initializing new ModuleLoader with folder path: " + modulesPath);
    }

    /**
     * Method starts process of loading all modules from modules folder (defined in constructor).
     * @return set of loaded modules in Pair where key is: 'Visible name' and value: 'Class to be called'.
     */
    Set<Pair<String, Class>> loadModules() {
        logger.info("Loading all modules from file.");
        final File[] modules = loadJarFiles();
        return Arrays.stream(modules)
                .map(this::loadModule) // call method loadModule for every module
                .filter(Optional::isPresent) // remove modules which were not loaded
                .map(Optional::get) // extract modules from Optional class
                .collect(Collectors.toSet()); // return set of modules
    }

    /**
     * Method open file given by modules path in constructor, check if folder exists and if it is a directory.
     * On success return Optional of opened folder otherwise returns empty optional.
     * @return Optional of opened folder otherwise returns empty optional.
     */
    Optional<File> getModulesFolder() {

        final URL fileURL = getClass().getClassLoader().getResource(modulesPath);
        if (fileURL == null) {
            logger.warn("Can not open modules directory.");
            return Optional.empty();
        }

        try {
            final File modulesFolder = new File(fileURL.toURI());

            if (!modulesFolder.exists() || !modulesFolder.isDirectory()) {
                logger.warn("Modules folder is not exists or it is not a directory");
                return Optional.empty();
            }
            return Optional.of(modulesFolder);

        } catch (URISyntaxException e) {
            logger.warn("Can not open modules directory", e);
            return Optional.empty();
        }
    }

    /**
     * Load all jar files from folder given by modules path in constructor.
     *
     * @return array of founded jars or empty array
     */
    private File[] loadJarFiles() {

        Optional<File> folderOptional = getModulesFolder();
        if (folderOptional.isPresent()) {
            File[] files = folderOptional.get().listFiles(MODULE_FILTER);
            if (files == null) files = new File[0];
            logger.info(files.length + " modules were read from file");
            return files;
        }
        return new File[0];
    }

    /**
     * Load one particular module given by input File containing opened jar file.
     * Method returns module in Optional in Pair where key is visible modules name and value is access Class from module.
     *
     * @param moduleFile opened jar file with module
     * @return opened module or empty Optional where some error occurs.
     */
    private Optional<Pair<String, Class>> loadModule(File moduleFile) {
        JarInputStream jis = null;
        try {
            jis = new JarInputStream(new FileInputStream(moduleFile));
            final Manifest mf = jis.getManifest();
            final Attributes attributes = mf.getMainAttributes();
            final String moduleClassName = attributes.getValue(MODULE_CLASS_IDENTIFIER);
            final String moduleVisibleName = attributes.getValue(MODULE_NAME_IDENTIFIER);

            final ClassLoader loader = URLClassLoader.newInstance(new URL[]{moduleFile.toURI().toURL()});
            final Class<?> clazz = Class.forName(moduleClassName, true, loader);
            // checking if method exists, if not throw exception
            clazz.getMethod(methodName, methodParamClass);

            return Optional.of(new Pair<>(moduleVisibleName, clazz));

        } catch (Exception e) {
            logger.debug("Invalid module throw exception: ", e);
            return Optional.empty();
        } finally {
            try {
                if (jis != null) jis.close();
            } catch (IOException e) {
                logger.error("Can not close opened jar file: ", e);
            }
        }
    }
}
