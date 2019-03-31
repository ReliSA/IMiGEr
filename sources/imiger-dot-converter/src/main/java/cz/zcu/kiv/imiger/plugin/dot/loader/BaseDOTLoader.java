package cz.zcu.kiv.imiger.plugin.dot.loader;

import cz.zcu.kiv.imiger.plugin.dot.dto.EdgeDTO;
import cz.zcu.kiv.imiger.plugin.dot.dto.VertexDTO;
import cz.zcu.kiv.imiger.vo.AttributeType;

import java.util.HashSet;
import java.util.List;

public abstract class BaseDOTLoader<V extends VertexDTO, E extends EdgeDTO> {

    private final String dotInput;

    public BaseDOTLoader(String dotInput) {
        this.dotInput = dotInput;
    }

    public abstract List<V> getVerticies();

    public abstract List<E> getEdges();

    public abstract HashSet<AttributeType> getAttributeTypes();
}
