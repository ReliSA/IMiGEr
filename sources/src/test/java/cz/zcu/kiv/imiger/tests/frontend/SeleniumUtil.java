package cz.zcu.kiv.imiger.tests.frontend;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

class SeleniumUtil {
    private static final Logger logger = LogManager.getLogger();
    private static final String TEST_DIRECTORY = System.getProperty("user.dir") + "\\src\\test\\resources";

    /**
     * Path to the config location folder
     * Path should be the same as in web.xml file
     * Please change to your location
     */
    private static final String APP_CONFIG_LOCATION = "C:\\Users\\Tomas\\Sources\\swi\\IMiGEr\\config";

    private static final String GECKO_PATH = TEST_DIRECTORY + "\\geckodriver.exe";

    private static final String URL = "http://localhost:8080/imiger/";

    private static final int DATA_LOAD_TIMEOUT = 20;

    private static WebDriver browser;

    static WebDriver init() {
        System.setProperty("webdriver.gecko.driver", GECKO_PATH);
        browser = new FirefoxDriver();
        browser.get(URL);
        return browser;
    }

    static void loadGraphData(String filename) {
        WebElement fileInput = browser.findElement(By.id("file"));
        fileInput.sendKeys(TEST_DIRECTORY + "\\data\\" + filename );
        browser.findElement(By.id("btnLoad")).click();

        WebDriverWait wait = new WebDriverWait(browser, DATA_LOAD_TIMEOUT);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("viewport")));

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            logger.warn("Thread.sleep caused exception: ", e);
        }
    }

    static void prepareConfigFile(String configFile) {
        try {
            Files.deleteIfExists(Paths.get(APP_CONFIG_LOCATION + "\\config.json"));
            Files.createLink(Paths.get(APP_CONFIG_LOCATION + "\\config.json"),
                    Paths.get(TEST_DIRECTORY + "\\config\\" + configFile));
        } catch (IOException e) {
            logger.error("Can not prepare configuration file: ", e);
        }
    }

    static void switchToRaw(){
        browser.findElement(By.id("raw")).click();
    }

    /**
     * Turn on exclude mode for vertex exclude
     */
    static void switchToExcludeMode(){
        browser.findElement(By.id("exclude")).click();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            logger.warn("Thread.sleep caused exception: ", e);
        }
    }

    static void svgRectClick(WebElement toClick){
        toClick.findElement(By.tagName("rect")).click();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            logger.warn("Thread.sleep caused exception: ", e);
        }
    }

    static void svgRectContextClick(WebElement toClick){
        Actions builder = new Actions(browser);
        builder.contextClick(toClick.findElement(By.tagName("rect"))).build().perform();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            logger.warn("Thread.sleep caused exception: ", e);
        }
    }

    static void svgClick(WebElement toClick) {
        svgClickWithOffset(toClick, 0, 0);
    }

    static void svgClickWithOffset(WebElement toClick, int xOffset, int yOffset) {
        Actions builder = new Actions(browser);
        builder.moveToElement(toClick).moveByOffset(xOffset,yOffset).click().build().perform();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            logger.warn("Thread.sleep caused exception: ", e);
        }
    }

    /**
     * Right mouse click
     * @param toClick element for click
     */
    static void svgContextClick(WebElement toClick) {
        Actions builder = new Actions(browser);
        builder.moveToElement(toClick).contextClick().build().perform();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            logger.warn("Thread.sleep caused exception: ", e);
        }
    }

    static void clear() {
        browser.close();
    }
}
