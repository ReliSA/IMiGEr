*** Settings ***
Documentation	A resource file with reusable keywords and variables.

Library			Selenium2Library
Library			OperatingSystem


*** Variables ***
${BROWSER}		Chrome
${DELAY}		0.1

${SERVER}			http://localhost:8080/imiger/
${TEST DATA PATH}	${CURDIR}${/}..${/}..${/}..${/}..${/}..${/}data${/}

${UPLOAD FILES URL}	${SERVER}
${GRAPH URL}		${SERVER}/graph


*** Keywords ***
Open Browser To Base Path
	Open Browser		${UPLOAD FILES URL}		${BROWSER}
	Maximize Browser Window
	Set Selenium Speed	${DELAY}


Go To Upload Screen
	Go To				${UPLOAD FILES URL}


Open Diagram
	${filePath}=		Normalize Path		${TEST DATA PATH}SPADe JSONs${/}aswi2017mutant-industries-ltd.json
	Choose File				name:file		${filePath}
	Select Radio Button		jsonFileFormat	spade
	Click Element			//div[@class="upload-form"]//button[@type="submit"]
	Wait Until Element Is Not Visible		//div[@id="loader"]


Open Browser To Demo Diagram
	Open Browser To Base Path
	Click Element			//ul[@id="publicDiagramList"]/li[1]/a[text()="robot"]
	Wait Until Element Is Not Visible		//div[@id="loader"]


Open Browser To Diagram
	Open Browser To Base Path
	Open Diagram


Reload Diagram Screen
	Reload Page
	Wait Until Element Is Not Visible		//div[@id="loader"]


Element Should Have Class
	[Arguments]		${element}		${className}
	Page Should Contain Element		${element}[contains(@class, "${className}")]


Element Should Not Have Class
	[Arguments]		${element}		${className}
	Page Should Not Contain Element	${element}[contains(@class, "${className}")]
