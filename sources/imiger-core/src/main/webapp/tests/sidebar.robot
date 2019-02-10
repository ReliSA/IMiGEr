*** Settings ***
Documentation	A test suite with tests of sidebar panels toggling.

Suite Setup		Open Browser To Demo Diagram
Suite Teardown	Close Browser

Resource		common.robot


*** Variables ***
${sidebar}				//div[@id="sidebar"]

${unconnectedNodeList}	//div[@id="unconnectedNodeListComponent"]

${includeAllButton}		//button[contains(@class, "include-all-button")]
${excludeAllButton}		//button[contains(@class, "exclude-all-button")]

${vertex2030}			//*[name()="g"][contains(@class, "vertex")][@data-id="2030"]
${excludedVertex2030}	//li[contains(@class, "vertex")][@data-id="2030"]


*** Test Cases ***
Toggle Unconnected Nodes
	Element Should Not Have Attribute	${unconnectedNodeList}/div[@class="node-container-content"]		hidden
	Click Element						${unconnectedNodeList}/h2[@class="node-container-title"]
	Element Should Have Attribute		${unconnectedNodeList}/div[@class="node-container-content"]		hidden
	Click Element						${unconnectedNodeList}/h2[@class="node-container-title"]
	Element Should Not Have Attribute	${unconnectedNodeList}/div[@class="node-container-content"]		hidden


Include And Exclude All Unconnected Vertices
	Element Should Not Be Visible	${vertex2030}
	Element Should Be Visible		${unconnectedNodeList}${excludedVertex2030}
	# include all unconnected vertices
	Click Element					${unconnectedNodeList}${includeAllButton}
	Element Should Be Visible		${vertex2030}
	Element Should Not Be Visible	${unconnectedNodeList}${excludedVertex2030}
	# exclude all unconnected vertices
	Click Element					${unconnectedNodeList}${excludeAllButton}
	Element Should Not Be Visible	${vertex2030}
	Element Should Be Visible		${unconnectedNodeList}${excludedVertex2030}
