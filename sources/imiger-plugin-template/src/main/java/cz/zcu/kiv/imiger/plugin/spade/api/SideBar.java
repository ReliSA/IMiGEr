package cz.zcu.kiv.imiger.plugin.spade.api;

/**
 * Class store information about item in side bar.
 */
public class SideBar {

    /** Identification number of vertex or group which was generated in application. */
    private int vertexId;
    /** Indicates if related vertexes of this item have visible icon which shows relation with this item. */
    private boolean isIconsDisplayed;

    public SideBar(int vertexId, boolean isIconsDisplayed) {
        this.vertexId = vertexId;
        this.isIconsDisplayed = isIconsDisplayed;
    }

    public int getVertexId() {
        return vertexId;
    }

    public void setVertexId(int vertexId) {
        this.vertexId = vertexId;
    }

    public boolean isIconsDisplayed() {
        return isIconsDisplayed;
    }

    public void setIconsDisplayed(boolean iconsDisplayed) {
        this.isIconsDisplayed = iconsDisplayed;
    }
}
