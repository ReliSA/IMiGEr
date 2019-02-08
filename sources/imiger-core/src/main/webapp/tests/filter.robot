*** Settings ***
Documentation	A test suite with tests of node filtering.

Library			String

Suite Setup		Open Browser To Demo Diagram
Suite Teardown	Close Browser
Test Teardown	Reload Diagram Screen

Resource		common.robot


*** Variables ***
${filterButton}						//button[@id="filterButton"]
${filterModalWindow}				//div[contains(@class, "filter-modal")]
${filterModalWindowCloseButton}		${filterModalWindow}//button[contains(@class, "close-button")]

${baseFilterDropdown}				${filterModalWindow}//select[@name="baseFilter"]
${additionalFilterDropdown}			${filterModalWindow}//select[@name="additionalFilter"]
${operationDropdown}				${filterModalWindow}//select[@name="operation"]

${stringValueInput}					${filterModalWindow}//input[@name="value"]
${enumValueDropdown}				${filterModalWindow}//select[@name="value"]
${numberValueInput}					${filterModalWindow}//input[@name="value"]
${numberFromValueInput}				${filterModalWindow}//input[@name="value-from"]
${numberToValueInput}				${filterModalWindow}//input[@name="value-to"]
${dateValueInput}					${filterModalWindow}//input[@name="value"]
${dateFromValueInput}				${filterModalWindow}//input[@name="value-from"]
${dateToValueInput}					${filterModalWindow}//input[@name="value-to"]

${applyButton}						${filterModalWindow}//button[@type="submit"]
${resetButton}						${filterModalWindow}//button[@type="reset"]

${foundNodes}						//*[name()="svg"][contains(@class, "node--found")]


*** Test Cases ***
Open filter modal
	Click Button						${filterButton}
	Element Should Not Have Attribute	${filterModalWindow}	hidden


Close filter modal by button click
	Click Button					${filterButton}
	Click Button					${filterModalWindowCloseButton}
	Element Should Have Attribute	${filterModalWindow}	hidden


Close filter modal by backdrop click
	Click Button					${filterButton}
	Click Element At Coordinates	${filterModalWindow}	221		0
	Element Should Have Attribute	${filterModalWindow}	hidden


Focus form fields
	Click Button					${filterButton}
	Click Element					${filterModalWindow}//label[@for="baseFilter"]
	Element Should Be Focused		${baseFilterDropdown}
	Click Element					${filterModalWindow}//label[@for="operation"]
	Element Should Be Focused		${operationDropdown}


Reset form
	Click Button					${filterButton}
	Select From List By Label		${enumValueDropdown}	Vertex
	Click Button					${applyButton}
	Click Button					${resetButton}
	${values}=			Get Selected List Labels	${enumValueDropdown}
	Should Be Empty					${values}
	${count}=			Get Element Count	${foundNodes}
	Should Be Equal As Integers		${count}	0


Check defaults
	Click Button					${filterButton}
	${baseFilterValue}=	Get Selected List Label		${baseFilterDropdown}
	Should Be Equal As Strings		${baseFilterValue}		Node type
	Element Should Have Attribute	${additionalFilterDropdown}		hidden
	${operationValue}=	Get Selected List Label		${operationDropdown}
	Should Be Equal As Strings		${operationValue}		equals
	${values}=			Get Selected List Labels	${enumValueDropdown}
	Should Be Empty					${values}


Filter by node type equals
	[Tags]		filter-by-node-type
	Click Button					${filterButton}
	Select From List By Label		${operationDropdown}	equals
	Select From List By Label		${enumValueDropdown}	Vertex
	Click Button					${applyButton}
	${count}=			Get Element Count	${foundNodes}
	Should Be Equal As Integers		${count}	36


Filter by node type not equals
	[Tags]		filter-by-node-type
	Click Button					${filterButton}
	Select From List By Label		${operationDropdown}	not equals
	Select From List By Label		${enumValueDropdown}	Vertex
	Click Button					${applyButton}
	${count}=			Get Element Count	${foundNodes}
	Should Be Equal As Integers		${count}	1


Filter by vertex archetype equals
	[Tags]		filter-by-vertex-archetype
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex archetype
	Select From List By Label		${operationDropdown}	equals
	Select From List By Label		${enumValueDropdown}	Person
	Click Button					${applyButton}
	Found Count Should Be Equal		4


Filter by vertex archetype not equals
	[Tags]		filter-by-vertex-archetype
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex archetype
	Select From List By Label		${operationDropdown}	not equals
	Select From List By Label		${enumValueDropdown}	Person
	Click Button					${applyButton}
	Found Count Should Be Equal		32


Filter by string vertex attribute equals
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-string-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Name (string)
	Select From List By Label		${operationDropdown}	equals
	Input Text						${stringValueInput}		Stakeholders
	Click Button					${applyButton}
	Found Count Should Be Equal		1


Filter by string vertex attribute contains
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-string-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Name (string)
	Select From List By Label		${operationDropdown}	contains
	Input Text						${stringValueInput}		mentor
	Click Button					${applyButton}
	Found Count Should Be Equal		2


Filter by string vertex attribute starts with
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-string-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Name (string)
	Select From List By Label		${operationDropdown}	starts with
	Input Text						${stringValueInput}		Product
	Click Button					${applyButton}
	Found Count Should Be Equal		2


Filter by string vertex attribute ends with
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-string-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Name (string)
	Select From List By Label		${operationDropdown}	ends with
	Input Text						${stringValueInput}		projektu
	Click Button					${applyButton}
	Found Count Should Be Equal		2


Filter by string vertex attribute matches
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-string-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Name (string)
	Select From List By Label		${operationDropdown}	regular expression
	Input Text						${stringValueInput}		\\d+
	Click Button					${applyButton}
	Found Count Should Be Equal		4


Filter by enum vertex attribute equals
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-enum-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Roles (enum)
	Select From List By Label		${operationDropdown}	equals
	Select From List By Label		${enumValueDropdown}	Developer
	Click Button					${applyButton}
	Found Count Should Be Equal		3


Filter by enum vertex attribute not equals
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-enum-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Roles (enum)
	Select From List By Label		${operationDropdown}	not equals
	Select From List By Label		${enumValueDropdown}	Team leader
	Click Button					${applyButton}
	Found Count Should Be Equal		3


Filter by date vertex attribute equals
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-date-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Created (date)
	Select From List By Label		${operationDropdown}	equals
	Input Date						${dateValueInput}		2017-03-27
	Click Button					${applyButton}
	Found Count Should Be Equal		5


Filter by date vertex attribute not equals
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-date-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Created (date)
	Select From List By Label		${operationDropdown}	not equals
	Input Date						${dateValueInput}		2017-03-27
	Click Button					${applyButton}
	Found Count Should Be Equal		27


Filter by date vertex attribute from unix epoch to date
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-date-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Created (date)
	Select From List By Label		${operationDropdown}	is in range
	Input Date						${dateToValueInput}		2017-04-01
	Click Button					${applyButton}
	Found Count Should Be Equal		6


Filter by date vertex attribute is in range
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-date-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Created (date)
	Select From List By Label		${operationDropdown}	is in range
	Input Date						${dateFromValueInput}	2017-04-01
	Input Date						${dateToValueInput}		2017-05-01
	Click Button					${applyButton}
	Found Count Should Be Equal		22


Filter by date vertex attribute is from date to now
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-date-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Created (date)
	Select From List By Label		${operationDropdown}	is in range
	Input Date						${dateFromValueInput}	2017-05-01
	Click Button					${applyButton}
	Found Count Should Be Equal		4


Filter by number vertex attribute equals
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-number-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Progress (number)
	Select From List By Label		${operationDropdown}	equals
	Input Text						${numberValueInput}		40
	Click Button					${applyButton}
	Found Count Should Be Equal		1


Filter by number vertex attribute not equals
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-number-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Progress (number)
	Select From List By Label		${operationDropdown}	not equals
	Input Text						${numberValueInput}		40
	Click Button					${applyButton}
	Found Count Should Be Equal		0


Filter by number vertex attribute lower than
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-number-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Progress (number)
	Select From List By Label		${operationDropdown}	lower than
	Input Text						${numberValueInput}		40
	Click Button					${applyButton}
	Found Count Should Be Equal		0


Filter by number vertex attribute lower than or equals
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-number-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Progress (number)
	Select From List By Label		${operationDropdown}	lower than or equals
	Input Text						${numberValueInput}		40
	Click Button					${applyButton}
	Found Count Should Be Equal		1


Filter by number vertex attribute greater than
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-number-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Progress (number)
	Select From List By Label		${operationDropdown}	greater than
	Input Text						${numberValueInput}		40
	Click Button					${applyButton}
	Found Count Should Be Equal		0


Filter by number vertex attribute greater than or equals
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-number-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Progress (number)
	Select From List By Label		${operationDropdown}	greater than or equals
	Input Text						${numberValueInput}		40
	Click Button					${applyButton}
	Found Count Should Be Equal		1


Filter by number vertex attribute is from min to number
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-number-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Progress (number)
	Select From List By Label		${operationDropdown}	is in range
	Input Text						${numberToValueInput}	30
	Click Button					${applyButton}
	Found Count Should Be Equal		0


Filter by number vertex attribute is in range
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-number-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Progress (number)
	Select From List By Label		${operationDropdown}	is in range
	Input Text						${numberFromValueInput}	30
	Input Text						${numberToValueInput}	50
	Click Button					${applyButton}
	Found Count Should Be Equal		1


Filter by number vertex attribute is from number to max
	[Tags]		filter-by-vertex-attribute		filter-by-vertex-number-attribute
	Click Button					${filterButton}
	Select From List By Label		${baseFilterDropdown}	Vertex attribute
	Select From List By Label		${additionalFilterDropdown}		Progress (number)
	Select From List By Label		${operationDropdown}	is in range
	Input Text						${numberFromValueInput}	50
	Click Button					${applyButton}
	Found Count Should Be Equal		0


*** Keywords ***
Found Count Should Be Equal
	[Arguments]		${expectedCount}
	${count}=	Get Element Count	${foundNodes}
	Should Be Equal As Integers		${count}	${expectedCount}


Input Date
	[Arguments]		${locator}		${date}
	# split date to parts (day, month, year)
	@{parts}=		Split String	${date}		-
	# enter individual parts into the input
	Set Focus To Element			${locator}
	Press Key						${locator}		@{parts}[2]
	Press Key						${locator}		@{parts}[1]
	Press Key						${locator}		@{parts}[0]
