package cz.zcu.kiv.offscreen.modularization;

import javafx.util.Pair;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.FileInputStream;
import java.io.IOException;
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
    /** Valid file extension of Java module. */
    private static final String VALID_MODULE_EXTENSION = "jar";
    /** Identification of section in manifest containing other information about the module. */
    private static final String MODULE_SECTION_IDENTIFIER = "cz.zcu.kiv.imiger.plugin";
    /** Identification of class name in modules manifest. */
    private static final String MODULE_CLASS_IDENTIFIER = "Module-Class";
    /** Identification of modules visible name in modules manifest. */
    private static final String MODULE_NAME_IDENTIFIER = "Module-Name";

    /** Name of method which must contains every module. */
    private final String methodName;
    /** Class type of parameter to method which must contains every module. */
    private final Class methodParamClass;


    /**
     * Only story  input parameters
     * @param methodName Name of method which must contains every module.
     * @param methodParamClass Class type of parameter to method which must contains every module.
     */
    ModuleLoader(String methodName, Class methodParamClass) {
        this.methodName = methodName;
        this.methodParamClass = methodParamClass;
        logger.info("Initializing new ModuleLoader");
    }

    /**
     * Method starts process of loading all modules from modules folder (defined in constructor).
     * @return set of loaded modules in Pair where key is: 'Visible name' and value: 'Class to be called'.
     */
    Set<Pair<String, Class>> loadModules() {
        logger.info("Loading all modules from file.");
        final URL[] resources = ((URLClassLoader) getClass().getClassLoader()).getURLs();
        return Arrays.stream(resources)
                .filter(this::isJarFile) // remove resources which are not jar files
                .map(this::loadModule) // call method loadModule for every module
                .filter(Optional::isPresent) // remove modules which were not loaded
                .map(Optional::get) // extract modules from Optional class
                .collect(Collectors.toSet()); // return set of modules
    }

    /**
     * Checks if resource is a jar file by its extension.
     *
     * @param resourceUrl URL of the resource in local filesystem
     * @return true if the resource is a jar file, otherwise false
     */
    private boolean isJarFile(URL resourceUrl) {
        return FilenameUtils.getExtension(resourceUrl.getFile()).equals(VALID_MODULE_EXTENSION);
    }

    /**
     * Load one particular module given by input File containing opened jar file.
     * Method returns module in Optional in Pair where key is visible modules name and value is access Class from module.
     *
     * @param moduleUrl URL of the module in local filesystem
     * @return opened module or empty Optional where some error occurs.
     */
    private Optional<Pair<String, Class>> loadModule(URL moduleUrl) {
        JarInputStream jis = null;
        try {
            jis = new JarInputStream(new FileInputStream(FileUtils.toFile(moduleUrl)));
            final Manifest mf = jis.getManifest();
            final Attributes attributes = mf.getAttributes(MODULE_SECTION_IDENTIFIER);
            if (attributes == null) {
                throw new NotModuleException();
            }

            final String moduleClassName = attributes.getValue(MODULE_CLASS_IDENTIFIER);
            final String moduleVisibleName = attributes.getValue(MODULE_NAME_IDENTIFIER);

            final Class<?> clazz = Class.forName(moduleClassName, true, getClass().getClassLoader());
            // checking if method exists, if not throw exception
            clazz.getMethod(methodName, methodParamClass);

            return Optional.of(new Pair<>(moduleVisibleName, clazz));

        } catch (NotModuleException e) {
            return Optional.empty();
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
