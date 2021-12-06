package cz.zcu.kiv.imiger.plugin.dot.dto;

import java.util.HashMap;

public class VertexDTO {

    private String name;
    private int id;
    private HashMap<String, String> attributes;

    public VertexDTO(String name, int id, HashMap<String, String> attributes) {
        this.name = name;
        this.id = id;
        this.attributes = attributes;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public HashMap<String, String> getAttributes() {
        return attributes;
    }

    public void setAttributes(HashMap<String, String> attributes) {
        this.attributes = attributes;
    }
}
