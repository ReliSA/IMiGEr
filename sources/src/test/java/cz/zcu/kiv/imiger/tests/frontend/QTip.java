package cz.zcu.kiv.imiger.tests.frontend;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.List;

public class QTip {
    private WebElement qtip;

    public QTip(WebElement qtip) {
        this.qtip = qtip;
    }

    public boolean isVisible() {
        return qtip.isDisplayed();
    }

    public String getTitle() {
        return qtip.findElement(By.className("qtip-title")).getText();
    }

    public List<String> getAttributes() {
        List<WebElement> attributes = qtip.findElements(By.tagName("li"));
        List<String> result = new ArrayList<String>();

        for (WebElement attribute : attributes) {
            result.add(attribute.getText());
        }

        return result;
    }

    public void close() {
        qtip.findElement(By.className("qtip-close")).click();
    }
}
