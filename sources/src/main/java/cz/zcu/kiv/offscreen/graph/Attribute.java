package cz.zcu.kiv.offscreen.graph;

/**
 * This class represents attribute of edge or vertex.
 */
public class Attribute {
    /** Index to array of attribute types which is defined in input JSON file */
    private int typeIndex;
    /** Value of attribute */
    private Object value;

    public Attribute(int typeIndex, Object value) {
        this.typeIndex = typeIndex;
        this.value = value;
    }

    public int getTypeIndex() {
        return typeIndex;
    }

    public void setTypeIndex(int typeIndex) {
        this.typeIndex = typeIndex;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }
}
