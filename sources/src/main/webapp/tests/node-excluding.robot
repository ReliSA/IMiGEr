*** Settings ***
Documentation	A test suite with tests of node excluding functionality.
...
...				This test has a workflow that is created using keywords in
...				the imported resource file.
...
Suite Setup		Open Browser To Demo Diagram
Test Setup		Select Radio Button		actionMove	exclude
Test Teardown	Reload Diagram Screen
Suite Teardown	Close Browser
Resource		common.robot

*** Variables ***
${vertexToGroupButton}	//button[@id='vertexToGroup']

${excludedNodeList}	//div[@id='excludedNodeListComponent']

${includeAllButton}	//button[contains(@class, 'include-all-button')]

${vertex5}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='5']
${excludedVertex5}	//li[contains(@class, 'vertex')][@data-id='5']
${vertex6}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='6']
${excludedVertex6}	//li[contains(@class, 'vertex')][@data-id='6']

${group1}	//*[name()='svg'][contains(@class, 'group')][@data-id='1']
${excludedGroup1}	//li[contains(@class, 'group')][@data-id='1']

*** Test Cases ***
Exclude Vertex
	Click Element	${vertex6}
	Element Should Not Be Visible	${vertex6}
	Element Should Be Visible	${excludedNodeList}${excludedVertex6}

Exclude Group
	Click Element	${vertexToGroupButton}
	Click Element	${group1}
	Element Should Not Be Visible	${group1}
	Element Should Be Visible	${excludedNodeList}${excludedGroup1}

Include All Excluded Nodes
	Click Element	${vertex5}
	Click Element	${vertex6}
	Click Element	${excludedNodeList}${includeAllButton}
	Element Should Be Visible	${vertex5}
	Element Should Not Be Visible	${excludedNodeList}${excludedVertex5}
	Element Should Be Visible	${vertex6}
	Element Should Not Be Visible	${excludedNodeList}${excludedVertex6}

*** Keywords ***
