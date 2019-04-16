*** Settings ***
Documentation	A test suite with tests of vertex grouping functionality.

Suite Setup		Open Diagram Raw
Suite Teardown	Close Browser
Test Setup		Click Element	//button[@id="vertexToGroup"]
Test Teardown	Reload Diagram Screen

Resource		common.robot


*** Variables ***
${zoomInButton}		//button[@id="zoomIn"]

${vertex2014}		//*[name()="g"][contains(@class, "vertex")][@data-id="2014"]
${vertex2019}		//*[name()="g"][contains(@class, "vertex")][@data-id="2019"]

${group1}			//*[name()="g"][contains(@class, "group")][@data-id="1"]

${groupName}			//span[@class="group-name"]

${vertexContextMenu}	//div[contains(@class, "context-menu")]


*** Test Cases ***
Mouse Down Group
	Mouse Down		${group1}
	Element Should Have Class		${group1}	node--dragged
	Mouse Up		${group1}
	Element Should Not Have Class	${group1}	node--dragged


Drag Group
	# zoom in to 100% to get correct coordinates
	Click Element	${zoomInButton}
	Click Element	${zoomInButton}
	# get old group coordinates
	${oldCoords}=	Get Element Coordinates		${group1}
	${oldX}=	Convert To Number		${oldCoords}[0]		2
	${oldY}=	Convert To Number		${oldCoords}[1]		2
	# move vertex by 10 pixels in both directions
	Drag And Drop By Offset				${group1}	10	10
	# get new group coordinates
	${newCoords}=	Get Element Coordinates		${group1}
	${newX}=	Convert To Number		${newCoords}[0]		2
	${newY}=	Convert To Number		${newCoords}[1]		2
	# check that offset matches
	Should Be Equal As Numbers			${oldX + 10}	${newX}
	Should Be Equal As Numbers			${oldY + 10}	${newY}


Rename Group
	Element Should Contain			${group1}${groupName}	File
	# trigger group rename prompt
	Click Element					${group1}${groupName}
	Input Text Into Alert			Lorem Ipsum
	# check that group name was changed
	Element Should Contain			${group1}${groupName}	Lorem Ipsum


Add Vertex To Group
	# open vertex context menu
	Open Context Menu				${vertex2014}
	Element Should Be Visible		${vertexContextMenu}
	# add vertex to group
	Click Element					${vertexContextMenu}//li[1]
	# check that neither vertex nor its context menu is visible
	Element Should Not Be Visible	${vertexContextMenu}
	Element Should Not Be Visible	${vertex2014}
