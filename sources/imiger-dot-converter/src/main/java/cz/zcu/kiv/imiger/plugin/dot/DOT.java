package cz.zcu.kiv.imiger.plugin.dot;

import com.google.gson.Gson;
import cz.zcu.kiv.imiger.plugin.dot.dto.EdgeDTO;
import cz.zcu.kiv.imiger.plugin.dot.dto.VertexDTO;
import cz.zcu.kiv.imiger.plugin.dot.loader.BaseDOTLoader;
import cz.zcu.kiv.imiger.plugin.dot.loader.PaypalDOTLoader;
import cz.zcu.kiv.imiger.spi.IModule;
import cz.zcu.kiv.imiger.vo.Graph;

public class DOT implements IModule {
    @Override
    public String getModuleName() {
        return "DOT file";
    }

    @Override
    public String getRawJson(String stringToConvert) {
        BaseDOTLoader<VertexDTO, EdgeDTO> loader = new PaypalDOTLoader(stringToConvert);
        GraphFactory graphFactory = new GraphFactory(loader);
        Graph graph = graphFactory.createGraph();

        Gson gson = new Gson();
        return gson.toJson(graph, Graph.class);
    }
}
