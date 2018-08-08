package cz.zcu.kiv.offscreen.graph;

import java.util.*;

public class VertexData {
    public int id;
    public String title;
    public String text;
    public int archetypeIndex;
    public Map<Integer, Attribute> attributes = new HashMap<>();

    public VertexData(int id, String title, String text, int archetypeIndex) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.archetypeIndex = archetypeIndex;
    }

    public void addAttribute(int attrTypeIndex, Object value) {
        Attribute attr = new Attribute(attrTypeIndex, value);
        attributes.put(attrTypeIndex, attr);
    }

    public Attribute getAttribute(int attrTypeIndex) {
        return attributes.get(attrTypeIndex);
    }

    @Override
    public int hashCode() {
        return id;
    }

    @Override
    public boolean equals(Object edge) {
        if (!(edge instanceof VertexData)) return false;
        return id == ((VertexData) edge).id;
    }

    public void addAttributes(Map<Integer, Attribute> attributes) {
        this.attributes.putAll(attributes);
    }

    public List<Attribute> getSortedAttributes() {
        List<Attribute> list = new ArrayList<>();
        ArrayList<Integer> indices = new ArrayList<>(attributes.keySet());
        //indices.sort(Integer::compareTo);
        Collections.sort(indices); // TODO check correct order
        for (int i = 0; i < indices.size(); i++) {
            list.add(attributes.get(indices.get(i)));
        }
        return list;
    }
}
