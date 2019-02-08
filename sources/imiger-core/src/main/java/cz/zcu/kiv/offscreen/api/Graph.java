package cz.zcu.kiv.offscreen.api;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.*;

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

    private static final Logger logger = LogManager.getLogger();

    public Graph() {
        vertices = new HashSet<>();
        edges = new LinkedList<>();
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

    public void setVertexArchetypes(List<VertexArchetype> vertexArchetypes) {
        this.vertexArchetypes = vertexArchetypes;
    }

    public void setEdgeArchetypes(List<EdgeArchetype> edgeArchetypes) {
        this.edgeArchetypes = edgeArchetypes;
    }

    public void setAttributeTypes(List<AttributeType> attributeTypes) {
        this.attributeTypes = attributeTypes;
    }

    public void setPossibleEnumValues(Map<Integer, List<String>> possibleEnumValues) {
        this.possibleEnumValues = new HashMap<>();
        for (Map.Entry<Integer, List<String>> entry : possibleEnumValues.entrySet()) {
            this.possibleEnumValues.put("" + entry.getKey(), entry.getValue());
        }
    }

    public void setGroups(List<Group> groups) {
        this.groups = groups;
    }

    public void setSideBar(List<SideBar> sideBar) {
        this.sideBar = sideBar;
    }

    public void setHighlightedVertex(String highlightedVertex) {
        this.highlightedVertex = highlightedVertex;
    }

    public void setHighlightedEdge(String highlightedEdge) {
        this.highlightedEdge = highlightedEdge;
    }
}
