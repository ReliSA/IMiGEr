//package cz.zcu.kiv.offscreen.graph.creator;
//
//import cz.zcu.kiv.offscreen.api.EdgeInterface;
//import cz.zcu.kiv.offscreen.api.GraphInterface;
//import cz.zcu.kiv.offscreen.api.VertexInterface;
//import cz.zcu.kiv.offscreen.graph.EdgeImpl;
//import cz.zcu.kiv.offscreen.graph.GraphImpl;
//import cz.zcu.kiv.offscreen.graph.VertexImpl;
//import java.security.InvalidParameterException;
//import java.util.Random;
//import org.apache.log4j.Logger;
//
///**
// * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
// */
//public class GraphGenerator {
//
//    private final int COUNT_OF_VERTICES;
//    private final int COUNT_OF_EDGES;
//    private GraphInterface graph;
//    private boolean[][] conectionGraph;
//
//    private Logger logger = Logger.getLogger(GraphGenerator.class);
//
//    public GraphGenerator(int countOfVertices, int countOfEdges) {
//        logger.trace("ENTRY");
//        if (countOfVertices <= 0 || countOfEdges <= 0
//                || countOfEdges > (countOfVertices * countOfVertices - countOfVertices)) {
//            throw new InvalidParameterException("Count of edges is greater then count of possible edges.");
//        }
//        this.COUNT_OF_VERTICES = countOfVertices;
//        this.COUNT_OF_EDGES = countOfEdges;
//        this.graph = new GraphImpl();
//        this.conectionGraph = new boolean[this.COUNT_OF_VERTICES][this.COUNT_OF_VERTICES];
//        logger.trace("EXIT");
//    }
//
//    /**
//     * This method creates the vertices and adds them to the graph.
//     */
//    private void generateVertices() {
//        logger.trace("ENTRY");
//        VertexInterface vertex;
//        String name;
//
//        for (int i = 0; i < this.COUNT_OF_VERTICES; i++) {
//            name = "vertex " + (i + 1);
//            vertex = new VertexImpl((i + 1), name, name);
//            this.graph.addVertex(name, vertex);
//        }
//        logger.trace("EXIT");
//    }
//
//    /**
//     * Generates edges between randomly selected vertices and adds them to the
//     * graph.
//     */
//    private void generateEdges() {
//        logger.trace("ENTRY");
//        Random rnd = new Random(10);
//        int v1, v2;
//        EdgeInterface edge;
//        VertexImpl vertex1, vertex2;
//        for (int i = 0; i < this.COUNT_OF_EDGES; i++) {
//
//            do {
//                v1 = rnd.nextInt(this.COUNT_OF_VERTICES);
//                v2 = rnd.nextInt(this.COUNT_OF_VERTICES);
//            } while (v1 == v2 || this.conectionGraph[v1][v2] == true);
//
//            this.conectionGraph[v1][v2] = true;
//
//            vertex1 = (VertexImpl) this.graph.getVertices().get("vertex " + (v1 + 1));
//            vertex2 = (VertexImpl) this.graph.getVertices().get("vertex " + (v2 + 1));
//            edge = new EdgeImpl(i + 1, vertex1.getName(), vertex2.getName(), true, "");
//            this.graph.addEdge(edge);
////            vertex1.addEdge(edge);
////            vertex2.addEdge(edge);
//
//        }
//        logger.trace("EXIT");
//    }
//
//    /**
//     * Generates the graph with vertices and edges.
//     *
//     * @return graph
//     */
//    public GraphInterface generate() {
//        logger.trace("ENTRY");
//        generateVertices();
//        generateEdges();
//        logger.trace("EXIT");
//        return this.graph;
//    }
//}
