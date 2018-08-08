*** Settings ***
Documentation	A test suite with tests of sidebar panels toggling.
...
...				This test has a workflow that is created using keywords in
...				the imported resource file.
...
Suite Setup		Open Browser To Demo Diagram
Suite Teardown	Close Browser
Resource		common.robot

*** Variables ***
${sidebar}	//div[@id='sidebar']

${changeButton}	//button[@id='changeButton']
${postponedButton}	//button[@id='postponedButton']
${unconnectedButton}	//button[@id='unconnectedButton']
${missingButton}	//button[@id='missingButton']

${activeChange}	//div[@id='activeChange']
${postponedChangeList}	//div[@id='postponedChangeListComponent']
${unconnectedNodeList}	//div[@id='unconnectedNodeListComponent']
${missingClassList}	//div[@id='missingClassListComponent']

${includeAllButton}	//button[contains(@class, 'include-all-button')]
${excludeAllButton}	//button[contains(@class, 'exclude-all-button')]

${vertex4}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='4']
${excludedVertex4}	//li[contains(@class, 'vertex')][@data-id='4']

*** Test Cases ***
Toggle Active Change
	Element Should Not Have Class	${activeChange}	hidden
	Click Element	${changeButton}
	Element Should Have Class	${activeChange}	hidden

Toggle Postponed Changes
	Element Should Have Class	${postponedChangeList}	hidden
	Click Element	${postponedButton}
	Element Should Not Have Class	${postponedChangeList}	hidden

Toggle Unconnected Nodes
	Element Should Have Class	${unconnectedNodeList}	hidden
	Click Element	${unconnectedButton}
	Element Should Not Have Class	${unconnectedNodeList}	hidden

Toggle Missing Classes
	Element Should Have Class	${missingClassList}	hidden
	Click Element	${missingButton}
	Element Should Not Have Class	${missingClassList}	hidden

Include And Exclude All Unconnected Vertices
	Click Element	${unconnectedButton}
	Element Should Not Be Visible	${vertex4}
	Element Should Be Visible	${unconnectedNodeList}${excludedVertex4}
	# include all unconnected vertices
	Click Element	${unconnectedNodeList}${includeAllButton}
	Element Should Be Visible	${vertex4}
	Element Should Not Be Visible	${unconnectedNodeList}${excludedVertex4}
	# exclude all unconnected vertices
	Click Element	${unconnectedNodeList}${excludeAllButton}
	Element Should Not Be Visible	${vertex4}
	Element Should Be Visible	${unconnectedNodeList}${excludedVertex4}

*** Keywords ***
