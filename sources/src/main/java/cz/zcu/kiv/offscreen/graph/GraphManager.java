package cz.zcu.kiv.offscreen.graph;

import cz.zcu.kiv.offscreen.api.*;
import cz.zcu.kiv.offscreen.graph.filter.*;
import cz.zcu.kiv.offscreen.graph.loader.JSONConfigLoader;

import java.util.*;

public class GraphManager {

    public List<VertexArchetype> vertexArchetypes = new ArrayList<>();
    public List<EdgeArchetype> edgeArchetypes = new ArrayList<>();
    public List<AttributeType> attributeTypes = new ArrayList<>();

    /**
     * the key is the attributeType index, the value is the list of possible values
     */
    private Map<Integer, List<String>> possibleEnumValues = new HashMap<>();

    /**
     * key is the archetype index, value is the set of vertices of the given archetype
     */
    public Map<Integer, HashSet<VertexImpl>> vertices = new HashMap<>();

    /**
     * key is the triplet of archetypes {fromVertex, edge, toVertex}, value is the list of edges for the given archetype triplet
     */
    public Map<EdgeArchetypeInfo, List<EdgeImpl>> edges = new HashMap<>();

    public void addVertexArchetype(String name, String text) {
        vertexArchetypes.add(new VertexArchetype(name, text));
    }

    public void addEdgeArchetype(String name, String text) {
        edgeArchetypes.add(new EdgeArchetype(name, text));
    }


    public void addAttributeType(String name, AttributeDataType dataType, String text) {
        attributeTypes.add(new AttributeType(name, dataType, text));
    }

    /**
     * Adds a list of values to the possible values hashmap. All duplicated are
     * removed.
     *
     * @param attributeTypeId - Id of attribute type
     * @param values          - List of values of the corresponding attribute type
     */
    public void addUniquePossibleAttributeValues(int attributeTypeId, List<String> values) {
        if (possibleEnumValues.containsKey(attributeTypeId)) {
            List<String> attrValues = possibleEnumValues.get(attributeTypeId);
            List<String> valuesWithoutDuplicates = new ArrayList<>(new HashSet<>(values)); // Converting to hashset removes duplicates
            valuesWithoutDuplicates.removeAll(attrValues);   // Values to add without values already present in the hashmap
            attrValues.addAll(valuesWithoutDuplicates);
        } else {
            possibleEnumValues.put(attributeTypeId, values);
        }
    }

    public List<Integer> getEnumPositionsForAttrIndex(int attributeTypeId, List<String> enumValues) {
        List<Integer> positions = new ArrayList<>();
        if (!possibleEnumValues.containsKey(attributeTypeId)) {
            return positions;
        }

        List<String> possibleValues = possibleEnumValues.get(attributeTypeId);
        for (int i = 0; i < possibleValues.size(); i++) {
            String possibleValue = possibleValues.get(i);
            if (enumValues.contains(possibleValue)) {
                positions.add(i);
            }
        }

        return positions;
    }

    /**
     * Gets string values from possible enums for attribute type id.
     * @param attributeTypeId - Id of the attribute type
     * @param valuePositions - List of positions in the possible enums hashmap for which to find the enum values.
     * @return - List of string values of enums.
     */
    private List<String> getEnumStringsForAttrIndex(int attributeTypeId, List<Integer> valuePositions) {
        List<String> values = new ArrayList<>();

        List<String> possibleValues = possibleEnumValues.get(attributeTypeId);
        for (int i = 0; i < possibleValues.size(); i++) {
            if (valuePositions.contains(i)) {
                values.add(possibleValues.get(i));
            }
        }

        return values;
    }

    public AttributeType getAttributeDataTypeByName(String attributeName) {
        return attributeTypes.get(getAttributeIndex(attributeName));
    }

    /**
     * Adds a record to the possibleEnumValues hashset of the attributes possible values.
     *
     * @param attributeIndex - Index of the attribute for which to add the possible values
     * @param possibleValues - All the possible values of the attribute
     */
    public void addEnumValues(int attributeIndex, List<String> possibleValues) {
        possibleEnumValues.put(attributeIndex, possibleValues);
    }

    /**
     * Creates a new vertex from input parameters and adds it to the map of
     * vertices with the archetypeIndex as the key.
     *
     * @param id             - ID of the vertex to add
     * @param name           - Name of the vertex
     * @param text           - Text of the vertex
     * @param archetypeIndex - Type of archetype associated with this vertex
     * @param attributes     - Map of attributes associated with the vertex
     */
    public void addVertex(int id, String name, String text, int archetypeIndex, Map<Integer, Attribute> attributes) {
        VertexImpl vertexToAdd = new VertexImpl(id, name, archetypeIndex, text);
        if (vertices.containsKey(archetypeIndex)) {
            vertices.get(archetypeIndex).add(vertexToAdd);
        } else {
            HashSet<VertexImpl> vertexSet = new HashSet<>();
            vertexSet.add(vertexToAdd);
            vertices.put(archetypeIndex, vertexSet);
        }

        vertexToAdd.addAttributes(attributes);
    }

    /**
     * Creates a new edge from input parameters and adds it to the map of
     * edges with the archetypeIndex as the key.
     *
     * @param id            - ID of the edge to add
     * @param from          - ID of the vertex the edge comes from
     * @param to            - ID of the vertex the edge points to
     * @param text          - Text of edge
     * @param archetypeInfo - The archetype information associated with this edge
     * @param attributes    - Map of attributes associated with the edge
     */
    public void addEdge(int id, int from, int to, String text, EdgeArchetypeInfo archetypeInfo, Map<Integer, Attribute> attributes) {
        EdgeImpl edgeToAdd = new EdgeImpl(id, from, to, text, id, archetypeInfo.edgeArchetypeIndex);
        edgeToAdd.addAttributes(attributes);

        if (edges.containsKey(archetypeInfo)) {
            edges.get(archetypeInfo).add(edgeToAdd);
        } else {
            List<EdgeImpl> edgesList = new ArrayList<>();
            edgesList.add(edgeToAdd);
            edges.put(archetypeInfo, edgesList);
        }
    }

    /**
     * returns the index of a given enum value in the list of the possible enum values
     * @param value the enum value
     * @return index in the list of possible enum values or -1 if the value is not in the list
     */
    public int getEnumValueIndex(int attributeTypeIndex, String value) {
        int index = -1;
        List<String> values = possibleEnumValues.get(attributeTypeIndex);
        for (int i = 0; i < values.size(); i++) {
            if (values.get(i).equals(value)) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * returns the index of an attribute with a given name in the attributeTypes list
     * @param name the name of the attribute
     * @return the attribute index or -1 if there is no attribute with such a name
     */
    public int getAttributeIndex(String name) {
        int index = -1;
        for (int i = 0; i < attributeTypes.size(); i++) {
            if (attributeTypes.get(i).name.equals(name)) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * returns the index of an archetype with a given name in the vertexArchetypes list
     * @param archetypeName name of the archetype
     * @return the index or -1 if there is no archetype with the given name in the list
     */
    public int getVertexArchetypeIndex(String archetypeName) {
        int index = -1;
        for (int i = 0; i < vertexArchetypes.size(); i++) {
            if (vertexArchetypes.get(i).name.equals(archetypeName)) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * returns the index of an archetype with a given name in the edgeArchetypes list
     * @param archetypeName name of the archetype
     * @return the index or -1 if there is no archetype with the given name in the list
     */
    public int getEdgeArchetypeIndex(String archetypeName) {
        int index = -1;
        for (int i = 0; i < edgeArchetypes.size(); i++) {
            if (edgeArchetypes.get(i).name.equals(archetypeName)) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * Filters the edges and vertices according to the default filter loaded from the configuration file
     * and constructs the {@code Graph} object.
     * @param configLoader - The object that loads the configuration file.
     * @return - Constructed {@code Graph} object.
     */
    public Graph createGraph(JSONConfigLoader configLoader) {
        Graph graph = new Graph();

        // To use default filter from a configuration file
        GraphFilter filter = configLoader.loadDefaultFilter();
        if (filter == null) {
            // To Enable Everything
            filter = new GraphFilter();
            filter.setVertexArchetypeFilter(new ArrayList<>(), GraphFilter.ArchetypeMatchType.NON_MATCHING);
            filter.setEdgeArchetypeFilter(new ArrayList<>(), GraphFilter.ArchetypeMatchType.NON_MATCHING);
        }


        Set<VertexImpl> resultVertices = getVerticesByArchetypeFilter(filter);
        resultVertices = getVerticesByAttributeFilter(filter, resultVertices);
        List<EdgeImpl> resultEdges = getEdgesByArchetypeFilter(filter, resultVertices);
        resultEdges = getEdgesByAttributeFilter(filter, resultEdges);

        addVerticesToGraph(graph, resultVertices);
        addEdgesToGraph(graph, resultEdges);

        Map<String, String> archetypeIcons = configLoader.loadArchetypeIcons();
        addVertexArchetypes(graph, archetypeIcons);
        graph.setEdgeArchetypes(edgeArchetypes);

        graph.setAttributeTypes(attributeTypes);
        graph.setPossibleEnumValues(possibleEnumValues);

        List<String> defaultGroupArchetypes = configLoader.loadGroupArchetypesStrings();
        addDefaultGroups(graph, defaultGroupArchetypes);

        return graph;
    }

    /**
     * Gets filtered vertices by attributes.
     * @param filter - Filter object.
     * @param vertices - List of vertices for filtration.
     * @return - List of vertices filtered by attribute.
     */
    private Set<VertexImpl> getVerticesByAttributeFilter(GraphFilter filter, Set<VertexImpl> vertices) {
        Set<VertexImpl> resultVertices = new HashSet<>();
        for (VertexImpl vertex : vertices) {
            boolean filterPassed = true;
            AttributeFilter attributeFilter = filter.getVertexAttributeFilter(vertex.getArchetype());
            if (attributeFilter != null) {
                // Iterate through all attributes of the vertex
                for (int attributeIndex : vertex.getAttributesMap().keySet()) {
                    Attribute vertexAttribute = vertex.getAttributesMap().get(attributeIndex);

                    filterPassed = (filterPassed && checkAttributeFiltersPassed(vertexAttribute, attributeFilter, attributeIndex));
                    if (!filterPassed) break;   // filter did not pass
                }
            }
            if (filterPassed)
                resultVertices.add(vertex);
        }
        return resultVertices;
    }

    /**
     * Gets filtered edges by attribute.
     * @param filter - Filter object.
     * @param edges - List of edges for filtration.
     * @return - List of edges filtered by attribute.
     */
    private List<EdgeImpl> getEdgesByAttributeFilter(GraphFilter filter, List<EdgeImpl> edges) {
        List<EdgeImpl> resultEdges = new ArrayList<>();
        for (EdgeImpl edge : edges) {
            boolean filterPassed = true;
            AttributeFilter attributeFilter = filter.getEdgeAttributeFilter(edge.getArchetype());
            if (attributeFilter != null) {
                // Iterate through all attributes of the edge
                for (int attributeIndex : edge.getAttributesMap().keySet()) {
                    Attribute edgeAttribute = edge.getAttributesMap().get(attributeIndex);

                    filterPassed = (filterPassed && checkAttributeFiltersPassed(edgeAttribute, attributeFilter, attributeIndex));
                    if (!filterPassed) break;   // filter did not pass
                }
            }
            if (filterPassed)
                resultEdges.add(edge);
        }

        return resultEdges;
    }

    /**
     * Filters the attribute by its attribute filters and checks if it passed.
     * @param vertexAttribute - Attribute object to filter.
     * @param attributeFilter - Attribute filter of the attribute.
     * @param attributeIndex - Index of the attribute.
     * @return - true if passed the filter, else false.
     */
    private boolean checkAttributeFiltersPassed(Attribute vertexAttribute, AttributeFilter attributeFilter, int attributeIndex) {
        AttributeDataType attributeType = attributeTypes.get(vertexAttribute.getTypeIndex()).dataType;

        boolean filterPassed;
        ITypeAttributeFilter typeFilter = null;
        switch (attributeType) {
            case NUMBER:
                typeFilter = attributeFilter.getNumberFilter(attributeIndex);
                break;
            case DATE:
                typeFilter = attributeFilter.getDateFilter(attributeIndex);
                break;
            case ENUM:
                typeFilter = attributeFilter.getEnumFilter(attributeIndex);
                break;
            case STRING:
                typeFilter = attributeFilter.getStringFilter(attributeIndex);
                break;
        }
        if (typeFilter == null) { // No filters mean pass
            return true;
        }

        filterPassed = typeFilter.filter(vertexAttribute.getValue());

        return filterPassed;
    }

    /**
     * Filters vertices by archetype from the specified filter object.
     *
     * @param filter - Filter to be applied to the vertices.
     * @return A list of vertices filtered by the specified filter object.
     */
    private HashSet<VertexImpl> getVerticesByArchetypeFilter(GraphFilter filter) {
        HashSet<VertexImpl> resultVertices = new HashSet<>();

        VertexArchetypeFilter vertexArchetypeFilter = filter.getVertexArchetypeFilter();
        List<Integer> archetypesFiltered = vertexArchetypeFilter.archetypeIndeces;
        switch (vertexArchetypeFilter.matchType) {
            case MATCHING:
                for (Integer vertexArchetypeIndex : vertices.keySet()){
                    if (archetypesFiltered.contains(vertexArchetypeIndex)) {
                        resultVertices.addAll(vertices.get(vertexArchetypeIndex));
                    }
                }
                break;
            case NON_MATCHING:
                for (Integer vertexArchetypeIndex : vertices.keySet()){
                    if (!archetypesFiltered.contains(vertexArchetypeIndex)) {
                        resultVertices.addAll(vertices.get(vertexArchetypeIndex));
                    }
                }
                break;
        }

        return resultVertices;
    }

    /**
     * Filters edges by archetype from the specified filter object. Also removes all edges that contain either a vertex
     * from which the edge originates or to which the edge leads.
     *
     * @param filter         - Filter to be applied to the edges list.
     * @param resultVertices - List of vertices which should be present in the result graph.
     * @return A list of edges filtered by the specified filter object
     */
    private List<EdgeImpl> getEdgesByArchetypeFilter(GraphFilter filter, Set<VertexImpl> resultVertices) {
        List<EdgeImpl> resultEdges = new ArrayList<>();

        EdgeArchetypeFilter edgeArchetypeFilter = filter.getEdgeArchetypeFilter();
        List<EdgeArchetypeInfo> edgeInfosFiltered = edgeArchetypeFilter.archetypeIndeces;
        switch (edgeArchetypeFilter.matchType) {
            case MATCHING:
                for (EdgeArchetypeInfo edgeInfo : edges.keySet()){
                    if (edgeInfosFiltered.contains(edgeInfo)) {
                        resultEdges.addAll(edges.get(edgeInfo));
                    }
                }
                break;
            case NON_MATCHING:
                for (EdgeArchetypeInfo edgeInfo : edges.keySet()){
                    if (!edgeInfosFiltered.contains(edgeInfo)) {
                        resultEdges.addAll(edges.get(edgeInfo));
                    }
                }
                break;
        }

        Iterator<EdgeImpl> i = resultEdges.iterator();
        while (i.hasNext()) {
            EdgeImpl edge = i.next();

            VertexImpl toDummy = new VertexImpl(edge.getTo(), null, -1,null);
            VertexImpl fromDummy = new VertexImpl(edge.getFrom(), null, -1, null);

            if (!resultVertices.contains(toDummy) || !resultVertices.contains(fromDummy)){
                i.remove();
            }
        }

        return resultEdges;
    }

    /**
     * Adds edges to graph.
     *
     * Edges are equal when their attributes from and to are equal. Equal edges are combined and their differences
     * are saved in list of SubedgeInfo.
     *
     * @param graph - graph to which add the edges
     * @param resultEdges - List of edges to add to the graph.
     */
    private void addEdgesToGraph(Graph graph, List<EdgeImpl> resultEdges) {
        HashMap<EdgeImpl, List<SubedgeInfo>> edgeSet = new HashMap<>();

        for (EdgeImpl edgeImpl : resultEdges) {
            List<String[]> attributes = getAttributesAsArray(edgeImpl.getSortedAttributes());
            SubedgeInfo subedgeInfo = new SubedgeInfo(edgeImpl.getOriginalId(), edgeImpl.getArchetype(), attributes);

            if (edgeSet.containsKey(edgeImpl)) {
                edgeSet.get(edgeImpl).add(subedgeInfo);
            } else {
                List<SubedgeInfo> subEdgeInfoList = new ArrayList<>();
                subEdgeInfoList.add(subedgeInfo);
                edgeSet.put(edgeImpl, subEdgeInfoList);
            }
        }

        int idCounter = 1;
        for (EdgeImpl edgeImpl : edgeSet.keySet()) {
            Edge edge = new Edge(idCounter++, edgeImpl.getFrom(), edgeImpl.getTo(), edgeImpl.getText(), edgeSet.get(edgeImpl));
            graph.getEdges().add(edge);
        }
    }

    /**
     * Adds icons from input map to vertexArchetypes and add archetypes to graph.
     *
     * @param graph - Graph in which will be set vertex archetypes
     * @param archetypeIcons Map where key is archetype name and value is svg icon.
     */
    private void addVertexArchetypes(Graph graph, Map<String, String> archetypeIcons){

        for(VertexArchetype archetype : vertexArchetypes){
            for(String archetypeName : archetypeIcons.keySet()){

                if(archetype.name.equals(archetypeName)){
                    archetype.icon = archetypeIcons.get(archetypeName);
                    break;
                }
            }
        }
        graph.setVertexArchetypes(vertexArchetypes);
    }

    /**
     * Adds vertices to the graph.
     * @param graph - Graph to which add the vertices.
     * @param resultVertices - List of vertices to add to the graph.
     */
    private void addVerticesToGraph(Graph graph, Set<VertexImpl> resultVertices) {
        for (VertexImpl vertexImpl : resultVertices) {

            List<String[]> attributes = getAttributesAsArray(vertexImpl.getSortedAttributes());
            Vertex vertex = new Vertex(vertexImpl,attributes);
            graph.getVertices().add(vertex);
        }
    }

    private List<String[]> getAttributesAsArray(List<Attribute> sortedAttributes) {
        ArrayList<String[]> attributes = new ArrayList<>();

        for (Attribute attr : sortedAttributes) {
            String attrName = attributeTypes.get(attr.getTypeIndex()).name;
            AttributeDataType attrType = attributeTypes.get(attr.getTypeIndex()).dataType;

            StringBuilder attrValue = getAttributeValue(attr, attrType);
            attributes.add(new String[]{attrName, attrValue.toString()});
        }
        return attributes;
    }

    /**
     * Gets the string value of attribute by its data type.
     * @param attr - Attribute object from which to extract the value.
     * @param attrType - Data type of the attribute.
     * @return - String value of the attribute.
     */
    private StringBuilder getAttributeValue(Attribute attr, AttributeDataType attrType) {
        StringBuilder attrValue;
        switch (attrType) {
            case NUMBER:
                attrValue = new StringBuilder(attr.getValue().toString());
                break;
            case DATE:
                Date value = (Date) attr.getValue();
                attrValue = new StringBuilder(String.valueOf(value.getTime()));
                break;
            case ENUM: // Enum attribute type must be a list of integers!
                List<Integer> valuePositions = (List<Integer>) attr.getValue();
                List<String> values = getEnumStringsForAttrIndex(attr.getTypeIndex(), valuePositions);

                attrValue = new StringBuilder();
                for (int j = 0; j < values.size(); j++) {
                    attrValue.append(values.get(j));
                    if (j < values.size() - 1)
                        attrValue.append(", ");
                }
                break;
            default:
                attrValue = new StringBuilder(attr.getValue().toString());
                break;
        }
        return attrValue;
    }

    /**
     * Method add list of groups whose are defined in defaultGroupArchetypes to graph.
     * Vertices are taken from graph.
     *
     * @param graph graph to which are groups added.
     * @param defaultGroupArchetypes list of group archetypes
     */
    private void addDefaultGroups(Graph graph, List<String> defaultGroupArchetypes){

        Map<Integer, Group> groups = new HashMap<>();
        int groupId = 1;

        // find index of vertex archetypes names
        int index = 0;
        for(VertexArchetype archetype : graph.getVertexArchetypes()){
            if(defaultGroupArchetypes.contains(archetype.name)){
                groups.put(index, new Group(groupId++, archetype.name));
            }
            index++;
        }

        // find vertices with founded vertex archetypes indices
        for (Vertex vertex : graph.getVertices()){
            if(groups.keySet().contains(vertex.getArchetype())){
                groups.get(vertex.getArchetype()).addVertexId(vertex.getId());
            }
        }

        // remove groups without vertices
        List<Group> groupList = new ArrayList<>();
        for(Group group : groups.values()){
            if (!group.getVerticesId().isEmpty()){
                groupList.add(group);
            }
        }

        graph.setGroups(groupList);
    }
}
