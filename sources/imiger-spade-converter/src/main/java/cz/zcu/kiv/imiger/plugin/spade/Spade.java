package cz.zcu.kiv.imiger.plugin.spade;

import cz.zcu.kiv.imiger.vo.Graph;
import cz.zcu.kiv.imiger.plugin.spade.graph.GraphManager;
import cz.zcu.kiv.imiger.plugin.spade.graph.loader.GraphJSONDataLoader;
import cz.zcu.kiv.imiger.plugin.spade.graph.loader.JSONConfigLoader;
import net.sf.json.JSONObject;

public class Spade {

    /**
     * Convert input spade JSON to RAW JSON and return it.
     */
    public String getRawJson(String file) {
        GraphManager graphManager = new GraphJSONDataLoader(file).loadData();
        JSONConfigLoader configLoader = new JSONConfigLoader(graphManager);

        Graph graph = graphManager.createGraph(configLoader);
        JSONObject json = JSONObject.fromObject(graph);

        return json.toString();
    }
}
