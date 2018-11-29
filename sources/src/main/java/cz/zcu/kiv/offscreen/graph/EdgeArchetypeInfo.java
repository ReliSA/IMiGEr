package cz.zcu.kiv.offscreen.graph;

public class EdgeArchetypeInfo {
    /**
     * index of the archetype of the vertex the edge leads to
     */
    public int fromArchetypeIndex;

    /**
     * index of the archetype of the edge
     */
    public int edgeArchetypeIndex;

    /**
     * index of the archetype of the vertex the edge leads from
     */
    public int toArchetypeIndex;

    public EdgeArchetypeInfo(int fromArchetypeIndex, int edgeArchetypeIndex, int toArchetypeIndex) {
        this.fromArchetypeIndex = fromArchetypeIndex;
        this.edgeArchetypeIndex = edgeArchetypeIndex;
        this.toArchetypeIndex = toArchetypeIndex;
    }

    @Override
    public int hashCode() {
        return fromArchetypeIndex * 10000 + edgeArchetypeIndex * 100 + fromArchetypeIndex;
    }

    @Override
    public boolean equals(Object obj) {
        if(!(obj instanceof  EdgeArchetypeInfo)) return false;
        
        EdgeArchetypeInfo info = (EdgeArchetypeInfo)obj;
        return (info.fromArchetypeIndex == fromArchetypeIndex) &&
                (info.edgeArchetypeIndex == edgeArchetypeIndex) &&
                (info.toArchetypeIndex == toArchetypeIndex);
    }
}
