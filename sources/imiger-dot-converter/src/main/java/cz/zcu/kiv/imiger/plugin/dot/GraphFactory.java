package cz.zcu.kiv.imiger.plugin.dot;

import cz.zcu.kiv.imiger.plugin.dot.dto.EdgeDTO;
import cz.zcu.kiv.imiger.plugin.dot.dto.VertexDTO;
import cz.zcu.kiv.imiger.plugin.dot.loader.BaseDOTLoader;
import cz.zcu.kiv.imiger.vo.*;

import java.util.*;

/**
 * Date: 31.03.2019
 *
 * @author Martin Matas
 */
public class GraphFactory extends BaseGraphFactory<VertexDTO, EdgeDTO> {

	private static final String EDGE_ARCHETYPE_NAME = "Edge";
	private static final String VERTEX_ARCHETYPE_NAME = "Vertex";
	private static final String ARCHETYPE_TEXT = "";
	private static final int DEFAULT_ARCHETYPE_INDEX = 0;

	public GraphFactory(BaseDOTLoader<VertexDTO,EdgeDTO> dotLoader) {
		super(dotLoader);
		prepareEdgeArchetypes();
		prepareVertexArchetypes();
	}

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

	@Override
	public Graph createGraph() {
		Graph graph = new Graph();

		graph.setEdgeArchetypes(edgeArchetypes);
		graph.setVertexArchetypes(vertexArchetypes);
		graph.setAttributeTypes(attributeTypes);
		addEdgesToGraph(graph, edges);
		addVerticesToGraph(graph, vertices);

		return graph;
	}

	private void addVerticesToGraph(Graph graph, List<VertexDTO> vertices) {
		for (VertexDTO v : vertices) {

			List<String[]> attributes = new ArrayList<>();
			attributes.add(convertListToArray(v.getAttributes().values()));
			Vertex vertex = new Vertex(v.getId(), v.getName(), DEFAULT_ARCHETYPE_INDEX, "", attributes);
			graph.getVertices().add(vertex);
		}
	}

	private void addEdgesToGraph(Graph graph, List<EdgeDTO> edges) {
		for (EdgeDTO e : edges) {

			List<String[]> attributes = new ArrayList<>();
			attributes.add(convertListToArray(e.getAttributes().values()));
			SubedgeInfo subedgeInfo = new SubedgeInfo(e.getId(), DEFAULT_ARCHETYPE_INDEX, attributes);

			List<SubedgeInfo> subedgeInfos = new ArrayList<>();
			subedgeInfos.add(subedgeInfo);

			Edge eddge = new Edge(e.getId(), e.getIdFrom(), e.getIdTo(), e.getName(), subedgeInfos);
			graph.getEdges().add(eddge);
		}
	}

	private String[] convertListToArray(Collection<String> list) {
		String[] array = new String[list.size()];
		int i = 0;

		for (String str: list) {
			array[i++] = str;
		}

		return array;
	}

	private void prepareEdgeArchetypes() {
		edgeArchetypes= new ArrayList<>();
		edgeArchetypes.add(new EdgeArchetype(EDGE_ARCHETYPE_NAME, ARCHETYPE_TEXT));
	}

	private void prepareVertexArchetypes() {
		vertexArchetypes = new ArrayList<>();
		vertexArchetypes.add(new VertexArchetype(VERTEX_ARCHETYPE_NAME, ARCHETYPE_TEXT));
	}

}
