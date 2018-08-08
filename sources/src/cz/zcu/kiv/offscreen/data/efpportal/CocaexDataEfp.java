package cz.zcu.kiv.offscreen.data.efpportal;

import cz.zcu.kiv.efps.comparator.result.EfpEvalResult.MatchingResult;
import cz.zcu.kiv.efps.types.datatypes.EfpValueType;

/**
 * Holds EFP's data.
 * 
 * @author Jiri Loudil
 *
 */
public class CocaexDataEfp {
	private String efpName;
	private String efpValueTypeName;
	private EfpValueType efpValue;
	private MatchingResult typeError;
	
	/**
	 * @return the efpName
	 */
	public String getEfpName() {
		return efpName;
	}
	/**
	 * @param efpName the efpName to set
	 */
	public void setEfpName(String efpName) {
		this.efpName = efpName;
	}
	/**
	 * @return the efpValueTypeName
	 */
	public String getEfpValueTypeName() {
		return efpValueTypeName;
	}
	/**
	 * @param efpValueTypeName the efpValueTypeName to set
	 */
	public void setEfpValueTypeName(String efpValueTypeName) {
		this.efpValueTypeName = efpValueTypeName;
	}
	/**
	 * @return the efpValue
	 */
	public EfpValueType getEfpValue() {
		return efpValue;
	}
	/**
	 * @param efpValue the efpValue to set
	 */
	public void setEfpValue(EfpValueType efpValue) {
		this.efpValue = efpValue;
	}

	/**
	 * @return the typeError
	 */
	public MatchingResult getTypeError() {
		return typeError;
	}

	/**
	 * @param typeError the typeError to set
	 */
	public void setTypeError(MatchingResult typeError) {
		this.typeError = typeError;
	}
	
}