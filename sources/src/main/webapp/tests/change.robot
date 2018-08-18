*** Settings ***
Documentation	A test suite with tests of change actions.
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
${postponedButton}	//button[@id='postponedButton']

${activeChange}	//div[@id='activeChange']
${postponedChangeList}	//div[@id='postponedChangeListComponent']
${excludedNodeList}	//div[@id='excludedNodeListComponent']

${vertex1}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='1']
${excludedVertex1}	//li[contains(@class, 'vertex')][@data-id='1']

${changePostponeButton}	//button[contains(@class, 'postpone-button')]
${changeActivateButton}	//button[contains(@class, 'activate-button')]

${vertexIncludeButton}	//button[contains(@class, 'include-button')]
${vertexChangeButton}	//button[contains(@class, 'change-button')]

*** Test Cases ***
Add Vertex To Change
	Click Element	${vertex1}
	Click Element	${excludedNodeList}${excludedVertex1}${vertexChangeButton}
	Element Should Not Be Visible	${excludedNodeList}${excludedVertex1}
	Element Should Be Visible	${activeChange}${excludedVertex1}

Postpone And Activate Change
	Click Element	${postponedButton}
	Click Element	${vertex1}
	Click Element	${excludedNodeList}${excludedVertex1}${vertexChangeButton}
	# postpone change
	Click Element	${activeChange}${changePostponeButton}
	# check that change is in list of postponed
	Element Should Not Be Visible	${activeChange}${excludedVertex1}
	Element Should Be Visible	${postponedChangeList}${excludedVertex1}
	# activate change
	Click Element	${postponedChangeList}${changeActivateButton}
	# check that change is back active
	Element Should Not Be Visible	${postponedChangeList}${excludedVertex1}
	Element Should Be Visible	${activeChange}${excludedVertex1}

*** Keywords ***
