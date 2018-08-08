package cz.zcu.kiv.offscreen.graph;

import java.util.ArrayList;

import org.apache.log4j.Logger;

import cz.zcu.kiv.offscreen.api.EdgeInterface;
import cz.zcu.kiv.offscreen.graph.efp.EfpFeature;

/**
 * 
 * @author Jiri Loudil
 *
 */
public class EdgeEfp implements EdgeInterface {
	private int edgeId;
	private String from;
	private String to;
	
	private boolean edgeStatusOk;
	private ArrayList<EfpFeature> features;

	private Logger logger = Logger.getLogger(EdgeEfp.class);

	/**
	 * Inicialization of edge.
	 * 
	 * @param edgeId
	 *            id of edge
	 * @param from
	 *            name of vertex which leads from the edge
	 * @param to
	 *            name of vertex which leads to the edge
	 */
	public EdgeEfp(int edgeId, String from, String to) {
		logger.trace("ENTRY");
		this.edgeId = edgeId;
		this.from = from;
		this.to = to;
		
		this.edgeStatusOk = true;
		this.features = new ArrayList<EfpFeature>();
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

	public ArrayList<EfpFeature> getFeatures() {
		return features;
	}

	public boolean isEdgeStatusOk() {
		return edgeStatusOk;
	}

	public void setEdgeStatusOk(boolean edgeStatusOk) {
		this.edgeStatusOk = edgeStatusOk;
	}

}
