package cz.zcu.kiv.offscreen.graph.loader;

import cz.zcu.kiv.offscreen.graph.Attribute;
import cz.zcu.kiv.offscreen.graph.EdgeArchetypeInfo;
import cz.zcu.kiv.offscreen.graph.GraphManager;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Class loads json file with graph data.
 * @author Stepan Baratta
 */
public class GraphJSONDataLoader {

    private File file;
    private String loadedJSON;

    private GraphManager graphManager;

    /**
     * stores archetypes of vertices, key is the vertex id, value is the index of its archetype
     */
    private HashMap<Integer, Integer> vertexArchetypes = new HashMap<Integer, Integer>();

    static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    public GraphJSONDataLoader(File file) {
        this.file = file;
    }

    private void loadJSON() throws IOException {
        loadedJSON = FileUtils.readFileToString(file, "UTF-8");
    }

    public GraphManager LoadData() throws IOException {
        this.graphManager = new GraphManager();

        loadJSON();
        JSONObject json = JSONObject.fromObject(loadedJSON);

        JSONArray attributeTypes = getLoadedAttributeTypes(json);

        loadVertexArchetypes(json);

        loadEdgeArchetypes(json);

        loadVertices(attributeTypes, json);

        loadEdges(attributeTypes, json);

        return graphManager;
    }

    /**
     * Returns the json array with the loaded attribute types.
     * Adds the attributes to the list of all attribute types.
     * @param json
     * @return - Json array with the attribute types.
     */
    private JSONArray getLoadedAttributeTypes(JSONObject json) {
        JSONArray attributeTypes = json.getJSONArray("attributeTypes");
        for (int i = 0; i < attributeTypes.size(); i++) {
            JSONObject attributeType = attributeTypes.getJSONObject(i);
            String dataTypeString = attributeType.getString("dataType");
            GraphManager.AttributeDataType dataType;
            switch (dataTypeString) {
                case "number": dataType = GraphManager.AttributeDataType.NUMBER; break;
                case "date": dataType = GraphManager.AttributeDataType.DATE; break;
                case "enum": dataType = GraphManager.AttributeDataType.ENUM; break;
                default: dataType = GraphManager.AttributeDataType.STRING; break;
            }
            graphManager.addAttributeType(attributeType.getString("name"), dataType, attributeType.getString("text"));
        }

        return attributeTypes;
    }

    /**
     * Loads the vertex archetypes from the json and adds them to all vertex archetypes.
     * @param json
     */
    private void loadVertexArchetypes(JSONObject json) {
        JSONArray vertexArchetypes = json.getJSONArray("vertexArchetypes");
        for (int i = 0; i < vertexArchetypes.size(); i++) {
            JSONObject vertexArchetype = vertexArchetypes.getJSONObject(i);

            graphManager.addVertexArchetype(vertexArchetype.getString("name"), vertexArchetype.getString("text"));
        }
    }

    /**
     * Loads the edge archetypes from the json and adds them to all edge archetypes.
     * @param json
     */
    private void loadEdgeArchetypes(JSONObject json) {
        JSONArray edgeArchetypes = json.getJSONArray("edgeArchetypes");
        for (int i = 0; i < edgeArchetypes.size(); i++) {
            JSONObject edgeArchetype = edgeArchetypes.getJSONObject(i);

            graphManager.addEdgeArchetype(edgeArchetype.getString("name"), edgeArchetype.getString("text"));
        }
    }

    /**
     * Loads the vertices from the json and adds them to the list of all vertices.
     * @param attributeTypes - json array with the attribute types
     * @param json
     */
    private void loadVertices(JSONArray attributeTypes, JSONObject json) {
        JSONArray verticesObject = json.getJSONArray("vertices");
        for (int i = 0; i < verticesObject.size(); i++) {
            JSONObject vertexObject = verticesObject.getJSONObject(i);
            String name = vertexObject.getString("title");
            String text = vertexObject.getString("text");
            int archetypeIndex = vertexObject.getInt("archetype");
            int vertexId = vertexObject.getInt("id");
            vertexArchetypes.put(vertexId, archetypeIndex);

            JSONObject attributesObject = vertexObject.getJSONObject("attributes");
            Map<Integer, Attribute> attributes = loadObjectAttributes(attributesObject, attributeTypes);

            graphManager.addVertex(vertexId, name, text, archetypeIndex, attributes);
        }
    }

    /**
     * Loads the edges from the json and adds them to the list of all edges.
     * @param attributeTypes - List of attributes
     * @param json
     */
    private void loadEdges(JSONArray attributeTypes, JSONObject json) {
        JSONArray edgesObject = json.getJSONArray("edges");
        for (int i = 0; i < edgesObject.size(); i++) {
            JSONObject edgeObject = edgesObject.getJSONObject(i);
            int edgeId = edgeObject.getInt("id");
            int from = edgeObject.getInt("from");
            int to = edgeObject.getInt("to");
            String text = edgeObject.getString("text");
            int archetypeIndex = edgeObject.getInt("archetype");
            int fromArchetypeIndex = vertexArchetypes.get(from);
            int toArchetypeIndex = vertexArchetypes.get(to);

            JSONObject attributesObject = edgeObject.getJSONObject("attributes");
            Map<Integer, Attribute> attributes = loadObjectAttributes(attributesObject, attributeTypes);

            EdgeArchetypeInfo archetypeInfo = new EdgeArchetypeInfo(fromArchetypeIndex, archetypeIndex, toArchetypeIndex);
            graphManager.addEdge(edgeId, from, to, text, archetypeInfo, attributes);
        }
    }

    /**
     * Loads all the attributes for the json object.
     * @param attributesObject - json object for which to get the attributes
     * @param attributeTypes - All types of attributes
     * @return Map of attributes for the json object
     */
    private Map<Integer, Attribute> loadObjectAttributes(JSONObject attributesObject, JSONArray attributeTypes) {
        Map<Integer, Attribute> attributes = new HashMap<>();
        for (Object attributeKey : attributesObject.keySet()) {
            Object attrValue = loadAttributeFromObject((String)attributeKey, attributeTypes, attributesObject);

            int attributeTypeIndex = Integer.parseInt((String)attributeKey);
            attributes.put(attributeTypeIndex, new Attribute(attributeTypeIndex, attrValue));
        }

        return attributes;
    }

    /**
     * Loads single attribute from the json object
     * @param attributeIdString - Attribute id as key
     * @param attributeTypes - All the attributes types
     * @param attributesObject - Object containing all the attributes for the current object
     * @return Value of the attribute
     */
    private Object loadAttributeFromObject(String attributeIdString, JSONArray attributeTypes, JSONObject attributesObject) {
        int attributeId = Integer.parseInt(attributeIdString);
        String attrType = attributeTypes.getJSONObject(attributeId).getString("dataType");
        Object attrValue;
        switch (attrType) {
            case "number":
                String val = attributesObject.getString(attributeIdString);
                attrValue = new BigDecimal(val);
                break;
            case "date":
                String dateStr = attributesObject.getString(attributeIdString);
                SimpleDateFormat format = new SimpleDateFormat(GraphJSONDataLoader.DATETIME_FORMAT);
                attrValue = format.parse(dateStr, new ParsePosition(0));
                break;
            case "enum":
                List<String> enumValues = new ArrayList<>();
                JSONArray enumValuesArray = attributesObject.optJSONArray(attributeIdString);
                if (enumValuesArray == null) {
                    enumValues.add(attributesObject.getString(attributeIdString)); // Only one value present
                } else {
                    for (int j = 0; j < enumValuesArray.size(); j++) {
                        enumValues.add(enumValuesArray.getString(j));
                    }
                }

                graphManager.addUniquePossibleAttributeValues(attributeId, enumValues);
                attrValue = graphManager.getEnumPositionsForAttrIndex(attributeId, enumValues);

                break;
            default:
                attrValue = attributesObject.getString(attributeIdString);
                break;
        }

        return attrValue;
    }
}
