package cz.zcu.kiv.offscreen.services.impl;

import com.google.gson.Gson;
import com.google.gson.internal.LinkedTreeMap;
import cz.zcu.kiv.offscreen.services.IInitialEliminationService;

import java.util.*;

public class InitialEliminationService implements IInitialEliminationService {

    private static final int MAX_VISIBLE_COMPONENTS = 100;

    @Override
    public String ComputeInitialElimination(String rawJSONGraph) {
        Gson gson = new Gson();
        Map graphMap = gson.fromJson(rawJSONGraph, Map.class);
        ArrayList<LinkedTreeMap<String, Object>> vertices = (ArrayList<LinkedTreeMap<String, Object>>) graphMap.get("vertices");
        ArrayList<LinkedTreeMap<String, Object>> edges = (ArrayList<LinkedTreeMap<String, Object>>) graphMap.get("edges");
        ArrayList<LinkedTreeMap<String, String>> archetypes = (ArrayList<LinkedTreeMap<String, String>>) graphMap.get("vertexArchetypes");


        vertices.forEach(vertex -> {
            int id = (int)Math.round((double)vertex.get("id"));
            int numEdges = (int) edges.stream().filter(edge -> {
                int from = (int) Math.round((double) edge.get("from"));
                int to = (int) Math.round((double) edge.get("to"));
                return (id == from || id == to);
            }).count();
            vertex.put("numEdges", numEdges);
        });

        int visibleComponents = vertices.size() + edges.size();
        int numVerticesToGroup = 0;

        if (visibleComponents > MAX_VISIBLE_COMPONENTS) {
            numVerticesToGroup = Math.min(vertices.size(), visibleComponents - MAX_VISIBLE_COMPONENTS);
        }

        if (numVerticesToGroup > 0) {

            HashMap<Integer, ArrayList<LinkedTreeMap<String, Object>>> groups = new HashMap<>();

            edges.forEach(edge -> {
                int archetype = (int) Math.round((Double) edge.get("archetype"));
                ArrayList<LinkedTreeMap<String, Object>> group = groups.computeIfAbsent(archetype, k -> new ArrayList<>());
                group.add(edge);
            });

            if (groups.size() > 0) {
                int numVertices = vertices.size();
                int numGroups = groups.size();
                int numberToLeftOut = numVertices - numVerticesToGroup - numGroups;

                groups.forEach((archetype, group) -> {
                    double p = vertices.size() / (double)numVertices;
                    int numberToLeftOutInThisGroup = (int)Math.ceil(Math.floor(p * numberToLeftOut));
                    List<LinkedTreeMap<String, Object>> filtered = removeMostConnected(vertices, numberToLeftOutInThisGroup);

                    if (filtered.size() > 0) {
                        String groupName = archetypes.get(archetype).get("name");
                        // TODO implement group creation
                    }

                });
            }

        }

        return "";
    }

    private List<LinkedTreeMap<String, Object>> removeMostConnected(ArrayList<LinkedTreeMap<String, Object>> vertices, int count){
        vertices.sort(Comparator.comparingInt(a -> (int) a.get("numEdges")));
        return vertices.subList(0, vertices.size()-count);
    }

}
