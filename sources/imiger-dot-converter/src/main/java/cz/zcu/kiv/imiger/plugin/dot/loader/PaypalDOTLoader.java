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
    private final HashSet<String> attributeNames;
    private final HashMap<GraphNode, Integer> remappedVertices;

    /**
     * DOT loader which uses Digraph library
     *
     * @param dotInput - Source DOT file
     */
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
        attributeNames = new HashSet<>();

        if(parser != null) {
            processVertices();
            processEdges();
        }
    }

    /**
     * Returns list of vertices DTO
     * @return List of vertices DTO
     */
    @Override
    public List<VertexDTO> getVertices() {
        return vertices;
    }

    /**
     * Returns list of edges DTO
     * @return List of edges DTO
     */
    @Override
    public List<EdgeDTO> getEdges() {
        return edges;
    }

    /**
     * Returns list of attribute types
     * @return List of attribute types
     */
    @Override
    public Set<AttributeType> getAttributeTypes() {
        if(attributeTypes.size() == 0 && attributeNames.size() > 0) {
            for(String attr : attributeNames) {
                attributeTypes.add(new AttributeType(attr, AttributeDataType.STRING, ""));
            }
        }
        return attributeTypes;
    }

    /**
     * Method transforms vertices from GraphNode object to vertex DTO and stores attribute type.
     * It has to be called before processing edges.
     */
    private void processVertices() {
        int id = 0;

        for(GraphNode node : this.parser.getNodes().values()) {
            HashMap<String, String> attrs = new HashMap<>();

            if(!node.getAttributes().entrySet().isEmpty()) {
                for (Map.Entry<String, Object> entry : node.getAttributes().entrySet()) {
                    attrs.put(entry.getKey(), entry.getValue().toString());
                    attributeNames.add(entry.getKey());
                }
            }

            VertexDTO vertex = new VertexDTO(node.getId(), id++, attrs);
            this.remappedVertices.put(node, vertex.getId());

            vertices.add(vertex);
        }
    }

    /**
     * Method transforms vertices from GraphNode object to vertex DTO and stores attribute type.
     * It has to be called after processing vertices.
     */
    private void processEdges() {
        int id = 0;

        for(GraphEdge edge : this.parser.getEdges().values()) {
            HashMap<String, String> attrs = new HashMap<>();

            if(!edge.getAttributes().entrySet().isEmpty()) {
                for (Map.Entry<String, Object> entry : edge.getAttributes().entrySet()) {
                    attrs.put(entry.getKey(), entry.getValue().toString());
                    attributeNames.add(entry.getKey());
                }
            }

            int from = remappedVertices.get(edge.getNode1());
            int to = remappedVertices.get(edge.getNode2());
            EdgeDTO edgeDTO = new EdgeDTO(edge.getId(), from, to, id++, attrs);

            edges.add(edgeDTO);
        }
    }
}
