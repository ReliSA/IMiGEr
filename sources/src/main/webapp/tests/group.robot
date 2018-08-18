*** Settings ***
Documentation	A test suite with tests of vertex grouping functionality.
...
...				This test has a workflow that is created using keywords in
...				the imported resource file.
...
Suite Setup		Open Browser To Demo Diagram
Test Setup		Click Element	//button[@id='vertexToGroup']
Test Teardown	Reload Diagram Screen
Suite Teardown	Close Browser
Resource		common.robot

*** Variables ***
${zoomInButton}	//button[@id='zoomIn']

${vertex5}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='5']
${vertex6}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='6']

${group1}	//*[name()='svg'][contains(@class, 'group')][@data-id='1']

${groupName}	/*[name()='text'][@class='group-name']
${groupVertexList}	/*[name()='g'][@class='group-vertex-list']
${groupExpandButton}	/*[name()='g'][contains(@class, 'expand-button')]
${groupCompressButton}	/*[name()='g'][contains(@class, 'compress-button')]
${groupDissolveButton}	/*[name()='g'][contains(@class, 'dissolve-button')]

${vertexContextMenu}	//div[contains(@class, 'context-menu')]

*** Test Cases ***
Mouse Down Group
	Mouse Down	${group1}
	Element Should Have Class	${group1}	node--dragged
	Mouse Up	${group1}
	Element Should Not Have Class	${group1}	node--dragged

Drag Group
	# zoom in to 100% to get correct coordinates
	Click Element	${zoomInButton}
	Click Element	${zoomInButton}
	# get old group coordinates
	${oldX}=	Get Element Attribute	${group1}	x
	${oldX}=	Convert To Number	${oldX}	2
	${oldY}=	Get Element Attribute	${group1}	y
	${oldY}=	Convert To Number	${oldY}	2
	# move vertex by 10 pixels in both directions
	Drag And Drop By Offset		${group1}	10	10
	# get new group coordinates
	${newX}=	Get Element Attribute	${group1}	x
	${newX}=	Convert To Number	${newX}	2
	${newY}=	Get Element Attribute	${group1}	y
	${newY}=	Convert To Number	${newY}	2
	# check that offset matches
	Should Be Equal As Numbers	${oldX + 10}	${newX}
	Should Be Equal As Numbers	${oldY + 10}	${newY}

Rename Group
	Element Should Contain	${group1}${groupName}	Group 1
	# trigger group rename prompt
	Click Element	${group1}/*[name()='text']
	Input Text Into Alert	Lorem Ipsum
	# check that group name was changed
	Element Should Contain	${group1}${groupName}	Lorem Ipsum

Expand And Compress Group
	# expand group
	Click Element	${group1}${groupExpandButton}
	# check that group is expanded
	Element Should Have Class	${group1}	group--expanded
	Element Should Not Be Visible	${group1}${groupExpandButton}
	Element Should Be Visible	${group1}${groupCompressButton}
	Element Should Be Visible	${group1}${groupVertexList}
	# compress group
	Click Element	${group1}${groupCompressButton}
	# check that group is back to normal
	Element Should Not Have Class	${group1}	group--expanded
	Element Should Be Visible	${group1}${groupExpandButton}
	Element Should Not Be Visible	${group1}${groupCompressButton}
	Element Should Not Be Visible	${group1}${groupVertexList}

Dissolve Group
	Click Element	${group1}${groupDissolveButton}
	# check that group is not visible while its vertex is
	Element Should Not Be Visible	${group1}
	Element Should Be Visible	${vertex6}

Add Vertex To Group
	# open vertex context menu
	Open Context Menu	${vertex5}
	Element Should Be Visible	${vertexContextMenu}
	# add vertex to group
	Click Element	${vertexContextMenu}//li[1]
	# check that neither vertex nor its context menu is visible
	Element Should Not Be Visible	${vertexContextMenu}
	Element Should Not Be Visible	${vertex5}

*** Keywords ***
