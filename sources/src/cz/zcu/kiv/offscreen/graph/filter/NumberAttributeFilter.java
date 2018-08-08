package cz.zcu.kiv.offscreen.graph.filter;

import java.math.BigDecimal;

public class NumberAttributeFilter implements ITypeAttributeFilter {
    private BigDecimal min;
    private BigDecimal max;
    private boolean minInclusive;
    private boolean maxInclusive;
    private GraphFilter.NumberMatchType matchType;

    public NumberAttributeFilter(BigDecimal min, BigDecimal max, boolean minInclusive, boolean maxInclusive, GraphFilter.NumberMatchType matchType) {
        this.min = min;
        this.max = max;
        this.minInclusive = minInclusive;
        this.maxInclusive = maxInclusive;
        this.matchType = matchType;
    }

    @Override
    public boolean filter(Object value) {
        BigDecimal val = (BigDecimal) value;
        boolean result = false;

        int cmpMin = -1;
        int cmpMax = 1;

        if (minInclusive) cmpMin = 0;
        if (maxInclusive) cmpMax = 0;

        if (min.compareTo(val) <= cmpMin && max.compareTo(val) >= cmpMax) {
            result = true;
        }

        return (matchType == GraphFilter.NumberMatchType.MATCHING) == result;
    }

    public BigDecimal getMin() {
        return min;
    }

    public BigDecimal getMax() {
        return max;
    }

    public boolean isMinInclusive() {
        return minInclusive;
    }

    public boolean isMaxInclusive() {
        return maxInclusive;
    }

    public GraphFilter.NumberMatchType getMatchType() {
        return matchType;
    }
}
