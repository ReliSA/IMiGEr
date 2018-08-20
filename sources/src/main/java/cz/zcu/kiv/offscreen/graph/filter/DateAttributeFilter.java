package cz.zcu.kiv.offscreen.graph.filter;

import java.util.Date;

public class DateAttributeFilter implements ITypeAttributeFilter {
    private Date min;
    private Date max;
    private boolean minInclusive;
    private boolean maxInclusive;
    private GraphFilter.DateMatchType matchType;

    public DateAttributeFilter(Date min, Date max, boolean minInclusive, boolean maxInclusive, GraphFilter.DateMatchType matchType) {
        this.min = min;
        this.max = max;
        this.minInclusive = minInclusive;
        this.maxInclusive = maxInclusive;
        this.matchType = matchType;
    }

    @Override
    public boolean filter(Object value) {
        Date date = (Date) value;
        boolean result = false;

        int cmpMin = -1;
        int cmpMax = 1;

        if (minInclusive) cmpMin = 0;
        if (maxInclusive) cmpMax = 0;

        if (min.compareTo(date) <= cmpMin && max.compareTo(date) >= cmpMax) {
            result = true;
        }

        return (matchType == GraphFilter.DateMatchType.MATCHING) == result;
    }

    public Date getMin() {
        return min;
    }

    public Date getMax() {
        return max;
    }

    public boolean isMinInclusive() {
        return minInclusive;
    }

    public boolean isMaxInclusive() {
        return maxInclusive;
    }

    public GraphFilter.DateMatchType getMatchType() {
        return matchType;
    }
}
