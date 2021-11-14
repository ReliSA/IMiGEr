package cz.zcu.kiv.imiger.plugin.spade.graph.filter;

import cz.zcu.kiv.imiger.plugin.spade.graph.EdgeArchetypeInfo;

import java.util.List;

public class EdgeArchetypeFilter {
    public List<EdgeArchetypeInfo> archetypeIndeces;
    public GraphFilter.ArchetypeMatchType matchType;

    public EdgeArchetypeFilter(List<EdgeArchetypeInfo> archetypeIndeces, GraphFilter.ArchetypeMatchType matchType) {
        this.archetypeIndeces = archetypeIndeces;
        this.matchType = matchType;
    }
}
