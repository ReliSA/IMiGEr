package cz.zcu.kiv.imiger.tests.frontend;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.List;

public class AutomaticGroupingTest {
    static WebDriver browser;

    @BeforeAll
    public static void initTest() {
        SeleniumUtil.prepareConfigFile("automaticGroupingConfigTest.json");
        browser = SeleniumUtil.init();
        SeleniumUtil.loadGraphData("automaticGroupingTest.json");
    }

    @Test
    public void groups1(){
        String groupName = "FirstGroupArchetype";
        List<String> verticesIds = new ArrayList<>();
        verticesIds.add("li1");
        verticesIds.add("li3");

        checkGroupExisting(browser, groupName, verticesIds);
        System.out.println("Group: " + groupName + " was not found.");
    }

    private void checkGroupExisting(WebDriver browser, String groupName, List<String> verticesIds){
        WebElement group = browser.findElement(By.className("component group_vertices"));
        System.out.println("Trying to locate vertexes in group");
        for(String id : verticesIds){
            group.findElement(By.id(id));
        }

        System.out.println("Vertexes found.");
    }

    @AfterAll
    public static void finishTest() {
        SeleniumUtil.clear();
    }
}
