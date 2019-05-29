class VertexArchetypeFilter extends AbstractFilter {
	/**
	 * @constructor
	 * @param {string} operation Filtering operation.
	 * @param {FormData} formData Raw, unprocessed form content.
	 */
	constructor(operation, formData) {
		super();

		this._operation = operation;
		this._formData = formData;
	}

	/**
	 * @inheritDoc
	 */
	run(nodeList) {
		// prefilter
		nodeList = nodeList.filter(node => {
			return node instanceof Vertex;
		});

		// filter
		return nodeList.filter(this._getFilterFunction());
	}

	/**
	 * @returns {function} Function to be used for filtering.
	 */
	_getFilterFunction() {
		const filterValues = this._formData.getAll('value').map(value => parseInt(value));

		let filterFn;
		switch (this._operation) {
			case EnumFilterOperation.EQ:
				filterFn = vertex => {
					return filterValues.indexOf(vertex.archetype) < 0; //> -1
				};
				break;

			case EnumFilterOperation.NEQ:
				filterFn = vertex => {
					return filterValues.indexOf(vertex.archetype) > -1; //< 0
				};
				break;

			default:
				throw new InvalidArgumentError;
		}

		return filterFn;
	}
}