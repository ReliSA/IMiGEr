*** Settings ***
Documentation	A test suite with tests of graph construction.
...
...				This test has a workflow that is created using keywords in
...				the imported resource file.
...
Suite Setup		Open Browser To Diagram
Suite Teardown	Close Browser
Resource		common.robot

*** Variables ***
${graphWrapper}	//*[name()='g'][@id='graph']
${unconnectedNodeList}	//div[@id='unconnectedNodeListComponent']

${componentCounter}	//span[@class='component-counter']
${graphVersion}	//span[@class='graph-version']

${vertex1}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='1']
${vertex2}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='2']
${vertex3}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='3']
${vertex4}	//li[@data-id='4']
${vertex5}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='5']
${vertex6}	//*[name()='svg'][contains(@class, 'vertex')][@data-id='6']

*** Test Cases ***
General
	Title Should Be		Visualization of large component diagrams
	# check component counter
	${count}=		Get Text	${componentCounter}
	Should Be Equal As Strings		${count}	loaded components: 6
	# check graph version
	${version}=		Get Text	${graphVersion}
	Should Be Equal As Strings		${version}	graph version: 1
	# check vertices that should (not) be contained in viewport
	Page Should Contain Element		${graphWrapper}${vertex1}
	Page Should Contain Element		${graphWrapper}${vertex2}
	Page Should Contain Element		${graphWrapper}${vertex3}
	Page Should Not Contain Element	${graphWrapper}${vertex4}
	Page Should Contain Element		${graphWrapper}${vertex5}
	Page Should Contain Element		${graphWrapper}${vertex6}
	# check vertices that should (not) be contained in unconnected node list
	Page Should Not Contain Element	${unconnectedNodeList}${vertex1}
	Page Should Not Contain Element	${unconnectedNodeList}${vertex2}
	Page Should Not Contain Element	${unconnectedNodeList}${vertex3}
	Page Should Contain Element		${unconnectedNodeList}${vertex4}
	Page Should Not Contain Element	${unconnectedNodeList}${vertex5}
	Page Should Not Contain Element	${unconnectedNodeList}${vertex6}

*** Keywords ***
