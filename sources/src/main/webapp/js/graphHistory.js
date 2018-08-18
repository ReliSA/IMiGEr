/**
 * @constructor
 */
function GraphHistory() {

	this.goBack = function() {
		history.back();
	};

	this.goForward = function() {
		history.forward();
	};

	this.goTo = function(pageNumber) {
		history.go(pageNumber);
	};

}
