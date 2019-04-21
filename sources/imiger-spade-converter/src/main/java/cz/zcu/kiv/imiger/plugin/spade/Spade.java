package cz.zcu.kiv.imiger.plugin.spade;

import cz.zcu.kiv.imiger.spi.IModule;
import cz.zcu.kiv.imiger.vo.Graph;
import cz.zcu.kiv.imiger.plugin.spade.graph.GraphManager;
import cz.zcu.kiv.imiger.plugin.spade.graph.loader.GraphJSONDataLoader;
import cz.zcu.kiv.imiger.plugin.spade.graph.loader.JSONConfigLoader;
import java.util.regex.Pattern;
import net.sf.json.JSONObject;

public class Spade implements IModule {
    @Override
    public String getModuleName() {
        return "Spade JSON";
    }

    @Override
    public Pattern getFileNamePattern() {
        return Pattern.compile("(?s).+\\.json");
    }

    /**
     * Convert input spade JSON to RAW JSON.
     *
     * @param file String to be converted to raw JSON.
     * @return Raw JSON.
     */
    @Override
    public String getRawJson(String file) {
        GraphManager graphManager = new GraphJSONDataLoader(file).loadData();
        JSONConfigLoader configLoader = new JSONConfigLoader(graphManager);

        Graph graph = graphManager.createGraph(configLoader);
        JSONObject json = JSONObject.fromObject(graph);

        return json.toString();
    }
}
