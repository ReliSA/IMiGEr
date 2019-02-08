package cz.zcu.kiv.imiger.tests.frontend;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

class DetailsTest {

    private static WebDriver browser;

    @BeforeAll
    static void initTest() {
        SeleniumUtil.prepareConfigFile("emptyConfig.json");
        browser = SeleniumUtil.init();
        SeleniumUtil.switchToRaw();
        SeleniumUtil.loadGraphData("RawDetailTest.json");
    }

    @Test
    void vertexDetail(){
        checkPopover(vertexPopover("V1"),"V1 (3)\nD: E\nB: W\nA: Q");

        checkPopover(vertexPopover("V2"),"V2 (2)\nD: E\nC: Q\nB: W");

        checkPopover(vertexPopover("V3"),"V3 (1)\nD: Q\nC: W\nA: E");
    }

    @Test
    void edgeDetail() {
        checkPopover(edgePopover("1"),"Edge details\nedgeArchetype1\nD: E\nC: W");

        checkPopover(edgePopover("2"),"Edge details\nedgeArchetype1\nD: E\nB: W\nA: Q\nedgeArchetype2\nD: D\nB: S\nA: A");

        checkPopover(edgePopover("3"),"Edge details\nedgeArchetype2\nC: T\nB: R");
    }


    private WebElement edgePopover(String edgeId) {
        WebElement arrow = browser.findElement(By.cssSelector("[data-id='edges']"))
                .findElement(By.cssSelector("[data-id='" + edgeId + "']"))
                .findElement(By.className("arrow"));

        SeleniumUtil.svgClickWithOffset(arrow, 3, 0);
        return browser.findElement(By.className("edge-popover"));
    }

    private WebElement vertexPopover(String vertexElementName) {
        WebElement archetypeIcon = browser.findElement(By.cssSelector("[data-id='vertices']"))
                .findElement(By.cssSelector("[data-name='" + vertexElementName + "']"))
                .findElement(By.className("archetype-icon"));

        SeleniumUtil.svgClick(archetypeIcon);
        return browser.findElement(By.className("vertex-popover"));
    }

    private void checkPopover(WebElement popoverElement, String expectedText) {
        String text = popoverElement.getText();
        Assertions.assertEquals(expectedText, text);
    }

    @AfterAll
    static void finishTest() {
        SeleniumUtil.clear();
    }
}
