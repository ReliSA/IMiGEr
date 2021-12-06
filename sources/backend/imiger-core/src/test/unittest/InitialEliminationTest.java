import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.internal.LinkedTreeMap;
import cz.zcu.kiv.offscreen.services.IInitialEliminationService;
import cz.zcu.kiv.offscreen.services.impl.InitialEliminationService;
import org.junit.Before;
import org.junit.Test;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class InitialEliminationTest {

    private IInitialEliminationService initialEliminationService;
    private String testJSONGraph;

    @Before
    public void Prepare() throws IOException {
        // instantiate the service
        initialEliminationService = new InitialEliminationService();

        // read the test data
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
        String result = initialEliminationService.computeInitialElimination(testJSONGraph);

        // Parse the  resulting graph and get the individual elements
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        Map<String, Object> graphMap = (Map<String, Object>)gson.fromJson(result, Map.class);
        ArrayList<LinkedTreeMap<String, Object>> groups = (ArrayList<LinkedTreeMap<String, Object>>) graphMap.get("groups");
        assertEquals(3, groups.size());
    }

}
