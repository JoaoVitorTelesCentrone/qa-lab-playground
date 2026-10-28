package com.qalab.training;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.jupiter.api.Assertions.assertTrue;

class MobileSmokeTest {
  @Test
  void homeScreenIsVisible() throws Exception {
    String appPathValue = System.getenv("MOBILE_APP_PATH");
    Assumptions.assumeTrue(
        appPathValue != null && Files.isRegularFile(Path.of(appPathValue)),
        "Set MOBILE_APP_PATH to an authorized Android test APK to run this device test.");

    String serverUrl = System.getenv().getOrDefault(
        "APPIUM_SERVER_URL", "http://127.0.0.1:4723");
    String deviceName = System.getenv().getOrDefault(
        "ANDROID_DEVICE_NAME", "Android Emulator");
    String homeAccessibilityId = System.getenv().getOrDefault(
        "MOBILE_HOME_ACCESSIBILITY_ID", "home-title");

    UiAutomator2Options options = new UiAutomator2Options()
        .setDeviceName(deviceName)
        .setApp(Path.of(appPathValue).toAbsolutePath().toString());

    AndroidDriver driver = new AndroidDriver(URI.create(serverUrl).toURL(), options);
    try {
      WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
      WebElement homeTitle = wait.until(ExpectedConditions.visibilityOfElementLocated(
          AppiumBy.accessibilityId(homeAccessibilityId)));
      assertTrue(homeTitle.isDisplayed(), "The home screen title should be visible.");
    } finally {
      driver.quit();
    }
  }
}
