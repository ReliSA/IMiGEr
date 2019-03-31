package cz.zcu.kiv.imiger.plugin.dot.loader;

import cz.zcu.kiv.imiger.vo.BaseEdge;
import cz.zcu.kiv.imiger.vo.BaseVertex;

import java.util.List;

public abstract class BaseDOTLoader<V extends BaseVertex, E extends BaseEdge> {

    private final String dotInput;

    public BaseDOTLoader(String dotInput) {
        this.dotInput = dotInput;
    }

    public abstract List<V> getVerticies();

    public abstract List<E> getEdges();
}
