package cz.zcu.kiv.offscreen.graph;

import cz.zcu.kiv.offscreen.api.Group;
import cz.zcu.kiv.offscreen.api.Position;
import cz.zcu.kiv.offscreen.api.SideBar;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class GraphState {

    private List<Group> groups = new ArrayList<>();
    private List<Position> positions = new ArrayList<>();
    private List<SideBar> sideBar = new ArrayList<>();
    private int selectedVertex;
    private int selectedEdge;


    public List<Group> getGroups() {
        return groups;
    }

    public List<Position> getPositions() {
        return positions;
    }

    public List<SideBar> getSideBar() {
        return sideBar;
    }

    public int getSelectedVertex() {
        return selectedVertex;
    }

    public int getSelectedEdge() {
        return selectedEdge;
    }

    public void addGroup(Group group){
        this.groups.add(group);
    }

    public void addPosition(Position position){
        this.positions.add(position);
    }

    public void addSideBar(SideBar sideBar){
        this.sideBar.add(sideBar);
    }

    public void addGroupsAll(Collection<Group> collection){
        this.groups.addAll(collection);
    }

    public void addPositionsAll(Collection<Position> collection){
        this.positions.addAll(collection);
    }

    public void addSideBarsAll(Collection<SideBar> collection){
        this.sideBar.addAll(collection);
    }

    public void setSelectedVertex(int selectedVertex) {
        this.selectedVertex = selectedVertex;
    }

    public void setSelectedEdge(int selectedEdge) {
        this.selectedEdge = selectedEdge;
    }
}
