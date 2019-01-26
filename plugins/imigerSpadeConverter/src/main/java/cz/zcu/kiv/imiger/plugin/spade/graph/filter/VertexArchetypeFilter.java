package cz.zcu.kiv.imiger.plugin.spade.graph.filter;

import java.util.List;

public class VertexArchetypeFilter {
    public List<Integer> archetypeIndeces;
    public GraphFilter.ArchetypeMatchType matchType;

    public VertexArchetypeFilter(List<Integer> archetypeIndeces, GraphFilter.ArchetypeMatchType matchType) {
        this.archetypeIndeces = archetypeIndeces;
        this.matchType = matchType;
    }
}
