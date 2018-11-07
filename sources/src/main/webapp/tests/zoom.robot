*** Settings ***
Documentation	A test suite with tests of graph zoom.

Library			String

Suite Setup		Open Browser To Demo Diagram
Suite Teardown	Close Browser
Test Teardown	Reload Diagram Screen

Resource		common.robot


*** Variables ***
${defaultZoom}		${80}
${minZoom}			${10}
${maxZoom}			${500}

${graphWrapper}		//*[name()="g"][@id="graph"]

${zoomInButton}		//button[@id="zoomIn"]
${zoomOutButton}	//button[@id="zoomOut"]
${zoomValue}		//span[@id="zoomValue"]


*** Test Cases ***
Zoom In
	Click Element		${zoomInButton}
	Zoom Should Be Equal	${defaultZoom + 10}


Zoom In Constraint
	# zoom in to maximum (there are 12 steps between default and maximum zoom level)
	Repeat Keyword	12	Click Element	${zoomInButton}
	Zoom Should Be Equal	${maxZoom}
	Element Should Have Class	${zoomInButton}	disabled


Zoom Out
	Click Element		${zoomOutButton}
	Zoom Should Be Equal	${defaultZoom - 10}


Zoom Out Constraint
	# zoom out to minimum (there are 5 steps between default and minimum zoom level)
	Repeat Keyword	5	Click Element	${zoomOutButton}
	Zoom Should Be Equal	${minZoom}
	Element Should Have Class	${zoomOutButton}	disabled


*** Keywords ***
Zoom Should Be Equal
	[Arguments]	${expectedScale}
	# check zoom scale text
	${scalePercentage}=	Get Text	${zoomValue}
	${expectedPercentage}=	Catenate	SEPARATOR=	${expectedScale}	%
	Should Be Equal As Strings	${scalePercentage}	${expectedPercentage}
	# check zoom scale attribute
	${expectedScaleAsString}=	Convert To String	${expectedScale / 100}
	${expectedScaleAsString}=	Replace String	${expectedScaleAsString}	.0	${EMPTY}
	${scaleAttribute}=	Get Element Attribute	${graphWrapper}	transform
	${expectedAttribute}=	Catenate	SEPARATOR=	scale(	${expectedScaleAsString}	)
	Should Be Equal As Strings	${scaleAttribute}	${expectedAttribute}
