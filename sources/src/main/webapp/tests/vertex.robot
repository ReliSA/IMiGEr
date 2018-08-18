*** Settings ***
Documentation	A test suite with tests of vertex actions.
...
...				This test has a workflow that is created using keywords in
...				the imported resource file.
...
Suite Setup		Open Browser To Demo Diagram
Suite Teardown	Close Browser
Resource		common.robot

*** Variables ***
${zoomInButton}	//button[@id='zoomIn']

${vertex1}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='1']
${vertex2}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='2']
${vertex3}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='3']
${vertex4}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='4']
${vertex5}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='5']
${vertex6}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='6']

${vertexInterface}	/*[name()='g'][@class='interface']

${vertexPopover}	//div[contains(@class, 'vertex-popover')]

*** Test Cases ***
Highlight Vertex
	Click Element	${vertex3}
	# check that other vertices are either highlighted or dimmed
	Element Should Have Class	${vertex1}	node--highlighted-provided
	Element Should Have Class	${vertex2}	node--dimmed
	Element Should Have Class	${vertex3}	node--highlighted
	Element Should Have Class	${vertex5}	node--dimmed
	Element Should Have Class	${vertex6}	node--highlighted-required
	# unhighlight
	Click Element	${vertex3}
	# check that other vertices are back to normal
	Element Should Not Have Class	${vertex1}	node--highlighted-provided
	Element Should Not Have Class	${vertex2}	node--dimmed
	Element Should Not Have Class	${vertex3}	node--highlighted
	Element Should Not Have Class	${vertex5}	node--dimmed
	Element Should Not Have Class	${vertex6}	node--highlighted-required

Mouse Down Vertex
	Mouse Down	${vertex3}
	Element Should Have Class	${vertex3}	node--dragged
	Mouse Up	${vertex3}
	Element Should Not Have Class	${vertex3}	node--dragged

Drag Vertex
	# zoom in to 100% to get correct coordinates
	Click Element	${zoomInButton}
	Click Element	${zoomInButton}
	# get old vertex coordinates
	${oldX}=	Get Element Attribute	${vertex3}	x
	${oldX}=	Convert To Number	${oldX}	2
	${oldY}=	Get Element Attribute	${vertex3}	y
	${oldY}=	Convert To Number	${oldY}	2
	# move vertex by 10 pixels in both directions
	Drag And Drop By Offset		${vertex3}	10	10
	# get new vertex coordinates
	${newX}=	Get Element Attribute	${vertex3}	x
	${newX}=	Convert To Number	${newX}	2
	${newY}=	Get Element Attribute	${vertex3}	y
	${newY}=	Convert To Number	${newY}	2
	# check that offset matches
	Should Be Equal As Numbers	${oldX + 10}	${newX}
	Should Be Equal As Numbers	${oldY + 10}	${newY}

Display Vertex Popover
	Click Element	${vertex3}${vertexInterface}
	Element Should Be Visible	${vertexPopover}
	Element Should Not Have Class  ${vertexPopover}  hidden

Hide Vertex Popover By Moving Mouse Out
	Click Element	${vertex3}${vertexInterface}
	Mouse Out	${vertexPopover}
	Element Should Not Be Visible	${vertexPopover}
	Element Should Have Class  ${vertexPopover}  hidden

Hide Vertex Popover By Clicking Elsewhere
	Click Element	${vertex3}${vertexInterface}
	Click Element	//body
	Element Should Not Be Visible	${vertexPopover}
	Element Should Have Class  ${vertexPopover}  hidden

*** Keywords ***
