package cz.zcu.kiv.offscreen.graph;

import java.util.*;

public class EdgeData {
    public int id;
    public int from;
    public int to;
    public String text;
    public int archetypeIndex;
    public Map<Integer, Attribute> attributes = new HashMap<>();

    public EdgeData(int id, int from, int to, String text, int archetypeIndex) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.text = text;
        this.archetypeIndex = archetypeIndex;
    }

    public void addAttribute(int attrTypeIndex, Object value) {
        Attribute attr = new Attribute(attrTypeIndex, value);
        attributes.put(attrTypeIndex, attr);
    }

    public void addAttributes(Map<Integer, Attribute> attributes) {
        this.attributes.putAll(attributes);
    }

    public Attribute getAttribute(int attrTypeIndex) {
        return attributes.get(attrTypeIndex);
    }

    @Override
    public int hashCode() {
        return from * 100000 + to;
    }

    @Override
    public boolean equals(Object edge) {
        return from == ((EdgeData) edge).from && to == ((EdgeData) edge).to;
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
