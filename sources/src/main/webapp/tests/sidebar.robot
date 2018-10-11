*** Settings ***
Documentation	A test suite with tests of sidebar panels toggling.

Suite Setup		Open Browser To Demo Diagram
Suite Teardown	Close Browser

Resource		common.robot


*** Variables ***
${sidebar}				//div[@id="sidebar"]

${unconnectedButton}	//button[@id="unconnectedButton"]
${unconnectedNodeList}	//div[@id="unconnectedNodeListComponent"]

${includeAllButton}		//button[contains(@class, "include-all-button")]
${excludeAllButton}		//button[contains(@class, "exclude-all-button")]

${vertex0}				//*[name()="svg"][contains(@class, "vertex")][@data-id="0"]
${excludedVertex0}		//li[contains(@class, "vertex")][@data-id="0"]


*** Test Cases ***
Toggle Unconnected Nodes
	Element Should Have Class		${unconnectedNodeList}	hidden
	Click Element					${unconnectedButton}
	Element Should Not Have Class	${unconnectedNodeList}	hidden
	Click Element					${unconnectedButton}
	Element Should Have Class		${unconnectedNodeList}	hidden


Include And Exclude All Unconnected Vertices
	Click Element					${unconnectedButton}
	Element Should Not Be Visible	${vertex0}
	Element Should Be Visible		${unconnectedNodeList}${excludedVertex0}
	# include all unconnected vertices
	Click Element					${unconnectedNodeList}${includeAllButton}
	Element Should Be Visible		${vertex0}
	Element Should Not Be Visible	${unconnectedNodeList}${excludedVertex0}
	# exclude all unconnected vertices
	Click Element					${unconnectedNodeList}${excludeAllButton}
	Element Should Not Be Visible	${vertex0}
	Element Should Be Visible		${unconnectedNodeList}${excludedVertex0}
	Click Element					${unconnectedButton}
