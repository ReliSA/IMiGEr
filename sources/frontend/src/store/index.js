import {createStore} from 'vuex'
import loadTestData from '@/utils/graph.js'
import force_directed_layout from '@/utils/graph.js'

// scale factor
const scaleD = 0.1

export default createStore({
    state: {
        // flag indicating whether the application is busy loading/processing something
        loading: true,
        // state attributes representing the graph
        edges: [],
        vertices: [],
        // vertex that is being dragged
        vertexBeingDragged: null,
        // define the size of the world
        worldSize: 5000,
        // define a global style object for graph components
        style: {
            edge: {
                strokeColor: "#888888AA",
                strokeWidth: 4,
                highlightedStrokeColor: "#880000AA",
                highlightedStrokeWidth: 8,
                tipColor: "#444444",
                fontSize: 1.5,
                textBottomOffset: 15,
                arrowSize: 9,
                textColor: "red"
            },
            vertex: {
                strokeWidth: 1,
                fillColor: "white",
                highlightedFillColor: "#F44336",
                strokeColor: "black",
                radius: 50
            }
        },
        viewPort: {
            scale: 1,
            tx: 0,
            ty: 0,
            width: window.innerWidth,
            height: window.innerHeight
        },
        clickBehaviour: "move"
    },
    mutations: {
        // mutations of the viewports scale
        // eslint-disable-next-line no-unused-vars
        INCREASE_SCALE(state, {targetX, targetY}) {
            // TODO utilize targetX and targetY to zoom at the target coordinates
            state.viewPort.scale += scaleD
        },
        DECREASE_SCALE(state) {
            if (state.viewPort.scale - scaleD > 0.1) {
                state.viewPort.scale -= scaleD
            }
        },
        // mutations of node highlight state
        HIGHLIGHT_VERTEX(state, vertex) {
            vertex.highlighted = true
        },
        DISABLE_VERTEX_HIGHLIGHT(state, vertex) {
            vertex.highlighted = false
        },
        // mutations for changing the translation of the viewport
        CHANGE_TRANSLATION(state, {dx, dy}) {
            state.viewPort.tx += dx
            state.viewPort.ty += dy
        },
        // mutation for changing a position of a vertex
        CHANGE_VERTEX_POS(state, {vertex, dx, dy}) {
            vertex.x += dx
            vertex.y += dy
        },
        // mutation for storing the graph data
        SET_GRAPH_DATA(state, {edges, vertices}) {
            state.vertices = vertices
            state.edges = edges
        },
        // mutation for toggling the loading state
        SET_LOADING(state, loading) {
            state.loading = loading
        },
        // mutation for toggling highlight state of an edge
        SET_EDGE_HIGHLIGHTED(state, {edge, highlighted}) {
            edge.highlighted = highlighted
        },

        // mutation to be when invoked a mouse button has been clicked down on a vertex
        VERTEX_MOUSE_DOWN(state, {vertex, down}) {
            if (down) {
                state.vertexBeingDragged = vertex
            } else {
                state.vertexBeingDragged = null
            }
        },

        // sets viewport dimensions
        SET_VIEWPORT_DIMENSIONS(state, {width, height}) {
            state.viewPort.width = width
            state.viewPort.height = height
        },
        SET_CLICK_BEHAVIOUR(state, clickBehaviour) {
            state.clickBehaviour = clickBehaviour
        }
    },
    actions: {
        async increaseScale({commit}, event) {
            commit("INCREASE_SCALE", event)
        },
        async decreaseScale({commit}) {
            commit("DECREASE_SCALE")
        },
        async toggleVertexHighlightState({commit, dispatch}, vertex) {
            if (vertex.highlighted) {
                commit("DISABLE_VERTEX_HIGHLIGHT", vertex)
                // remove highlight from edges that are connected to the vertex
                dispatch("highlightVertexEdges", {vertex, highlighted: false})
            } else {
                commit("HIGHLIGHT_VERTEX", vertex)
                // highlight edges that are connected to the vertex
                dispatch("highlightVertexEdges", {vertex, highlighted: true})
            }
        },
        async highlightVertexEdges({commit, state}, {vertex, highlighted}) {
            vertex.edges.forEach(edgeId => {
                // iterate over all edges that are connected to the node
                if (!highlighted) {
                    // when edges should not be highlighted check first whether
                    // other vertices the edge is connected to are highlighted
                    // (if so, then the edge should remain highlighted)
                    let edge = state.edges[edgeId]
                    if (!state.vertices[edge.from].highlighted && !state.vertices[edge.to].highlighted) {
                        commit("SET_EDGE_HIGHLIGHTED", {edge: edge, highlighted: highlighted})
                    }
                } else {
                    commit("SET_EDGE_HIGHLIGHTED", {edge: state.edges[edgeId], highlighted: highlighted})
                }
            })
        },
        async changeTranslation({commit, state}, payload) {
            if (!state.vertexBeingDragged) {
                commit("CHANGE_TRANSLATION", payload)
            }
        },
        async changeVertexPos({commit, state}, payload) {
            payload.dx *= (1 / state.viewPort.scale)
            payload.dy *= (1 / state.viewPort.scale)
            commit("CHANGE_VERTEX_POS", payload)
        },
        // eslint-disable-next-line no-unused-vars
        async loadInitialData({commit, state}, graph) {
            commit("SET_LOADING", true)
            loadTestData.prepare_graph_object(graph, state.worldSize)
            force_directed_layout.force_directed_layout(graph, state.worldSize, state.worldSize, 20)
            commit("SET_GRAPH_DATA", graph)
            await new Promise(resolve => setTimeout(resolve, 1500));
            commit("SET_LOADING", false)
        },
        async vertexMouseDown({commit}, payload) {
            commit("VERTEX_MOUSE_DOWN", payload)
        },
        async setViewPortDimensions({commit}, dimensions) {
            commit("SET_VIEWPORT_DIMENSIONS", dimensions)
        }
    }
})
