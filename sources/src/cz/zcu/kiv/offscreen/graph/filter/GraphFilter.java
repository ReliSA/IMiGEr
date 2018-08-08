package cz.zcu.kiv.offscreen.graph.filter;

import cz.zcu.kiv.offscreen.graph.EdgeArchetypeInfo;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

public class GraphFilter {
    public enum ArchetypeMatchType {
        /**
         * accepts all the archetypes in the list
         */
        MATCHING,

        /**
         * accepts all the available archetypes except those in the list
         */
        NON_MATCHING
    }

    public enum NumberMatchType {
        /**
         * accepts all numbers that belong to the interval
         */
        MATCHING,

        /**
         * accepts all numbers that are outside the interval
         */
        NON_MATCHING
    }

    public enum EnumMatchType {
        /**
         * accepts when the attribute has at least one of the values in the list
         */
        ANY,

        /**
         * accepts when the attribute has none of the values in the list
         */
        NONE,

        /**
         * accepts when the attribute has the exact values as the values in the list and none other
         */
        EXACT_MATCH
    }

    public enum DateMatchType {
        /**
         * accepts all dates that belong to the interval
         */
        MATCHING,

        /**
         * accepts all dates that are outside the interval
         */
        NON_MATCHING
    }

    public enum StringMatchType {
        /**
         * accepts strings that have the exact filter value
         */
        EXACT_MATCH,

        /**
         * accepts strings that have any value different from the filter value
         */
        EXACT_MISMATCH,

        /**
         * accepts strings that contain the filter value as a substring
         */
        CONTAINING,

        /**
         * accepts strings that do not contain the filter value as s substring
         */
        NON_CONTAINING,

        /**
         * accepts strings that are accepted by the regular expression defined by the filter value
         */
        REGULAR_EXPRESSION
    }

    private VertexArchetypeFilter vertexArchetypeFilter;
    private EdgeArchetypeFilter edgeArchetypeFilter;

    /**
     * key is the vertex archetype index, value is the filter object
     */
    private HashMap<Integer, AttributeFilter> vertexAttributeFilters = new HashMap<>();

    /**
     * key is the edge archetype index, value is the filter object
     */
    private HashMap<Integer, AttributeFilter> edgeAttributeFilters = new HashMap<Integer, AttributeFilter>();

    public AttributeFilter getVertexAttributeFilter(int archetypeIndex) {
        return vertexAttributeFilters.get(archetypeIndex);
    }

    public AttributeFilter getEdgeAttributeFilter(int archetypeIndex) {
        return edgeAttributeFilters.get(archetypeIndex);
    }

    public VertexArchetypeFilter getVertexArchetypeFilter() {
        return vertexArchetypeFilter;
    }

    public EdgeArchetypeFilter getEdgeArchetypeFilter() {
        return edgeArchetypeFilter;
    }

    public void setVertexArchetypeFilter(List<Integer> archetypeIndices, ArchetypeMatchType matchType) {
        vertexArchetypeFilter = new VertexArchetypeFilter(archetypeIndices, matchType);
    }

    public void setEdgeArchetypeFilter(List<EdgeArchetypeInfo> archetypeIndices, ArchetypeMatchType matchType) {
        edgeArchetypeFilter = new EdgeArchetypeFilter(archetypeIndices, matchType);
    }

    public void setVertexNumberAttributeFilter(int archetypeIndex, int attributeTypeIndex, BigDecimal min, BigDecimal max, boolean minInclusive, boolean maxInclusive, NumberMatchType matchType) {
        AttributeFilter filter;
        if (vertexAttributeFilters.containsKey(archetypeIndex)) {
            filter = vertexAttributeFilters.get(archetypeIndex);
        } else {
            filter = new AttributeFilter();
            vertexAttributeFilters.put(archetypeIndex, filter);
        }
        filter.addNumberFilter(attributeTypeIndex, new NumberAttributeFilter(min, max, minInclusive, maxInclusive, matchType));
    }

    public void setEdgeNumberAttributeFilter(int archetypeIndex, int attributeTypeIndex, BigDecimal min, BigDecimal max, boolean minInclusive, boolean maxInclusive, NumberMatchType matchType) {
        AttributeFilter filter;
        if (edgeAttributeFilters.containsKey(archetypeIndex)) {
            filter = edgeAttributeFilters.get(archetypeIndex);
        } else {
            filter = new AttributeFilter();
            edgeAttributeFilters.put(archetypeIndex, filter);
        }
        filter.addNumberFilter(attributeTypeIndex, new NumberAttributeFilter(min, max, minInclusive, maxInclusive, matchType));
    }

    public void setVertexEnumAttributeFilter(int archetypeIndex, int attributeTypeIndex, List<Integer> valueIndices, EnumMatchType matchType) {
        AttributeFilter filter;
        if (vertexAttributeFilters.containsKey(archetypeIndex)) {
            filter = vertexAttributeFilters.get(archetypeIndex);
        } else {
            filter = new AttributeFilter();
            vertexAttributeFilters.put(archetypeIndex, filter);
        }
        filter.addEnumFilter(attributeTypeIndex, new EnumAttributeFilter(valueIndices, matchType));
    }

    public void setEdgeEnumAttributeFilter(int archetypeIndex, int attributeTypeIndex, List<Integer> valueIndices, EnumMatchType matchType) {
        AttributeFilter filter;
        if (edgeAttributeFilters.containsKey(archetypeIndex)) {
            filter = edgeAttributeFilters.get(archetypeIndex);
        } else {
            filter = new AttributeFilter();
            edgeAttributeFilters.put(archetypeIndex, filter);
        }
        filter.addEnumFilter(attributeTypeIndex, new EnumAttributeFilter(valueIndices, matchType));
    }

    public void setVertexDateAttributeFilter(int archetypeIndex, int attributeTypeIndex, Date min, Date max, boolean minInclusive, boolean maxInclusive, DateMatchType matchType) {
        AttributeFilter filter;
        if (vertexAttributeFilters.containsKey(archetypeIndex)) {
            filter = vertexAttributeFilters.get(archetypeIndex);
        } else {
            filter = new AttributeFilter();
            vertexAttributeFilters.put(archetypeIndex, filter);
        }
        filter.addDateFilter(attributeTypeIndex, new DateAttributeFilter(min, max, minInclusive, maxInclusive, matchType));
    }

    public void setEdgeDateAttributeFilter(int archetypeIndex, int attributeTypeIndex, Date min, Date max, boolean minInclusive, boolean maxInclusive, DateMatchType matchType) {
        AttributeFilter filter;
        if (edgeAttributeFilters.containsKey(archetypeIndex)) {
            filter = edgeAttributeFilters.get(archetypeIndex);
        } else {
            filter = new AttributeFilter();
            edgeAttributeFilters.put(archetypeIndex, filter);
        }
        filter.addDateFilter(attributeTypeIndex, new DateAttributeFilter(min, max, minInclusive, maxInclusive, matchType));
    }

    public void setVertexStringAttributeFilter(int archetypeIndex, int attributeTypeIndex, String filterValue, StringMatchType matchType) {
        AttributeFilter filter;
        if (vertexAttributeFilters.containsKey(archetypeIndex)) {
            filter = vertexAttributeFilters.get(archetypeIndex);
        } else {
            filter = new AttributeFilter();
            vertexAttributeFilters.put(archetypeIndex, filter);
        }
        filter.addStringFilter(attributeTypeIndex, new StringAttributeFilter(filterValue, matchType));
    }

    public void setEdgeStringAttributeFilter(int archetypeIndex, int attributeTypeIndex, String filterValue, StringMatchType matchType) {
        AttributeFilter filter;
        if (edgeAttributeFilters.containsKey(archetypeIndex)) {
            filter = edgeAttributeFilters.get(archetypeIndex);
        } else {
            filter = new AttributeFilter();
            edgeAttributeFilters.put(archetypeIndex, filter);
        }
        filter.addStringFilter(attributeTypeIndex, new StringAttributeFilter(filterValue, matchType));
    }

    /*
    advised filtering process:
    first filter the archetypes using queries in the hash maps in GraphManager
    then iterate through all vertices/edges that are left after the first step and for each vertex/edge do the following:
     - use getVertex/EdgeAttributeFilter in GraphFilter to get the filer setting for the given archetype, this returns AttributeFilter
     - iterate through all attributes of the vertex/edge and do the following:
        - get the attribute data type and index
        - use getString/Number/Enum/DateFilter in AttributeFilter to get the filter for the given attribute
        - decide whether the attribute's value passes the filter and whether to keep the give vertex/edge or not
     */
}
