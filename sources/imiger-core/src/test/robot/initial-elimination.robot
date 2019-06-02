*** Settings ***
Documentation	A test suite with tests of initial elimination.

Suite Setup		Open Diagram Raw With Initial Elimination
Suite Teardown	Close Browser

Resource		common.robot

*** Test Cases ***

Initial elimination
	${count}=    Get Element Count    //*[name()="g"][contains(@class, "vertex")]
	Should Be True  ${count} < 20
