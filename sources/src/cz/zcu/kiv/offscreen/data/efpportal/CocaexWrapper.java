package cz.zcu.kiv.offscreen.data.efpportal;

import java.util.Map;

/**
 * 
 * EFPPortal export data wrapper. Contains mappings for feature connection names and EFPs names.
 * 
 * @author Jiri Loudil
 *
 */
public class CocaexWrapper {
	/**
	 * Feature names mapping.
	 */
	private Map<String, String> featureMappings;
	
	/**
	 * EFPs name s mapping.
	 */
	private Map<String, String> efpMappings;
	
	/**
	 * EFPPortal data with IDs instead of names for EFPs and Features.
	 */
	private Map<String, CocaexData> data;
	
	/**
	 * @return the featureMappings
	 */
	public Map<String, String> getFeatureMappings() {
		return featureMappings;
	}
	/**
	 * @param featureMappings the featureMappings to set
	 */
	public void setFeatureMappings(Map<String, String> featureMappings) {
		this.featureMappings = featureMappings;
	}
	/**
	 * @return the efpMappings
	 */
	public Map<String, String> getEfpMappings() {
		return efpMappings;
	}
	/**
	 * @param efpMappings the efpMappings to set
	 */
	public void setEfpMappings(Map<String, String> efpMappings) {
		this.efpMappings = efpMappings;
	}
	/**
	 * @return the data
	 */
	public Map<String, CocaexData> getData() {
		return data;
	}
	/**
	 * @param data the data to set
	 */
	public void setData(Map<String, CocaexData> data) {
		this.data = data;
	}
	
	
}
