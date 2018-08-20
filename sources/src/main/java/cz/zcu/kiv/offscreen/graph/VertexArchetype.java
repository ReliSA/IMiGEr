package cz.zcu.kiv.offscreen.graph;

public class VertexArchetype {
    public String name;
    public String text;

    VertexArchetype(String name, String text) {
        this.name = name;
        this.text = text;
    }

    public String getName() {
        return name;
    }

    public String getText() {
        return text;
    }
}
