package cz.zcu.kiv.imiger.vo;

import java.util.List;

public class SubedgeInfo {

    /** Edge archetype index. */
    private int archetype;
    /** Original id of edge which is taken from input JSON file. */
    private int id;
    /** List of all tributes. Every attribute is stored in String array in pair as {attribute name, attribute value}. */
    private List<String[]> attributes;

    /**
     * Create new subedgeInfo
     * @param id Original id of edge which is taken from input JSON file.
     * @param archetype Edge archetype index.
     * @param attributes  List of all tributes. Every attribute is stored in String array in pair as {attribute name, attribute value}.
     */
    public SubedgeInfo(int id, int archetype, List<String[]> attributes) {
        this.id = id;
        this.archetype = archetype;
        this.attributes = attributes;
    }

    public int getId() {
        return id;
    }

    public int getArchetype() {
        return archetype;
    }

    public List<String[]> getAttributes() {
        return attributes;
    }
}
