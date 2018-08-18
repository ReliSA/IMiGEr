*** Settings ***
Documentation	A test suite with tests of node search.
...
...				This test has a workflow that is created using keywords in
...				the imported resource file.
...
Suite Setup		Open Browser To Demo Diagram
Test Teardown	Reload Diagram Screen
Suite Teardown	Close Browser
Resource		common.robot

*** Variables ***
${searchInputField}	//input[@id='searchText']
${searchButton}		//button[@id='search']
${searchCounter}	//span[@id='countOfFound']

${vertex1}		//*[name()='svg'][@data-id='1']
${vertex2}		//*[name()='svg'][@data-id='2']
${vertex3}		//*[name()='svg'][@data-id='3']
${vertex4}		//*[name()='svg'][@data-id='4']
${vertex5}		//*[name()='svg'][@data-id='5']
${vertex6}		//*[name()='svg'][@data-id='6']

*** Test Cases ***
Search vertex using enter key
	Input Text			${searchInputField}	obcc-parking-example
	# press enter
	Press Key			${searchInputField}	\\13
	# check counter of found nodes
	${found}=	Get Text	${searchCounter}
	Should Be Equal As Strings	${found}	4
	# check CSS classes of (not) found nodes
	Element Should Have Class	${vertex1}	vertex--found
	Element Should Have Class	${vertex2}	vertex--found
	Element Should Have Class	${vertex3}	vertex--found
	Element Should Have Class	${vertex5}	vertex--found
	Element Should Not Have Class	${vertex6}	vertex--found

Search vertex using button
	Input Text			${searchInputField}	obcc-parking-example
	Click Element		${searchButton}
	# check counter of found nodes
	${found}=	Get Text	${searchCounter}
	Should Be Equal As Strings	${found}	4
	# check CSS classes of (not) found nodes
	Element Should Have Class	${vertex1}	vertex--found
	Element Should Have Class	${vertex2}	vertex--found
	Element Should Have Class	${vertex3}	vertex--found
	Element Should Have Class	${vertex5}	vertex--found
	Element Should Not Have Class	${vertex6}	vertex--found

Reset search using escape key
	Input Text			${searchInputField}	obcc-parking-example
	Click Element		${searchButton}
	# press escape
	Press Key			${searchInputField}	\\27
	# check counter of found nodes
	${found}=	Get Text	${searchCounter}
	Should Be Equal As Strings	${found}	0
	# check that no nodes are found
	Element Should Not Have Class	${vertex1}	vertex--found
	Element Should Not Have Class	${vertex2}	vertex--found
	Element Should Not Have Class	${vertex3}	vertex--found
	Element Should Not Have Class	${vertex5}	vertex--found
	Element Should Not Have Class	${vertex6}	vertex--found

Reset search using counter click
	Input Text			${searchInputField}	obcc-parking-example
	Click Element		${searchButton}
	Click Element		${searchCounter}
	# check counter of found nodes
	${found}=	Get Text	${searchCounter}
	Should Be Equal As Strings	${found}	0
	# check that no nodes are found
	Element Should Not Have Class	${vertex1}	vertex--found
	Element Should Not Have Class	${vertex2}	vertex--found
	Element Should Not Have Class	${vertex3}	vertex--found
	Element Should Not Have Class	${vertex5}	vertex--found
	Element Should Not Have Class	${vertex6}	vertex--found

*** Keywords ***
