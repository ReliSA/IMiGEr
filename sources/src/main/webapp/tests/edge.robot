*** Settings ***
Documentation	A test suite with tests of edge actions.
...
...				This test has a workflow that is created using keywords in
...				the imported resource file.
...
Suite Setup		Open Browser To Demo Diagram
Test Teardown	Reload Diagram Screen
Suite Teardown	Close Browser
Resource		common.robot

*** Variables ***
${edge1}	//*[name()='g'][contains(@class, 'edge')][@data-id='1']

${vertex1}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='1']
${vertex2}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='2']
${vertex3}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='3']
${vertex4}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='4']
${vertex5}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='5']
${vertex6}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='6']

${edgeLollipop}	/*[name()='g'][contains(@class, 'lollipop')]

${edgePopover}	//div[contains(@class, 'edge-popover')]

*** Test Cases ***
Highlight Edge
	Click Element	${edge1}${edgeLollipop}
	# check that vertices not connected to the edge are not highlighted
	Element Should Have Class	${edge1}	edge--highlighted
	Element Should Have Class	${vertex1}	node--highlighted
	Element Should Not Have Class	${vertex2}	node--highlighted
	Element Should Not Have Class	${vertex3}	node--highlighted
	Element Should Not Have Class	${vertex4}	node--highlighted
	Element Should Not Have Class	${vertex5}	node--highlighted
	Element Should Have Class	${vertex6}	node--highlighted

Hide Edge Popover By Moving Mouse Out
	Click Element	${edge1}${edgeLollipop}
	Mouse Out	${edgePopover}
	Element Should Not Be Visible	${edgePopover}
	Element Should Have Class  ${edgePopover}  hidden

Hide Edge Popover By Clicking Elsewhere
	Click Element	${edge1}${edgeLollipop}
	Click Element	//body
	Element Should Not Be Visible	${edgePopover}
	Element Should Have Class  ${edgePopover}  hidden

*** Keywords ***
