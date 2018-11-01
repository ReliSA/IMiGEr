package cz.zcu.kiv.imiger.tests.frontend;

import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.List;

public class AutomaticGroupingTest {
    static WebDriver browser;

    @BeforeEach
    public void initTest() {
        SeleniumUtil.prepareConfigFile("automaticGroupingConfigTest.json");
        browser = SeleniumUtil.init();
        SeleniumUtil.loadGraphData("automaticGroupingTest.json");
    }

    @Test
    public void groupIncluded(){
        String groupName = "FirstGroupArchetype";
        checkGroupExist(browser, groupName);
    }

    @Test
    public void groupExcluded(){
        String groupName = "FirstGroupArchetype";
        List<String> verticesNames = new ArrayList<>();
        verticesNames.add("First vertex from first group");
        verticesNames.add("Second vertex from first group");

        excludeFirstGroup(browser);
        checkExcludedGroup(browser, groupName, verticesNames);
    }

    private void checkGroupExist(WebDriver browser, String groupName){
        List<WebElement> groups = browser.findElement(By.cssSelector("[data-id='groups']"))
                .findElements(By.className("node"));

        Assertions.assertEquals(1, groups.size());

        String actualGroupName = groups.get(0).findElement(By.tagName("foreignObject"))
                .findElement(By.className("group-name")).getText();

        Assertions.assertEquals(groupName, actualGroupName);
    }

    private void checkExcludedGroup(WebDriver browser, String groupName, List<String> verticesTexts){
        List<WebElement> nodes = browser.findElement(By.id("excludedNodeListComponent"))
                .findElement(By.className("node-list"))
                .findElements(By.tagName("li"));

        Assertions.assertEquals(3, nodes.size());
        WebElement group = nodes.get(0);

        String actualGroupName = group.findElement(By.className("group-name")).getText();
        Assertions.assertEquals(groupName, actualGroupName);

        for(int i = 1; i < nodes.size(); i ++){
            Assertions.assertTrue(verticesTexts.contains(nodes.get(i).getText()));
        }
    }

    private void excludeFirstGroup(WebDriver browser){
        List<WebElement> navList = browser.findElement(By.tagName("nav")).findElements(By.tagName("ul"));

        for( WebElement item : navList){
            WebElement form = item.findElement(By.tagName("form"));
            if (form != null){
                String formName = form.getAttribute("name");
                if (formName.equals("actionForm")) {
                    item.findElements(By.tagName("label")).get(1).click();
                    break;
                }
            }
        }

        List<WebElement> groups = browser.findElement(By.cssSelector("[data-id='groups']"))
                .findElements(By.className("node"));

        groups.get(0).findElement(By.tagName("rect")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @AfterEach
    public void finishTest() {
        SeleniumUtil.clear();
    }
}
