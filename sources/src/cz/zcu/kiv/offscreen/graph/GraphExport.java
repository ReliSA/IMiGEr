package cz.zcu.kiv.offscreen.graph;

import cz.zcu.kiv.offscreen.api.EdgeInterface;
import cz.zcu.kiv.offscreen.api.GraphInterface;
import cz.zcu.kiv.offscreen.api.VertexInterface;
import java.util.ArrayList;
import java.util.List;
import org.apache.log4j.Logger;

/*
 * To change this template, choose Tools | Templates and open the template in
 * the editor.
 */
/**
 *
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public class GraphExport {

    private List<VertexInterface> vertices;
    private List<EdgeInterface> edges;
    private Logger logger = Logger.getLogger(GraphExport.class);

    public GraphExport(GraphInterface graph) {
        logger.trace("ENTRY");
        this.vertices = new ArrayList<VertexInterface>(graph.getVertices().values());
        this.edges = new ArrayList<EdgeInterface>(graph.getEdges());
        logger.trace("EXIT");
    }

    public List<EdgeInterface> getEdges() {
        logger.trace("ENTRY");
        logger.trace("EXIT");
        return edges;
    }

    public List<VertexInterface> getVertices() {
        logger.trace("ENTRY");
        logger.trace("EXIT");
        return vertices;
    }
}
