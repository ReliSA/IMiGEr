package cz.zcu.kiv.imiger.plugin.dot;

import cz.zcu.kiv.imiger.plugin.dot.dto.EdgeDTO;
import cz.zcu.kiv.imiger.plugin.dot.dto.VertexDTO;
import cz.zcu.kiv.imiger.plugin.dot.loader.BaseDOTLoader;
import cz.zcu.kiv.imiger.vo.*;

import java.util.*;

/**
 * Factory provides generic implementation for creating instance of {@link Graph} from
 * data retrieved using given instance of {@link BaseDOTLoader}.
 *
 * Date: 31.03.2019
 *
 * @author Martin Matas
 */
public abstract class BaseGraphFactory<V extends VertexDTO, E extends EdgeDTO> {

	/**
	 * List of vertex archetypes that must factory initialize.
	 */
	protected List<VertexArchetype> vertexArchetypes;

	/**
	 * List of edge archetypes that must factory initialize.
	 */
	protected List<EdgeArchetype> edgeArchetypes;

	/**
	 * List of defined attribute types retrieved from {@link BaseDOTLoader}.
	 */
	protected List<AttributeType> attributeTypes;

	/**
	 * List of defined vertices retrieved from {@link BaseDOTLoader}. {@link VertexDTO} is
	 * specific vertex created with DOTLoader.
	 */
	protected List<VertexDTO> vertices;

	/**
	 * List of defined edges retrieved from {@link BaseDOTLoader}. {@link EdgeDTO} is
	 * specific vertex created with DOTLoader.
	 */
	protected List<EdgeDTO> edges;

	/**
	 * Constructor initialize data that can be retrieved from {@link BaseDOTLoader}, the rest of
	 * necessary attributes for creating graph must be initialized in children of this abstract class.
	 *
	 * @param dotLoader - instance of {@link BaseDOTLoader} which provides parsed data from DOT file
	 */
	protected BaseGraphFactory(BaseDOTLoader<V, E> dotLoader) {
		vertices = new ArrayList<>();
		edges = new ArrayList<>();
		attributeTypes = new ArrayList<>();
		loadData(dotLoader);
	}

	/**
	 * Must initialize necessary attributes for creating graph from data provided by {@link BaseDOTLoader}.
	 *
	 * @param dotLoader - instance of {@link BaseDOTLoader} which provides parsed data from DOT file
	 */
	protected abstract void loadData(BaseDOTLoader<V, E> dotLoader);

	/**
	 * Must create instance of {@link Graph} from created and retrieved data.
	 *
	 * @return - new graph created from prepared data
	 */
	public abstract Graph createGraph();

}
