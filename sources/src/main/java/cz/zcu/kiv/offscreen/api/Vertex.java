package cz.zcu.kiv.offscreen.api;

import java.util.List;

/**
 * Class represents vertex which is used for output JSON format (JSON between frontend and backend)
 */
public class Vertex extends BaseVertex {

    /** List of all tributes. Every attribute is stored in String array in pair as {attribute name, attribute value}. */
    private List<String[]> attributes;

    /**
     * Create new vertex.
     * @param id new generated identification number.
     * @param originalId original identification number from input file
     * @param name of vertex
     * @param archetypeIndex index of vertex archetype
     * @param text additional info
     * @param attributes List of all attributes. Every attribute is stored in String array in pair as {attribute name, attribute value}.
     */
    public Vertex(int id, int originalId, String name, int archetypeIndex, String text, List<String[]> attributes) {
        super(id, originalId, name, archetypeIndex, text);
        this.attributes = attributes;
    }

    public List<String[]> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<String[]> attributes) {
        this.attributes = attributes;
    }
}
