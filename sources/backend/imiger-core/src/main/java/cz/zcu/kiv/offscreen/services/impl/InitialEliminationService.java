package cz.zcu.kiv.offscreen.services.impl;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.internal.LinkedTreeMap;
import cz.zcu.kiv.offscreen.services.IInitialEliminationService;

import java.util.*;

public class InitialEliminationService implements IInitialEliminationService {

    // Maximum number of components to be visible in the graph
    private static final int MAX_VISIBLE_COMPONENTS = 100;

    /**
     * Apply an initial elimination on the provided graph represented in JSON string
     * @param rawJSONGraph Graph in raw JSON format to be reduced
     * @return Raw-JSON representation of the resulting graph
     */
    @Override
    public String computeInitialElimination(String rawJSONGraph) {
        // Parse the graph and get the individual elements
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        Map<String, Object> graphMap = (Map<String, Object>)gson.fromJson(rawJSONGraph, Map.class);
        ArrayList<LinkedTreeMap<String, Object>> vertices = (ArrayList<LinkedTreeMap<String, Object>>) graphMap.get("vertices");
        ArrayList<LinkedTreeMap<String, Object>> edges = (ArrayList<LinkedTreeMap<String, Object>>) graphMap.get("edges");
        ArrayList<LinkedTreeMap<String, String>> archetypes = (ArrayList<LinkedTreeMap<String, String>>) graphMap.get("vertexArchetypes");

        getNumberOfEdges(vertices, edges);

        // calculate how many vertices shall be grouped
        int visibleComponents = vertices.size() + edges.size();
        int numVerticesToGroup = 0;
        if (visibleComponents > MAX_VISIBLE_COMPONENTS) {
            numVerticesToGroup = Math.min(vertices.size(), visibleComponents - MAX_VISIBLE_COMPONENTS);
        }

        // if there are any vertices to be grouped -> group them
        if (numVerticesToGroup > 0) {
            // separate the vertices into groups by archetypes
            HashMap<Integer, ArrayList<LinkedTreeMap<String, Object>>> archetypeGroups = getArchetypeGroups(vertices);

            // were some vertices found -> if yes, use the groups for grouping
            if (archetypeGroups.size() > 0) {
                int numVertices = vertices.size();
                int numGroups = archetypeGroups.size();
                int numberToLeftOut = numVertices - numVerticesToGroup - numGroups;

                // process each of the archetype gorups
                archetypeGroups.forEach((archetype, archetypeGroup) -> {
                    double p = archetypeGroup.size() / (double)numVertices;
                    int numberToLeftOutInThisGroup = (int)Math.ceil(Math.floor(p * numberToLeftOut));

                    // select N-most connected vertices
                    List<LinkedTreeMap<String, Object>> filtered = selectMostConnected(archetypeGroup, numberToLeftOutInThisGroup);

                    // if the resulting group is not empty -> create the new group in the JSON representation
                    if (filtered.size() > 0) {
                        createNewGroup(graphMap, edges, archetypes, archetype, filtered);
                    }
                });
            }
        }
        return gson.toJson(graphMap);
    }

    /**
     * Create a new group in the graph
     * @param graphMap graph in which the group shall be created
     * @param edges list of all edges in the graph
     * @param archetypes list of all applicable archetypes
     * @param archetype archetype of the resulting group
     * @param filtered list of nodes to be assigned into the group
     */
    private void createNewGroup(Map<String, Object> graphMap, ArrayList<LinkedTreeMap<String, Object>> edges, ArrayList<LinkedTreeMap<String, String>> archetypes, Integer archetype, List<LinkedTreeMap<String, Object>> filtered) {

        // get current groups from the graph
        ArrayList<LinkedTreeMap<String, Object>> groups = (ArrayList<LinkedTreeMap<String, Object>>) graphMap.get("groups");

        // create new group item
        LinkedTreeMap<String, Object> newGroup = new LinkedTreeMap<>();

        // get name of the new group
        newGroup.put("name", archetypes.get(archetype).get("name"));

        // decide the ID of the new group -> maximum of the existing IDs + 1
        int newGroupId = 0;
        if (groups != null && !groups.isEmpty()) {
            newGroupId =
                    groups
                    .stream()
                    .mapToInt(gr -> (int)((gr.get("id"))))
                    .max()
                    .getAsInt() + 1;
        }
        newGroup.put("id", newGroupId);

        // find IDs of all the nodes inside the group
        ArrayList<Integer> newGroupVertices = new ArrayList<>();
        filtered.forEach(vertex -> {
            newGroupVertices.add((int)Math.ceil((double)vertex.get("id")));
        });
        newGroup.put("verticesId", newGroupVertices);

        // get list of incoming/outgoing nodes
        ArrayList<Integer> verticesEdgeFromId = new ArrayList<>();
        ArrayList<Integer> verticesEdgeToId = new ArrayList<>();

        edges.forEach(edge -> {
            int from = (int) Math.round((double) edge.get("from"));
            int to = (int) Math.round((double) edge.get("to"));

            if (newGroupVertices.contains(from)) {
                verticesEdgeFromId.add(to);
            }
            else if (newGroupVertices.contains(to)) {
                verticesEdgeToId.add(from);
            }
        });

        newGroup.put("verticesEdgeFromId", verticesEdgeFromId);
        newGroup.put("verticesEdgeToId", verticesEdgeToId);

        // assign the group in the graph
        graphMap.computeIfAbsent("groups", k -> new ArrayList<LinkedTreeMap<String, Object>>());
        ((ArrayList<LinkedTreeMap<String, Object>>) graphMap.get("groups")).add(newGroup);
    }

    /**
     * Assigns each vertex from the provided list into a group based on the provided
     * @param vertices
     * @return
     */
    private HashMap<Integer, ArrayList<LinkedTreeMap<String, Object>>> getArchetypeGroups(ArrayList<LinkedTreeMap<String, Object>> vertices) {
        HashMap<Integer, ArrayList<LinkedTreeMap<String, Object>>> archetypeGroups = new HashMap<>();

        vertices.forEach(vertex -> {
            int archetype = (int) Math.round((Double) vertex.get("archetype"));
            ArrayList<LinkedTreeMap<String, Object>> group = archetypeGroups.computeIfAbsent(archetype, k -> new ArrayList<>());
            group.add(vertex);
        });
        return archetypeGroups;
    }

    /**
     * Calculate number of edged (incoming + outgoing) for each of the vertex and assign the result to each
     * of the vertex as an attribute.
     * @param vertices List vertices for which the number of connections shall be computed
     * @param edges List of all edges in the graph
     */
    private void getNumberOfEdges(ArrayList<LinkedTreeMap<String, Object>> vertices, ArrayList<LinkedTreeMap<String, Object>> edges) {
        vertices.forEach(vertex -> {
            int id = (int)Math.round((double)vertex.get("id"));
            int numEdges = (int) edges.stream().filter(edge -> {
                int from = (int) Math.round((double) edge.get("from"));
                int to = (int) Math.round((double) edge.get("to"));
                return (id == from || id == to);
            }).count();
            vertex.put("numEdges", numEdges);
        });
    }

    /**
     * Select N-most connected vertices from the provided list
     * @param vertices list of vertices from which the most connected shall be selected
     * @param count N parameter that determines how many of most connected components shall be selected
     * @return A List of N-most connected vertices from the provided list
     */
    private List<LinkedTreeMap<String, Object>> selectMostConnected(ArrayList<LinkedTreeMap<String, Object>> vertices, int count){
        vertices.sort(Comparator.comparingInt(a -> (int) a.get("numEdges")));
        return vertices.subList(0, vertices.size()-count);
    }

}
