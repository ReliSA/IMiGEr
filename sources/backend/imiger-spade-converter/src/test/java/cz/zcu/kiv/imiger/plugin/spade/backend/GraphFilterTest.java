package cz.zcu.kiv.imiger.plugin.spade.backend;

import cz.zcu.kiv.imiger.vo.Edge;
import cz.zcu.kiv.imiger.vo.Graph;
import cz.zcu.kiv.imiger.vo.Vertex;
import cz.zcu.kiv.imiger.plugin.spade.graph.GraphManager;
import cz.zcu.kiv.imiger.plugin.spade.graph.loader.GraphJSONDataLoader;
import cz.zcu.kiv.imiger.plugin.spade.graph.loader.JSONConfigLoader;
import cz.zcu.kiv.imiger.vo.SubedgeInfo;
import java.io.InputStream;
import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class GraphFilterTest {

    private static GraphManager graphManager;

    @BeforeClass
    public static void initTest() throws IOException {
        InputStream resource = GraphFilterTest.class.getClassLoader().getResourceAsStream("data/test1.json");
        String loadedJSON = IOUtils.toString(resource, "UTF-8");
        graphManager = new GraphJSONDataLoader(loadedJSON).loadData();
    }

    @Test
    public void testFilter1a() {
        Graph graph = createGraph("config/test1a.json");

        List<Integer> vertexIds = new ArrayList<>();
        vertexIds.add(32);
        vertexIds.add(9);
        vertexIds.add(1);
        vertexIds.add(2);

        List<Edge> edges = new ArrayList<>();

        List<SubedgeInfo> subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(117));
        edges.add(createTestEdge(1, 32, subedgeInfos));

        subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(10));
        edges.add(createTestEdge(1, 9, subedgeInfos));

        subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(8));
        edges.add(createTestEdge(2, 9, subedgeInfos));

        graphContains(graph, vertexIds, edges);
    }

    @Test
    public void testFilter1b() {
        Graph graph = createGraph("config/test1b.json");

        List<Integer> vertexIds = new ArrayList<>();
        vertexIds.add(2);
        vertexIds.add(9);
        vertexIds.add(18);

        List<Edge> edges = new ArrayList<>();

        List<SubedgeInfo> subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(9));
        edges.add(createTestEdge(9, 2, subedgeInfos));

        subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(86));
        edges.add(createTestEdge(18, 2, subedgeInfos));

        graphContains(graph, vertexIds, edges);
    }

    @Test
    public void testFilter1c() {
        Graph graph = createGraph("config/test1c.json");

        List<Integer> vertexIds = new ArrayList<>();
        vertexIds.add(2);
        vertexIds.add(18);
        vertexIds.add(32);

        List<Edge> edges = new ArrayList<>();

        List<SubedgeInfo> subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(79));
        edges.add(createTestEdge(2, 18, subedgeInfos));

        subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(86));
        edges.add(createTestEdge(18, 2, subedgeInfos));

        graphContains(graph, vertexIds, edges);
    }

    @Test
    public void testFilter1d() {
        Graph graph = createGraph("config/test1d.json");

        List<Integer> vertexIds = new ArrayList<>();
        vertexIds.add(1);
        vertexIds.add(9);
        vertexIds.add(32);

        List<Edge> edges = new ArrayList<>();

        List<SubedgeInfo> subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(10));
        edges.add(createTestEdge(1, 9, subedgeInfos));

        subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(117));
        edges.add(createTestEdge(1, 32, subedgeInfos));

        graphContains(graph, vertexIds, edges);
    }

    @Test
    public void testFilter1e() {
        Graph graph = createGraph("config/test1e.json");

        List<Integer> vertexIds = new ArrayList<>();
        vertexIds.add(1);
        vertexIds.add(32);
        vertexIds.add(9);

        List<Edge> edges = new ArrayList<>();

        List<SubedgeInfo> subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(11));
        edges.add(createTestEdge(9, 1, subedgeInfos));

        subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(117));
        edges.add(createTestEdge(1, 32, subedgeInfos));

        graphContains(graph, vertexIds, edges);
    }

    @Test
    public void testFilter1f() {
        Graph graph = createGraph("config/test1f.json");

        List<Integer> vertexIds = new ArrayList<>();
        vertexIds.add(1);
        vertexIds.add(2);
        vertexIds.add(18);

        List<Edge> edges = new ArrayList<>();

        List<SubedgeInfo> subedgeInfos = new ArrayList<>();
        subedgeInfos.add(createTestSubEdge(86));
        edges.add(createTestEdge(18, 2, subedgeInfos));

        graphContains(graph, vertexIds, edges);
    }

    private Graph createGraph(String configFilename) {
        return graphManager.createGraph(new JSONConfigLoader(graphManager, new File(configFilename)));
    }

    private SubedgeInfo createTestSubEdge(int id) {
        return new SubedgeInfo(id,0, null);
    }

    private Edge createTestEdge(int from, int to, List<SubedgeInfo> subedges) {
        return new Edge(0, from, to, "", subedges);
    }

    /**
     *
     * @param graph - Graph object to test.
     * @param vertexIds - vertices, that graph must contain in order to pass the test.
     * @param edges - edges, that graph must contain in order to pass the test.
     */
    private void graphContains(Graph graph, List<Integer> vertexIds, List<Edge> edges) {
        Assert.assertEquals(graph.getVertices().size(), vertexIds.size());
        Assert.assertEquals(graph.getEdges().size(), edges.size());

        // Vertices
        for (Vertex vertex : graph.getVertices()) {
            Assert.assertTrue(vertexIds.contains(vertex.getId()));
        }

        // Edges
        for (Edge edge : graph.getEdges()) {
            Assert.assertTrue(edges.contains(edge));

            Edge edgeCmp = edges.get(edges.indexOf(edge));
            Assert.assertEquals(edge.getSubedgeInfo().size(), edgeCmp.getSubedgeInfo().size());

            for (SubedgeInfo subedgeInfo : edge.getSubedgeInfo()) {
                Assert.assertTrue(containsSubedgeWithId(subedgeInfo, edgeCmp.getSubedgeInfo()));
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
            if (s.getId() == subedgeInfo.getId()) {
                return true;
            }
        }

        return false;
    }
}
