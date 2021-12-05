import {createStore} from 'vuex'
import loadTestData from '@/utils/graph.js'
import force_directed_layout from '@/utils/graph.js'

// scale factor
const scaleD = 0.1
const MAX_SCALE = 5;
const MIN_SCALE = 0.11;

export default createStore({
    state: {
        // flag indicating whether the application is busy loading/processing something
        loading: true,
        // flag indicating whether a graph has been loaded or not
        graph_loaded: false,
        // state attributes representing the graph
        edges: [],
        vertices: [],
        vertex_map: {},
        excludedVertices: [],
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
        UPDATE_SCALE(state, {targetX, targetY, direction}) {
            let original_scale = state.viewPort.scale;
            let size = [state.viewPort.width / original_scale, state.viewPort.height / original_scale];
            let full_size = [state.viewPort.width, state.viewPort.height];

            if (direction < 0) {
                if (original_scale >= MAX_SCALE) return;
                state.viewPort.scale += scaleD;
            } else {
                if (original_scale <= MIN_SCALE) return;
                state.viewPort.scale -= scaleD;
            }

            let shift_fraction = [targetX / full_size[0], targetY / full_size[1]];
            // console.log(original_scale, state.viewPort.scale, size);

            // console.log("original tx", state.viewPort.tx);

            state.viewPort.tx = state.viewPort.tx / original_scale;
            state.viewPort.ty = state.viewPort.ty / original_scale;

            // console.log("normalized tx", state.viewPort.tx);

            state.viewPort.tx -= (size[0] - size[0] * original_scale / state.viewPort.scale) * shift_fraction[0];
            state.viewPort.ty -= (size[1] - size[1] * original_scale / state.viewPort.scale) * shift_fraction[1];

            // console.log("updated tx", state.viewPort.tx);

            state.viewPort.tx *= state.viewPort.scale;
            state.viewPort.ty *= state.viewPort.scale;

            // console.log("denormalized tx", state.viewPort.tx);
        },
        // mutations of viewport tx/ty in order to center the viewport on the graph
        ADJUST_VIEWPORT(state){
            state.viewPort.scale = 0.3;
            state.viewPort.tx = - (state.worldSize - state.viewPort.width / state.viewPort.scale) / 2 * state.viewPort.scale;
            state.viewPort.ty = - (state.worldSize - state.viewPort.height / state.viewPort.scale) / 2 * state.viewPort.scale;
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
        SET_GRAPH_DATA(state, {edges, vertices, vertex_map}) {
            state.vertex_map = vertex_map
            state.vertices = vertices
            state.edges = edges
        },
        // mutation for toggling the loading state
        SET_LOADING(state, loading) {
            state.loading = loading
        },
        // mutation for notifying of graph being loaded
        SET_GRAPH_LOADED(state, loaded){
            state.graph_loaded = loaded;
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

        // mutation to be used to reset all graph data
        RESET_GRAPH_DATA(state) {
            state.edges = [];
            state.vertices = [];
            state.vertex_map = {};
            state.vertexBeingDragged = null;
        },

        // set the page behaviour when a vertex is clicked on
        SET_CLICK_BEHAVIOUR(state, clickBehaviour) {
            state.clickBehaviour = clickBehaviour
        },

        // exclude a vertex
        SET_VERTEX_EXCLUDED(state, vertex) {
            vertex.excluded = true;
            state.excludedVertices.push(vertex)
            vertex.edges.forEach(edgeId => {
                // iterate over all edges that are connected to the node
                state.edges[edgeId].excluded = true
            })
        },

        // include an edge
        SET_VERTEX_INCLUDED(state, vertex) {
            vertex.excluded = false;
            let index = state.excludedVertices.indexOf(vertex);
            if (index !== -1) {
                state.excludedVertices.splice(index, 1);
            }
        },

        // exclude an edge
        SET_EDGE_EXCLUDED(state, {edge, excluded}) {
           edge.excluded = excluded
        }
    },
    actions: {
        async updateScale({commit}, event) {
            commit("UPDATE_SCALE", event)
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
        async excludeVertex({state, commit}, vertex) {
            commit("SET_VERTEX_EXCLUDED", vertex)
            // iterate over all edges that are connected to the node
            vertex.edges.forEach(edgeId => {
                // and exclude them
                commit("SET_EDGE_EXCLUDED", {edge: state.edges[edgeId], excluded: true})
            })
        },
        async includeVertex({commit, state}, vertex) {
            commit("SET_VERTEX_INCLUDED", vertex)
            // iterate over all edges that are connected to the node
            vertex.edges.forEach(edgeId => {
                let edge = state.edges[edgeId]
                if (!state.vertices[edge.from].excluded  && !state.vertices[edge.to].excluded) {
                    // and include them only if both nodes it is connected to are not excluded
                    commit("SET_EDGE_EXCLUDED", {edge: state.edges[edgeId], excluded: false})
                }
            })
        },
        async vertexClicked({dispatch, state}, vertex) {
           if (state.clickBehaviour === "move") {
               dispatch("toggleVertexHighlightState", vertex)
           } else {
               dispatch("excludeVertex", vertex)
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
            commit("ADJUST_VIEWPORT")
            commit("SET_LOADING", false)
            commit("SET_GRAPH_LOADED", true)
        },
        async vertexMouseDown({commit}, payload) {
            commit("VERTEX_MOUSE_DOWN", payload)
        },
        async restartVisualization({commit}) {
            commit("SET_GRAPH_LOADED", false);
            commit("RESET_GRAPH_DATA");
        },
        async setViewPortDimensions({commit}, dimensions) {
            commit("SET_VIEWPORT_DIMENSIONS", dimensions)
        }
    }
})
