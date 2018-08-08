package cz.zcu.kiv.offscreen.graph.efp;

import java.util.ArrayList;

import org.apache.log4j.Logger;

/**
 * 
 * Holds data of a feature used in EFP relation.
 * 
 * @author Jiri Loudil
 *
 */
public class EfpFeature {
	
	/**
	 * Name of the feature.
	 */
	private String name = "";
	
	/**
	 * List of EFPs connected to this particular feature.
	 */
	private ArrayList<EfpComparison> efps;
	
	/**
	 * Status of the feture. OK, MISSING, etc.
	 */
	private String featureStatus = "";
	
	/**
	 * Logging.
	 */
	private Logger logger = Logger.getLogger(EfpFeature.class);

	/**
	 * 
	 * Construct new named feature.
	 * 
	 * @param name New feature name.
	 */
	public EfpFeature(String name) {
		logger.trace("ENTRY");
		this.name = name;
		
		this.efps = new ArrayList<EfpComparison>();
		this.featureStatus = "";
		
		logger.trace("EXIT");
	}

	public ArrayList<EfpComparison> getEfps() {
		return efps;
	}

	public String getFeatureStatus() {
		return featureStatus;
	}

	public void setFeatureStatus(String featureStatus) {
		this.featureStatus = featureStatus;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
