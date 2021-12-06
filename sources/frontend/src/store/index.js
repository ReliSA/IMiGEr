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
        // vertex that is being dragged
        vertexBeingDragged: null,
        // define the size of the world
        worldSize: 5000,
        // define a global style object for graph components
        style: {
            edge: {
                strokeColor: "#888888AA",
                tipColor: "#444444",
                strokeWidth: 4,
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
        }
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
        SET_GRAPH_DATA(state, {edges, vertices}) {
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

        // mutation to be when invoked a mouse button has been clicked down on a vertex
        VERTEX_MOUSE_DOWN(state, {vertex, down}) {
            if (down) {
                state.vertexBeingDragged = vertex
            } else {
                state.vertexBeingDragged = null
            }
        }
    },
    actions: {
        async updateScale({commit}, event) {
            commit("UPDATE_SCALE", event)
        },
        async toggleVertexHighlightState({commit}, vertex) {
            if (vertex.highlighted) {
                commit("DISABLE_VERTEX_HIGHLIGHT", vertex)
            } else {
                commit("HIGHLIGHT_VERTEX", vertex)
            }
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
        }
    }
})
