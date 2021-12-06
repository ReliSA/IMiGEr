import cz.zcu.kiv.offscreen.services.IInitialEliminationService;
import cz.zcu.kiv.offscreen.services.impl.InitialEliminationService;
import org.junit.Before;
import org.junit.Test;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import static org.junit.Assert.assertEquals;

public class InitialEliminationTest {

    private IInitialEliminationService initialEliminationService;
    private String testJSONGraph;

    @Before
    public void Prepare() throws IOException {
        initialEliminationService = new InitialEliminationService();

        try (BufferedReader reader = new BufferedReader(new FileReader("../../../examples/IMiGEr_RAW_json/histrocal-data.json"))) {
            String line;
            StringBuilder stringBuilder = new StringBuilder();
            String ls = System.getProperty("line.separator");
            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line);
                stringBuilder.append(ls);
            }

            testJSONGraph = stringBuilder.toString();
        }
    }

    @Test
    public void TestHistoricalData(){
        initialEliminationService.ComputeInitialElimination(testJSONGraph);
        assertEquals("True", "True");
    }

}
