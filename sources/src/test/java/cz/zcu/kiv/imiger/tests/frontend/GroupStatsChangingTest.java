package cz.zcu.kiv.imiger.tests.frontend;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class GroupStatsChangingTest {
    static WebDriver browser;

    @BeforeAll
    public static void initTest() {
        SeleniumUtil.prepareConfigFile("emptyConfig.json");
        browser = SeleniumUtil.init();
        SeleniumUtil.loadGraphData("associatedArchetypeTest.json");
        for(int i = 0; i<=5;i++)
            SeleniumUtil.svgClick(browser.findElement(By.id("zoomOut")));
    }

    @Test
    public void ChangingStats() {
        String groupId = "";
        switchExludeMode();
        WebElement firstEcludedVertex = browser.findElement(By.id("vertex3"));

        SeleniumUtil.svgClick(firstEcludedVertex);
        System.out.println("Exclude vertex3 to group as first vertex of group");

        excludeToExistingGroup("vertex2");
        System.out.println("Exclude vertex2 to group");

        //get data-id of fgroup
        groupId = browser.findElement(By.className("group_vertices")).getAttribute("data-id");

        compareExpectedValues(groupId, new ArrayList<String>(Arrays.asList("2","0","0","0")));

        excludeToExistingGroup("vertex1");
        compareExpectedValues(groupId, new ArrayList<String>(Arrays.asList("2","2","0","2")));
        System.out.println("Exclude vertex1 to group");

        System.out.println("Remove vertex2 to group");
        removeVertexFromGroup("li2");
        compareExpectedValues(groupId, new ArrayList<String>(Arrays.asList("1","2","0","2")));

        System.out.println("Switch off stats for vertex1");
        toogleVertexInGroup("li1");
        compareExpectedValues(groupId, new ArrayList<String>(Arrays.asList("1","0","0","0")));

        System.out.println("Switch off stats for vertex3");
        toogleVertexInGroup("li3");
        compareExpectedValues(groupId, new ArrayList<String>(Arrays.asList("0","0","0","0")));

        System.out.println("Switch on stats for vertex1");
        toogleVertexInGroup("li3");
        excludeToExistingGroup("vertex2");
        compareExpectedValues(groupId, new ArrayList<String>(Arrays.asList("2","0","0","0")));

        //finaly test just one vertex in group
        String archetypePrefix = "v_archetype_4_";
        switchExludeMode();
        WebElement singleEcludedVertex = browser.findElement(By.id("vertex4"));
        System.out.println("Exclude vertex4 to group as first vertex of group");
        SeleniumUtil.svgClick(singleEcludedVertex);

        System.out.println("Checking group statistics");
        String actualValue1 = browser.findElement(By.id(archetypePrefix + "0")).findElement(By.tagName("text")).getText();
        String actualValue2 = browser.findElement(By.id(archetypePrefix + "2")).findElement(By.tagName("text")).getText();
        Assertions.assertEquals(actualValue1, "2");
        Assertions.assertEquals(actualValue2, "1");

        System.out.println("Expected: 2 - Real: " + actualValue1);
        System.out.println("Expected: 1 - Real: " + actualValue2);

    }

    /**
     * Turn on exclude mode for vertex exclude
     */
    private void switchExludeMode(){
        browser.findElement(By.id("remove")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    /**
     * Exclude vertex from graph to group
     * @param vertexId id of vertex to exclude
     */
    private void excludeToExistingGroup(String vertexId){
        WebElement secondExcludedVertex = browser.findElement(By.id(vertexId));
        SeleniumUtil.svgContexClick(secondExcludedVertex);
        WebElement selectedGroup = browser.findElement(By.className("component_color"));
        SeleniumUtil.svgClick(selectedGroup);
    }

    /**
     * Remove vertex from group back to graph
     * @param vertexId id of vertex
     */
    private void removeVertexFromGroup(String vertexId){
        WebElement removeVertex = browser.findElement(By.id(vertexId)).findElement(By.className("deleteItemGroup"));
        SeleniumUtil.svgClick(removeVertex);
    }

    /**
     * Toogle stats for vertex
     * @param vertexId id of vertex
     */
    private void toogleVertexInGroup(String vertexId){
        WebElement removeVertex = browser.findElement(By.id(vertexId)).findElement(By.className("toggleStat"));
        SeleniumUtil.svgClick(removeVertex);
    }

    /**
     * comparison of real values with expected values
     * @param groupId id of group
     * @param expectedValues list of expected values
     */
    private void compareExpectedValues(String groupId, ArrayList<String> expectedValues){
        System.out.println("Checking group statistics");
        String archetypePrefix = "g_archetype_" + groupId + "_";

        List<String> actualValues = new ArrayList<String>();

        for(int i = 0; i< expectedValues.size(); i++) {
            String archetypePos = i+"";
            String actualValue = browser.findElement(By.id(archetypePrefix + archetypePos)).findElement(By.tagName("text")).getText();
            actualValues.add(actualValue);
        }

        for(int i = 0; i< expectedValues.size(); i++) {
            Assertions.assertEquals(actualValues.get(i), expectedValues.get(i));
            System.out.println("Expected: " + expectedValues.get(i) + " - Real: " + actualValues.get(i));
        }
    }

    @AfterAll
    public static void finishTest() {
        SeleniumUtil.clear();
    }
}
