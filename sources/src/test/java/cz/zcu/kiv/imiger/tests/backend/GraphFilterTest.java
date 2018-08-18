package cz.zcu.kiv.imiger.tests.backend;

import cz.zcu.kiv.offscreen.api.EdgeInterface;
import cz.zcu.kiv.offscreen.api.GraphInterface;
import cz.zcu.kiv.offscreen.graph.EdgeImpl;
import cz.zcu.kiv.offscreen.graph.GraphManager;
import cz.zcu.kiv.offscreen.graph.SubedgeInfo;
import cz.zcu.kiv.offscreen.graph.loader.GraphJSONDataLoader;
import cz.zcu.kiv.offscreen.graph.loader.JSONConfigLoader;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class GraphFilterTest {

    private static String testDirectory;

    private static GraphManager graphManager;

    @BeforeAll
    static void initTest() {
        testDirectory = System.getProperty("user.dir") + "\\..\\test";

        File graphFile = new File(testDirectory + "\\data\\test1.json");

        try {
            graphManager = new GraphJSONDataLoader(graphFile).LoadData();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    void testFilter1a() {
        GraphInterface graph = createGraph("test1a.json");

        List<String> vertexIds = new ArrayList<>();
        vertexIds.add("32");
        vertexIds.add("9");
        vertexIds.add("1");
        vertexIds.add("2");

        List<EdgeInterface> edges = new ArrayList<>();

        List<SubedgeInfo> subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(117));
        edges.add(createTestEdge("1", "32", subedgeInfos));

        subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(10));
        edges.add(createTestEdge("1", "9", subedgeInfos));

        subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(8));
        edges.add(createTestEdge("2", "9", subedgeInfos));

        graphContains(graph, vertexIds, edges);
    }

    @Test
    void testFilter1b() {
        GraphInterface graph = createGraph("test1b.json");

        List<String> vertexIds = new ArrayList<>();
        vertexIds.add("2");
        vertexIds.add("9");
        vertexIds.add("18");

        List<EdgeInterface> edges = new ArrayList<>();

        List<SubedgeInfo> subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(9));
        edges.add(createTestEdge("9", "2", subedgeInfos));

        subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(86));
        edges.add(createTestEdge("18", "2", subedgeInfos));

        graphContains(graph, vertexIds, edges);
    }

    @Test
    void testFilter1c() {
        GraphInterface graph = createGraph("test1c.json");

        List<String> vertexIds = new ArrayList<>();
        vertexIds.add("2");
        vertexIds.add("18");
        vertexIds.add("32");

        List<EdgeInterface> edges = new ArrayList<>();

        List<SubedgeInfo> subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(79));
        edges.add(createTestEdge("2", "18", subedgeInfos));

        subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(86));
        edges.add(createTestEdge("18", "2", subedgeInfos));

        graphContains(graph, vertexIds, edges);
    }

    @Test
    void testFilter1d() {
        GraphInterface graph = createGraph("test1d.json");

        List<String> vertexIds = new ArrayList<>();
        vertexIds.add("1");
        vertexIds.add("9");
        vertexIds.add("32");

        List<EdgeInterface> edges = new ArrayList<>();

        List<SubedgeInfo> subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(10));
        edges.add(createTestEdge("1", "9", subedgeInfos));

        subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(117));
        edges.add(createTestEdge("1", "32", subedgeInfos));

        graphContains(graph, vertexIds, edges);
    }

    @Test
    void testFilter1e() {
        GraphInterface graph = createGraph("test1e.json");

        List<String> vertexIds = new ArrayList<>();
        vertexIds.add("1");
        vertexIds.add("32");
        vertexIds.add("9");

        List<EdgeInterface> edges = new ArrayList<>();

        List<SubedgeInfo> subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(11));
        edges.add(createTestEdge("9", "1", subedgeInfos));

        subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(117));
        edges.add(createTestEdge("1", "32", subedgeInfos));

        graphContains(graph, vertexIds, edges);
    }

    @Test
    void testFilter1f() {
        GraphInterface graph = createGraph("test1f.json");

        List<String> vertexIds = new ArrayList<>();
        vertexIds.add("1");
        vertexIds.add("2");
        vertexIds.add("18");

        List<EdgeInterface> edges = new ArrayList<>();

        List<SubedgeInfo> subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(86));
        edges.add(createTestEdge("18", "2", subedgeInfos));

        graphContains(graph, vertexIds, edges);
    }

    private GraphInterface createGraph(String configFilename) {
        String configLocation = testDirectory + "\\config";
        JSONConfigLoader configLoader = new JSONConfigLoader(graphManager, configLocation);
        JSONConfigLoader.configFilename = configFilename;
        return graphManager.createGraph(configLoader);
    }

    private SubedgeInfo createTestSubEdge(int id) {
        SubedgeInfo subedge = new SubedgeInfo(0, null);
        subedge.id = id;

        return subedge;
    }

    private EdgeInterface createTestEdge(String from, String to, List<SubedgeInfo> subedges) {
        EdgeInterface edge = new EdgeImpl(0, from, to, false, "");
        edge.setSubedgeInfo(subedges);

        return edge;
    }

    /**
     *
     * @param graph - Graph object to test.
     * @param vertexIds - vertices, that graph must contain in order to pass the test.
     * @param edges - edges, that graph must contain in order to pass the test.
     */
    private void graphContains(GraphInterface graph, List<String> vertexIds, List<EdgeInterface> edges) {
        Assertions.assertEquals(graph.getVertices().size(), vertexIds.size());
        Assertions.assertEquals(graph.getEdges().size(), edges.size());

        // Vertices
        for (String vertexId : graph.getVertices().keySet()) {
            Assertions.assertTrue(vertexIds.contains(vertexId));
        }

        // Edges
        for (EdgeInterface edge : graph.getEdges()) {
            Assertions.assertTrue(edges.contains(edge));

            EdgeInterface edgeCmp = edges.get(edges.indexOf(edge));
            Assertions.assertEquals(edge.getSubedgeInfo().size(), edgeCmp.getSubedgeInfo().size());

            for (SubedgeInfo subedgeInfo : edge.getSubedgeInfo()) {
                Assertions.assertTrue(containsSubedgeWithId(subedgeInfo, edgeCmp.getSubedgeInfo()));
            }
        }
    }

    /**
     * Checks if list of subedges contains subedge with id.
     * @param subedgeInfo - Subedge from graph to compare.
     * @param subedgeInfos - List of subedges that the graph must contain.
     * @return true if subedges that should be present contain id of subedge.
     */
    private boolean containsSubedgeWithId(SubedgeInfo subedgeInfo, List<SubedgeInfo> subedgeInfos) {
        for (SubedgeInfo s : subedgeInfos) {
            if (s.id == subedgeInfo.id) {
                return true;
            }
        }

        return false;
    }
}
