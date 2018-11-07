package cz.zcu.kiv.imiger.tests.frontend;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

class ArchetypeIconConfigTest {
    private static WebDriver browser;

    @BeforeAll
    static void initTest() {
        SeleniumUtil.prepareConfigFile("archetypeIconConfigTest.json");
        browser = SeleniumUtil.init();
        SeleniumUtil.switchToRaw();
        SeleniumUtil.loadGraphData("RawArchetypeIconTest.json");
    }

    @Test
    void SpecifiedValueDefinition(){
        WebElement iconDef = browser.findElement(By.id("vertexArchetypeIcon-SpecifiedIcon"));

        System.out.println("Trying to locate an element with class 'testingArchetypeIcon'");
        iconDef.findElement(By.className("testingArchetypeIcon"));
        System.out.println("Element found.");
    }

    @Test
    void UnspecifiedValueDefinition(){
        emptyIconDefinition("UnspecifiedIcon");
    }

    @Test
    void SmileyValueDefinition(){
        emptyIconDefinition("☺Smiley");
    }

    @Test
    void SpecifiedIcon(){
        locateTestingArchetypeIcon("1","#vertexArchetypeIcon-SpecifiedIcon");
    }

    @Test
    void UnspecifiedIcon(){
        locateTestingArchetypeIcon("2","#vertexArchetypeIcon-UnspecifiedIcon");
    }

    @Test
    void SmileyIcon(){
        locateTestingArchetypeIcon("3","#vertexArchetypeIcon-☺Smiley");
    }

    /**
     * Utility method for checking of the presence of the specified icon element
     * @param elementId Id of the element in which the search is done
     * @param expectedHref expected href to icon in founded element
     */
    private void locateTestingArchetypeIcon(String elementId, String expectedHref) {
        WebElement icon = browser.findElement(By.cssSelector("[data-id='vertices']"))
                .findElement(By.cssSelector("[data-id='" + elementId + "']"))
                .findElement(By.className("archetype-icon"));

        Assertions.assertEquals(expectedHref, icon.getAttribute("href"));
    }

    private void emptyIconDefinition(String iconName){
        WebElement iconDef = browser.findElement(By.id("vertexArchetypeIcon-" + iconName))
                .findElement(By.tagName("text"));

        System.out.println("Testing if icon contains specific text");
        Assertions.assertEquals(iconName.substring(0,1), iconDef.getText());
    }

    @AfterAll
    static void finishTest() {
        SeleniumUtil.clear();
    }
}
