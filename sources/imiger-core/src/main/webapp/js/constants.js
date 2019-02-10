/**
 * Class containing application constants.
 */
class Constants {
}

/** @static @prop {string} notFoundVertexName Name of the vertex that groups all components that were not found while constructing graph. */
Constants.notFoundVertexName = 'NOT_FOUND';

/** @static @prop {object} API Map of application programming interface paths. */
Constants.API = {
	logIn: 'api/log-in',
	logOut: 'api/log-out',
	register: 'api/register',
	loadGraphData: 'api/load-graph-data',
	getDiagram: 'api/get-diagram',
	saveDiagram: 'api/save-diagram',
	removeDiagram: 'api/remove-diagram',
	getPrivateDiagrams: 'api/get-private-diagrams',
};

/** @static @prop {object} Regular expression for extracting coordinates from SVG transform attribute. */
Constants.transformAttributeRegex = /translate\((?<x>[0-9\.-]+), (?<y>[0-9\.-]+)\)/;
