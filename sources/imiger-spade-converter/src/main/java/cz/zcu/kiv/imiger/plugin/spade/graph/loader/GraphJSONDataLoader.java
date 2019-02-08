package cz.zcu.kiv.imiger.plugin.spade.graph.loader;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import cz.zcu.kiv.imiger.vo.AttributeDataType;
import cz.zcu.kiv.imiger.plugin.spade.graph.Attribute;
import cz.zcu.kiv.imiger.plugin.spade.graph.EdgeArchetypeInfo;
import cz.zcu.kiv.imiger.plugin.spade.graph.GraphManager;
import org.apache.logging.log4j.util.Strings;

import java.math.BigDecimal;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Class loads json file with graph data.
 *
 * @author Stepan Baratta
 */
public class GraphJSONDataLoader {

    static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    private String loadedJSON;
    private GraphManager graphManager;

    /**
     * stores archetypes of vertices, key is the vertex id, value is the index of its archetype
     */
    private HashMap<Integer, Integer> vertexArchetypes = new HashMap<>();


    public GraphJSONDataLoader(String json) {
        loadedJSON = json;
    }

    /**
     * Method load graph from parameters from constructor or null when data are invalid.
     *
     * @return GraphManager of loaded graph or null.
     */
    public GraphManager loadData() {
        this.graphManager = new GraphManager();

        if (Strings.isBlank(loadedJSON)) {
            return null;
        }
        JsonObject json = new JsonParser().parse(loadedJSON).getAsJsonObject();

        JsonArray attributeTypes = getLoadedAttributeTypes(json);

        loadVertexArchetypes(json);

        loadEdgeArchetypes(json);

        loadVertices(attributeTypes, json);

        loadEdges(attributeTypes, json);

        return graphManager;
    }

    /**
     * Returns the json array with the loaded attribute types.
     * Adds the attributes to the list of all attribute types.
     *
     * @param json array of loaded graph
     * @return - Json array with the attribute types.
     */
    private JsonArray getLoadedAttributeTypes(JsonObject json) {

        JsonArray attributeTypes = json.getAsJsonArray("attributeTypes");
        for (JsonElement attributeTypeElement : attributeTypes) {
            if (attributeTypeElement.isJsonNull()) continue;

            JsonObject attributeType = attributeTypeElement.getAsJsonObject();
            String dataTypeString = attributeType.get("dataType").getAsString();

            AttributeDataType dataType = AttributeDataType.getEnum(dataTypeString);

            graphManager.addAttributeType(attributeType.get("name").getAsString(), dataType, attributeType.get("text").getAsString());
        }

        return attributeTypes;
    }

    /**
     * Loads the vertex archetypes from the json and adds them to all vertex archetypes.
     *
     * @param json array of loaded graph
     */
    private void loadVertexArchetypes(JsonObject json) {
        JsonArray vertexArchetypes = json.getAsJsonArray("vertexArchetypes");

        for (JsonElement vertexArchetypeElement : vertexArchetypes) {
            if (vertexArchetypeElement.isJsonNull()) continue;

            JsonObject vertexArchetype = vertexArchetypeElement.getAsJsonObject();
            graphManager.addVertexArchetype(vertexArchetype.get("name").getAsString(), vertexArchetype.get("text").getAsString());
        }
    }

    /**
     * Loads the edge archetypes from the json and adds them to all edge archetypes.
     *
     * @param json array of loaded graph
     */
    private void loadEdgeArchetypes(JsonObject json) {
        JsonArray edgeArchetypes = json.getAsJsonArray("edgeArchetypes");
        for (JsonElement edgeArchetypeElement : edgeArchetypes) {
            if (edgeArchetypeElement.isJsonNull()) continue;
            JsonObject edgeArchetype = edgeArchetypeElement.getAsJsonObject();

            graphManager.addEdgeArchetype(edgeArchetype.get("name").getAsString(), edgeArchetype.get("text").getAsString());
        }
    }

    /**
     * Loads the vertices from the json and adds them to the list of all vertices.
     *
     * @param attributeTypes - json array with the attribute types
     * @param json           array of loaded graph
     */
    private void loadVertices(JsonArray attributeTypes, JsonObject json) {
        JsonArray verticesObject = json.getAsJsonArray("vertices");
        for (JsonElement vertexElement : verticesObject) {
            if (vertexElement.isJsonNull()) continue;
            JsonObject vertexObject = vertexElement.getAsJsonObject();

            String name = vertexObject.get("title").getAsString();
            String text = vertexObject.get("text").getAsString();
            int archetypeIndex = vertexObject.get("archetype").getAsShort();
            int vertexId = vertexObject.get("id").getAsInt();

            vertexArchetypes.put(vertexId, archetypeIndex);

            JsonObject attributesObject = vertexObject.getAsJsonObject("attributes");
            Map<Integer, Attribute> attributes = loadObjectAttributes(attributesObject, attributeTypes);

            graphManager.addVertex(vertexId, name, text, archetypeIndex, attributes);
        }
    }

    /**
     * Loads the edges from the json and adds them to the list of all edges.
     *
     * @param attributeTypes - List of attributes
     * @param json           array of loaded graph
     */
    private void loadEdges(JsonArray attributeTypes, JsonObject json) {
        JsonArray edgesObject = json.getAsJsonArray("edges");

        for (JsonElement edgeElement : edgesObject) {
            if (edgeElement.isJsonNull()) continue;
            JsonObject edgeObject = edgeElement.getAsJsonObject();

            int edgeId = edgeObject.get("id").getAsInt();
            int from = edgeObject.get("from").getAsInt();
            int to = edgeObject.get("to").getAsInt();
            String text = edgeObject.get("text").getAsString();
            int archetypeIndex = edgeObject.get("archetype").getAsInt();

            int fromArchetypeIndex = vertexArchetypes.get(from);
            int toArchetypeIndex = vertexArchetypes.get(to);

            JsonObject attributesObject = edgeObject.getAsJsonObject("attributes");
            Map<Integer, Attribute> attributes = loadObjectAttributes(attributesObject, attributeTypes);

            EdgeArchetypeInfo archetypeInfo = new EdgeArchetypeInfo(fromArchetypeIndex, archetypeIndex, toArchetypeIndex);
            graphManager.addEdge(edgeId, from, to, text, archetypeInfo, attributes);
        }
    }

    /**
     * Loads all the attributes for the json object.
     *
     * @param attributesObject - json object for which to get the attributes
     * @param attributeTypes   - All types of attributes
     * @return Map of attributes for the json object
     */
    private Map<Integer, Attribute> loadObjectAttributes(JsonObject attributesObject, JsonArray attributeTypes) {
        Map<Integer, Attribute> attributes = new HashMap<>();

        for (Map.Entry<String, JsonElement> attribute : attributesObject.entrySet()) {
            Object attrValue = loadAttributeFromObject(attribute, attributeTypes);

            int attributeTypeIndex = Integer.parseInt(attribute.getKey());
            attributes.put(attributeTypeIndex, new Attribute(attributeTypeIndex, attrValue));
        }

        return attributes;
    }

    /**
     * Loads single attribute from the json object
     *
     * @param attribute      - Attribute
     * @param attributeTypes - All the attributes types
     * @return Value of the attribute
     */
    private Object loadAttributeFromObject(Map.Entry<String, JsonElement> attribute, JsonArray attributeTypes) {

        int attributeId = Integer.parseInt(attribute.getKey());
        String attrType = attributeTypes.get(attributeId).getAsJsonObject().get("dataType").getAsString();
        Object attrValue;
        switch (attrType) {
            case "number":
                String val = attribute.getValue().getAsString();
                attrValue = new BigDecimal(val);
                break;
            case "date":
                String dateStr = attribute.getValue().getAsString();
                SimpleDateFormat format = new SimpleDateFormat(GraphJSONDataLoader.DATETIME_FORMAT);
                attrValue = format.parse(dateStr, new ParsePosition(0));
                break;
            case "enum":
                List<String> enumValues = new ArrayList<>();

                if (attribute.getValue().isJsonArray()) {

                    JsonArray enumValuesArray = attribute.getValue().getAsJsonArray();
                    for (JsonElement element : enumValuesArray) {
                        enumValues.add(element.isJsonNull() ? "" : element.getAsString());
                    }

                } else {
                    enumValues.add(attribute.getValue().getAsString()); // Only one value present
                }

                graphManager.addUniquePossibleAttributeValues(attributeId, enumValues);
                attrValue = graphManager.getEnumPositionsForAttrIndex(attributeId, enumValues);

                break;
            default:
                StringBuilder elements = new StringBuilder();
                if (attribute.getValue().isJsonArray()) {

                    for (JsonElement element : attribute.getValue().getAsJsonArray()) {
                        if (element.isJsonNull()) continue;
                        if (elements.length() != 0) {
                            elements.append(", ");
                        }
                        elements.append(element.getAsString());
                    }
                    attrValue = elements.toString();

                } else {
                    attrValue = attribute.getValue().getAsString();
                }
                break;
        }

        return attrValue;
    }
}
