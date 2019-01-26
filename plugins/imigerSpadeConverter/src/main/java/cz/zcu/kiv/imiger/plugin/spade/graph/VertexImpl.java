package cz.zcu.kiv.imiger.plugin.spade.graph;

import cz.zcu.kiv.imiger.plugin.spade.api.BaseVertex;

import java.util.*;

/**
 * Class represents vertex which is used for input JSON format.
 */
public class VertexImpl extends BaseVertex {

    /** Map contains attributes stored in key value format. Key is index to array of attribute types defined in input file */
    private Map<Integer, Attribute> attributesMap;

    /**
     * Creates new vertex.
     * @param id original identification number from input file
     * @param name of vertex
     * @param archetypeIndex index of vertex archetype
     * @param text additional info
     */
    public VertexImpl(int id, String name, int archetypeIndex, String text) {
        super(id, name, archetypeIndex, text);
        this.attributesMap = new HashMap<>();
    }

    public void addAttribute(int attrTypeIndex, Object value) {
        Attribute attr = new Attribute(attrTypeIndex, value);
        attributesMap.put(attrTypeIndex, attr);
    }

    public void addAttributes(Map<Integer, Attribute> attributes) {
        this.attributesMap.putAll(attributes);
    }

    public Attribute getAttribute(int attrTypeIndex) {
        return attributesMap.get(attrTypeIndex);
    }

    public Map<Integer, Attribute> getAttributesMap(){
        return attributesMap;
    }

    /**
     * Return list of attributes sorted by their key value in {@code attributeMap}
     * @return sorted list
     */
    public List<Attribute> getSortedAttributes() {
        List<Attribute> list = new ArrayList<>();
        ArrayList<Integer> indices = new ArrayList<>(attributesMap.keySet());
        //indices.sort(Integer::compareTo);
        Collections.sort(indices);
        for (int index : indices) {
            list.add(attributesMap.get(index));
        }
        return list;
    }
}
