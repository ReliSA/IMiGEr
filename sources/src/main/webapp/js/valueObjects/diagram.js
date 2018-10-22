/**
 * Class representing a saved diagram.
 */
class Diagram {
	/**
	 * @constructor
	 * @param {object} props Object loaded from database holding properties of the diagram.
	 */
	constructor(props) {
		this.id = parseInt(props.id);
		this.name = props.name;
		this.public = props.public === '1';
	}
}
