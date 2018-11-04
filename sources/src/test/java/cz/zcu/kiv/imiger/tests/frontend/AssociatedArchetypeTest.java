package cz.zcu.kiv.imiger.tests.frontend;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.Arrays;
import java.util.List;


class AssociatedArchetypeTest {
    private static WebDriver browser;

    @BeforeAll
    static void initTest() {
        SeleniumUtil.prepareConfigFile("emptyConfig.json");
        browser = SeleniumUtil.init();
        SeleniumUtil.switchToRaw();
        SeleniumUtil.loadGraphData("RawAssociatedArchetypeTest.json");
    }

    @Test
    void visibilityOfAllIcons() {
        checkVisibilityOfIcons("1", Arrays.asList("2", "4"), Arrays.asList("2", "4"));

        checkVisibilityOfIcons("2", Arrays.asList("1"), Arrays.asList("1"));

        checkVisibilityOfIcons("3", Arrays.asList("1"),Arrays.asList("1"));

        checkVisibilityOfIcons("4", Arrays.asList("1", "3"), Arrays.asList("1", "3"));

        checkVisibilityOfIcons("5", Arrays.asList("4"), Arrays.asList("4"));
    }

    @Test
    void vertexHighlighting() {
        //associated vertices to V1
        checkHighlightedVertices("1", "2", Arrays.asList("2", "3"));
        checkHighlightedVertices("1", "4", Arrays.asList("4"));

        //associated vertices to V2
        checkHighlightedVertices("2", "1", Arrays.asList("1"));

        //associated vertices to V3
        checkHighlightedVertices("3", "1", Arrays.asList("1"));

        //associated vertices to V4
        checkHighlightedVertices("4", "1", Arrays.asList("1"));
        checkHighlightedVertices("4", "3", Arrays.asList("5"));

        //associated vertices to V5
        checkHighlightedVertices("5", "4", Arrays.asList("4"));
    }

    /**
     * Check if all the expected associated archetype icons are present
     * @param elementId Id of the vertex in the DOM
     * @param expectedArchetypes names of expected archetypes
     * @param expectedArchetypeIconTexts Texts of all the associated archetype icons that are expected to occur
     */
    private void checkVisibilityOfIcons(String elementId, List<String> expectedArchetypes, List<String> expectedArchetypeIconTexts) {
        System.out.println("Checking element " + elementId);
        WebElement vertex = browser.findElement(By.cssSelector("[data-id='vertices']"))
                .findElement(By.cssSelector("[data-id='" + elementId + "']"));

        List<WebElement> associatedArchetypeIcons = vertex.findElement(By.tagName("g")).
                findElements(By.className("archetype-icon"));

        System.out.println("Associated archetypes: \n");
        Assertions.assertEquals(associatedArchetypeIcons.size(), expectedArchetypeIconTexts.size());

        for (int i = 0; i < expectedArchetypeIconTexts.size(); i++) {
            WebElement icon = associatedArchetypeIcons.get(i);

            String iconHref = icon.getAttribute("href");
            System.out.println("Icon href: " + iconHref+"\n");
            Assertions.assertEquals("#vertexArchetypeIcon-" + expectedArchetypes.get(i), iconHref);


            WebElement iconDef = browser.findElement(By.id("vertexArchetypeIcon-" + expectedArchetypes.get(i)));

            System.out.println("Testing if icon contains specific text");
            Assertions.assertEquals(expectedArchetypeIconTexts.get(i), iconDef.getText());
        }
    }

    /**
     * Check if all the expected vertices are highlighted when clicking on the associated archetype icon
     * @param vertexId Id of the vertex in viewport
     * @param archetypeName name of associated archetype
     * @param expectedHighlightedVertexIds Ids of all the vertices that are expected to be highlighted
     */
    private void checkHighlightedVertices(String vertexId, String archetypeName, List<String> expectedHighlightedVertexIds) {
        System.out.println("\nChecking associated vertices of vertex: " + vertexId + " for archetype icon with : " + archetypeName);

        WebElement vertex = browser.findElement(By.cssSelector("[data-id='vertices']"))
                .findElement(By.cssSelector("[data-id='" + vertexId + "']"));

        List<WebElement> associatedArchetypeIcons = vertex.findElement(By.tagName("g")).
                findElements(By.className("archetype-icon"));

        WebElement associatedArchetypeIcon = null;
        for (WebElement icon : associatedArchetypeIcons) {
            if(icon.getAttribute("href").endsWith(archetypeName)) {
                associatedArchetypeIcon = icon;
                break;
            }
        }
        Assertions.assertNotNull(associatedArchetypeIcon);
        SeleniumUtil.svgClick(associatedArchetypeIcon);

        List<WebElement> highlightedVertices = browser.findElements(By.className("node--highlighted-archetype"));

        System.out.println("Number of highlighted vertices: " + highlightedVertices.size());
        Assertions.assertEquals(expectedHighlightedVertexIds.size(), highlightedVertices.size());

        for(int i = 0; i < highlightedVertices.size(); i++) {
            String id = highlightedVertices.get(i).getAttribute("data-id");
            System.out.println(id);

            Assertions.assertEquals(expectedHighlightedVertexIds.get(i), id);
        }

        SeleniumUtil.svgClick(associatedArchetypeIcon);
    }

    @AfterAll
    static void finishTest() {
        SeleniumUtil.clear();
    }
}
