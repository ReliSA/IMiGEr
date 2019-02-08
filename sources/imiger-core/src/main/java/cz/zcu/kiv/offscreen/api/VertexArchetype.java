package cz.zcu.kiv.offscreen.api;

public class VertexArchetype {
    public String name;
    public String text;
    public String icon;

    public VertexArchetype(String name, String text, String icon) {
        this.name = name;
        this.text = text;
        this.icon = icon;
    }

    public VertexArchetype(String name, String text) {
        this(name, text, "");
    }

    public String getName() {
        return name;
    }

    public String getText() {
        return text;
    }

    public String getIcon() {
        return icon;
    }
}
