import {createStore} from 'vuex'
import loadTestData from '@/utils/graph.js'
import force_directed_layout from '@/utils/graph.js'

// scale factor
const scaleD = 0.1
const MAX_SCALE = 5;
const MIN_SCALE = 0.11;
const TIMELINE_HEIGHT = 200;

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
        edge_map: {},
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
            },
            timeline: {
                height: TIMELINE_HEIGHT,
            }
        },
        viewPort: {
            scale: 1,
            tx: 0,
            ty: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            X: 0,
            Y: 0
        },
        clickBehaviour: "move",

        // required in order to be able to connect excluded nodes with the rest of the graph (contains absolute coordinates relative to the window)
        excludedNodesClientRects: {},

        // defines whether the signing/signup menu shall be displayed on the main page
        displayAuthComponent: false,

        // defines whether to display a timeline in the SGV view
        showTimeline: false,
    },
    mutations: {
        // mutations of the viewports scale
        UPDATE_SCALE(state, {targetX, targetY, direction}) {
            let d;
            if (direction < 0) {
                if (state.viewPort.scale >= MAX_SCALE) return;
                d = +scaleD;
            } else {
                if (state.viewPort.scale <= MIN_SCALE) return;
                d = -scaleD;
            }

            function new_value_of_dimension(t, w, a, b){
                return -(d*(a-b) - t*(state.viewPort.scale+d)) / state.viewPort.scale;
            }

            state.viewPort.tx = new_value_of_dimension(state.viewPort.tx, state.viewPort.width, targetX, state.viewPort.X);
            state.viewPort.ty = new_value_of_dimension(state.viewPort.ty, state.viewPort.height, targetY, state.viewPort.Y);
            state.viewPort.scale += d;
        },
        // mutations of viewport tx/ty in order to center the viewport on the graph
        CENTER_VIEWPORT(state){
            // TODO include viewPort.X/Y information for precise centering (imprecise is sufficient)
            state.viewPort.scale = 0.3;
            state.viewPort.tx = - (state.worldSize * state.viewPort.scale - state.viewPort.width) / 2;
            state.viewPort.ty = - (state.worldSize * state.viewPort.scale - state.viewPort.height) / 2;
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
        SET_GRAPH_DATA(state, {edges, vertices, vertex_map, edge_map}) {
            state.vertex_map = vertex_map
            state.edge_map = edge_map
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

        // mutation to be used to reset all graph data
        RESET_GRAPH_DATA(state) {
            state.edges = [];
            state.vertices = [];
            state.vertex_map = {};
            state.vertexBeingDragged = null;
            state.edge_map = {};
            state.excludedVertices = [];
        },

        // sets viewport dimensions
        SET_VIEWPORT_BOX(state, {x, y, width, height}) {
            state.viewPort.X = x
            state.viewPort.Y = y
            state.viewPort.width = width
            state.viewPort.height = height
        },

        // set the page behaviour when a vertex is clicked on
        SET_CLICK_BEHAVIOUR(state, clickBehaviour) {
            state.clickBehaviour = clickBehaviour
        },

        // exclude a vertex
        SET_VERTEX_EXCLUDED(state, vertex) {
            vertex.excluded = true;
            state.excludedVertices.push(vertex)
            state.edge_map[vertex.id].forEach(edgeId => {
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
        },

        // add a client box of an excluded vertex box
        ADD_EXCLUDED_VERTEX_CLIENT_BOX(state, {vertex, clientRect}) {
            state.excludedNodesClientRects[vertex.id] = {
                x: clientRect.x,
                y: clientRect.y,
                width: clientRect.width,
                height: clientRect.height
            }
        },

        // remove a client box of an excluded vertex box
        REMOVE_EXCLUDED_VERTEX_CLIENT_BOX(state, vertex) {
            delete state.excludedNodesClientRects[vertex.id]
        },

        // sets the visibility of the auth component on the main scree
        SET_AUTH_COMPONENT_VISIBILITY(state, authEnabled) {
            state.displayAuthComponent = authEnabled;
        },

        // sets the visibility of the timeline component
        SET_TIMELINE_COMPONENT_VISIBILITY(state, timelineEnabled) {
            state.showTimeline = timelineEnabled;
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
            state.edge_map[vertex.id].forEach(edgeId => {
                // and exclude them
                commit("SET_EDGE_EXCLUDED", {edge: state.edges[edgeId], excluded: true})
            })
        },
        async includeVertex({commit, state}, vertex) {
            commit("SET_VERTEX_INCLUDED", vertex)
            // iterate over all edges that are connected to the node
            state.edge_map[vertex.id].forEach(edgeId => {
                let edge = state.edges[edgeId]
                if (!state.vertices[edge.from].excluded && !state.vertices[edge.to].excluded) {
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
            state.edge_map[vertex.id].forEach(edgeId => {
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
            commit("CENTER_VIEWPORT")
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
            commit("SET_VIEWPORT_BOX", dimensions)
        },
        async addExcludedVertexClientRect({commit}, payload) {
            commit("ADD_EXCLUDED_VERTEX_CLIENT_BOX", payload)
        },
        async removeExcludedVertexClientRect({commit}, vertex) {
            commit("REMOVE_EXCLUDED_VERTEX_CLIENT_BOX", vertex)
        },
        async setClickBehavior({commit}, behavior) {
            commit("SET_CLICK_BEHAVIOUR", behavior)
        },
        async setAuthComponentVisibility({commit}, displayAuthComponent) {
            commit("SET_AUTH_COMPONENT_VISIBILITY", displayAuthComponent)
        },
        async setTimelineComponentVisibility({commit}, displayTimeline) {
            commit("SET_TIMELINE_COMPONENT_VISIBILITY", displayTimeline)
        }
    }
})
