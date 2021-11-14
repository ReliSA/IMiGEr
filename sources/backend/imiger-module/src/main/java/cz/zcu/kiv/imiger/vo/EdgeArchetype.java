package cz.zcu.kiv.imiger.vo;

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
