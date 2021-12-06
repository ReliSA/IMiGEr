*** Settings ***
Documentation	A test suite with tests of navbar actions.

Suite Setup		Open Diagram Raw
Suite Teardown	Close Browser
Test Teardown	Reload Diagram Screen

Resource		common.robot


*** Variables ***
${navbar}				//div[@class="navbar"]
${graphWrapper}			//*[name()="g"][@id="graph"]

${mostEdgeButton}		//button[@id="mostEdge"]
${vertexToGroupButton}	//button[@id="vertexToGroup"]
${backToUploadButton}	//a[@id="backToUpload"]

${excludedNodeList}		//div[@id="excludedNodeListComponent"]

${group1}				//*[name()="g"][contains(@class, "group")][@data-id="1"]
${vertex2044}			//*[name()="g"][contains(@class, "vertex")][@data-id="2044"]
${excludedVertex2044}	//li[contains(@class, "vertex")][@data-id="2044"]


*** Test Cases ***
Exclude Vertex With Most Edges
	Click Element		${mostEdgeButton}
	# vertex with most edges should be excluded
	Page Should Not Contain Element	${graphWrapper}${vertex2044}
	Page Should Contain Element		${excludedNodeList}${excludedVertex2044}


Exclude Vertex With Most Edges To Group
	Click Element		${vertexToGroupButton}
	# vertex with most edges should be in a group
	Page Should Not Contain Element	${graphWrapper}${vertex2044}
	Page Should Contain Element		${graphWrapper}${group1}


Back To Upload
	Click Element		${backToUploadButton}
	${location}=		Get Location
	Should Be Equal As Strings		${location}		${UPLOAD FILES URL}
