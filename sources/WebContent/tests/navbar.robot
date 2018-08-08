*** Settings ***
Documentation	A test suite with tests of navbar actions.
...
...				This test has a workflow that is created using keywords in
...				the imported resource file.
...
Suite Setup		Open Browser To Demo Diagram
Test Teardown	Reload Diagram Screen
Suite Teardown	Close Browser
Resource		common.robot

*** Variables ***
${navbar}	//div[@id='navigation']
${graphWrapper}	//*[name()='g'][@id='graph']

${mostEdgeButton}	//button[@id='mostEdge']
${vertexToGroupButton}	//button[@id='vertexToGroup']
${backToUploadButton}	//a[@id='view_back_to_upload']

${excludedNodeList}	//div[@id='excludedNodeListComponent']

${group1}	//*[name()='svg'][contains(@class, 'group')][@data-id='1']
${vertex6}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='6']
${excludedVertex6}	//li[contains(@class, 'vertex')][@data-id='6']

*** Test Cases ***
Exclude Vertex With Most Edges
	Click Element	${mostEdgeButton}
	# vertex with most edges should be excluded
	Page Should Not Contain Element	${graphWrapper}${vertex6}
	Page Should Contain Element		${excludedNodeList}${excludedVertex6}

Exclude Vertex With Most Edges To Group
	Click Element	${vertexToGroupButton}
	# vertex with most edges should be in a group
	Page Should Not Contain Element	${graphWrapper}${vertex6}
	Page Should Contain Element		${graphWrapper}${group1}

Back To Upload
	Click Element	${backToUploadButton}
	${location}=	Get Location
	Should Be Equal As Strings	${location}	${UPLOAD FILES URL}

*** Keywords ***
