package cz.zcu.kiv.offscreen.api;

import java.util.ArrayList;
import java.util.List;

/**
 * Class represents group of edges and their settings. Used in JSON between frontend and backend.
 */
public class Group {

    /** Generated id of group. */
    private int id;
    /** Name of group */
    private String name;
    /** List of vertices id which belongs to this group */
    private List<Integer> verticesId;
    /** List of vertices id whose outgoing edges are visible. */
    private List<Integer> verticesEdgeFromId;
    /** List of vertices id whose incoming edges are visible. */
    private List<Integer> verticesEdgeToId;
    /** Relative position in graph */
    private Position position;

    public Group(int id, String name){
        this.id = id;
        this.name = name;
        this.verticesId = new ArrayList<>();
        this.verticesEdgeFromId = new ArrayList<>();
        this.verticesEdgeToId = new ArrayList<>();
        this.position = null;
    }

    public Group(int id, String name, List<Integer> verticesId, List<Integer> verticesEdgeFromId, List<Integer> verticesEdgeToId) {
        this.id = id;
        this.name = name;
        this.verticesId = verticesId;
        this.verticesEdgeFromId = verticesEdgeFromId;
        this.verticesEdgeToId = verticesEdgeToId;
        this.position = null;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Integer> getVerticesId() {
        return verticesId;
    }

    public void setVerticesId(List<Integer> verticesId) {
        this.verticesId = verticesId;
    }

    public List<Integer> getVerticesEdgeFromId() {
        return verticesEdgeFromId;
    }

    public void setVerticesEdgeFromId(List<Integer> verticesEdgeFromId) {
        this.verticesEdgeFromId = verticesEdgeFromId;
    }

    public List<Integer> getVerticesEdgeToId() {
        return verticesEdgeToId;
    }

    public void setVerticesEdgeToId(List<Integer> verticesEdgeToId) {
        this.verticesEdgeToId = verticesEdgeToId;
    }

    public void addVertexId(int vertexId){
        this.verticesId.add(vertexId);
    }

    public void addVetexEdgeToId(int vertexId){
        this.verticesEdgeToId.add(vertexId);
    }

    public void addVetexEdgeFromId(int vertexId){
        this.verticesEdgeFromId.add(vertexId);
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }
}
