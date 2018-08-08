package cz.zcu.kiv.offscreen;

import cz.zcu.kiv.offscreen.graph.GraphManager;

public class AttributeType {
    public String name;
    public GraphManager.AttributeDataType dataType;
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
}
