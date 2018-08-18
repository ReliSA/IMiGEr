package cz.zcu.kiv.imiger.tests.frontend;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.opentest4j.AssertionFailedError;

public class ArchetypeIconConfigTest {
    static WebDriver browser;

    @BeforeAll
    public static void initTest() {
        SeleniumUtil.prepareConfigFile("archetypeIconConfigTest.json");
        browser = SeleniumUtil.init();
        SeleniumUtil.loadGraphData("archetypeIconTest.json");
    }

    @Test
    public void SpecifiedIcon1(){
        locateTestingArchetypeIcon("vertex1");
    }

    @Test
    public void SpecifiedIcon2(){
        Assertions.assertThrows(NoSuchElementException.class,
                () -> checkUnspecifiedArchetypeSymbol("vertex1", "S"));

        System.out.println("Default value not found on the vertex with specified archetype icon.");
    }

    @Test
    public void UnspecifiedIcon1(){
        Assertions.assertThrows(NoSuchElementException.class,
                () -> locateTestingArchetypeIcon("vertex2"));

        System.out.println("Element not found.");
    }

    @Test
    public void UnspecifiedIcon2(){
        Assertions.assertThrows(NoSuchElementException.class,
                () -> locateTestingArchetypeIcon("vertex3"));

        System.out.println("Element not found.");
    }

    @Test
    public void UnspecifiedIcon3(){
        checkUnspecifiedArchetypeSymbol("vertex2", "U");
    }

    @Test
    public void UnspecifiedIcon4(){
        checkUnspecifiedArchetypeSymbol("vertex3", "☺");
    }

    /**
     * Utility method for checking of the presence of the specified icon element
     * @param elementId Id of the element in which the search is done
     */
    private void locateTestingArchetypeIcon(String elementId) {
        WebElement icon = browser.findElement(By.id(elementId))
                .findElement(By.className("archetype"));

        System.out.println("Trying to locate an element with class 'testingArchetypeIcon'");
        icon.findElement(By.className("testingArchetypeIcon"));
        System.out.println("Element found.");
    }

    /**
     * Utility method for checking whether specified element contains the default archetype icon
     * @param elementId Id of the element in which the test is done
     * @param expectedText Expected text present in the icon
     */
    private void checkUnspecifiedArchetypeSymbol(String elementId, String expectedText) {
        WebElement icon = browser.findElement(By.id(elementId))
                .findElement(By.className("archetype"));

        System.out.println("Checking text of unspecified archetype icon");
        Assertions.assertEquals(expectedText, icon.findElement(By.tagName("text")).getText(),
                "Text of unspecified icon is different from the expected.");
        System.out.println("Default text found.");
    }


    @AfterAll
    public static void finishTest() {
        SeleniumUtil.clear();
    }
}
