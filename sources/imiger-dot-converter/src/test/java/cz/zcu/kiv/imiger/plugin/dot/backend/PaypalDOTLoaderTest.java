package cz.zcu.kiv.imiger.plugin.dot.backend;

import cz.zcu.kiv.imiger.plugin.dot.dto.EdgeDTO;
import cz.zcu.kiv.imiger.plugin.dot.dto.VertexDTO;
import cz.zcu.kiv.imiger.plugin.dot.loader.BaseDOTLoader;
import cz.zcu.kiv.imiger.plugin.dot.loader.PaypalDOTLoader;
import cz.zcu.kiv.imiger.vo.AttributeType;
import org.junit.Before;
import org.junit.Test;
import org.apache.commons.io.*;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import static org.junit.Assert.*;

public class PaypalDOTLoaderTest {

    BaseDOTLoader<VertexDTO, EdgeDTO> loader;

    @Before
    public void setup() {
        loader = null;
    }

    private String getFileAsString(String fileName) {
        try {
            return IOUtils.toString(getClass().getClassLoader().getResourceAsStream(fileName), "UTF-8");
        } catch (IOException e) {
            return null;
        }
    }

    @Test
    public void testOkGraph() {
        String input = getFileAsString("complete1.dot");

        loader = new PaypalDOTLoader(input);

        List<VertexDTO> vertices = loader.getVertices();
        List<EdgeDTO> edges = loader.getEdges();
        Set<AttributeType> attrs = loader.getAttributeTypes();

        assertEquals(13, vertices.size());
        assertEquals(12, edges.size());
        assertEquals(5, attrs.size());
    }

    @Test
    public void testIncompleteGraph() {
        String input = getFileAsString("incomplete1.dot");

        loader = new PaypalDOTLoader(input);

        List<VertexDTO> vertices = loader.getVertices();
        List<EdgeDTO> edges = loader.getEdges();
        Set<AttributeType> attrs = loader.getAttributeTypes();

        assertEquals(0, vertices.size());
        assertEquals(0, edges.size());
        assertEquals(0, attrs.size());
    }

    @Test
    public void missingVertexDefinitionTest() {
        String input = getFileAsString("incomplete2.dot");

        loader = new PaypalDOTLoader(input);

        List<VertexDTO> vertices = loader.getVertices();
        List<EdgeDTO> edges = loader.getEdges();
        Set<AttributeType> attrs = loader.getAttributeTypes();

        assertEquals(13, vertices.size());
        assertEquals(12, edges.size());
        assertEquals(5, attrs.size());
    }
}
