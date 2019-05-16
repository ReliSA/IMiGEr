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
                if (!this._groupByTypes(visibleVertices)) {
                    this._simpleGrouping(visibleVertices, numberOfVerticesToGroup);
                }
            }
        }
    }

    _groupByTypes(visibleVertices) {
        let groups = new Map();
        visibleVertices.forEach(vertex => {
            let entry = groups.get(vertex.archetype);
            if (entry !== undefined) {
                entry.push(vertex);
            } else {
                groups.set(vertex.archetype, [vertex]);
            }
        });

        if (groups.size > 2) {
            // group by types
            groups.forEach((v, k) => {
                let archetype = app.archetype.vertex[k];
                let groupName = archetype.name;
                this._createGroup(v, groupName);
            });
            return true;
        } else {
            // not enough vertex types (archetypes)
            return false;
        }
    }

    _simpleGrouping(visibleVertices, numberOfVerticesToGroup) {
        // just pack the first n vertices into a group
        this._createGroup(visibleVertices.slice(0, numberOfVerticesToGroup), null);
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
    }
}
