/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cz.zcu.kiv.offscreen.api;

import cz.zcu.kiv.offscreen.graph.SubedgeInfo;

import java.util.List;

/**
 *
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public interface EdgeInterface {

    public String getFrom();

    public String getTo();

    public int getId();

    public List<SubedgeInfo> getSubedgeInfo();

    public void setSubedgeInfo(List<SubedgeInfo> subedgeInfo);
}
