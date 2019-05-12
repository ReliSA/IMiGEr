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
                // pack the first n vertices into a group
                let group = Group.create();
                visibleVertices.slice(0, numberOfVerticesToGroup).forEach(vertex => {
                    group.addVertex(vertex);
                });
                app.nodeList.push(group);
                app.groupList.push(group);
                app.viewportComponent.addNode(group);
            }
        }
    }
}
