package cz.zcu.kiv.offscreen.graph;

/**
 * Class represents one attribute type which is used in input JSON file and in output JSON file (file between frontend
 * and backend).
 */
public class AttributeType {
    /** name of attribute */
    public String name;
    /** data type of attribute */
    public GraphManager.AttributeDataType dataType;
    /** additional info */
    public String text;

    public AttributeType(String name, GraphManager.AttributeDataType dataType, String text) {
        this.name = name;
        this.dataType = dataType;
        this.text = text;
    }

    public String getName() {
        return name;
    }

    public GraphManager.AttributeDataType getDataType() {
        return dataType;
    }

    public String getText() {
        return text;
    }
}
