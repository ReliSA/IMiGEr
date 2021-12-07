export default {
    createEdgeConnectedToAExcludedVertex(edge, fromVertex, toVertex, viewPort, excludedVerticesBoxes) {
        let coords1 = getExcludedEdgeCoordinates(fromVertex, excludedVerticesBoxes, viewPort)
        if (coords1 == null) return null;
        let coords2 = getExcludedEdgeCoordinates(toVertex, excludedVerticesBoxes, viewPort)
        if (coords2 == null) return null;

        return {
            id: edge.id,
            x1: coords1.x,
            y1: coords1.y,
            x2: coords2.x,
            y2: coords2.y,
            description: edge.description,
            toExcluded: toVertex.excluded,
            fromExcluded: fromVertex.excluded
        }
    }
}

function getExcludedEdgeCoordinates(vertex, excludedVerticesBoxes, viewPort) {
    let obj = {}
    if (vertex.excluded) {
        let box = excludedVerticesBoxes[vertex.id]
        if (box == null) {
            return null
        } else {
            // TODO pass 5 as parameter
            obj.x = getExcludedEdgeX(viewPort) - 5 * (1 / viewPort.scale)
            obj.y = getExcludedEdgeY(viewPort, box)
        }
    } else {
        obj.x = vertex.x
        obj.y = vertex.y
    }
    return obj;
}

function getExcludedEdgeX(viewPort) {
    return (-viewPort.tx * (1 / viewPort.scale)) + (viewPort.width * (1 / viewPort.scale))
}

function getExcludedEdgeY(viewPort, box) {
    return -viewPort.ty * (1 / viewPort.scale) + (((box.y - (window.innerHeight - viewPort.height) + (box.height / 2))) * (1 / viewPort.scale))
}
