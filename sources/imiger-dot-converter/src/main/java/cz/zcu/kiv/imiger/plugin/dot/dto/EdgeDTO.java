package cz.zcu.kiv.imiger.plugin.dot.dto;

import java.util.HashMap;

public class EdgeDTO {

    private String name;
    private int idFrom;
    private int idTo;
    private int id;
    private HashMap<String, String> attributes;

    public EdgeDTO(String name, int idFrom, int idTo, int id, HashMap<String, String> attributes) {
        this.name = name;
        this.idFrom = idFrom;
        this.idTo = idTo;
        this.id = id;
        this.attributes = attributes;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getIdFrom() {
        return idFrom;
    }

    public void setIdFrom(int idFrom) {
        this.idFrom = idFrom;
    }

    public int getIdTo() {
        return idTo;
    }

    public void setIdTo(int idTo) {
        this.idTo = idTo;
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
