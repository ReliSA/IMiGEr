class InitialElimination {
    /**
     * @constructor
     */
    constructor(maxVisibleComponents) {
        this._maxVisibleComponents = maxVisibleComponents;
    }

    /**
     * Run initial elimination.
     */
    run() {
        let visibleVertices = app.viewportComponent.vertexList;
        let visibleGroups = app.viewportComponent.groupList;

        let visibleComponentsCount = visibleVertices.length + visibleGroups.length;

        if (visibleComponentsCount > this._maxVisibleComponents) {
            let numberOfVerticesToGroup = Math.min(
                    visibleVertices.length,
                    visibleComponentsCount - this._maxVisibleComponents);

            if (numberOfVerticesToGroup > 0) {
                this._groupByTypes(visibleVertices, numberOfVerticesToGroup);
            }
        }
    }

    _groupByTypes(visibleVertices, numberOfVerticesToGroup) {
        let groups = new Map();
        visibleVertices.forEach(vertex => {
            let entry = groups.get(vertex.archetype);
            if (entry !== undefined) {
                entry.push(vertex);
            } else {
                groups.set(vertex.archetype, [vertex]);
            }
        });

        if (groups.size > 0) {
            // group by types
            this._createGroupsWithCoupleOfVerticesLeftOut(visibleVertices, groups, numberOfVerticesToGroup);
        }
    }

    _createGroupsWithCoupleOfVerticesLeftOut(visibleVertices, groups, numberOfVerticesToGroup) {
        let numberOfVertices = visibleVertices.length;
        let numberOfGroups = groups.size;
        let numberToLeftOut = numberOfVertices - numberOfVerticesToGroup - numberOfGroups;

        groups.forEach((vertices, k) => {
            let p = vertices.length / numberOfVertices;
            let numberToLeftOutInThisGroup = Math.floor(p * numberToLeftOut);
            let filtered = this._removeMostConnected(vertices, numberToLeftOutInThisGroup);

            if (filtered.length > 0) {
                let archetype = app.archetype.vertex[k];
                let groupName = archetype.name;
                let group = this._createGroup(filtered, groupName);
                this._circularLayout(group, vertices);
            }
        });
    }

    _removeMostConnected(vertices, count) {
        vertices.sort((a, b) => a.countEdges() - b.countEdges());
        return vertices.slice(0, vertices.length - count);
    }

    _createGroup(vertices, name) {
        let group = Group.create();
        vertices.forEach(vertex => {
            group.addVertex(vertex);
        });
        if (name !== null) {
            group.name = name;
        }

        app.nodeList.push(group);
        app.groupList.push(group);
        app.viewportComponent.addNode(group);

        return group;
    }

    _circularLayout(group, vertices) {
        let center = group.position;

        let MIN_DISTANCE = 200;
        let MAX_DISTANCE = 400;
        let distance = MIN_DISTANCE
            + (group.vertexList.length / this._maxVisibleComponents * (MAX_DISTANCE - MIN_DISTANCE));

        vertices.forEach(v => {
            let angle = Math.random() * Math.PI * 2;
            let coordinates = new Coordinates(
                center.x + distance * Math.cos(angle) - (v.size.width / 2),
                center.y + distance * Math.sin(angle)
            );
            v.position = coordinates;
            v.move(coordinates);
        });

        group.move(center);
    }

}
