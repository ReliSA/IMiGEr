package cz.zcu.kiv.offscreen.graph;

import cz.zcu.kiv.offscreen.api.EdgeInterface;
import java.util.LinkedList;
import java.util.List;
import org.apache.log4j.Logger;

/**
 * This class represents edge.
 *
 * @author Jindra Pavlíková
 */
public class EdgeImpl implements EdgeInterface {

    private int edgeId;
    private String from;
    private String to;
    private List<String> packageConnections;
    private boolean isCompatible;
    private List<SubedgeInfo> subedgeInfo;
    private String compInfoJSON;
    private Logger logger = Logger.getLogger(EdgeImpl.class);

    /**
     * Inicialization of edge.
     *
     * @param edgeId id of edge
     * @param from name of vertex which leads from the edge
     * @param to name of vertex which leads to the edge
     */
    public EdgeImpl(int edgeId, String from, String to, boolean isCompatible, String compInfoJSON) {
        logger.trace("ENTRY");
        this.edgeId = edgeId;
        this.from = from;
        this.to = to;
        this.packageConnections = new LinkedList<String>();
        this.isCompatible = isCompatible;
        this.compInfoJSON = compInfoJSON;
        logger.trace("EXIT");
    }

    @Override
    public String getFrom() {
        logger.trace("ENTRY");
        logger.trace("EXIT");
        return from;

    }

    @Override
    public String getTo() {
        logger.trace("ENTRY");
        logger.trace("EXIT");
        return to;
    }

    @Override
    public int getId() {
        logger.trace("ENTRY");
        logger.trace("EXIT");
        return edgeId;
    }

    @Override
    public List<SubedgeInfo> getSubedgeInfo() {
        return subedgeInfo;
    }

    @Override
    public void setSubedgeInfo(List<SubedgeInfo> subedgeInfo) {
        this.subedgeInfo = subedgeInfo;
    }

    @Override
    public boolean equals(Object edge) {
        if (!(edge instanceof EdgeImpl)) return false;
        EdgeImpl cmpEdge = (EdgeImpl) edge;
        return from.equals(cmpEdge.from) && to.equals(cmpEdge.to);
    }

    public List<String> getPackageConnections() {
        logger.trace("ENTRY");
        logger.trace("EXIT");
        return this.packageConnections;
    }

    public void setPackageConnections(List<String> packageConnections) {
        logger.trace("ENTRY");
        this.packageConnections = packageConnections;
        logger.trace("EXIT");
    }
    
    public boolean getIsCompatible() {
        return isCompatible;
    }
    
    public String getCompInfoJSON() {
        return compInfoJSON;
    }
   
}
