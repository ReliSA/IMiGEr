*** Settings ***
Documentation	A test suite with tests of node excluding functionality.

Suite Setup		Open Browser To Demo Diagram
Suite Teardown	Close Browser
Test Setup		Select Radio Button		actionMove	exclude
Test Teardown	Reload Diagram Screen

Resource		common.robot


*** Variables ***
${vertexToGroupButton}	//button[@id="vertexToGroup"]

${excludedNodeList}		//div[@id="excludedNodeListComponent"]

${includeAllButton}		//button[contains(@class, "include-all-button")]

${vertex2013}			//*[name()="svg"][contains(@class, "vertex")][@data-id="2013"]
${excludedVertex2013}	//li[contains(@class, "vertex")][@data-id="2013"]
${vertex2014}			//*[name()="svg"][contains(@class, "vertex")][@data-id="2014"]
${excludedVertex2014}	//li[contains(@class, "vertex")][@data-id="2014"]

${group1}				//*[name()="svg"][contains(@class, "group")][@data-id="1"]
${excludedGroup1}		//li[contains(@class, "group")][@data-id="1"]


*** Test Cases ***
Exclude Vertex
	Click Element		${vertex2014}
	Element Should Not Be Visible	${vertex2014}
	Element Should Be Visible		${excludedNodeList}${excludedVertex2014}


Exclude Group
	Click Element		${vertexToGroupButton}
	Click Element		${group1}
	Element Should Not Be Visible	${group1}
	Element Should Be Visible		${excludedNodeList}${excludedGroup1}


Include All Excluded Nodes
	Click Element		${vertex2013}
	Click Element		${vertex2014}
	Click Element		${excludedNodeList}${includeAllButton}
	Element Should Be Visible		${vertex2013}
	Element Should Not Be Visible	${excludedNodeList}${excludedVertex2013}
	Element Should Be Visible		${vertex2014}
	Element Should Not Be Visible	${excludedNodeList}${excludedVertex2014}
