package cz.zcu.kiv.offscreen.graph.filter;

import java.util.HashMap;

public class AttributeFilter {
    private HashMap<Integer, NumberAttributeFilter> numberFilters = new HashMap<Integer, NumberAttributeFilter>();
    private HashMap<Integer, EnumAttributeFilter> enumFilters = new HashMap<Integer, EnumAttributeFilter>();
    private HashMap<Integer, DateAttributeFilter> dateFilters = new HashMap<Integer, DateAttributeFilter>();
    private HashMap<Integer, StringAttributeFilter> stringFilters = new HashMap<Integer, StringAttributeFilter>();


    public void addNumberFilter(int attrTypeIndex, NumberAttributeFilter filter) {
        numberFilters.put(attrTypeIndex, filter);
    }

    public NumberAttributeFilter getNumberFilter(int attrTypeIndex) {
        return numberFilters.get(attrTypeIndex);
    }

    public void addEnumFilter(int attrTypeIndex, EnumAttributeFilter filter) {
        enumFilters.put(attrTypeIndex, filter);
    }

    public EnumAttributeFilter getEnumFilter(int attrTypeIndex) {
        return enumFilters.get(attrTypeIndex);
    }

    public void addDateFilter(int attrTypeIndex, DateAttributeFilter filter) {
        dateFilters.put(attrTypeIndex, filter);
    }

    public DateAttributeFilter getDateFilter(int attrTypeIndex) {
        return dateFilters.get(attrTypeIndex);
    }

    public void addStringFilter(int attrTypeIndex, StringAttributeFilter filter) {
        stringFilters.put(attrTypeIndex, filter);
    }

    public StringAttributeFilter getStringFilter(int attrTypeIndex) {
        return stringFilters.get(attrTypeIndex);
    }
}
