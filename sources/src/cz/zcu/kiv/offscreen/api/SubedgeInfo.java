package cz.zcu.kiv.offscreen.api;

import java.util.List;

public class SubedgeInfo {

    /** Edge archetype index. */
    private int archetype;
    /** Original id of edge which is taken from input JSON file. */
    private int originalId;
    /** List of all tributes. Every attribute is stored in String array in pair as {attribute name, attribute value}. */
    private List<String[]> attributes;

    /**
     * Create new subedgeInfo
     * @param originalId Original id of edge which is taken from input JSON file.
     * @param archetype Edge archetype index.
     * @param attributes  List of all tributes. Every attribute is stored in String array in pair as {attribute name, attribute value}.
     */
    public SubedgeInfo(int originalId, int archetype, List<String[]> attributes) {
        this.originalId = originalId;
        this.archetype = archetype;
        this.attributes = attributes;
    }

    public int getOriginalId() {
        return originalId;
    }

    public int getArchetype() {
        return archetype;
    }

    public List<String[]> getAttributes() {
        return attributes;
    }
}
