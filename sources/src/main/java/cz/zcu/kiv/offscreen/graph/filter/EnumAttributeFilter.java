package cz.zcu.kiv.offscreen.graph.filter;

import java.util.List;

public class EnumAttributeFilter implements ITypeAttributeFilter {
    private List<Integer> valueIndices;
    private GraphFilter.EnumMatchType matchType;

    public EnumAttributeFilter(List<Integer> valueIndices, GraphFilter.EnumMatchType matchType) {
        this.valueIndices = valueIndices;
        this.matchType = matchType;
    }

    @Override
    public boolean filter(Object value) {
        boolean result = true;
        List<Integer> val = (List<Integer>) value;

        switch (matchType) {
            case ANY:
                for (int e : val) {
                    if (valueIndices.contains(e)) {
                        return true;
                    }
                }
                result = false;
                break;
            case NONE:
                for (int e : val) {
                    if (valueIndices.contains(e)) {
                        return false;
                    }
                }
                result = true;
                break;
            case EXACT_MATCH:
                for (int e : val) {
                    if (!valueIndices.contains(e)) {
                        return false;
                    }
                }
                for (int e : valueIndices) {
                    if (!val.contains(e)) {
                        return false;
                    }
                }
                result = true;
                break;
        }

        return result;
    }

    public List<Integer> getValueIndices() {
        return valueIndices;
    }

    public GraphFilter.EnumMatchType getMatchType() {
        return matchType;
    }
}
