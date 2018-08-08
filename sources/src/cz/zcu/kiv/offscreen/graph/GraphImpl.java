package cz.zcu.kiv.offscreen.graph;

import cz.zcu.kiv.offscreen.api.EdgeInterface;
import cz.zcu.kiv.offscreen.api.GraphInterface;
import cz.zcu.kiv.offscreen.api.VertexInterface;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import org.apache.log4j.Logger;

/**
 *
 * @author Jindra Pavlíková
 */
public class GraphImpl implements GraphInterface {

    private Map<String, VertexInterface> vertices;
    private List<EdgeInterface> edges;
    private Logger logger = Logger.getLogger(GraphImpl.class);

    public GraphImpl() {
        logger.trace("ENTRY");
        this.vertices = new HashMap<String, VertexInterface>();
        this.edges = new LinkedList<EdgeInterface>();
        logger.trace("EXIT");
    }

    @Override
    public List<EdgeInterface> getEdges() {
        logger.trace("ENTRY");
        logger.trace("EXIT");
        return edges;
    }

    @Override
    public Map<String, VertexInterface> getVertices() {
        logger.trace("ENTRY");
        logger.trace("EXIT");
        return vertices;
    }

    @Override
    public void addEdge(EdgeInterface edge) {
        logger.trace("ENTRY");
        this.edges.add(edge);
        logger.trace("EXIT");
    }

    @Override
    public void addVertex(String name, VertexInterface vertex) {
        logger.trace("ENTRY");
        this.vertices.put(name, vertex);
        logger.trace("EXIT");
    }
}
