export default {
    /**
     * Constructs an in-memory representation of the loaded graph. Reindexes vertices and edges to match their
     * array positions and adds edge list to each vertex to improve performance.
     */
    prepare_graph_object(input_graph, size) {
        let loaded_graph = Object.assign({}, input_graph);

        function add_edge_to_vertex(vertex, current_edge) {
            // eslint-disable-next-line no-prototype-builtins
            if (!loaded_graph["vertices"][vertex].hasOwnProperty("edges")) {
                loaded_graph["vertices"][vertex].edges = [];
            }
            if (!loaded_graph["vertices"][vertex].edges.includes(current_edge)) {
                loaded_graph["vertices"][vertex].edges.push(current_edge);
            }
        }

        for (let i = 0; i < loaded_graph["vertices"].length; i++) {
            loaded_graph["vertices"][i].id = i;
        }
        for (let i = 0; i < loaded_graph["edges"].length; i++) {
            loaded_graph["edges"][i].id = i;

            add_edge_to_vertex(loaded_graph["edges"][i].from, i);
            add_edge_to_vertex(loaded_graph["edges"][i].to, i);
        }
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

    force_directed_layout(loaded_graph, width, height, margin) {
        this.separate_components(loaded_graph, width, height); // in order to prevent unnecessary clash

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
                let a = loaded_graph["edges"][i].from;
                let b = loaded_graph["edges"][i].to;
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
                let vertex = loaded_graph["vertices"][id];
                if (vertex.edges !== undefined) {
                    for (let i = 0; i < vertex.edges.length; i++) {
                        let edge = loaded_graph["edges"][vertex.edges[i]];
                        if (edge.from === id) {
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

        let all_ids = new Set();
        for (let i = 0; i < loaded_graph["vertices"].length; i++) {
            all_ids.add(i);
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
                loaded_graph["vertices"][v].x = start_x + Math.random() * (end_x - start_x);
                loaded_graph["vertices"][v].y = Math.random() * height;
            });

            start_x = end_x + 1000;
        }
    }
}
