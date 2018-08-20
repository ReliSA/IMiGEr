package cz.zcu.kiv.offscreen.graph;

import cz.zcu.kiv.offscreen.api.Edge;
import cz.zcu.kiv.offscreen.api.Vertex;
import org.apache.log4j.Logger;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Class represents graph which is loaded from input JSON file.
 */
public class Graph {

    private Map<String, Vertex> vertices;
    private List<Edge> edges;
    private List<VertexArchetype> vertexArchetypes;
    private List<EdgeArchetype> edgeArchetypes;
    private List<AttributeType> attributeTypes;
    private Map<String, List<String>> possibleEnumValues;
    private List<String> defaultGroupArchetypes;
    private Map<String, String> archetypeIcons;

    private GraphState graphState;

    private Logger logger = Logger.getLogger(Graph.class);

    public Graph() {
        logger.trace("ENTRY");
        this.vertices = new HashMap<String, Vertex>();
        this.edges = new LinkedList<Edge>();
        logger.trace("EXIT");
    }

    public List<Edge> getEdges() {
        logger.trace("ENTRY");
        logger.trace("EXIT");
        return edges;
    }

    public List<VertexArchetype> getVertexArchetypes() {
        return vertexArchetypes;
    }

    public List<EdgeArchetype> getEdgeArchetypes() {
        return edgeArchetypes;
    }

    public void setVertexArchetypes(List<VertexArchetype> vertexArchetypes) {
        this.vertexArchetypes = vertexArchetypes;
    }

    public  void setEdgeArchetypes(List<EdgeArchetype> edgeArchetypes) {
        this.edgeArchetypes = edgeArchetypes;
    }

    public void setAttributeTypes(List<AttributeType> attributeTypes) {
        this.attributeTypes = attributeTypes;
    }

    public void setPossibleEnumValues(Map<Integer, List<String>> possibleEnumValues) {
        this.possibleEnumValues = new HashMap<>();
        for (Integer index : possibleEnumValues.keySet()) {
            this.possibleEnumValues.put("" + index, possibleEnumValues.get(index));
        }
    }

    public void setArchetypeIcons(Map<String, String> archetypeIcons) {
        this.archetypeIcons = archetypeIcons;
    }

    public List<String> getDefaultGroupArchetypes() {
        return defaultGroupArchetypes;
    }

    public void setDefaultGroupArchetypes(List<String> defaultGroupArchetypes) {
        this.defaultGroupArchetypes = defaultGroupArchetypes;
    }

    public List<AttributeType> getAttributeTypes() {
        return attributeTypes;
    }

    public Map<String, List<String>> getPossibleEnumValues() {
        return possibleEnumValues;
    }

    public Map<String, String> getArchetypeIcons() {
        return archetypeIcons;
    }

    public Map<String, Vertex> getVertices() {
        logger.trace("ENTRY");
        logger.trace("EXIT");
        return vertices;
    }

    public void addEdge(Edge edge) {
        logger.trace("ENTRY");
        this.edges.add(edge);
        logger.trace("EXIT");
    }

    public void addVertex(String name, Vertex vertex) {
        logger.trace("ENTRY");
        this.vertices.put(name, vertex);
        logger.trace("EXIT");
    }

    public GraphState getGraphState() {
        return graphState;
    }

    public void setGraphState(GraphState graphState) {
        this.graphState = graphState;
    }
}
