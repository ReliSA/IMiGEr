package cz.zcu.kiv.offscreen.graph;

import cz.zcu.kiv.offscreen.api.VertexInterface;
import java.util.LinkedList;
import java.util.List;

import org.apache.log4j.Logger;

/**
 *
 * @author Jindra Pavlíková
 */
public class VertexImpl implements VertexInterface {

    private int id;
    private String name;
    private String symbolicName;
    private List<String> exportedPackages;
    private List<String> importedPackages;
    private int archetype;
    private Logger logger = Logger.getLogger(VertexImpl.class);
    /**
     * list of attributes, the first value in each array is the attribute's name and the second value is its value
     */
    private List<String[]> attributes;
//    private List<EdgeInterface> edges;

    public VertexImpl(int id, String name, String symbolicName) {
        logger.trace("ENTRY");
        this.id = id;
        this.name = name;
        this.symbolicName = symbolicName;
        this.exportedPackages = new LinkedList<String>();
        this.importedPackages = new LinkedList<String>();
        logger.trace("EXIT");
//        this.edges = new ArrayList<EdgeInterface>();
    }

    //    public List<EdgeInterface> getEdges() {
//        return edges;
//    }
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
//    public void addEdge(EdgeInterface edge){
//        this.edges.add(edge);
//    }

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
        return archetype;
    }

    @Override
    public void setArchetype(int archetype) {
        this.archetype = archetype;
    }

    @Override
    public void setAttributes(List<String[]> attributes) {
        this.attributes = attributes;
    }

    @Override
    public List<String[]> getAttributes() {
        return attributes;
    }

    @Override
    public String getSymbolicName() {
        return this.symbolicName;
    }
}
