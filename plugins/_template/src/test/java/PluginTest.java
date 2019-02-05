import org.junit.jupiter.api.Test;
import org.junit.platform.commons.util.StringUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.jar.Attributes;
import java.util.jar.JarInputStream;
import java.util.jar.Manifest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * This class is only for testing integrity of Jar file.
 * Testing:
 *      Jar file can be open
 *      Manifest contains Module-Name and it is not blank
 *      Manifest contains Module-Class and this class exists in Jar file
 *      Given class contains method 'String getRawJson(String)'
 *
 *
 * !!! BEFORE USAGE PLEASE CHANGE VARIABLE 'ARCHIVE_WITH_DEPENDENCIES_PATH' !!!
 */
class PluginTest {

    private static final String ARCHIVE_WITH_DEPENDENCIES_PATH = "target\\imiger-plugin-template-1.0-SNAPSHOT-jar-with-dependencies.jar";


    // ========================================= DO NOT CHANGE UNDER THIS LINE =========================================

    private static final String MODULE_CLASS_IDENTIFIER = "Module-Class";
    private static final String MODULE_NAME_IDENTIFIER = "Module-Name";
    private static final String METHOD_NAME = "getRawJson";
    private static final Class METHOD_PARAMETER_CLASS = String.class;

    @Test
    void integrityTest() {
        try {
            File jarFile = new File(ARCHIVE_WITH_DEPENDENCIES_PATH);

            JarInputStream jis = new JarInputStream(new FileInputStream(jarFile));
            final Manifest mf = jis.getManifest();
            final Attributes attributes = mf.getMainAttributes();
            final String moduleClassName = attributes.getValue(MODULE_CLASS_IDENTIFIER);
            final String moduleVisibleName = attributes.getValue(MODULE_NAME_IDENTIFIER);

            assertFalse(StringUtils.isBlank(moduleClassName), "Blank module class name given by manifest attribute 'Module-Class'");
            assertFalse(StringUtils.isBlank(moduleVisibleName), "Blank module visible name given by manifest attribute 'Module-Name'");

            final ClassLoader loader = URLClassLoader.newInstance(new URL[]{jarFile.toURI().toURL()});
            final Class<?> clazz = Class.forName(moduleClassName, true, loader);
            // checking if method exists, if not throw exception
            Method method = clazz.getMethod(METHOD_NAME, METHOD_PARAMETER_CLASS);


            assertEquals(String.class, method.getReturnType(), "Invalid method return type.");

        } catch (IOException e){
            fail("Can not open given Jar file. Given path is probably incorrect.");
        } catch (ClassNotFoundException e) {
            fail("Class given by attribute 'Module-Class' in MANIFEST.MF was not found in Jar file.");
        } catch (NoSuchMethodException e) {
            fail("Class given by attribute 'Module-Class' in MANIFEST.MF do not contains method: String getRawJson(String).");
        }
    }
}
