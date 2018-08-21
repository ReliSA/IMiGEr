package cz.zcu.kiv.imiger.tests.frontend;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SampleTest {
    static WebDriver browser;

    @BeforeAll
    public static void initTest() {
        browser = SeleniumUtil.init();
    }
    @Test
    public void Test(){
        WebElement fileInput = browser.findElement(By.id("hidden_input"));
        fileInput.sendKeys(System.getProperty("user.dir") + "\\..\\test\\data\\aswi2017falsum.json" );
        browser.findElement(By.className("load")).click();

        WebDriverWait wait = new WebDriverWait(browser, 20);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.className("vertices")));

        System.out.println(browser.findElement(By.id("vertex1")).getAttribute("data-id"));

        //Assertions.assertTrue(header.getText().equals("Interactive Multimodal Graph Explorer"));
    }

    @AfterAll
    public static void finishTest() {
        SeleniumUtil.clear();
    }

}
