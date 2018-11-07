*** Settings ***
Documentation	A test suite with tests of vertex actions.

Suite Setup		Open Browser To Demo Diagram
Suite Teardown	Close Browser

Resource		common.robot


*** Variables ***
${zoomInButton}			//button[@id="zoomIn"]

${vertex9}				//*[name()="svg"][contains(@class, "vertex")][@data-id="9"]
${vertex58}				//*[name()="svg"][contains(@class, "vertex")][@data-id="58"]
${vertex2014}			//*[name()="svg"][contains(@class, "vertex")][@data-id="2014"]

${vertexArchetypeIcon}	/*[name()="g"][@class="archetype-icon"]

${vertexPopover}		//div[contains(@class, "vertex-popover")]


*** Test Cases ***
Highlight Vertex
	Click Element					${vertex58}
	# check that other vertices are either highlighted or dimmed
	Element Should Have Class		${vertex9}		node--highlighted-required
	Element Should Have Class		${vertex58}		node--highlighted
	Element Should Have Class		${vertex2014}	node--dimmed
	# unhighlight
	Click Element					${vertex58}
	# check that other vertices are back to normal
	Element Should Not Have Class	${vertex9}		node--highlighted-required
	Element Should Not Have Class	${vertex58}		node--highlighted
	Element Should Not Have Class	${vertex2014}	node--dimmed


Mouse Down Vertex
	Mouse Down						${vertex2014}
	Element Should Have Class		${vertex2014}	node--dragged
	Mouse Up						${vertex2014}
	Element Should Not Have Class	${vertex2014}	node--dragged


Drag Vertex
	# zoom in to 100% to get correct coordinates
	Click Element		${zoomInButton}
	Click Element		${zoomInButton}
	# get old vertex coordinates
	${oldX}=	Get Element Attribute	${vertex2014}	x
	${oldX}=	Convert To Number		${oldX}	2
	${oldY}=	Get Element Attribute	${vertex2014}	y
	${oldY}=	Convert To Number		${oldY}	2
	# move vertex by 10 pixels in both directions
	Drag And Drop By Offset				${vertex2014}	10	10
	# get new vertex coordinates
	${newX}=	Get Element Attribute	${vertex2014}	x
	${newX}=	Convert To Number		${newX}	2
	${newY}=	Get Element Attribute	${vertex2014}	y
	${newY}=	Convert To Number		${newY}	2
	# check that offset matches
	Should Be Equal As Numbers			${oldX + 10}	${newX}
	Should Be Equal As Numbers			${oldY + 10}	${newY}


Display Vertex Popover
	Click Element		${vertex2014}${vertexArchetypeIcon}
	Element Should Be Visible		${vertexPopover}
	Element Should Not Have Class	${vertexPopover}	hidden
	Mouse Out			${vertexPopover}


Hide Vertex Popover By Moving Mouse Out
	Click Element		${vertex2014}${vertexArchetypeIcon}
	Mouse Out			${vertexPopover}
	Element Should Not Be Visible	${vertexPopover}
	Element Should Have Class		${vertexPopover}	hidden


Hide Vertex Popover By Clicking Elsewhere
	Click Element		${vertex2014}${vertexArchetypeIcon}
	Click Element		//body
	Element Should Not Be Visible	${vertexPopover}
	Element Should Have Class		${vertexPopover}	hidden
