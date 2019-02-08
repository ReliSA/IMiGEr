package cz.zcu.kiv.imiger.plugin.spade.api;

public class EdgeArchetype {
    public String name;
    public String text;

    public EdgeArchetype(String name, String text) {
        this.name = name;
        this.text = text;
    }

    public String getName() {
        return  name;
    }

    public String getText() {
        return text;
    }
}
