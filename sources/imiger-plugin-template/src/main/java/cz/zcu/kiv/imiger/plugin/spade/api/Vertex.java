package cz.zcu.kiv.imiger.plugin.spade.api;

import java.util.List;

/**
 * Class represents vertex which is used for output JSON format (JSON between frontend and backend)
 */
public class Vertex extends BaseVertex {

    /** List of all tributes. Every attribute is stored in String array in pair as {attribute name, attribute value}. */
    private List<String[]> attributes;
    /** Relative position in graph */
    private Position position;

    /**
     * Create new vertex.
     * @param id original identification number from input file
     * @param name of vertex
     * @param archetypeIndex index of vertex archetype
     * @param text additional info
     * @param attributes List of all attributes. Every attribute is stored in String array in pair as {attribute name, attribute value}.
     */
    public Vertex(int id, String name, int archetypeIndex, String text, List<String[]> attributes) {
        super(id, name, archetypeIndex, text);
        this.attributes = attributes;
        this.position = null;
    }

    public List<String[]> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<String[]> attributes) {
        this.attributes = attributes;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }
}
