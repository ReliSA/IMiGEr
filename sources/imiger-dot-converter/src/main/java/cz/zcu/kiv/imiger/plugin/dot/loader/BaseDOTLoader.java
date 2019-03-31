package cz.zcu.kiv.imiger.plugin.dot.loader;

import cz.zcu.kiv.imiger.plugin.dot.dto.EdgeDTO;
import cz.zcu.kiv.imiger.plugin.dot.dto.VertexDTO;
import cz.zcu.kiv.imiger.vo.AttributeType;

import java.util.List;
import java.util.Set;

/**
 * Abstract class for DOT loader which takes DOT input and transforms it
 * to DTO classes.
 */
public abstract class BaseDOTLoader<V extends VertexDTO, E extends EdgeDTO> {

    /**
     * Source DOT file
     */
    protected final String dotInput;

    /**
     *
     * @param dotInput - Source DOT file
     */
    public BaseDOTLoader(String dotInput) {
        this.dotInput = dotInput;
    }

    /**
     * Returns list of vertices DTO
     * @return List of vertices DTO
     */
    public abstract List<V> getVertices();

    /**
     * Returns list of edges DTO
     * @return List of edges DTO
     */
    public abstract List<E> getEdges();

    /**
     * Returns list of attribute types
     * @return List of attribute types
     */
    public abstract Set<AttributeType> getAttributeTypes();
}
