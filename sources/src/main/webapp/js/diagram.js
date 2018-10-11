/**
 * Class representing a saved diagram.
 * @constructor
 * @param {object} props Properties of the diagram.
 */
function Diagram(props) {
	/** @prop {int} id Identifier of the diagram. */
	this.id = parseInt(props.id);
	/** @prop {string} name Name of the diagram. */
	this.name = props.name;
	/** @prop {bool} public True if the diagram is public, otherwise false. */
	this.public = props.public === '1';
}
