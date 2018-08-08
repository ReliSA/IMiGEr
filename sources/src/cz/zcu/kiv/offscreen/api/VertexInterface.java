/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cz.zcu.kiv.offscreen.api;

import java.util.List;

/**
 * 
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public interface VertexInterface {

	public int getId();

	public String getName();

	public String getSymbolicName();

	public List<String> getExportedPackages();

	public List<String> getImportedPackages();

	public void setExportedPackages(List<String> exportedPackages);

	public void setImportedPackages(List<String> importedPackages);

	public int getArchetype();

	public void setArchetype(int archetype);

	public void setAttributes(List<String[]> attributes);

	public List<String[]> getAttributes();
}
