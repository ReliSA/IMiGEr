package cz.zcu.kiv.imiger.plugin.dot.loader;

import cz.zcu.kiv.imiger.plugin.dot.dto.EdgeDTO;
import cz.zcu.kiv.imiger.plugin.dot.dto.VertexDTO;
import cz.zcu.kiv.imiger.vo.AttributeType;

import java.util.HashSet;
import java.util.List;

public class PaypalDOTLoader extends BaseDOTLoader<VertexDTO, EdgeDTO> {

    public PaypalDOTLoader(String dotInput) {
        super(dotInput);
    }

    @Override
    public List<VertexDTO> getVerticies() {
        return null;
    }

    @Override
    public List<EdgeDTO> getEdges() {
        return null;
    }

    @Override
    public HashSet<AttributeType> getAttributeTypes() {
        return null;
    }
}
