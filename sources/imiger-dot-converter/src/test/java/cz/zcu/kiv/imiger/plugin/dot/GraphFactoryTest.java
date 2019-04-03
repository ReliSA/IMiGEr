package cz.zcu.kiv.imiger.plugin.dot;

import cz.zcu.kiv.imiger.plugin.dot.dto.EdgeDTO;
import cz.zcu.kiv.imiger.plugin.dot.dto.VertexDTO;
import cz.zcu.kiv.imiger.plugin.dot.loader.BaseDOTLoader;
import cz.zcu.kiv.imiger.vo.AttributeDataType;
import cz.zcu.kiv.imiger.vo.AttributeType;
import cz.zcu.kiv.imiger.vo.Graph;
import cz.zcu.kiv.imiger.vo.Vertex;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.*;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Tests process of data transformation from DOT file into Graph structure.
 *
 * Date: 02.04.2019
 *
 * @author Martin Matas
 */
@RunWith(MockitoJUnitRunner.class)
public class GraphFactoryTest {

	/** Name of attribute type */
	private static final String ATTR_TYPE_NAME = "test";

	/** Text of attribute type */
	private static final String ATTR_TYPE_TEXT = "test attribute type";

	/** List index / Attribute identifier */
	private static final int ATTR_TYPE_ID = 0;

	/** Vertex / Edge attribute value */
	private static final String ATTR_VALUE = "test value";

	/** Vertices names */
	private static final String VERTEX_A = "A";
	private static final String VERTEX_B = "B";

	/** Lists indexes / Vertices identifiers */
	private static final int VERTEX_A_ID = 0;
	private static final int VERTEX_B_ID = 1;

	/** Edge name */
	private static final String EDGE_AB = "A-B";

	/** Edge identifier */
	private static final int EDGE_AB_ID = 0;

	/** Archetypes names */
	private static final String EDGE_ARCHETYPE = "Edge";
	private static final String VERTEX_ARCHETYPE = "Vertex";

	private static final boolean EMPTY_UNUSED_CLASS_ATTR = true;

	/**
	 * Mock object of {@link BaseDOTLoader}.
	 */
	@Mock
	private BaseDOTLoader<VertexDTO, EdgeDTO> loaderMock;

	/**
	 * Expects that retrieves correct non-empty data from DOTLoader.
	 */
	@Test
	public void loadDataFromCorrectLoader() {
		final int expectedAttributeTypeSize = 1, expectedEdgesSize = 1, expectedVerticesSize = 2;

		initCorrectLoader();
		BaseGraphFactory<VertexDTO, EdgeDTO> factory = new GraphFactory(loaderMock);

		// test method logic
		verify(loaderMock).getAttributeTypes();
		verify(loaderMock).getEdges();
		verify(loaderMock).getVertices();
		// test attributes initialization
		assertThat(factory.attributeTypes.size(), is(expectedAttributeTypeSize));
		assertThat(factory.edges.size(), is(expectedEdgesSize));
		assertThat(factory.vertices.size(), is(expectedVerticesSize));
		assertThat(factory.edgeArchetypes, is(not(nullValue())));
		assertThat(factory.vertexArchetypes, is(not(nullValue())));
		assertThat(factory.possibleEnumValues, is(not(nullValue())));
		assertThat(factory.groups, is(not(nullValue())));
		assertThat(factory.sideBar, is(not(nullValue())));
		assertThat(factory.highlightedEdge, is(not(nullValue())));
		assertThat(factory.highlightedVertex, is(not(nullValue())));
		// test attribute type
		assertThat(factory.attributeTypes.get(ATTR_TYPE_ID).getName(), is(equalTo(ATTR_TYPE_NAME)));
		assertThat(factory.attributeTypes.get(ATTR_TYPE_ID).getText(), is(equalTo(ATTR_TYPE_TEXT)));
		// test vertices
		assertThat(factory.vertices.get(VERTEX_A_ID).getName(), is(equalTo(VERTEX_A)));
		assertThat(factory.vertices.get(VERTEX_A_ID).getAttributes().get(ATTR_TYPE_NAME), is(equalTo(ATTR_VALUE)));
		assertThat(factory.vertices.get(VERTEX_B_ID).getName(), is(equalTo(VERTEX_B)));
		assertThat(factory.vertices.get(VERTEX_B_ID).getAttributes().get(ATTR_TYPE_NAME), is(equalTo(ATTR_VALUE)));
		// test edges
		assertThat(factory.edges.get(EDGE_AB_ID).getName(), is(equalTo(EDGE_AB)));
		// test archetypes
		assertThat(factory.edgeArchetypes.get(0).getName(), is(equalTo(EDGE_ARCHETYPE)));
		assertThat(factory.vertexArchetypes.get(0).getName(), is(equalTo(VERTEX_ARCHETYPE)));
		// the rest of required but unused attributes
		assertThat(factory.possibleEnumValues.isEmpty(), is(equalTo(EMPTY_UNUSED_CLASS_ATTR)));
		assertThat(factory.groups.isEmpty(), is(equalTo(EMPTY_UNUSED_CLASS_ATTR)));
		assertThat(factory.sideBar.isEmpty(), is(equalTo(EMPTY_UNUSED_CLASS_ATTR)));
		assertThat(factory.highlightedEdge.isEmpty(), is(equalTo(EMPTY_UNUSED_CLASS_ATTR)));
		assertThat(factory.highlightedVertex.isEmpty(), is(equalTo(EMPTY_UNUSED_CLASS_ATTR)));
	}

	/**
	 * Expects that retrieves empty data from DOTLoader. In that case all factory attributes
	 * will empty except archetypes that will be created in factory.
	 */
	@Test
	public void loadDataFromEmptyLoader() {
		final int expectedAttributeTypeSize = 0, expectedEdgesSize = 0, expectedVerticesSize = 0;

		initEmptyLoader();
		BaseGraphFactory<VertexDTO, EdgeDTO> factory = new GraphFactory(loaderMock);

		verify(loaderMock).getAttributeTypes();
		verify(loaderMock).getEdges();
		verify(loaderMock).getVertices();

		assertThat(factory.attributeTypes.size(), is(expectedAttributeTypeSize));
		assertThat(factory.edges.size(), is(expectedEdgesSize));
		assertThat(factory.vertices.size(), is(expectedVerticesSize));
		assertThat(factory.edgeArchetypes, is(not(nullValue())));
		assertThat(factory.vertexArchetypes, is(not(nullValue())));
		assertThat(factory.possibleEnumValues, is(not(nullValue())));
		assertThat(factory.groups, is(not(nullValue())));
		assertThat(factory.sideBar, is(not(nullValue())));
		assertThat(factory.highlightedEdge, is(not(nullValue())));
		assertThat(factory.highlightedVertex, is(not(nullValue())));
	}

	/**
	 * Expects that retrieves uninitialized data from DOTLoader. In that case all factory attributes
	 * will be initialized empty except archetypes that will be created in factory.
	 */
	@Test
	public void loadDataFromIncorrectLoader() {
		final int expectedAttributeTypeSize = 0, expectedEdgesSize = 0, expectedVerticesSize = 0;

		initNullValueLoader();
		BaseGraphFactory<VertexDTO, EdgeDTO> factory = new GraphFactory(loaderMock);

		verify(loaderMock).getAttributeTypes();
		verify(loaderMock).getEdges();
		verify(loaderMock).getVertices();

		assertThat(factory.attributeTypes.size(), is(expectedAttributeTypeSize));
		assertThat(factory.edges.size(), is(expectedEdgesSize));
		assertThat(factory.vertices.size(), is(expectedVerticesSize));
		assertThat(factory.edgeArchetypes, is(not(nullValue())));
		assertThat(factory.vertexArchetypes, is(not(nullValue())));
		assertThat(factory.possibleEnumValues, is(not(nullValue())));
		assertThat(factory.groups, is(not(nullValue())));
		assertThat(factory.sideBar, is(not(nullValue())));
		assertThat(factory.highlightedEdge, is(not(nullValue())));
		assertThat(factory.highlightedVertex, is(not(nullValue())));
	}

	/**
	 * Tests correct creation of the graph instance. Especially vertex's and edge's attributes must be in
	 * correct form.
	 */
	@Test
	public void createGraph() {
		final int expectedAttributeTypeSize = 1, expectedEdgesSize = 1, expectedVerticesSize = 2;

		// correct loader initialized
		initCorrectLoader();
		// loaded data from loader
		BaseGraphFactory<VertexDTO, EdgeDTO> factory = new GraphFactory(loaderMock);

		// final graph
		Graph graph = factory.createGraph();

		assertThat(graph, is(not(nullValue())));
		assertThat(graph.getAttributeTypes().size(), is(expectedAttributeTypeSize));
		assertThat(graph.getEdges().size(), is(expectedEdgesSize));
		assertThat(graph.getVertices().size(), is(expectedVerticesSize));
		assertThat(graph.getEdgeArchetypes(), is(not(nullValue())));
		assertThat(graph.getVertexArchetypes(), is(not(nullValue())));
		// test attribute type
		assertThat(graph.getAttributeTypes().get(ATTR_TYPE_ID).getName(), is(equalTo(ATTR_TYPE_NAME)));
		assertThat(graph.getAttributeTypes().get(ATTR_TYPE_ID).getText(), is(equalTo(ATTR_TYPE_TEXT)));
		// test vertices
		Iterator<Vertex> iterator = graph.getVertices().iterator();
		Vertex a = iterator.next();
		Vertex b = iterator.next();
		assertThat(a.getName(), is(equalTo(VERTEX_A)));
		assertThat(a.getAttributes().get(0)[0], is(equalTo(ATTR_TYPE_NAME)));
		assertThat(a.getAttributes().get(0)[1], is(equalTo(ATTR_VALUE)));
		assertThat(b.getName(), is(equalTo(VERTEX_B)));
		assertThat(b.getAttributes().get(0)[0], is(equalTo(ATTR_TYPE_NAME)));
		assertThat(b.getAttributes().get(0)[1], is(equalTo(ATTR_VALUE)));
		// test edges
		assertThat(graph.getEdges().get(EDGE_AB_ID).getText(), is(equalTo(EDGE_AB)));
		assertThat(graph.getEdges().get(EDGE_AB_ID).getSubedgeInfo().get(0).getAttributes().get(0)[0], is(equalTo(ATTR_TYPE_NAME)));
		assertThat(graph.getEdges().get(EDGE_AB_ID).getSubedgeInfo().get(0).getAttributes().get(0)[1], is(equalTo(ATTR_VALUE)));
		// test archetypes
		assertThat(graph.getEdgeArchetypes().get(0).getName(), is(equalTo(EDGE_ARCHETYPE)));
		assertThat(graph.getVertexArchetypes().get(0).getName(), is(equalTo(VERTEX_ARCHETYPE)));
		// the rest of required but unused attributes
		assertThat(graph.getPossibleEnumValues().isEmpty(), is(equalTo(EMPTY_UNUSED_CLASS_ATTR)));
		assertThat(graph.getGroups().isEmpty(), is(equalTo(EMPTY_UNUSED_CLASS_ATTR)));
		assertThat(graph.getSideBar().isEmpty(), is(equalTo(EMPTY_UNUSED_CLASS_ATTR)));
		assertThat(graph.getHighlightedEdge().isEmpty(), is(equalTo(EMPTY_UNUSED_CLASS_ATTR)));
		assertThat(graph.getHighlightedVertex().isEmpty(), is(equalTo(EMPTY_UNUSED_CLASS_ATTR)));
	}

	/**
	 * Initializes loader with correct data.
	 */
	private void initCorrectLoader() {
		HashMap<String, String> map = new HashMap<>();
		map.put(ATTR_TYPE_NAME, ATTR_VALUE);

		Set<AttributeType> attributeTypes = new HashSet<>();
		attributeTypes.add(new AttributeType(ATTR_TYPE_NAME, AttributeDataType.STRING, ATTR_TYPE_TEXT));

		List<VertexDTO> vertices = new ArrayList<>();
		vertices.add(new VertexDTO(VERTEX_A, VERTEX_A_ID, map));
		vertices.add(new VertexDTO(VERTEX_B, VERTEX_B_ID, map));

		List<EdgeDTO> edges = new ArrayList<>();
		edges.add(new EdgeDTO(EDGE_AB, VERTEX_A_ID, VERTEX_B_ID, EDGE_AB_ID, map));

		when(loaderMock.getAttributeTypes()).thenReturn(attributeTypes);
		when(loaderMock.getVertices()).thenReturn(vertices);
		when(loaderMock.getEdges()).thenReturn(edges);
	}

	/**
	 * Initializes loader for returning empty data.
	 */
	private void initEmptyLoader() {
		Set<AttributeType> attributeTypes = new HashSet<>();
		List<VertexDTO> vertices = new ArrayList<>();
		List<EdgeDTO> edges = new ArrayList<>();

		when(loaderMock.getAttributeTypes()).thenReturn(attributeTypes);
		when(loaderMock.getVertices()).thenReturn(vertices);
		when(loaderMock.getEdges()).thenReturn(edges);
	}

	/**
	 * Initializes loader for returning uninitialized data.
	 */
	private void initNullValueLoader() {
		when(loaderMock.getAttributeTypes()).thenReturn(null);
		when(loaderMock.getVertices()).thenReturn(null);
		when(loaderMock.getEdges()).thenReturn(null);
	}

}