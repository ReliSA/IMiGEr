package cz.zcu.kiv.imiger.plugin.dot;

import org.junit.Test;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 * Integrity test fot DOT module. Verifies that for given DOT file module produces correct JSON output.
 *
 * Date: 03.04.2019
 *
 * @author Martin Matas
 */
public class DOTIntegrityTest {

    /**
     * Loaded test DOT file. Loaded string contains simple graph definition (two vertices connected with edge,
     * each of them has defined attribute).
     */
    private final String integrityTestDOTFile = loadTestDOTFile();

    /**
     * Loaded JSON file. Represents correct test result.
     */
    private final String integrityTestExpectedResult = loadTestResult();

    /**
     * Test verifies that for given DOT file module produces correct JSON output.
     */
    @Test
    public void getRawJson() {
        assertThat(integrityTestDOTFile, is(not(nullValue())));
        assertThat(integrityTestExpectedResult, is(not(nullValue())));

        DOT dotModule = new DOT();
        String result = dotModule.getRawJson(integrityTestDOTFile);

        assertThat(result, is(equalTo(integrityTestExpectedResult)));
    }

    /**
     * Method loads DOT file from resources and returns it as a string.
     *
     * @return - string that contains loaded DOT file
     */
    private String loadTestDOTFile() {
        return readFile(Objects.requireNonNull(getClass().getClassLoader().getResource("integrityTestSource.dot")));
    }

    /**
     * Method loads JSON file from resources and returns it as a string.
     *
     * @return - string that contains loaded JSON file
     */
    private String loadTestResult() {
        return readFile(Objects.requireNonNull(getClass().getClassLoader().getResource("integrityTestResult.json")));
    }

    /**
     * Method loads file based on given URL and returns it as a string.
     *
     * @param url - URL of file
     * @return - file content as a string
     */
    private String readFile(URL url) {
        String data = null;

        try {
            Path path = Paths.get(url.toURI());
            Stream<String> lines = Files.lines(path);
            data = lines.collect(Collectors.joining("\n"));
            lines.close();
        } catch (IOException | URISyntaxException e) {
            System.err.println("Loading test resource failed.");
        }

        return data;
    }

}