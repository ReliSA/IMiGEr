package cz.zcu.kiv.offscreen.api;

import cz.zcu.kiv.offscreen.graph.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

/**
 * Class represents graph with all information about graph plus information about state in which used store graph.
 * Class is used for creating of JSON which is send to frontend.
 */
public class GraphExport {

    private List<Vertex> vertices;
    private List<Edge> edges;
    private List<VertexArchetype> vertexArchetypes;
    private List<EdgeArchetype> edgeArchetypes;
    private List<AttributeType> attributeTypes;
    private Map<String, List<String>> possibleEnumValues;

    private List<Group> groups;
    private List<Position> positions;
    private List<SideBar> sideBar;
    private int selectedVertex;
    private int selectedEdge;

    private Logger logger = Logger.getLogger(GraphExport.class);

    public GraphExport(Graph graph) {
        logger.trace("ENTRY");
        this.vertices = new ArrayList<>(graph.getVertices().values());
        this.edges = new ArrayList<>(graph.getEdges());
        this.vertexArchetypes = new ArrayList<>(graph.getVertexArchetypes());
        this.edgeArchetypes = new ArrayList<>(graph.getEdgeArchetypes());
        this.attributeTypes = new ArrayList<>(graph.getAttributeTypes());
        this.possibleEnumValues = graph.getPossibleEnumValues();
        this.groups = graph.getGraphState().getGroups();
        this.positions = graph.getGraphState().getPositions();
        this.sideBar = graph.getGraphState().getSideBar();
        this.selectedVertex = graph.getGraphState().getSelectedVertex();
        this.selectedEdge = graph.getGraphState().getSelectedEdge();
        logger.trace("EXIT");
    }

    public List<Edge> getEdges() {
        logger.trace("ENTRY");
        logger.trace("EXIT");
        return edges;
    }

    public List<Vertex> getVertices() {
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

    public List<Position> getPositions() {
        return positions;
    }

    public List<SideBar> getSideBar() {
        return sideBar;
    }

    public int getSelectedVertex() {
        return selectedVertex;
    }

    public int getSelectedEdge() {
        return selectedEdge;
    }
}
