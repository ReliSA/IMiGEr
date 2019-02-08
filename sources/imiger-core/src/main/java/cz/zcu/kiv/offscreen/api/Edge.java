package cz.zcu.kiv.offscreen.api;

import java.util.List;

/**
 * Class represents edge which is used for output JSON format (JSON between frontend and backend).
 */
public class Edge extends BaseEdge {

    /**
     * List of subedgeInfo.
     * When two input edges are equals, in output their are in one record and their differences are in subedgeInfo.
     */
    private List<SubedgeInfo> subedgeInfo;

    /**
     * Create new edge.
     * @param id new generated identification number
     * @param from original ID of vertex from edge leads
     * @param to original ID of vertex where edge leads
     * @param text additional info
     * @param subedgeInfo list which contains differences between equals edges
     */
    public Edge(int id, int from, int to, String text, List<SubedgeInfo> subedgeInfo) {
        super(id, from, to, text);
        this.subedgeInfo = subedgeInfo;
    }

    public List<SubedgeInfo> getSubedgeInfo(){
        return subedgeInfo;
    }

    public void setSubedgeInfo(List<SubedgeInfo> subedgeInfo) {
        this.subedgeInfo = subedgeInfo;
    }
}
