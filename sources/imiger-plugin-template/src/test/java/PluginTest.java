import cz.zcu.kiv.imiger.spi.IModule;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Iterator;
import java.util.ServiceLoader;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * This class is only for testing integrity of Jar file.
 * <p>
 * Testing:
 * <ul>
 *     <li>Jar file exists
 *     <li>Jar file is valid service provider
 *     <li>Jar file contains at least one service implementing {@link cz.zcu.kiv.imiger.spi.IModule} interface
 * </ul>
 * <p>
 * !!! BEFORE USAGE PLEASE CHANGE VARIABLE 'ARCHIVE_PATH' !!!
 */
class PluginTest {

    private static final String ARCHIVE_PATH = "target/imiger-plugin-template-1.0-SNAPSHOT.jar";

    // ========================================= DO NOT CHANGE UNDER THIS LINE =========================================

    @Test
    void integrityTest() throws MalformedURLException {
        File jarFile = new File(ARCHIVE_PATH);
        assertTrue(jarFile.exists(), "Jar file does not exist!");

        ServiceLoader<IModule> serviceLoader = ServiceLoader.load(IModule.class, new URLClassLoader(new URL[] { jarFile.toURI().toURL() }));
        Iterator<IModule> moduleIterator = serviceLoader.iterator();

        int modulesCount = 0;
        while (moduleIterator.hasNext()) {
            modulesCount++;
            moduleIterator.next();
        }

        assertTrue(modulesCount > 0, "There should be at least one service provider in the Jar file!");
    }
}
