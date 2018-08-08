package cz.zcu.kiv.offscreen.graph;

import java.util.List;

public class SubedgeInfo {
    private int archetype;

    /**
     * the original id of the edge in the input file, does not need to be set, but can be used for testing
     */
    public int id;

    /**
     * list of attributes, the first value in each array is the attribute's name and the second value is its value
     */
    private List<String[]> attributes;

    public SubedgeInfo(int archetype, List<String[]> attributes) {
        this.archetype = archetype;
        this.attributes = attributes;
    }

    public int getArchetype() {
        return archetype;
    }

    public List<String[]> getAttributes() {
        return attributes;
    }
}
