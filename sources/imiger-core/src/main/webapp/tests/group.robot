*** Settings ***
Documentation	A test suite with tests of vertex grouping functionality.

Suite Setup		Open Browser To Demo Diagram
Suite Teardown	Close Browser
Test Setup		Click Element	//button[@id="vertexToGroup"]
Test Teardown	Reload Diagram Screen

Resource		common.robot


*** Variables ***
${zoomInButton}		//button[@id="zoomIn"]

${vertex2014}		//*[name()="svg"][contains(@class, "vertex")][@data-id="2014"]
${vertex2019}		//*[name()="svg"][contains(@class, "vertex")][@data-id="2019"]

${group1}			//*[name()="svg"][contains(@class, "group")][@data-id="1"]

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
	${oldX}=	Get Element Attribute	${group1}	x
	${oldX}=	Convert To Number		${oldX}	2
	${oldY}=	Get Element Attribute	${group1}	y
	${oldY}=	Convert To Number		${oldY}	2
	# move vertex by 10 pixels in both directions
	Drag And Drop By Offset				${group1}	10	10
	# get new group coordinates
	${newX}=	Get Element Attribute	${group1}	x
	${newX}=	Convert To Number		${newX}	2
	${newY}=	Get Element Attribute	${group1}	y
	${newY}=	Convert To Number		${newY}	2
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
