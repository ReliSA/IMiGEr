package cz.zcu.kiv.offscreen.graph;

import cz.zcu.kiv.offscreen.AttributeType;
import cz.zcu.kiv.offscreen.api.EdgeInterface;
import cz.zcu.kiv.offscreen.api.GraphInterface;
import cz.zcu.kiv.offscreen.api.VertexInterface;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    private List<VertexArchetype> vertexArchetypes;
    private List<EdgeArchetype> edgeArchetypes;
    private List<AttributeType> attributeTypes;
    private Map<String, List<String>> possibleEnumValues;
    private Map<String, String> archetypeIcons;
    private List<Integer> defaultGroupArchetypes;

    private Logger logger = Logger.getLogger(GraphExport.class);

    public GraphExport(GraphInterface graph) {
        logger.trace("ENTRY");
        this.vertices = new ArrayList<VertexInterface>(graph.getVertices().values());
        this.edges = new ArrayList<EdgeInterface>(graph.getEdges());
        this.vertexArchetypes = new ArrayList<VertexArchetype>(graph.getVertexArchetypes());
        this.edgeArchetypes = new ArrayList<EdgeArchetype>(graph.getEdgeArchetypes());
        this.attributeTypes = new ArrayList<>(graph.getAttributeTypes());
        this.possibleEnumValues = graph.getPossibleEnumValues();
        this.archetypeIcons = graph.getArchetypeIcons();
        this.defaultGroupArchetypes = graph.getDefaultGroupArchetypes();
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

    public Map<String, String> getArchetypeIcons() {
        return archetypeIcons;
    }

    public List<Integer> getDefaultGroupArchetypes() {
        return defaultGroupArchetypes;
    }
}
