/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cz.zcu.kiv.offscreen.api;

import cz.zcu.kiv.offscreen.AttributeType;
import cz.zcu.kiv.offscreen.graph.EdgeArchetype;
import cz.zcu.kiv.offscreen.graph.VertexArchetype;

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
    public List<VertexArchetype>  getVertexArchetypes();
    public List<EdgeArchetype> getEdgeArchetypes();
    public void setVertexArchetypes(List<VertexArchetype> vertexArchetypes);
    public void setEdgeArchetypes(List<EdgeArchetype> edgeArchetypes);
    public void setAttributeTypes(List<AttributeType> attributeTypes);
    public void setPossibleEnumValues(Map<Integer, List<String>> possibleEnumValues);
    public List<AttributeType> getAttributeTypes();
    public Map<String, List<String>> getPossibleEnumValues();
    void setArchetypeIcons(Map<String, String> archetypeIcons);
    Map<String, String> getArchetypeIcons();
    List<Integer> getDefaultGroupArchetypes();
    void setDefaultGroupArchetypes(List<Integer> defaultGroupArchetypes);
}
