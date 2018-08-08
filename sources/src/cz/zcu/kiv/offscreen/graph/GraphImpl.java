package cz.zcu.kiv.offscreen.graph;

import cz.zcu.kiv.offscreen.AttributeType;
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
    private List<VertexArchetype> vertexArchetypes;
    private List<EdgeArchetype> edgeArchetypes;
    private List<AttributeType> attributeTypes;
    private Map<String, List<String>> possibleEnumValues;
    private List<Integer> defaultGroupArchetypes;

    private Map<String, String> archetypeIcons;

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
    public List<VertexArchetype> getVertexArchetypes() {
        return vertexArchetypes;
    }

    @Override
    public List<EdgeArchetype> getEdgeArchetypes() {
        return edgeArchetypes;
    }

    @Override
    public void setVertexArchetypes(List<VertexArchetype> vertexArchetypes) {
        this.vertexArchetypes = vertexArchetypes;
    }

    @Override
    public  void setEdgeArchetypes(List<EdgeArchetype> edgeArchetypes) {
        this.edgeArchetypes = edgeArchetypes;
    }

    @Override
    public void setAttributeTypes(List<AttributeType> attributeTypes) {
        this.attributeTypes = attributeTypes;
    }

    @Override
    public void setPossibleEnumValues(Map<Integer, List<String>> possibleEnumValues) {
        this.possibleEnumValues = new HashMap<>();
        for (Integer index : possibleEnumValues.keySet()) {
            this.possibleEnumValues.put("" + index, possibleEnumValues.get(index));
        }
    }

    public void setArchetypeIcons(Map<String, String> archetypeIcons) {
        this.archetypeIcons = archetypeIcons;
    }

    @Override
    public List<Integer> getDefaultGroupArchetypes() {
        return defaultGroupArchetypes;
    }

    @Override
    public void setDefaultGroupArchetypes(List<Integer> defaultGroupArchetypes) {
        this.defaultGroupArchetypes = defaultGroupArchetypes;
    }

    @Override
    public List<AttributeType> getAttributeTypes() {
        return attributeTypes;
    }

    @Override
    public Map<String, List<String>> getPossibleEnumValues() {
        return possibleEnumValues;
    }

    @Override
    public Map<String, String> getArchetypeIcons() {
        return archetypeIcons;
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
