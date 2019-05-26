*** Settings ***
Documentation	A resource file with reusable keywords and variables.

Library			SeleniumLibrary
Library			OperatingSystem
Library			String


*** Variables ***
${BROWSER}		Chrome
${DELAY}		0.1

${SERVER}			http://localhost:8080/imiger/
${TEST DATA PATH}	${CURDIR}${/}data${/}

${UPLOAD FILES URL}	${SERVER}
${GRAPH URL}		${SERVER}/graph


*** Keywords ***
Open Browser To Base Path
	Open Browser		${UPLOAD FILES URL}		${BROWSER}
	Maximize Browser Window
	Set Selenium Speed	${DELAY}


Go To Upload Screen
	Go To				${UPLOAD FILES URL}


Open Diagram Raw
	Open Browser To Base Path
	${filePath}=		Normalize Path		${TEST DATA PATH}${/}raw${/}jira-project.json
	Choose File				name:file		${filePath}
	Unselect Checkbox			enableInitialElimination
	Click Button			Start visualization
	Wait Until Element Is Not Visible		//div[@id="loader"]


Open Diagram Spade
	Open Browser To Base Path
	${filePath}=		Normalize Path		${TEST DATA PATH}${/}spade${/}jira-project.json
	Choose File				name:file		${filePath}
	Select Radio Button		fileFormat		-968839389
	Unselect Checkbox			enableInitialElimination
	Click Button			Start visualization
	Wait Until Element Is Not Visible		//div[@id="loader"]


Reload Diagram Screen
	Reload Page
	Wait Until Element Is Not Visible		//div[@id="loader"]


Element Should Have Class
	[Arguments]		${element}		${className}
	${element}=		Catenate	SEPARATOR=	${element}	[contains(@class,"		${className}	")]
	Page Should Contain Element		${element}


Element Should Not Have Class
	[Arguments]		${element}		${className}
	${element}=		Catenate	SEPARATOR=	${element}	[contains(@class,"		${className}	")]
	Page Should Not Contain Element	${element}


Element Should Have Attribute
	[Arguments]		${element}		${attributeName}
	${element}=		Catenate	SEPARATOR=	${element}	[@	${attributeName}	]
	Page Should Contain Element		${element}


Element Should Not Have Attribute
	[Arguments]		${element}		${attributeName}
	Element Attribute Value Should Be	${element}	${attributeName}	${None}


Get Element Coordinates
	[Arguments]		${element}
	${transformAttributeValue}=		Get Element Attribute	${element}	transform
	${matches}=		Get Regexp Matches		${transformAttributeValue}	([0-9\.-]+)
	[Return]		${matches}
