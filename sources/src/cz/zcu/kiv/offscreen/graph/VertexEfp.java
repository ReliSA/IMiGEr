package cz.zcu.kiv.offscreen.graph;

import java.util.LinkedList;
import java.util.List;

import org.apache.log4j.Logger;

import cz.zcu.kiv.offscreen.api.VertexInterface;

/**
 *
 * @author Jiri Loudil
 *
 */
public class VertexEfp implements VertexInterface {
	private int id;
	private String name;
	private String symbolicName;

	private List<String> exportedPackages;
	private List<String> importedPackages;

	private Logger logger = Logger.getLogger(VertexEfp.class);

	/**
	 *
	 * @param id
	 * @param name
	 * @param symbolicName
	 */
	public VertexEfp(int id, String name, String symbolicName) {
		logger.trace("ENTRY");
		this.id = id;
		this.name = name;
		this.symbolicName = symbolicName;

		this.exportedPackages = new LinkedList<String>();
		this.importedPackages = new LinkedList<String>();

		logger.trace("EXIT");
	}

	@Override
	public int getId() {
		logger.trace("ENTRY");
		logger.trace("EXIT");
		return id;
	}

	@Override
	public String getName() {
		logger.trace("ENTRY");
		logger.trace("EXIT");
		return name;
	}

	@Override
	public String getSymbolicName() {
		logger.trace("ENTRY");
		logger.trace("EXIT");
		return this.symbolicName;
	}

	@Override
	public List<String> getExportedPackages() {
		logger.trace("ENTRY");
		logger.trace("EXIT");
		return this.exportedPackages;
	}

	@Override
	public List<String> getImportedPackages() {
		logger.trace("ENTRY");
		logger.trace("EXIT");
		return this.importedPackages;
	}

	@Override
	public void setExportedPackages(List<String> exportedPackages) {
		logger.trace("ENTRY");
		this.exportedPackages = exportedPackages;
		logger.trace("EXIT");
	}

	@Override
	public void setImportedPackages(List<String> importedPackages) {
		logger.trace("ENTRY");
		this.importedPackages = importedPackages;
		logger.trace("EXIT");
	}

	@Override
	public int getArchetype() {
		return 0;
	}

	@Override
	public void setArchetype(int archetype) {

	}

	@Override
	public void setAttributes(List<String[]> attributes) {

	}

	@Override
	public List<String[]> getAttributes() {
		return null;
	}

}
