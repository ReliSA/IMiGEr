package cz.zcu.kiv.offscreen.modularization;

import com.sun.jndi.toolkit.url.Uri;
import javafx.util.Pair;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.net.URI;
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

public class ModuleLoader {

    private static final Logger logger = LogManager.getLogger();
    private static final FilenameFilter MODULE_FILTER = (file, name) -> name.contains(".jar");
    private static final String MODULE_CLASS_IDENTIFIER = "Module-Class";
    private static final String MODULE_NAME_IDENTIFIER = "Module-Name";

    private final String modulesPath;

    public ModuleLoader(String modulesPath) {
        this.modulesPath = modulesPath;
        logger.info("Initializing new ModuleLoader with folder path: " + modulesPath);
    }

    public Set<Pair<String, IModule>> loadModules() {
        logger.info("Loading all modules from file.");
        final File[] modules = loadJarFiles();
        return Arrays.stream(modules)
                .map(this::loadModule)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());
    }

    public Optional<File> getModulesFolder(){

        final URL fileURL = getClass().getClassLoader().getResource(modulesPath);
        if (fileURL == null){
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

    private File[] loadJarFiles() {

        Optional<File> folderOptional = getModulesFolder();
        if(folderOptional.isPresent()){
            logger.info(folderOptional.get().length() + " modules were read from file");
            return folderOptional.get().listFiles(MODULE_FILTER);
        }
        return new File[0];
    }

    private Optional<Pair<String, IModule>> loadModule(File moduleFile) {
        try {
            final JarInputStream jis = new JarInputStream(new FileInputStream(moduleFile));
            final Manifest mf = jis.getManifest();
            final Attributes attributes = mf.getMainAttributes();
            final String moduleClassName = attributes.getValue(MODULE_CLASS_IDENTIFIER);
            final String moduleVisibleName = attributes.getValue(MODULE_NAME_IDENTIFIER);

            final ClassLoader loader = URLClassLoader.newInstance(new URL[]{moduleFile.toURI().toURL()});
            final Class clazz = Class.forName(moduleClassName, true, loader);
            final IModule module = (IModule) clazz.asSubclass(IModule.class).newInstance();

            return Optional.of(new Pair<>(moduleVisibleName, module));

        } catch (Exception e) {
            logger.debug("Invalid module throw exception: ", e);
            return Optional.empty();
        }
    }
}
