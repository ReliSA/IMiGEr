package cz.zcu.kiv.offscreen.graph.loader;

import cz.zcu.kiv.offscreen.api.AttributeDataType;
import cz.zcu.kiv.offscreen.api.AttributeType;
import cz.zcu.kiv.offscreen.graph.EdgeArchetypeInfo;
import cz.zcu.kiv.offscreen.graph.GraphManager;
import cz.zcu.kiv.offscreen.graph.filter.*;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.io.IOUtils;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Class is used to load the configuration file from disk.
 * The configuration file contains default filters, svgs for archetype icons
 * and other configurable application properties.
 *
 * @author Stepan Baratta
 */
public class JSONConfigLoader {

    private GraphManager graphManager;
    private JSONObject json;
    private File configFile;

    public JSONConfigLoader(GraphManager graphManager) {
        this(graphManager, new File("config.json"));
    }

    public JSONConfigLoader(GraphManager graphManager, File configFile) {
        this.graphManager = graphManager;
        this.configFile = configFile;
    }

    /**
     * Loads the default filter into the {@code GraphFilter} object.
     * @return {@code GraphFilter} with set values of the default filter.
     */
    public GraphFilter loadDefaultFilter() {
        GraphFilter filter = new GraphFilter();

        try {
            String filterJson = IOUtils.toString(getClass().getClassLoader().getResourceAsStream(configFile.getPath()), "UTF-8");

            json = JSONObject.fromObject(filterJson);

            JSONObject defaultFilter = json.getJSONObject("defaultFilter");
            JSONObject vertexArchetypeFilter = defaultFilter.getJSONObject("vertexArchetypeFilter");

            processVertexArchetypeFilters(filter, vertexArchetypeFilter);

            JSONObject edgeArchetypeFilter = defaultFilter.getJSONObject("edgeArchetypeFilter");

            processEdgeArchetypeFilters(filter, edgeArchetypeFilter);

            Object[][] vertexAttributeFilterStrings = loadAttributeFilters(defaultFilter.getJSONArray("vertexAttributeFilters"));

            createVertexAttributeFilters(filter, vertexAttributeFilterStrings);

            Object[][] edgeAttributeFilterStrings = loadAttributeFilters(defaultFilter.getJSONArray("edgeAttributeFilters"));

            createEdgeAttributeFilters(filter, edgeAttributeFilterStrings);

        } catch (IOException | NullPointerException e) {
            e.printStackTrace();
        }

        return filter;
    }

    /**
     * Loads the edge archetypes from the json object.
     * @param filter - Filter to be used.
     * @param edgeArchetypeFilter - Json object containing the edge archetype filters.
     */
    private void processEdgeArchetypeFilters(GraphFilter filter, JSONObject edgeArchetypeFilter) {
        JSONArray edgeFilterArchetypes = edgeArchetypeFilter.getJSONArray("archetypes");
        String[][][] edgeArchetypeStrings = new String[edgeFilterArchetypes.size()][][];

        for (int i = 0; i < edgeFilterArchetypes.size(); i++) {
            edgeArchetypeStrings[i] = new String[3][];

            JSONObject edgeFilterArchetype = edgeFilterArchetypes.getJSONObject(i);
            JSONArray fromArchetypes = edgeFilterArchetype.getJSONArray("fromArchetypes");

            edgeArchetypeStrings[i][0] = new String[fromArchetypes.size()];
            for (int j = 0; j < fromArchetypes.size(); j++) {
                edgeArchetypeStrings[i][0][j] = fromArchetypes.getString(j);
            }

            JSONArray edgeArchetypes = edgeFilterArchetype.getJSONArray("edgeArchetypes");
            edgeArchetypeStrings[i][1] = new String[edgeArchetypes.size()];
            for (int j = 0; j < edgeArchetypes.size(); j++) {
                edgeArchetypeStrings[i][1][j] = edgeArchetypes.getString(j);
            }

            JSONArray toArchetypes = edgeFilterArchetype.getJSONArray("toArchetypes");
            edgeArchetypeStrings[i][2] = new String[toArchetypes.size()];
            for (int j = 0; j < toArchetypes.size(); j++) {
                edgeArchetypeStrings[i][2][j] = toArchetypes.getString(j);
            }
        }

        String edgeArchetypeMatchType = edgeArchetypeFilter.getString("matchType");

        List<EdgeArchetypeInfo> edgeArchetypeFilterList = createEdgeArchetypeFilterList(edgeArchetypeStrings);

        filter.setEdgeArchetypeFilter(edgeArchetypeFilterList, GraphFilter.ArchetypeMatchType.valueOf(edgeArchetypeMatchType.toUpperCase()));
    }

    /**
     * Creates edge archetype filter list.
     * @param edgeArchetypeStrings -
     * @return
     */
    private List<EdgeArchetypeInfo> createEdgeArchetypeFilterList(String[][][] edgeArchetypeStrings) {
        List<EdgeArchetypeInfo> edgeArchetypeFilterList = new ArrayList<>();
        for (EdgeArchetypeInfo info : graphManager.edges.keySet()) {
            for (String[][] edgeArchetypeString : edgeArchetypeStrings) {
                boolean fromMatch = false;
                boolean edgeMatch = false;
                boolean toMatch = false;
                String fromArchetype = graphManager.vertexArchetypes.get(info.fromArchetypeIndex).name;
                String edgeArchetype = graphManager.edgeArchetypes.get(info.edgeArchetypeIndex).name;
                String toArchetype = graphManager.vertexArchetypes.get(info.toArchetypeIndex).name;
                for (int j = 0; j < edgeArchetypeString[0].length; j++) {
                    fromMatch = (fromMatch || fromArchetype.equals(edgeArchetypeString[0][j]));
                }
                for (int j = 0; j < edgeArchetypeString[1].length; j++) {
                    edgeMatch = (edgeMatch || edgeArchetype.equals(edgeArchetypeString[1][j]));
                }
                for (int j = 0; j < edgeArchetypeString[2].length; j++) {
                    toMatch = (toMatch || toArchetype.equals(edgeArchetypeString[2][j]));
                }
                if (fromMatch && edgeMatch && toMatch) {
                    edgeArchetypeFilterList.add(new EdgeArchetypeInfo(info.fromArchetypeIndex, info.edgeArchetypeIndex, info.toArchetypeIndex));
                }
            }
        }
        return edgeArchetypeFilterList;
    }

    /**
     * Loads the vertex archetypes from the json object.
     * @param filter - Filter to be used.
     * @param vertexArchetypeFilter - Json object with the vertex archetype filters.
     */
    private void processVertexArchetypeFilters(GraphFilter filter, JSONObject vertexArchetypeFilter) {
        JSONArray archetypes = vertexArchetypeFilter.getJSONArray("archetypes");

        String[] vertexArchetypeStrings = new String[archetypes.size()];
        for (int i = 0; i < archetypes.size(); i++) {
            vertexArchetypeStrings[i] = archetypes.get(i).toString();
        }

        List<Integer> vertexArchetypeFilterList = new ArrayList<>();
        for (int i = 0; i < graphManager.vertexArchetypes.size(); i++) {
            for (String vertexArchetypeString : vertexArchetypeStrings) {
                if (graphManager.vertexArchetypes.get(i).name.equals(vertexArchetypeString)) {
                    vertexArchetypeFilterList.add(i);
                }
            }
        }

        String vertexArchetypeMatchType = vertexArchetypeFilter.getString("matchType");

        filter.setVertexArchetypeFilter(vertexArchetypeFilterList, GraphFilter.ArchetypeMatchType.valueOf(vertexArchetypeMatchType.toUpperCase()));
    }

    /**
     * Loads attribute filters from json array.
     * @param attributeFilters - Json array with the attribute filters.
     */
    private Object[][] loadAttributeFilters(JSONArray attributeFilters) {
        Object[][] attributeFilterStrings = new Object[attributeFilters.size()][3];

        for (int i = 0; i < attributeFilters.size(); i++) {
            JSONObject attributeFilter = attributeFilters.getJSONObject(i);
            String archetypeName = attributeFilter.getString("archetype");
            String attributeName = attributeFilter.getString("attributeName");

            attributeFilterStrings[i][0] = archetypeName;
            attributeFilterStrings[i][1] = attributeName;

            JSONObject attributeFilterInfo = attributeFilter.getJSONObject("filter");
            String filterMatchType = attributeFilterInfo.getString("matchType");

            AttributeType attrType = graphManager.getAttributeDataTypeByName(attributeName);
            switch (attrType.dataType) {
                case ENUM:
                    attributeFilterStrings[i][2] = getEnumAttributeFilter(attributeName, attributeFilterInfo, GraphFilter.EnumMatchType.valueOf(filterMatchType.toUpperCase()));
                    break;
                case NUMBER:
                    attributeFilterStrings[i][2] = getNumberAttributeFilter(attributeFilterInfo, GraphFilter.NumberMatchType.valueOf(filterMatchType.toUpperCase()));
                    break;
                case DATE:
                    attributeFilterStrings[i][2] = getDateAttributeFilter(attributeFilterInfo, GraphFilter.DateMatchType.valueOf(filterMatchType.toUpperCase()));
                    break;
                case STRING:
                    attributeFilterStrings[i][2] = getStringAttributeFilter(attributeFilterInfo, GraphFilter.StringMatchType.valueOf(filterMatchType.toUpperCase()));
                    break;
            }
        }

        return attributeFilterStrings;
    }

    /**
     * Sets the filtering objects from vertexAttributeFilterStrings to the graph filter object.
     * @param filter - Graph filter object
     * @param vertexAttributeFilterStrings - Array with attribute filter parameters (Archetype name, attribute name, filter object)
     */
    private void createVertexAttributeFilters(GraphFilter filter, Object[][] vertexAttributeFilterStrings) {
        for (Object[] vertexAttributeFilterString : vertexAttributeFilterStrings) {
            int archetypeIndex = graphManager.getVertexArchetypeIndex(vertexAttributeFilterString[0].toString());
            int attributeIndex = graphManager.getAttributeIndex(vertexAttributeFilterString[1].toString());
            AttributeDataType type = graphManager.attributeTypes.get(attributeIndex).dataType;
            switch (type) {
                case NUMBER:
                    NumberAttributeFilter nf = (NumberAttributeFilter) vertexAttributeFilterString[2];
                    filter.setVertexNumberAttributeFilter(archetypeIndex, attributeIndex, nf.getMin(), nf.getMax(), nf.isMinInclusive(), nf.isMaxInclusive(), nf.getMatchType());
                    break;
                case DATE:
                    DateAttributeFilter df = (DateAttributeFilter) vertexAttributeFilterString[2];
                    filter.setVertexDateAttributeFilter(archetypeIndex, attributeIndex, df.getMin(), df.getMax(), df.isMinInclusive(), df.isMaxInclusive(), df.getMatchType());
                    break;
                case STRING:
                    StringAttributeFilter sf = (StringAttributeFilter) vertexAttributeFilterString[2];
                    filter.setVertexStringAttributeFilter(archetypeIndex, attributeIndex, sf.getFilterValue(), sf.getMatchType());
                    break;
                case ENUM:
                    EnumAttributeFilter ef = (EnumAttributeFilter) vertexAttributeFilterString[2];
                    filter.setVertexEnumAttributeFilter(archetypeIndex, attributeIndex, ef.getValueIndices(), ef.getMatchType());
                    break;
            }
        }
    }

    /**
     * Sets the filtering objects from edgeAttributeFilterStrings to the graph filter object
     * @param filter - Graph filter object
     * @param edgeAttributeFilterStrings - Array with attribute filter parameters (Archetype name, attribute name, filter object)
     */
    private void createEdgeAttributeFilters(GraphFilter filter, Object[][] edgeAttributeFilterStrings) {
        for (Object[] edgeAttributeFilterString : edgeAttributeFilterStrings) {
            int archetypeIndex = graphManager.getEdgeArchetypeIndex(edgeAttributeFilterString[0].toString());
            int attributeIndex = graphManager.getAttributeIndex(edgeAttributeFilterString[1].toString());
            AttributeDataType type = graphManager.attributeTypes.get(attributeIndex).dataType;
            switch (type) {
                case NUMBER:
                    NumberAttributeFilter nf = (NumberAttributeFilter) edgeAttributeFilterString[2];
                    filter.setEdgeNumberAttributeFilter(archetypeIndex, attributeIndex, nf.getMin(), nf.getMax(), nf.isMinInclusive(), nf.isMaxInclusive(), nf.getMatchType());
                    break;
                case DATE:
                    DateAttributeFilter df = (DateAttributeFilter) edgeAttributeFilterString[2];
                    filter.setEdgeDateAttributeFilter(archetypeIndex, attributeIndex, df.getMin(), df.getMax(), df.isMinInclusive(), df.isMaxInclusive(), df.getMatchType());
                    break;
                case STRING:
                    StringAttributeFilter sf = (StringAttributeFilter) edgeAttributeFilterString[2];
                    filter.setEdgeStringAttributeFilter(archetypeIndex, attributeIndex, sf.getFilterValue(), sf.getMatchType());
                    break;
                case ENUM:
                    EnumAttributeFilter ef = (EnumAttributeFilter) edgeAttributeFilterString[2];
                    filter.setEdgeEnumAttributeFilter(archetypeIndex, attributeIndex, ef.getValueIndices(), ef.getMatchType());
                    break;
            }
        }
    }

    /**
     * Creates new string attribute filter with filter value from the json object. and returns it.
     * @param vertexAttributeFilterInfo - Json object from which to extract the filter value.
     * @param matchType - Type of matching in the filter.
     * @return - new String attribute filter object.
     */
    private StringAttributeFilter getStringAttributeFilter(JSONObject vertexAttributeFilterInfo, GraphFilter.StringMatchType matchType) {
        String filterValue = vertexAttributeFilterInfo.getString("value");

        return new StringAttributeFilter(filterValue, matchType);
    }

    /**
     * Creates new date attribute filter with filter value from the json object. and returns it.
     * @param vertexAttributeFilterInfo - Json object from which to extract the filter value.
     * @param matchType- Type of matching in the filter.
     * @return - new Date attribute filter object.
     */
    private DateAttributeFilter getDateAttributeFilter(JSONObject vertexAttributeFilterInfo, GraphFilter.DateMatchType matchType) {
        String min = vertexAttributeFilterInfo.getString("min");
        String max = vertexAttributeFilterInfo.getString("max");
        boolean minInclusive = vertexAttributeFilterInfo.getBoolean("minInclusive");
        boolean maxInclusive = vertexAttributeFilterInfo.getBoolean("maxInclusive");

        SimpleDateFormat format = new SimpleDateFormat(GraphJSONDataLoader.DATETIME_FORMAT);
        Date minDate, maxDate;

        minDate = format.parse(min, new ParsePosition(0));
        maxDate = format.parse(max, new ParsePosition(0));

        return new DateAttributeFilter(minDate, maxDate, minInclusive, maxInclusive, matchType);
    }

    /**
     * Creates new number attribute filter with filter value from the json object. and returns it.
     * @param vertexAttributeFilterInfo - Json object from which to extract the filter value.
     * @param matchType - Type of matching in the filter.
     * @return - new Number attribute filter object.
     */
    private NumberAttributeFilter getNumberAttributeFilter(JSONObject vertexAttributeFilterInfo, GraphFilter.NumberMatchType matchType) {
        BigDecimal min = new BigDecimal(vertexAttributeFilterInfo.getInt("min"));
        BigDecimal max = new BigDecimal(vertexAttributeFilterInfo.getInt("max"));
        boolean minInclusive = vertexAttributeFilterInfo.getBoolean("minInclusive");
        boolean maxInclusive = vertexAttributeFilterInfo.getBoolean("maxInclusive");

        return new NumberAttributeFilter(min, max, minInclusive, maxInclusive, matchType);
    }

    /**
     * Loads all the enum values for filtering and returns a list of indexes for those enum values.
     * @param vertexAttributeName - Name of the vertex attribute for which to get the enum values.
     * @param vertexAttributeFilterInfo - Json object containing the enum values.
     * @return Enum attribute filter.
     */
    private EnumAttributeFilter getEnumAttributeFilter(String vertexAttributeName, JSONObject vertexAttributeFilterInfo, GraphFilter.EnumMatchType matchType) {
        List<Integer> valueIndices = new ArrayList<>();

        JSONArray values = vertexAttributeFilterInfo.getJSONArray("values");
        for (int j = 0; j < values.size(); j++) {
            String value = values.getString(j);
            int index = graphManager.getEnumValueIndex(graphManager.getAttributeIndex(vertexAttributeName), value);
            valueIndices.add(index);
        }

        return new EnumAttributeFilter(valueIndices, matchType);
    }

    /**
     * Loads the archetype icons from the configuration file.
     * @return -  Map where key is the name of archetype icon and the value is the svg description.
     */
    public Map<String, String> loadArchetypeIcons() {
        Map<String, String> archetypeIcons = new HashMap<>();

        if (json != null){
            JSONArray archetypeIconsJson = json.getJSONArray("archetypeIcons");
            for (int i = 0; i < archetypeIconsJson.size(); i++) {
                JSONObject icon = archetypeIconsJson.getJSONObject(i);
                String archetypeName = icon.getString("name");
                String iconSvg = icon.getString("value");

                archetypeIcons.put(archetypeName, iconSvg);
            }
        }
        return archetypeIcons;
    }

    /**
     * Loads default group archetypes.
     * @return list of indices of archetypes.
     */
    public List<Integer> loadGroupArchetypes() {
        List<Integer> defaultGroupArchetypes = new ArrayList<>();

        if(json != null) {
            JSONArray defaultGroupArchetypesJson = json.getJSONArray("defaultGroupArchetypes");
            for (int i = 0; i < defaultGroupArchetypesJson.size(); i++) {
                String archetype = defaultGroupArchetypesJson.get(i).toString();
                defaultGroupArchetypes.add(graphManager.getVertexArchetypeIndex(archetype));
            }
        }

        return defaultGroupArchetypes;
    }

    /**
     * Loads default group archetypes and return them in a list.
     * @return list of archetypes.
     */
    public List<String> loadGroupArchetypesStrings(){
        List<String> groupArchetypes = new ArrayList<>();

        if (json != null) {
            JSONArray defaultGroupArchetypesJson = json.getJSONArray("defaultGroupArchetypes");
            for (Object jsonItem : defaultGroupArchetypesJson) {
                groupArchetypes.add(jsonItem.toString());
            }
        }
        return groupArchetypes;
    }
}
