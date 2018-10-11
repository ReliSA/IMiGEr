*** Settings ***
Documentation	A test suite with tests of node search.

Suite Setup		Open Browser To Demo Diagram
Suite Teardown	Close Browser
Test Teardown	Reload Diagram Screen

Resource		common.robot


*** Variables ***
${searchInputField}	//input[@id="searchText"]
${searchButton}		//button[@id="search"]
${searchCounter}	//span[@id="countOfFound"]

${vertex2015}		//*[name()="svg"][@data-id="2015"]
${vertex2039}		//*[name()="svg"][@data-id="2039"]


*** Test Cases ***
Search vertex using enter key
	Input Text			${searchInputField}		Product
	# press enter
	Press Key			${searchInputField}		\\13
	# check counter of found nodes
	${found}=		Get Text	${searchCounter}
	Should Be Equal As Strings	${found}		2
	# check CSS classes of found nodes
	Element Should Have Class	${vertex2015}	node--found
	Element Should Have Class	${vertex2039}	node--found


Search vertex using button
	Input Text			${searchInputField}		Product
	Click Element		${searchButton}
	# check counter of found nodes
	${found}=	Get Text		${searchCounter}
	Should Be Equal As Strings	${found}		2
	# check CSS classes of found nodes
	Element Should Have Class	${vertex2015}	node--found
	Element Should Have Class	${vertex2039}	node--found


Reset search using escape key
	Input Text				${searchInputField}	Product
	Click Element			${searchButton}
	# press escape
	Press Key				${searchInputField}	\\27
	# check counter of found nodes
	${found}=	Get Text	${searchCounter}
	Should Be Equal As Strings	${found}		0
	# check that no nodes are found
	Element Should Not Have Class	${vertex2015}	node--found
	Element Should Not Have Class	${vertex2039}	node--found


Reset search using counter click
	Input Text				${searchInputField}	Product
	Click Element			${searchButton}
	Click Element			${searchCounter}
	# check counter of found nodes
	${found}=	Get Text	${searchCounter}
	Should Be Equal As Strings	${found}		0
	# check that no nodes are found
	Element Should Not Have Class	${vertex2015}	vertex--found
	Element Should Not Have Class	${vertex2039}	vertex--found
