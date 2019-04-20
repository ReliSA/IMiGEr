package cz.zcu.kiv.imiger.plugin.dot;

import com.google.gson.Gson;
import cz.zcu.kiv.imiger.plugin.dot.dto.EdgeDTO;
import cz.zcu.kiv.imiger.plugin.dot.dto.VertexDTO;
import cz.zcu.kiv.imiger.plugin.dot.loader.BaseDOTLoader;
import cz.zcu.kiv.imiger.plugin.dot.loader.DigraphDOTLoader;
import cz.zcu.kiv.imiger.spi.IModule;
import cz.zcu.kiv.imiger.vo.Graph;

/**
 * IModule implementation for DOT converter.
 */
public class DOT implements IModule {

    /**
     * Returns name of this module.
     *
     * @return - name of this module
     */
    @Override
    public String getModuleName() {
        return "DOT file";
    }

    /**
     * Retrieves DOT file which has to be converted to raw JSON that
     * IMiGEr support.
     *
     * @param stringToConvert String to be converted to raw JSON.
     * @return - raw JSON as string
     */
    @Override
    public String getRawJson(String stringToConvert) {
        BaseDOTLoader<VertexDTO, EdgeDTO> loader = new DigraphDOTLoader(stringToConvert);
        GraphFactory graphFactory = new GraphFactory(loader);
        Graph graph = graphFactory.createGraph();

        if(!graph.getVertices().isEmpty()) {
            Gson gson = new Gson();
            return gson.toJson(graph, Graph.class);
        }

        else {
            return "";
        }
    }
}
