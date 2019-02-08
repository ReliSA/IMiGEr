package cz.zcu.kiv.imiger.plugin.spade.api;

/**
 * Class represents one attribute type which is used in input JSON file and in output JSON file (file between frontend
 * and backend).
 */
public class AttributeType {
    /** name of attribute */
    public String name;
    /** data type of attribute */
    public AttributeDataType dataType;
    /** additional info */
    public String text;

    public AttributeType(String name, AttributeDataType dataType, String text) {
        this.name = name;
        this.dataType = dataType;
        this.text = text;
    }

    public String getName() {
        return name;
    }

    public AttributeDataType getDataType() {
        return dataType;
    }

    public String getText() {
        return text;
    }
}
