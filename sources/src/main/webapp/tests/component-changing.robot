*** Settings ***
Documentation	A test suite with tests of component changing functionality.
...
...				This test has a workflow that is created using keywords in
...				the imported resource file.
...
Suite Setup		Open Browser To Diagram
Test Setup		Exclude Vertex
Test Teardown	Reload Diagram Screen
Suite Teardown	Close Browser
Resource		common.robot

*** Variables ***
${graphVersion}	//span[@class='graph-version']

${activeChange}	//div[@id='activeChange']
${excludedNodeList}	//div[@id='excludedNodeListComponent']

${changeTriggerButton}	//button[contains(@class, 'trigger-change-button')]
${changeLoadDetailsButton}	//button[contains(@class, 'load-details-button')]
${changeAcceptButton}	//button[contains(@class, 'accept-button')]
${changeRevokeButton}	//button[contains(@class, 'revoke-button')]

${vertex1}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='1']
${excludedVertex1}	//li[contains(@class, 'vertex')][@data-id='1']

${vertexChangeButton}	//button[contains(@class, 'change-button')]

*** Test Cases ***
Trigger Simple Change
	# trigger change
	Click Element	${activeChange}${changeTriggerButton}
	Wait Until Element Is Not Visible	//div[@id='loader']
	# check that valid components were retrieved
	Element Should Contain	${activeChange}//ul[@class='node-list'][2]	obcc-parking-example.carpark

Trigger Change Including Not Found
	# trigger change
	Select Checkbox	name:includeNotFoundClasses
	Click Element	${activeChange}${changeTriggerButton}
	Wait Until Element Is Not Visible	//div[@id='loader']
	# check that valid components were retrieved
	Element Should Contain	${activeChange}//ul[@class='node-list'][2]	slf4j.api
	Element Should Contain	${activeChange}//ul[@class='node-list'][2]	obcc-parking-example.carpark
	Element Should Contain	${activeChange}//ul[@class='node-list'][2]	org.osgi.framework

Revoke Simple Change
	# trigger change
	Click Element	${activeChange}${changeTriggerButton}
	Wait Until Element Is Not Visible	//div[@id='loader']
	# revoke change
	Click Element	${changeRevokeButton}
	Wait Until Element Is Not Visible	//div[@id='loader']
	# check that list of proposals is empty
	Xpath Should Match X Times	${activeChange}//ul[@class='node-list'][2]/li	0

Accept Simple Change
	# trigger change
	Click Element	${activeChange}${changeTriggerButton}
	Wait Until Element Is Not Visible	//div[@id='loader']
	Select Checkbox	name:replaceComponents
	# accept change
	Click Element	${changeAcceptButton}
	Wait Until Element Is Not Visible	//div[@id='loader']
	# check name of the replacing component
	${name}=	Get Element Attribute	${vertex1}	data-name
	Should Be Equal As Strings	${name}	obcc-parking-example.carpark.jar
	# check graph version
	${version}=		Get Text	${graphVersion}
	Should Be Equal As Strings		${version}	graph version: 2

*** Keywords ***
Exclude Vertex
	Select Radio Button		actionMove	exclude
	Click Element	${vertex1}
	Click Element	${excludedNodeList}${excludedVertex1}${vertexChangeButton}
