package cz.zcu.kiv.offscreen.services;

public interface IInitialEliminationService {

    /**
     * Reduce number of visible nodes using an initial elimination algorithm
     * @param rawJSONGraph Graph in raw JSON format to be reduced
     * @return JSON representation of the graph after IE being applied
     */
    public String ComputeInitialElimination(String rawJSONGraph);

}
