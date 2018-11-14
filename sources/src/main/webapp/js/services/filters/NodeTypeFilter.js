class NodeTypeFilter extends AbstractFilter {
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
				filterFn = node => {
					return (node instanceof Vertex && filterValues.indexOf(NodeTypeFilter.VERTEX) > -1)
						|| (node instanceof Group && filterValues.indexOf(NodeTypeFilter.GROUP) > -1);
				};
				break;

			case EnumFilterOperation.NEQ:
				filterFn = node => {
					return (node instanceof Vertex && filterValues.indexOf(NodeTypeFilter.VERTEX) < 0)
						|| (node instanceof Group && filterValues.indexOf(NodeTypeFilter.GROUP) < 0);
				};
				break;

			default:
				throw new InvalidArgumentError;
		}

		return filterFn;
	}
}

NodeTypeFilter.VERTEX = 0;
NodeTypeFilter.GROUP = 1;
