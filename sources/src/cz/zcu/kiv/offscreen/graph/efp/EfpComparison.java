package cz.zcu.kiv.offscreen.graph.efp;

import org.apache.log4j.Logger;

/**
 * 
 * Holds data of EFP comparison relation.
 * 
 * @author Jiri Loudil
 * 
 */
public class EfpComparison {
	
	/**
	 * Status of the EFP cmp. OK, MISSING, etc.
	 */
	private String comparisonStatus;

	/**
	 * Name of the EFP cmp.
	 */
	private String efpName;
	
	/**
	 * Values of the left and right side of cmp. relation.
	 */
	private String leftEfpValue, rightEfpValue;
	
	/**
	 * Name of the type used for the EFP cmp. relation.
	 */
	private String typeName;

	/**
	 * Logging.
	 */
	private Logger logger = Logger.getLogger(EfpComparison.class);

	/**
	 * Construct new relation.
	 */
	public EfpComparison() {
		logger.trace("ENTRY");

		logger.trace("EXIT");
	}

	public String getComparisonStatus() {
		return comparisonStatus;
	}

	public void setComparisonStatus(String comparisonStatus) {
		this.comparisonStatus = comparisonStatus;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public String getLeftEfpValue() {
		return leftEfpValue;
	}

	public void setLeftEfpValue(String leftEfpValue) {
		this.leftEfpValue = leftEfpValue;
	}

	public String getRightEfpValue() {
		return rightEfpValue;
	}

	public void setRightEfpValue(String rightEfpValue) {
		this.rightEfpValue = rightEfpValue;
	}

	public String getEfpName() {
		return efpName;
	}

	public void setEfpName(String efpName) {
		this.efpName = efpName;
	}

}
