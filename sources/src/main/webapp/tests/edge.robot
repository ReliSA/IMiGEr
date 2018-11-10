*** Settings ***
Documentation	A test suite with tests of edge actions.

Suite Setup		Open Browser To Demo Diagram
Suite Teardown	Close Browser
Test Teardown	Reload Diagram Screen

Resource		common.robot


*** Variables ***
${edge38}		//*[name()="g"][contains(@class, "edge")][@data-id="38"]

${vertex4}		//*[name()="svg"][contains(@class, "vertex")][@data-id="4"]
${vertex2014}	//*[name()="svg"][contains(@class, "vertex")][@data-id="2014"]

${edgeArrow}	/*[name()="g"][contains(@class, "arrow")]

${edgePopover}	//div[contains(@class, "edge-popover")]


*** Test Cases ***
Highlight Edge
	Click Element	${edge38}${edgeArrow}
	# check that vertices not connected to the edge are not highlighted
	Element Should Have Class	${edge38}		edge--highlighted
	Element Should Have Class	${vertex4}		node--highlighted
	Element Should Have Class	${vertex2014}	node--highlighted


Hide Edge Popover By Moving Mouse Out
	Click Element		${edge38}${edgeArrow}
	Mouse Out			${edgePopover}
	Element Should Not Be Visible	${edgePopover}
	Element Should Have Attribute	${edgePopover}	hidden


Hide Edge Popover By Clicking Elsewhere
	Click Element		${edge38}${edgeArrow}
	Click Element		//body
	Element Should Not Be Visible	${edgePopover}
	Element Should Have Attribute	${edgePopover}	hidden
