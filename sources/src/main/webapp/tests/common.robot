*** Settings ***
Documentation	A resource file with reusable keywords and variables.
...
...				The system specific keywords created here form our own
...				domain specific language. They utilize keywords provided
...				by the imported Selenium2Library.
Library			Selenium2Library

*** Variables ***
${BROWSER}		Chrome
${DELAY}		0.1

${SERVER}		http://localhost:8080/cocaex-compatibility
${TEST DATA PATH}	C:\\Users\\fidra\\Work\\cocaex\\branches\\cocaex-jacc-integration\\test-data

${BASE URL}		${SERVER}
${UPLOAD FILES URL}	${SERVER}/upload-files
${GRAPH URL}	${SERVER}/graph

*** Keywords ***
Open Browser To Base Path
	Open Browser	${BASE URL}	${BROWSER}
	Maximize Browser Window
	Set Selenium Speed	${DELAY}

Go To Upload Screen
	Go To	${UPLOAD FILES URL}

Open Demo Diagram
	[Arguments]	${demoId}
	${formName}=	Catenate	SEPARATOR=	demoDiagramForm	${demoId}
	Click Element	//form[@name='${formName}']/a
	Wait Until Element Is Not Visible	//div[@id='loader']

Open Diagram
	Choose File	//input[@id='fileUpload']	${TEST DATA PATH}${/}obcc-parking-example${/}obcc-parking-example.carpark-svc.jar
	Click Element	//input[@type='submit'][@value='Upload']
	Choose File	//input[@id='fileUpload']	${TEST DATA PATH}${/}obcc-parking-example${/}obcc-parking-example.dashboard-svc.jar
	Click Element	//input[@type='submit'][@value='Upload']
	Choose File	//input[@id='fileUpload']	${TEST DATA PATH}${/}obcc-parking-example${/}obcc-parking-example.gate.jar
	Click Element	//input[@type='submit'][@value='Upload']
	Choose File	//input[@id='fileUpload']	${TEST DATA PATH}${/}obcc-parking-example${/}obcc-parking-example.statsbase-svc.jar
	Click Element	//input[@type='submit'][@value='Upload']
	Choose File	//input[@id='fileUpload']	${TEST DATA PATH}${/}obcc-parking-example${/}obcc-parking-example.trafficlane-svc.jar
	Click Element	//input[@type='submit'][@value='Upload']
	Click Element	//input[@type='submit'][@value='Start visualization']
	Wait Until Element Is Not Visible	//div[@id='loader']

Open Browser To Demo Diagram
	Open Browser To Base Path
	Open Demo Diagram	6

Open Browser To Diagram
	Open Browser To Base Path
	Open Diagram

Reload Diagram Screen
	Reload Page
	Wait Until Element Is Not Visible	//div[@id='loader']

Element Should Have Class
	[Arguments]	${element}	${className}
	Page Should Contain Element	${element}[contains(@class, '${className}')]

Element Should Not Have Class
	[Arguments]	${element}	${className}
	Page Should Not Contain Element	${element}[contains(@class, '${className}')]
