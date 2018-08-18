/**
 * Class containing application constants.
 * @constructor
 */
function Constants() {
	/** @prop {string} crceApiBase CRCE API base path. */
	this.crceApiBase = 'http://localhost:8081/rest/v2';
	/** @prop {string} notFoundVertexName Name of the vertex that groups all components that were not found while constructing graph. */
	this.notFoundVertexName = 'NOT_FOUND';
}
