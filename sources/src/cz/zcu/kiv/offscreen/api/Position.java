package cz.zcu.kiv.offscreen.api;

/**
 * Class is used for storing information about vertex/group relative position.
 */
public class Position {

    /** Identification number of vertex or group which was generated in application. */
    private int vertexId;
    /** Relative X position. */
    private float x;
    /** Relative Y position */
    private float y;

    public Position(int vertexId, float x, float y) {
        this.vertexId = vertexId;
        this.x = x;
        this.y = y;
    }

    public int getVertexId() {
        return vertexId;
    }

    public void setVertexId(int vertexId) {
        this.vertexId = vertexId;
    }

    public float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }
}
