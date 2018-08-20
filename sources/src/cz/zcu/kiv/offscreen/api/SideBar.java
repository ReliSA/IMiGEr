package cz.zcu.kiv.offscreen.api;

/**
 * Class store information about item in side bar.
 */
public class SideBar {

    /** Identification number of vertex or group which was generated in application. */
    private int vertexId;
    /** Indicates if related vertexes of this item have visible icon which shows relation with this item. */
    private boolean highlighted;

    public SideBar(int vertexId, boolean highlighted) {
        this.vertexId = vertexId;
        this.highlighted = highlighted;
    }

    public int getVertexId() {
        return vertexId;
    }

    public void setVertexId(int vertexId) {
        this.vertexId = vertexId;
    }

    public boolean isHighlighted() {
        return highlighted;
    }

    public void setHighlighted(boolean highlighted) {
        this.highlighted = highlighted;
    }
}
