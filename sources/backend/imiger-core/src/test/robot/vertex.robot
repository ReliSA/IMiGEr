*** Settings ***
Documentation	A test suite with tests of vertex actions.

Suite Setup		Open Diagram Raw
Suite Teardown	Close Browser

Resource		common.robot


*** Variables ***
${zoomInButton}			//button[@id="zoomIn"]

${vertex9}				//*[name()="g"][contains(@class, "vertex")][@data-id="9"]
${vertex58}				//*[name()="g"][contains(@class, "vertex")][@data-id="58"]
${vertex2014}			//*[name()="g"][contains(@class, "vertex")][@data-id="2014"]

${vertexArchetypeIcon}	/*[name()="use"][@class="archetype-icon"]

${vertexPopover}		//div[contains(@class, "vertex-popover")]


*** Test Cases ***
Highlight Vertex
	Click Element					${vertex58}
	# check that other vertices are either highlighted or dimmed
	Element Should Have Class		${vertex9}		node--highlighted-as-required
	Element Should Have Class		${vertex58}		node--highlighted
	Element Should Have Class		${vertex2014}	node--dimmed
	# unhighlight
	Click Element					${vertex58}
	# check that other vertices are back to normal
	Element Should Not Have Class	${vertex9}		node--highlighted-as-required
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
	${oldCoords}=	Get Element Coordinates		${vertex2014}
	${oldX}=	Convert To Number		${oldCoords}[0]		2
	${oldY}=	Convert To Number		${oldCoords}[1]		2
	# move vertex by 10 pixels in both directions
	Drag And Drop By Offset				${vertex2014}	10	10
	# get new vertex coordinates
	${newCoords}=	Get Element Coordinates		${vertex2014}
	${newX}=	Convert To Number		${newCoords}[0]		2
	${newY}=	Convert To Number		${newCoords}[1]		2
	# check that offset matches
	Should Be Equal As Numbers			${oldX + 10}	${newX}
	Should Be Equal As Numbers			${oldY + 10}	${newY}


Display Vertex Popover
	Click Element		${vertex2014}${vertexArchetypeIcon}
	Element Should Be Visible			${vertexPopover}
	Element Should Not Have Attribute	${vertexPopover}	hidden
	Mouse Out			${vertexPopover}


Hide Vertex Popover By Moving Mouse Out
	Click Element		${vertex2014}${vertexArchetypeIcon}
	Mouse Out			${vertexPopover}
	Element Should Not Be Visible	${vertexPopover}
	Element Should Have Attribute	${vertexPopover}	hidden


Hide Vertex Popover By Clicking Elsewhere
	Click Element		${vertex2014}${vertexArchetypeIcon}
	Click Element		//body
	Element Should Not Be Visible	${vertexPopover}
	Element Should Have Attribute	${vertexPopover}	hidden
