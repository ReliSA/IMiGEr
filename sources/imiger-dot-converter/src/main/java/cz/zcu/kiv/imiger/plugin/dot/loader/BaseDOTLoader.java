package cz.zcu.kiv.imiger.plugin.dot.loader;

import cz.zcu.kiv.imiger.plugin.dot.dto.EdgeDTO;
import cz.zcu.kiv.imiger.plugin.dot.dto.VertexDTO;
import cz.zcu.kiv.imiger.vo.AttributeType;

import java.util.List;
import java.util.Set;

public abstract class BaseDOTLoader<V extends VertexDTO, E extends EdgeDTO> {

    protected final String dotInput;

    public BaseDOTLoader(String dotInput) {
        this.dotInput = dotInput;
    }

    public abstract List<V> getVertices();

    public abstract List<E> getEdges();

    public abstract Set<AttributeType> getAttributeTypes();
}
