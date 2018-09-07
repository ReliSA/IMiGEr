/**
 * Class is used for manipulation with filters
 * @constructor
 */
function Filter() {

    /**
     * Function add values from input list to archetype selector.
     * @param vertexArchetypes list of vertex archetypes
     */
    this.initializeSelectors = function(vertexArchetypes) {

        let vertexArchetypeSelection = document.getElementById('vertexArchetypeSelection');

        vertexArchetypes.forEach(function(archetype) {
            let option = document.createElement("option");
            option.text = archetype.name;
            option.value = archetype.name;
            vertexArchetypeSelection.add(option);
        });
    };

    /**
     * Function remove all options from archetype selector.
     */
    this.resetSelectors = function () {
        let vertexArchetypeSelection = document.getElementById('vertexArchetypeSelection');

        while (vertexArchetypeSelection.length > 0){
            vertexArchetypeSelection.remove(0);
        }
    }

}