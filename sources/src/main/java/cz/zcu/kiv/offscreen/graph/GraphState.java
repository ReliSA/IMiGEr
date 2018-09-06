package cz.zcu.kiv.offscreen.graph;

import cz.zcu.kiv.offscreen.api.Group;
import cz.zcu.kiv.offscreen.api.SideBar;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class GraphState {

    private List<Group> groups = new ArrayList<>();
    private List<SideBar> sideBar = new ArrayList<>();
    private int highlightedVertex;
    private int highlightedEdge;


    public List<Group> getGroups() {
        return groups;
    }

    public List<SideBar> getSideBar() {
        return sideBar;
    }

    public int getHighlightedVertex() {
        return highlightedVertex;
    }

    public int getHighlightedEdge() {
        return highlightedEdge;
    }

    public void addGroup(Group group){
        this.groups.add(group);
    }

    public void addSideBar(SideBar sideBar){
        this.sideBar.add(sideBar);
    }

    public void addGroupsAll(Collection<Group> collection){
        this.groups.addAll(collection);
    }

    public void addSideBarsAll(Collection<SideBar> collection){
        this.sideBar.addAll(collection);
    }

    public void setHighlightedVertex(int highlightedVertex) {
        this.highlightedVertex = highlightedVertex;
    }

    public void setHighlightedEdge(int highlightedEdge) {
        this.highlightedEdge = highlightedEdge;
    }
}
