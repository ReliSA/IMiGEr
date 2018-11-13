class Filter {

	constructor() {
		this._filterList = [];
	}

	run() {
		console.log(this._filterList);
	}

	/**
     * Function add values from input list to archetype selector.
     * @param vertexArchetypes list of vertex archetypes
     */
    initializeSelectors(vertexArchetypes) {
        let vertexArchetypeSelection = document.getElementById('vertexArchetypeSelection');

        vertexArchetypes.forEach(function(archetype) {
            let option = document.createElement("option");
            option.text = archetype.name;
            option.value = archetype.name;
            vertexArchetypeSelection.add(option);
        });
    }

    /**
     * Function remove all options from archetype selector.
     */
    resetSelectors() {
        let vertexArchetypeSelection = document.getElementById('vertexArchetypeSelection');

        while (vertexArchetypeSelection.length > 0){
            vertexArchetypeSelection.remove(0);
        }
    }

}