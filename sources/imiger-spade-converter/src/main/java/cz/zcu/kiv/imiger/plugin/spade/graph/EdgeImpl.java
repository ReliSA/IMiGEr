package cz.zcu.kiv.imiger.plugin.spade.graph;

import cz.zcu.kiv.imiger.vo.BaseEdge;

import java.util.*;

/**
 * Class represents edge which is used for input JSON format.
 */
public class EdgeImpl extends BaseEdge {

    /** original identification number which is defined in input file */
    private int originalId;
    /** index of edge archetype */
    private int archetypeIndex;
    /** Map contains attributes stored in key value format. Key is index to array of attribute types defined in input file */
    private Map<Integer, Attribute> attributesMap;

    /**
     * Create new edge.
     * @param id new generated identification number
     * @param from original ID of vertex from edge leads
     * @param to original ID of vertex where edge leads
     * @param text additional info
     * @param originalId original identification number which is defined in input file
     * @param archetypeIndex index of edge archetype
     */
    public EdgeImpl(int id, int from, int to, String text, int originalId, int archetypeIndex) {
        super(id, from, to, text);
        this.originalId = originalId;
        this.archetypeIndex = archetypeIndex;
        this.attributesMap = new HashMap<>();
    }

    public Attribute getAttribute(int attrTypeIndex) {
        return attributesMap.get(attrTypeIndex);
    }

    public Map<Integer, Attribute> getAttributesMap() {
        return attributesMap;
    }


    public int getOriginalId() {
        return originalId;
    }


    public int getArchetype() {
        return archetypeIndex;
    }


    public void addAttribute(int attrTypeIndex, Object value) {
        Attribute attr = new Attribute(attrTypeIndex, value);
        attributesMap.put(attrTypeIndex, attr);
    }

    public void addAttributes(Map<Integer, Attribute> attributes) {
        this.attributesMap.putAll(attributes);
    }

    public void setOriginalId(int originalId) {
        this.originalId = originalId;
    }

    public void setArchetypeIndex(int archetypeIndex) {
        this.archetypeIndex = archetypeIndex;
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
        for (Integer index : indices) {
            list.add(attributesMap.get(index));
        }
        return list;
    }
}
