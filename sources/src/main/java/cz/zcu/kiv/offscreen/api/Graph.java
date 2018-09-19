package cz.zcu.kiv.offscreen.api;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;

/**
 * Class represents graph with all information about graph plus information about state in which used store graph.
 * Class is used for creating of JSON which is send to frontend.
 */
public class Graph {

    private Set<Vertex> vertices;
    private List<Edge> edges;
    private List<VertexArchetype> vertexArchetypes;
    private List<EdgeArchetype> edgeArchetypes;
    private List<AttributeType> attributeTypes;
    private Map<String, List<String>> possibleEnumValues;

    private List<Group> groups;
    private List<SideBar> sideBar;
    private String highlightedVertex; // group-ID, vertex-ID
    private String highlightedEdge;

    private Logger logger = Logger.getLogger(Graph.class);

    public Graph(cz.zcu.kiv.offscreen.graph.Graph graph) {
        logger.trace("ENTRY");
        this.vertices = graph.getVertices();
        this.edges = graph.getEdges();
        this.vertexArchetypes = graph.getVertexArchetypes();
        this.edgeArchetypes = graph.getEdgeArchetypes();
        this.attributeTypes = graph.getAttributeTypes();
        this.possibleEnumValues = graph.getPossibleEnumValues();
        this.groups = graph.getGraphState().getGroups();
        this.sideBar = graph.getGraphState().getSideBar();
        this.highlightedVertex = graph.getGraphState().getHighlightedVertex();
        this.highlightedEdge = graph.getGraphState().getHighlightedEdge();
        logger.trace("EXIT");
    }

    public List<Edge> getEdges() {
        logger.trace("ENTRY");
        logger.trace("EXIT");
        return edges;
    }

    public Set<Vertex> getVertices() {
        logger.trace("ENTRY");
        logger.trace("EXIT");
        return vertices;
    }

    public List<VertexArchetype> getVertexArchetypes() {
        return vertexArchetypes;
    }

    public List<EdgeArchetype> getEdgeArchetypes() {
        return edgeArchetypes;
    }

    public List<AttributeType> getAttributeTypes() {
        return attributeTypes;
    }

    public Map<String, List<String>> getPossibleEnumValues() {
        return possibleEnumValues;
    }

    public List<Group> getGroups() {
        return groups;
    }

    public List<SideBar> getSideBar() {
        return sideBar;
    }

    public String getHighlightedVertex() {
        return highlightedVertex;
    }

    public String getHighlightedEdge() {
        return highlightedEdge;
    }
}
