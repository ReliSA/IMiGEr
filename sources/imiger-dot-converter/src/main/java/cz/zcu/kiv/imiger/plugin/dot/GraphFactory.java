package cz.zcu.kiv.imiger.plugin.dot;

import cz.zcu.kiv.imiger.plugin.dot.dto.EdgeDTO;
import cz.zcu.kiv.imiger.plugin.dot.dto.VertexDTO;
import cz.zcu.kiv.imiger.plugin.dot.loader.BaseDOTLoader;
import cz.zcu.kiv.imiger.vo.*;

import java.util.*;

/**
 * Implements necessary methods for creating graph.
 *
 * Date: 31.03.2019
 *
 * @author Martin Matas
 */
public class GraphFactory extends BaseGraphFactory<VertexDTO, EdgeDTO> {

	/**
	 * Name of default edge archetype name field.
	 */
	private static final String EDGE_ARCHETYPE_NAME = "Edge";

	/**
	 * Name of default vertex archetype name field.
	 */
	private static final String VERTEX_ARCHETYPE_NAME = "Vertex";

	/**
	 * Value of default archetype text field.
	 */
	private static final String ARCHETYPE_TEXT = "";

	/**
	 * Index of default archetype in created archetype list.
	 */
	private static final int DEFAULT_ARCHETYPE_INDEX = 0;

	/**
	 * Retrieves data from {@link BaseDOTLoader} and defines archetypes for vertices and edges.
	 *
	 * @param dotLoader - instance of {@link BaseDOTLoader} which provides parsed data from DOT file
	 */
	public GraphFactory(BaseDOTLoader<VertexDTO,EdgeDTO> dotLoader) {
		super(dotLoader);
		prepareEdgeArchetypes();
		prepareVertexArchetypes();
		preparePossibleEnumValues();
		prepareGroups();
		prepareSideBar();
		defineHighlightedVertex();
        defineHighlightedEdge();
	}

	/**
	 * Initialize attributes that can be filled with data from {@link BaseDOTLoader}. In case when
	 * DOTLoader returns uninitialized lists, attributes will be initialized empty.
	 *
	 * @param dotLoader - instance of {@link BaseDOTLoader} which provides parsed data from DOT file
	 */
	@Override
	protected void loadData(BaseDOTLoader<VertexDTO,EdgeDTO> dotLoader) {
		List<VertexDTO> loadedVertices = dotLoader.getVertices();
		List<EdgeDTO> loadedEdges = dotLoader.getEdges();
		Set<AttributeType> loadedAttributeTypes = dotLoader.getAttributeTypes();

		if (loadedVertices != null) {
			vertices = new ArrayList<>(loadedVertices);
		}

		if (loadedEdges != null) {
			edges = new ArrayList<>(loadedEdges);
		}

		if (loadedAttributeTypes != null) {
			attributeTypes = new ArrayList<>(loadedAttributeTypes);
		}
	}

	/**
	 * Creates new graph from data which were prepared when instance was created.
	 *
	 * @return - new instance of graph
	 */
	@Override
	public Graph createGraph() {
		Graph graph = new Graph();

		graph.setEdgeArchetypes(edgeArchetypes);
		graph.setVertexArchetypes(vertexArchetypes);
		graph.setAttributeTypes(attributeTypes);
		graph.setPossibleEnumValues(possibleEnumValues);
		graph.setGroups(groups);
		graph.setSideBar(sideBar);
		graph.setHighlightedEdge(highlightedEdge);
		graph.setHighlightedVertex(highlightedVertex);
		addEdgesToGraph(graph, edges);
		addVerticesToGraph(graph, vertices);

		return graph;
	}

	/**
	 * Iterates through the list of vertices retrieved from {@link BaseDOTLoader} and for each of them
	 * creates new graph vertex.
	 *
	 * @param graph - reference to the instance of new graph
	 * @param vertices - vertices retrieved from {@link BaseDOTLoader}
	 */
	private void addVerticesToGraph(Graph graph, List<VertexDTO> vertices) {
		for (VertexDTO v : vertices) {

			List<String[]> attributes = checkAttributes(v.getAttributes(), attributeTypes);
			Vertex vertex = new Vertex(v.getId(), v.getName(), DEFAULT_ARCHETYPE_INDEX, "", attributes);
			graph.getVertices().add(vertex);
		}
	}

	/**
	 * Iterates through the list of edges retrieved from {@link BaseDOTLoader} and for each of them
	 * creates new graph edge.
	 *
	 * @param graph - reference to the instance of new graph
	 * @param edges - edges retrieved from {@link BaseDOTLoader}
	 */
	private void addEdgesToGraph(Graph graph, List<EdgeDTO> edges) {
		for (EdgeDTO e : edges) {

			List<String[]> attributes = checkAttributes(e.getAttributes(), attributeTypes);
			SubedgeInfo subedgeInfo = new SubedgeInfo(e.getId(), DEFAULT_ARCHETYPE_INDEX, attributes);

			List<SubedgeInfo> subedgeInfos = new ArrayList<>();
			subedgeInfos.add(subedgeInfo);

			Edge edge = new Edge(e.getId(), e.getIdFrom(), e.getIdTo(), e.getName(), subedgeInfos);
			graph.getEdges().add(edge);
		}
	}

	/**
	 * Iterates through the list of attributes and for each of them checks if the attribute type exists. Then for the
	 * attribute creates key-value pair using {@link String[]}, where key is the attribute type and value is the
	 * value of attribute.
	 *
	 * @param uncheckedAttributes - map of attributes retrieved from {@link BaseDOTLoader}, where key is unchecked
	 *                            attribute type and value is the value of attribute
	 * @param attributeTypes - list of attribute types retrieved from {@link BaseDOTLoader} against which will be unchecked
	 *                       attributes validated
	 * @return - list of checked attributes
	 */
	private List<String[]> checkAttributes(Map<String, String> uncheckedAttributes, List<AttributeType> attributeTypes) {
		List<String[]> attributes = new ArrayList<>();
		Set<String> attributesHashSet = new HashSet<>();

		attributeTypes.forEach(t -> attributesHashSet.add(t.getName()));

		for (Map.Entry<String, String> e: uncheckedAttributes.entrySet()) {
			if (attributesHashSet.contains(e.getKey())) {
				attributes.add(new String[]{e.getKey(), e.getValue()});
			}
		}

		return attributes;
	}

	/**
	 * Defines default edge archetype for edges.
	 */
	private void prepareEdgeArchetypes() {
		edgeArchetypes = new ArrayList<>();
		edgeArchetypes.add(new EdgeArchetype(EDGE_ARCHETYPE_NAME, ARCHETYPE_TEXT));
	}

	/**
	 * Defines default vertex archetypes for vertices.
	 */
	private void prepareVertexArchetypes() {
		vertexArchetypes = new ArrayList<>();
		vertexArchetypes.add(new VertexArchetype(VERTEX_ARCHETYPE_NAME, ARCHETYPE_TEXT));
	}

    /**
     * Defines default map of possible enum values.
     */
	private void preparePossibleEnumValues() {
		possibleEnumValues = new HashMap<>();
	}


    /**
     * Defines default list fo groups.
     */
	private void prepareGroups() {
		groups = new ArrayList<>();
	}


    /**
     * Defines default list of sidebars.
     */
	private void prepareSideBar() {
		sideBar = new ArrayList<>();
	}


    /**
     * Defines default highlighted edge. Empty string means that no edge will be highlighted
     * when graph loads.
     */
	private void defineHighlightedEdge() {
		highlightedEdge = "";
	}

    /**
     * Defines default highlighted vertex. Empty string means that no vertex will be highlighted
     * when graph loads.
     */
	private void defineHighlightedVertex() {
		highlightedVertex = "";
	}

}
