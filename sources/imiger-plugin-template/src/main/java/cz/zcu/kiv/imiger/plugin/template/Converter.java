package cz.zcu.kiv.imiger.plugin.template;

import com.google.gson.Gson;
import cz.zcu.kiv.imiger.spi.IModule;
import cz.zcu.kiv.imiger.vo.Graph;
import java.util.regex.Pattern;

public class Converter implements IModule {
    @Override
    public String getModuleName() {
        return "Module Template";
    }

    @Override
    public Pattern getFileNamePattern() {
        return Pattern.compile("(?s).+\\.json");
    }

    /**
     * Convert input file to RAW JSON and return it.
     */
    @Override
    public String getRawJson(String inputFile) {
        Graph graph = new Graph();
        return new Gson().toJson(graph);
    }
}
