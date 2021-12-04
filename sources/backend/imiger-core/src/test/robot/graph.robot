*** Settings ***
Documentation	A test suite with tests of graph construction.

Suite Setup		Open Diagram Spade
Suite Teardown	Close Browser

Resource		common.robot


*** Variables ***
${graphWrapper}			//*[name()="g"][@id="graph"]
${unconnectedNodeList}	//div[@id="unconnectedNodeListComponent"]
${componentCounter}		//span[@class="component-counter"]

${vertex2}				//*[name()="g"][contains(@class, "vertex")][@data-id="2"]
${vertex4}				//*[name()="g"][contains(@class, "vertex")][@data-id="4"]
${vertex291}			//*[name()="g"][contains(@class, "vertex")][@data-id="291"]
${vertex303}			//*[name()="g"][contains(@class, "vertex")][@data-id="303"]

${vertex0}				//*[name()="li"][contains(@class, "vertex")][@data-id="0"]
${vertex6}				//*[name()="li"][contains(@class, "vertex")][@data-id="6"]

*** Test Cases ***
General
	Title Should Be			IMiGEr - jira-project.json
	# check component counter
	${count}=	Get Text	${componentCounter}
	Should Be Equal As Strings		${count}	loaded components: 19
	# check vertices that should be contained in viewport
	Page Should Contain Element		${graphWrapper}${vertex2}
	Page Should Contain Element		${graphWrapper}${vertex4}
	Page Should Contain Element		${graphWrapper}${vertex291}
	Page Should Contain Element		${graphWrapper}${vertex303}
	# check vertices that should be contained in unconnected node list
	Page Should Contain Element		${unconnectedNodeList}${vertex0}
	Page Should Contain Element		${unconnectedNodeList}${vertex6}
