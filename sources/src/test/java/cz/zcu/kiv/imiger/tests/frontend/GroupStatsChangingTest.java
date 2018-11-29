package cz.zcu.kiv.imiger.tests.frontend;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.*;

class GroupStatsChangingTest {
    private static final Logger logger = LogManager.getLogger();
    private static WebDriver browser;

    @BeforeAll
    static void initTest() {
        SeleniumUtil.prepareConfigFile("emptyConfig.json");
        browser = SeleniumUtil.init();
        SeleniumUtil.switchToRaw();
        SeleniumUtil.loadGraphData("RawAssociatedArchetypeTest.json");
    }

    @Test
    void ChangingStats() {
        String groupId;
        SeleniumUtil.switchToExcludeMode();
        WebElement firstExcludedVertex = browser.findElement(By.cssSelector("[data-id='vertices']"))
                .findElement(By.cssSelector("[data-id='3']"));

        SeleniumUtil.svgRectClick(firstExcludedVertex);
        logger.debug("Exclude vertex3 to group as first vertex of group");

        excludeToExistingGroup("2");
        logger.debug("Exclude vertex2 to group");

        //get data-id of fgroup
        groupId = browser.findElement(By.id("excludedNodeListComponent"))
                .findElement(By.className("node")).getAttribute("data-id");

        Map<String, String> map = new HashMap<>();
        map.put("1", "2");
        map.put("3", "1");
        compareExpectedValues(groupId, map);

//        EXCLUDING VERTICES FROM GROUPS IS NOT SUPPORTED YET
//        excludeToExistingGroup("1");
//        compareExpectedValues(groupId, new ArrayList<String>(Arrays.asList("2","2","0","2")));
//        logger.debug("Exclude vertex1 to group");
//
//        logger.debug("Remove vertex2 to group");
//        removeVertexFromGroup("li2");
//        compareExpectedValues(groupId, new ArrayList<String>(Arrays.asList("1","2","0","2")));
//
//        logger.debug("Switch off stats for vertex1");
//        toogleVertexInGroup("li1");
//        compareExpectedValues(groupId, new ArrayList<String>(Arrays.asList("1","0","0","0")));
//
//        logger.debug("Switch off stats for vertex3");
//        toogleVertexInGroup("li3");
//        compareExpectedValues(groupId, new ArrayList<String>(Arrays.asList("0","0","0","0")));
//
//        logger.debug("Switch on stats for vertex1");
//        toogleVertexInGroup("li3");
//        excludeToExistingGroup("vertex2");
//        compareExpectedValues(groupId, new ArrayList<String>(Arrays.asList("2","0","0","0")));
//
//        //finaly test just one vertex in group
//        String archetypePrefix = "v_archetype_4_";
//        SeleniumUtil.switchToExcludeMode();
//        WebElement singleEcludedVertex = browser.findElement(By.id("vertex4"));
//        logger.debug("Exclude vertex4 to group as first vertex of group");
//        SeleniumUtil.svgClick(singleEcludedVertex);
//
//        logger.debug("Checking group statistics");
//        String actualValue1 = browser.findElement(By.id(archetypePrefix + "0")).findElement(By.tagName("text")).getText();
//        String actualValue2 = browser.findElement(By.id(archetypePrefix + "2")).findElement(By.tagName("text")).getText();
//        Assertions.assertEquals(actualValue1, "2");
//        Assertions.assertEquals(actualValue2, "1");
//
//        logger.debug("Expected: 2 - Real: " + actualValue1);
//        logger.debug("Expected: 1 - Real: " + actualValue2);

    }

    /**
     * Exclude vertex from graph to group
     * @param vertexId id of vertex to exclude
     */
    private void excludeToExistingGroup(String vertexId){
        WebElement secondExcludedVertex = browser.findElement(By.cssSelector("[data-id='vertices']"))
                .findElement(By.cssSelector("[data-id='" + vertexId + "']"));

        SeleniumUtil.svgContextClick(secondExcludedVertex.findElement(By.tagName("rect")));
        WebElement selectedGroup = browser.findElement(By.className("context-menu")).findElements(By.tagName("li")).get(0);
        selectedGroup.click();
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
    private void compareExpectedValues(String groupId, Map<String, String> expectedValues){
        logger.debug("Checking group statistics");
        String archetypePrefix = "#vertexArchetypeIcon-";

        WebElement nodeList = browser.findElement(By.id("excludedNodeListComponent"))
                .findElement(By.className("node-list"));

        for (String key : expectedValues.keySet()) {

            List<WebElement> gList = nodeList.findElement(By.cssSelector("[href='" + archetypePrefix + key + "']"))
                    .findElements(By.xpath("//parent::*[name()='g']"));


            String actualValue = gList.get(gList.size() - 1)
                    .findElement(By.tagName("text")).getText();

            Assertions.assertEquals(actualValue, expectedValues.get(key));
        }
    }

    @AfterAll
    static void finishTest() {
        SeleniumUtil.clear();
    }
}
