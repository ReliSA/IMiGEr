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
public abstract class BaseGraphFactory<V extends VertexDTO, E extends EdgeDTO> {

	protected List<VertexArchetype> vertexArchetypes;
	protected List<EdgeArchetype> edgeArchetypes;
	protected List<AttributeType> attributeTypes;
	protected List<VertexDTO> vertices;
	protected List<EdgeDTO> edges;


	protected BaseGraphFactory(BaseDOTLoader<V, E> dotLoader) {
		loadData(dotLoader);
	}

	protected abstract void loadData(BaseDOTLoader<V, E> dotLoader);

	public abstract Graph createGraph();

}
