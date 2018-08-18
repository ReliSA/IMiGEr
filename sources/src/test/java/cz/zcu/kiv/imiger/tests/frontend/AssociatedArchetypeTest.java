package cz.zcu.kiv.imiger.tests.frontend;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.Arrays;
import java.util.List;

public class AssociatedArchetypeTest {
    static WebDriver browser;

    @BeforeAll
    public static void initTest() {
        SeleniumUtil.prepareConfigFile("emptyConfig.json");
        browser = SeleniumUtil.init();
        SeleniumUtil.loadGraphData("associatedArchetypeTest.json");
    }

    @Test
    public void visibilityOfAllIcons() {
        checkVisibilityOfIcons("vertex1", Arrays.asList("2", "4"));

        checkVisibilityOfIcons("vertex2",Arrays.asList("1"));

        checkVisibilityOfIcons("vertex3",Arrays.asList("1"));

        checkVisibilityOfIcons("vertex4",Arrays.asList("1", "3"));

        checkVisibilityOfIcons("vertex5",Arrays.asList("4"));
    }

    @Test
    public void vertexHighlighting() {
        //associated vertices to V1
        checkHighlightedVertices("archetype1_1", Arrays.asList("vertex2", "vertex3"));
        checkHighlightedVertices("archetype1_3", Arrays.asList("vertex4"));

        //associated vertices to V2
        checkHighlightedVertices("archetype2_0", Arrays.asList("vertex1"));

        //associated vertices to V3
        checkHighlightedVertices("archetype3_0", Arrays.asList("vertex1"));

        //associated vertices to V4
        checkHighlightedVertices("archetype4_0", Arrays.asList("vertex1"));
        checkHighlightedVertices("archetype4_2", Arrays.asList("vertex5"));

        //associated vertices to V5
        checkHighlightedVertices("archetype5_3", Arrays.asList("vertex4"));
    }

    /**
     * Check if all the expected associated archetype icons are present
     * @param elementId Id of the vertex in the DOM
     * @param expectedArchetypeIconTexts Texts of all the associated archetype icons that are expected to occur
     */
    private void checkVisibilityOfIcons(String elementId, List<String> expectedArchetypeIconTexts) {
        System.out.println("Checking element " + elementId);
        WebElement vertex = browser.findElement(By.id(elementId));

        List<WebElement> associatedArchetypeIcons = vertex.findElements(By.className("associatedArchetype"));

        System.out.println("Associated archetypes: \n");
        Assertions.assertEquals(associatedArchetypeIcons.size(), expectedArchetypeIconTexts.size());

        for (int i = 0; i < expectedArchetypeIconTexts.size(); i++) {
            WebElement icon = associatedArchetypeIcons.get(i);
            System.out.println("Icon id: " + icon.getAttribute("id"));

            String archetypeIconText = icon.findElement(By.tagName("text")).getText();
            System.out.println("Icon text: " + archetypeIconText +"\n");

            Assertions.assertEquals(expectedArchetypeIconTexts.get(i), archetypeIconText);
        }
    }

    /**
     * Check if all the expected vertices are highlighted when clicking on the associated archetype icon
     * @param associatedArchetypeIconId Id of the associated archetype icon in the DOM
     * @param expectedHighlightedVertexIds Ids of all the vertices that are expected to be highlighted
     */
    private void checkHighlightedVertices(String associatedArchetypeIconId, List<String> expectedHighlightedVertexIds) {
        System.out.println("\nChecking associated vertices for archetype icon with id: " + associatedArchetypeIconId);
        WebElement associatedArchetypeIcon = browser.findElement(By.id(associatedArchetypeIconId));
        SeleniumUtil.svgClick(associatedArchetypeIcon);

        List<WebElement> highlightedVertices = browser.findElements(By.className("colorHighlightArchetype"));

        System.out.println("Number of highlighted vertices: " + highlightedVertices.size());
        Assertions.assertEquals(expectedHighlightedVertexIds.size(), highlightedVertices.size());

        for(int i = 0; i < highlightedVertices.size(); i++) {
            WebElement vertex = highlightedVertices.get(i);
            String id = vertex.getAttribute("id");

            System.out.println(id);

            Assertions.assertEquals(expectedHighlightedVertexIds.get(i), id);
        }

        SeleniumUtil.svgClick(associatedArchetypeIcon);
    }

    @AfterAll
    public static void finishTest() {
        SeleniumUtil.clear();
    }
}
