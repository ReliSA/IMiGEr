package cz.zcu.kiv.offscreen.graph.filter;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringAttributeFilter implements ITypeAttributeFilter {
    private String filterValue;
    private GraphFilter.StringMatchType matchType;

    public StringAttributeFilter(String filterValue, GraphFilter.StringMatchType matchType) {
        this.filterValue = filterValue;
        this.matchType = matchType;
    }

    @Override
    public boolean filter(Object value) {
        String val = (String) value;
        boolean result = false;

        switch (matchType) {
            case EXACT_MATCH:
                if (val.equals(filterValue)) result = true;
                break;
            case EXACT_MISMATCH:
                if (!val.equals(filterValue)) result = true;
                break;
            case CONTAINING:
                if (val.contains(filterValue)) result = true;
                break;
            case NON_CONTAINING:
                if (!val.contains(filterValue)) result = true;
                break;
            case REGULAR_EXPRESSION:
                Pattern pattern = Pattern.compile(filterValue);
                Matcher matcher = pattern.matcher(val);
                if (matcher.find()) result = true;
                break;
        }

        return result;
    }

    public String getFilterValue() {
        return filterValue;
    }

    public GraphFilter.StringMatchType getMatchType() {
        return matchType;
    }
}
