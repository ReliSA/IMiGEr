*** Settings ***
Documentation	A test suite with tests of node search.

Suite Setup		Open Diagram Raw
Suite Teardown	Close Browser
Test Teardown	Reload Diagram Screen

Resource		common.robot


*** Variables ***
${searchInputField}	//input[@id="searchText"]
${searchButton}		//button[@id="searchButton"]
${searchCounter}	//span[@id="searchCount"]

${vertex2015}		//*[contains(@class, "vertex")][@data-id="2015"]
${vertex2039}		//*[contains(@class, "vertex")][@data-id="2039"]


*** Test Cases ***
Search vertex using enter key
	Input Text			${searchInputField}		Product
	# press enter
	Press Key			${searchInputField}		\\13
	# check counter of found nodes
	${found}=		Get Text	${searchCounter}
	Should Be Equal As Strings	${found}		2
	# check found nodes
	Element Attribute Value Should Be	${vertex2015}	filter	url(#node--found)
	Element Attribute Value Should Be	${vertex2039}	filter	url(#node--found)


Search vertex using button
	Input Text			${searchInputField}		Product
	Click Element		${searchButton}
	# check counter of found nodes
	${found}=	Get Text		${searchCounter}
	Should Be Equal As Strings	${found}		2
	# check found nodes
	Element Attribute Value Should Be	${vertex2015}	filter	url(#node--found)
	Element Attribute Value Should Be	${vertex2039}	filter	url(#node--found)


Reset search using escape key
	Input Text				${searchInputField}	Product
	Click Element			${searchButton}
	# press escape
	Press Key				${searchInputField}	\\27
	# check counter of found nodes
	${found}=	Get Text	${searchCounter}
	Should Be Equal As Strings	${found}		0
	# check that no nodes are found
	Element Should Not Have Attribute	${vertex2015}	filter
	Element Should Not Have Attribute	${vertex2039}	filter


Reset search using counter click
	Input Text				${searchInputField}	Product
	Click Element			${searchButton}
	Click Element			${searchCounter}
	# check counter of found nodes
	${found}=	Get Text	${searchCounter}
	Should Be Equal As Strings	${found}		0
	# check that no nodes are found
	Element Should Not Have Attribute	${vertex2015}	filter
	Element Should Not Have Attribute	${vertex2039}	filter
