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
    private Logger logger = Logger.getLogger(VertexImpl.class);
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
    public String getSymbolicName() {
        return this.symbolicName;
    }
}
