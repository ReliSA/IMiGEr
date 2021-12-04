/**
 * Class representing a saved diagram.
 */
class Diagram {
	/**
	 * @constructor
	 * @param {object} props Object loaded from database holding properties of the diagram.
	 */
	constructor(props) {
		this.id = Utils.isDefined(props.id) ? parseInt(props.id) : null;
		this.name = Utils.isDefined(props.name) ? props.name : null;
		this.public = Utils.isDefined(props.public) ? (props.public === '1') : null;
	}
}
