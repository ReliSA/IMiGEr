export default {
    createEdgeConnectedToAExcludedVertex(edge, fromVertex, toVertex, viewPort, excludedVerticesBoxes) {
        let x1 = 0
        let y1 = 0
        let x2 = 0
        let y2 = 0

        if (fromVertex.excluded) {
            let box = excludedVerticesBoxes[fromVertex.id]
            if (box == null) {
                return null
            } else {
                x1 = getExcludedEdgeX(viewPort)
                y1 = getExcludedEdgeY(viewPort, box)
            }
        } else {
            x1 = fromVertex.x
            y1 = fromVertex.y
        }

        if (toVertex.excluded) {
            let box = excludedVerticesBoxes[toVertex.id]
            if (box == null) {
                return null
            } else {
                x2 = getExcludedEdgeX(viewPort)
                y2 = getExcludedEdgeY(viewPort, box)
            }
        } else {
            x2 = toVertex.x
            y2 = toVertex.y
        }

        // horizontal padding (TODO pass value "5" as a parameter)
        x1 -= 5 * (1 / viewPort.scale)
        x2 -= 5 * (1 / viewPort.scale)

        return {
            id: edge.id,
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            description: edge.description,
            toExcluded: toVertex.excluded,
            fromExcluded: fromVertex.excluded
        }
    }
}

function getExcludedEdgeX(viewPort) {
    return (-viewPort.tx * (1 / viewPort.scale)) + (viewPort.width * (1 / viewPort.scale))
}

function getExcludedEdgeY(viewPort, box) {
    return -viewPort.ty * (1 / viewPort.scale) + (((box.y - (window.innerHeight - viewPort.height) + (box.height / 2))) * (1 / viewPort.scale))
}
