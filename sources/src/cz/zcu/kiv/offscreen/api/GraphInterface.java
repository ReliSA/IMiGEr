/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cz.zcu.kiv.offscreen.api;

import java.util.List;
import java.util.Map;

/**
 *
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public interface GraphInterface {
    
    public void addEdge(EdgeInterface edge);
    public void addVertex(String name, VertexInterface vertex);
    public Map<String, VertexInterface> getVertices();
    public List<EdgeInterface> getEdges();
    
}
