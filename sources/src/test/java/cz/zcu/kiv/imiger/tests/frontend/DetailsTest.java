package cz.zcu.kiv.imiger.tests.frontend;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

import java.util.Arrays;
import java.util.List;

public class DetailsTest {

    static WebDriver browser;

    public static final String VISIBLE_Q_TIP_XPATH = "//div[contains(@class, 'qtip') and @aria-hidden='false']";

    @BeforeAll
    public static void initTest() {
        SeleniumUtil.prepareConfigFile("emptyConfig.json");
        browser = SeleniumUtil.init();
        SeleniumUtil.loadGraphData("detailTest.json");
    }

    @Test
    public void vertexDetail(){
        checkQTip(
                vertexQTip("vertex1"),
                "V1 (3)",
                Arrays.asList("D: E", "B: W", "A: Q")
        );

        checkQTip(
                vertexQTip("vertex2"),
                "V2 (2)",
                Arrays.asList("D: E", "C: Q", "B: W")
        );

        checkQTip(
                vertexQTip("vertex3"),
                "V3 (1)",
                Arrays.asList("D: Q", "C: W", "A: E")
        );
    }

    @Test
    public void edgeDetail() {
        checkQTip(
                edgeQTip("e1"),
                "Edge Details",
                Arrays.asList(
                        "edgeArchetype1", "D : E", "C : W"
                )
        );

        checkQTip(
                edgeQTip("e2"),
                "Edge Details",
                Arrays.asList(
                        "edgeArchetype1", "D : E", "B : W", "A : Q",
                        "edgeArchetype2", "D : D", "B : S", "A : A"
                )
        );

        checkQTip(
                edgeQTip("e3"),
                "Edge Details",
                Arrays.asList(
                        "edgeArchetype2", "C : T", "B : R"
                )
        );
    }


    private WebElement edgeQTip(String edgeElementId) {
        WebElement arrow = browser.findElement(By.id(edgeElementId))
                .findElement(By.className("arrow"));

        return getQTipElement(arrow);
    }

    private WebElement vertexQTip(String vertexElementId) {
        WebElement archetypeIcon = browser.findElement(By.id(vertexElementId))
                .findElement(By.className("archetype"));

        return getQTipElement(archetypeIcon);
    }

    private WebElement getQTipElement(WebElement toClick) {
        SeleniumUtil.svgClick(toClick);

        return browser.findElement(By.xpath(VISIBLE_Q_TIP_XPATH));
    }

    private void checkQTip(WebElement qTipElement, String expectedTitle, List<String> expectedAttributes) {
        QTip qtip = new QTip(qTipElement);

        System.out.println("Title: " + qtip.getTitle());
        Assertions.assertEquals(expectedTitle, qtip.getTitle());

        List<String> attributes = qtip.getAttributes();
        System.out.println("Attributes:");
        for (String attr : attributes) {
            System.out.println(attr);
        }
        Assertions.assertEquals(expectedAttributes, attributes);

        qtip.close();
        Assertions.assertFalse(qtip.isVisible());
    }

    @AfterAll
    public static void finishTest() {
        SeleniumUtil.clear();
    }
}
