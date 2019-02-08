package cz.zcu.kiv.imiger.plugin.template;

import com.google.gson.Gson;
import cz.zcu.kiv.imiger.vo.Graph;

public class Converter {

    /**
     * Convert input file to RAW JSON and return it.
     */
    public String getRawJson(String inputFile) {

        Graph graph = new Graph();
        return new Gson().toJson(graph);
    }
}
