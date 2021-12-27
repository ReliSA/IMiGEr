export default {
    /**
     * Constructs an in-memory representation of the loaded graph. Reindexes vertices and edges to match their
     * array positions and adds edge list to each vertex to improve performance.
     */
    prepare_graph_object(loaded_graph, size) {
        loaded_graph.vertex_map = {};
        loaded_graph.edge_map = {};

        function add_edge_to_vertex(vertex_positional_id, current_edge) {
            // eslint-disable-next-line no-prototype-builtins
            if (!loaded_graph.edge_map.hasOwnProperty(vertex_positional_id)) {
                loaded_graph.edge_map[vertex_positional_id] = [];
            }
            if (!loaded_graph.edge_map[vertex_positional_id].includes(current_edge)) {
                loaded_graph.edge_map[vertex_positional_id].push(current_edge);
            }
        }

        for (let i = 0; i < loaded_graph["vertices"].length; i++) {
            loaded_graph.vertex_map[loaded_graph["vertices"][i].id] = i;
        }
        for (let i = 0; i < loaded_graph["edges"].length; i++) {
            add_edge_to_vertex(loaded_graph.vertex_map[loaded_graph["edges"][i].from], i);
            add_edge_to_vertex(loaded_graph.vertex_map[loaded_graph["edges"][i].to], i);
        }

        /// RESULT ///
        // loaded_graph.vertices ~= random vertex IDs                                   - source data
        // loaded_graph.edges ~= random edge IDs                                        - source data
        // loaded_graph.edge.from, to ~= random vertex IDs                              - source data
        // loaded_graph.vertex_map ~= random vertex ID -> positional vertex ID          - added
        // loaded_graph.edge_map ~= positional vertex ID -> array[ positional edge ID ] - added

        this.initialize_xy(loaded_graph, size)
    },

    /**
     * Adds position attributes to vertices.
     */
    initialize_xy(loaded_graph, size) {
        for (let i = 0; i < loaded_graph.vertices.length; i++) {
            loaded_graph.vertices[i].x = size + Math.random() * (size);
            loaded_graph.vertices[i].y = size + Math.random() * (size);
        }
    },

    random_layout(loaded_graph, width, height, margin) {
        for (let i = 0; i < loaded_graph.vertices.length; i++) {
            loaded_graph.vertices[i].x = margin + Math.random() * (width - 2*margin);
            loaded_graph.vertices[i].y = margin + Math.random() * (height - 2*margin);
        }
    },

    force_directed_layout(loaded_graph, width, height, margin) {
        const max_speed = 5;
        const vertex_repulse_accel = 3;
        const edge_accel = 3;
        const damp = 0.05;
        const iters = 500;
        const friction = 0.9;
        const target_dist = 250;
        const critical_dist = 100;
        const critical_dist_repulse_factor = 5;

        let movement = []; // struct array holding all FDL-related information w.r.t. each vertex
        let NUM_V = loaded_graph["vertices"].length;
        let NUM_E = loaded_graph["edges"].length;

        if (NUM_V > 100){
            this.random_layout(loaded_graph, width, height, margin);
            return;
        }

        this.separate_components(loaded_graph, width, height); // in order to prevent unnecessary clash

        for (let i = 0; i < NUM_V; i++) {
            movement[i] = {};
            movement[i].x = loaded_graph["vertices"][i].x;
            movement[i].y = loaded_graph["vertices"][i].y;
            movement[i].ax = 0;
            movement[i].ay = 0;
            movement[i].vx = 0;
            movement[i].vy = 0;
            movement[i].is_being_expelled = false;
        }

        for (let k = 0; k < iters; k++) {
            // vertex forces
            // TODO: Implement k-NN. O(n^2) is way too oof-y. //tr01an
            for (let i = 0; i < NUM_V; i++) {
                for (let j = 0; j < NUM_V; j++) {
                    if (i === j) continue;

                    let dx = (movement[j].x - movement[i].x);
                    let dy = (movement[j].y - movement[i].y);
                    let dt_2 = dx * dx + dy * dy;

                    if (dt_2 < target_dist * target_dist) {
                        movement[i].ax -= dx * vertex_repulse_accel;
                        movement[i].ay -= dy * vertex_repulse_accel;
                    }

                    if (dt_2 < critical_dist * critical_dist) {
                        movement[i].ax -= dx * vertex_repulse_accel * critical_dist_repulse_factor;
                        movement[i].ay -= dy * vertex_repulse_accel * critical_dist_repulse_factor;
                    }
                }

                // pull towards the center
                movement[i].ax += (width / 2 - movement[i].x) * 0.2;
                movement[i].ay += (width / 2 - movement[i].y) * 0.2;
            }

            // edge forces
            for (let i = 0; i < NUM_E; i++) {
                let a = loaded_graph.vertex_map[loaded_graph["edges"][i].from]; //
                let b = loaded_graph.vertex_map[loaded_graph["edges"][i].to]; // map random vertex ID to positional ID

                if (a === b){ // skip inward edges
                    continue;
                }

                let dx = (movement[b].x - movement[a].x);
                let dy = (movement[b].y - movement[a].y);
                let dt = Math.sqrt(dx * dx + dy * dy);
                let attractive_force = (dt - target_dist) / dt;  // if negative, then repulsive

                movement[a].ax += attractive_force * dx * edge_accel;
                movement[a].ay += attractive_force * dy * edge_accel;
                movement[b].ax -= attractive_force * dx * edge_accel;
                movement[b].ay -= attractive_force * dy * edge_accel;
            }

            // integration step (dt = 1)
            for (let i = 0; i < NUM_V; i++) {
                // denanify
                if(isNaN(movement[i].ax) || isNaN(movement[i].ay)) {
                    movement[i].ax = 0;
                    movement[i].ay = 0;
                }

                // damp
                movement[i].vx += movement[i].ax * damp;
                movement[i].vy += movement[i].ay * damp;

                // clip
                movement[i].vx = Math.min(max_speed, movement[i].vx);
                movement[i].vy = Math.min(max_speed, movement[i].vy);

                // friction
                movement[i].vx *= friction;
                movement[i].vy *= friction;

                // integrate
                movement[i].x += movement[i].vx;
                movement[i].y += movement[i].vy;

                // reset (force is immediate)
                movement[i].ax = 0;
                movement[i].ay = 0;
            }
        }

        let min_x = movement[0].x;
        let min_y = movement[0].y;
        let max_x = movement[0].x;
        let max_y = movement[0].y;

        for (let i = 1; i < NUM_V; i++) {
            if (movement[i].x < min_x) {
                min_x = movement[i].x;
            } else if (movement[i].x > max_x) {
                max_x = movement[i].x;
            }

            if (movement[i].y < min_y) {
                min_y = movement[i].y;
            } else if (movement[i].y > max_y) {
                max_y = movement[i].y;
            }
        }

        // rescale to world size
        for (let i = 0; i < NUM_V; i++) {
            loaded_graph["vertices"][i].x = (movement[i].x - min_x) / (max_x - min_x) * (width - margin * 2) + margin;
            loaded_graph["vertices"][i].y = (movement[i].y - min_y) / (max_y - min_y) * (width - margin * 2) + margin;
        }
    },

    separate_components(loaded_graph, width, height) {
        function dfs_component(id) {
            let ret = new Set();

            function dfs(id) {
                if (ret.has(id)) {
                    return;
                }

                ret.add(id);

                // console.log('id =', id, ret);

                let vertex_positional_id = loaded_graph.vertex_map[id]; // mapping random id to positional

                // console.log("corresponding vertex = ", vertex);

                let edges = loaded_graph.edge_map[vertex_positional_id];
                if (edges !== undefined) { // if this vertex has any edges
                    // console.log("vertex has edges");
                    for (let i = 0; i < edges.length; i++) {
                        let edge_positional_id = edges[i];
                        // console.log("found edge positional id ", edge_positional_id);

                        let edge = loaded_graph["edges"][edge_positional_id]; // edges[i] is positional
                        // console.log("corresponding to edge ", edge);
                        // console.log("which has vertices with random indices ", edge.from, edge.to);

                        if (edge.from === id) { // move to neighboring vertex (random id)
                            dfs(edge.to);
                        } else {
                            dfs(edge.from);
                        }
                    }
                }
            }

            dfs(id);
            return ret;
        }

        let all_ids = new Set(); // set of RANDOM IDs !
        for (let i = 0; i < loaded_graph["vertices"].length; i++) {
            all_ids.add(loaded_graph["vertices"][i].id);
        }
        let components = [];

        while (all_ids.size > 0) {
            const [first] = all_ids; // = get "some" element from 'all_ids' (this syntax is apparently a thing in JS)
            let component = dfs_component(first);
            components.push(component);
            component.forEach(el => all_ids.delete(el));
        }

        // give each component a stripe of world with thickness corresponding to component size
        let start_x = 0, end_x;
        for (let i = 0; i < components.length; i++) {
            end_x = start_x + width * (components[i].size / loaded_graph["vertices"].length);

            components[i].forEach(v => {
                let positional_id = loaded_graph.vertex_map[v]; // mapping random id to positional id
                loaded_graph["vertices"][positional_id].x = start_x + Math.random() * (end_x - start_x);
                loaded_graph["vertices"][positional_id].y = Math.random() * height;
            });

            start_x = end_x + 1000;
        }
    }
}
