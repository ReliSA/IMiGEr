package cz.zcu.kiv.imiger.plugin.dot.loader;

import com.paypal.digraph.parser.GraphEdge;
import com.paypal.digraph.parser.GraphNode;
import com.paypal.digraph.parser.GraphParser;
import com.paypal.digraph.parser.GraphParserException;
import cz.zcu.kiv.imiger.plugin.dot.dto.EdgeDTO;
import cz.zcu.kiv.imiger.plugin.dot.dto.VertexDTO;
import cz.zcu.kiv.imiger.vo.AttributeDataType;
import cz.zcu.kiv.imiger.vo.AttributeType;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.ByteArrayInputStream;
import java.util.*;

public class PaypalDOTLoader extends BaseDOTLoader<VertexDTO, EdgeDTO> {
    private static Logger logger = LogManager.getLogger();

    private GraphParser parser;
    private final List<VertexDTO> vertices;
    private final List<EdgeDTO> edges;
    private final HashSet<AttributeType> attributeTypes;
    private final HashMap<GraphNode, Integer> remappedVertices;

    public PaypalDOTLoader(String dotInput) {
        super(dotInput);
        parser = null;

        try {
            parser = new GraphParser(new ByteArrayInputStream(super.dotInput.getBytes()));
        } catch (GraphParserException ex) {
            logger.warn("There was a mistake in input DOT file. Exception: " + ex.getMessage());
        }
        vertices = new ArrayList<>();
        edges = new ArrayList<>();
        attributeTypes = new HashSet<>();
        remappedVertices = new HashMap<>();
        processEdges();
        processVertices();
    }

    @Override
    public List<VertexDTO> getVertices() {
        return vertices;
    }

    @Override
    public List<EdgeDTO> getEdges() {
        return edges;
    }

    @Override
    public Set<AttributeType> getAttributeTypes() {
        return attributeTypes;
    }

    private void processVertices() {
        int id = 0;

        for(GraphNode node : this.parser.getNodes().values()) {
            HashMap<String, String> attrs = new HashMap<>();
            for(Map.Entry<String, Object> entry : node.getAttributes().entrySet()) {
                attrs.put(entry.getKey(), entry.getValue().toString());
                attributeTypes.add(new AttributeType(entry.getKey(), AttributeDataType.STRING, ""));
            }

            VertexDTO vertex = new VertexDTO(node.getId(), id++, attrs);
            this.remappedVertices.put(node, vertex.getId());

            vertices.add(vertex);
        }
    }

    private void processEdges() {
        int id = 0;

        for(GraphEdge edge : this.parser.getEdges().values()) {
            HashMap<String, String> attrs = new HashMap<>();
            for(Map.Entry<String, Object> entry : edge.getAttributes().entrySet()) {
                attrs.put(entry.getKey(), entry.getValue().toString());
                attributeTypes.add(new AttributeType(entry.getKey(), AttributeDataType.STRING, ""));
            }

            int from = remappedVertices.get(edge.getNode1());
            int to = remappedVertices.get(edge.getNode2());
            EdgeDTO edgeDTO = new EdgeDTO(edge.getId(), from, to, id++, attrs);

            edges.add(edgeDTO);
        }
    }
}
