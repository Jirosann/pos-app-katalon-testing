import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testobject.ObjectRepository.findWindowsObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.llm.keyword.LlmKeywords as LLM
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testng.keyword.TestNGBuiltinKeywords as TestNGKW
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.windows.keyword.WindowsBuiltinKeywords as Windows
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

import com.kms.katalon.core.testobject.ConditionType

Mobile.startApplication('C:\\Users\\ASUS\\Project\\pos-app.apk', false)
Mobile.setText(findTestObject('input_username'), 'kasir', 10)
Mobile.setText(findTestObject('input_password'), '123456', 10)
Mobile.hideKeyboard()
Mobile.tap(findTestObject('btn_login'), 10)
Mobile.waitForElementPresent(findTestObject('text_title_products'), 10)

Mobile.tap(findTestObject('btn_add_1'), 10)

TestObject cartLabel = new TestObject('cart_label')
cartLabel.addProperty('xpath', ConditionType.EQUALS, "//*[@resource-id='btn_open_cart']//android.widget.TextView")
Mobile.verifyElementText(cartLabel, 'Keranjang (1)')
Mobile.takeScreenshot()

Mobile.delay(1)
Mobile.closeApplication()