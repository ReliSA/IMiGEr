class VertexAttributeFilter extends AbstractFilter {
	/**
	 * @constructor
	 * @param {string} additionalFilter
	 * @param {string} dataType
	 * @param {string} operation Filtering operation.
	 * @param {FormData} formData Raw, unprocessed form content.
	 */
	constructor(additionalFilter, dataType, operation, formData) {
		super();

		this._additionalFilter = additionalFilter;
		this._dataType = dataType;
		this._operation = operation;
		this._formData = formData;
		this._filterAttributeName = app.attributeTypeList[additionalFilter].name;
	}

	/**
	 * @inheritDoc
	 */
	run(nodeList) {
		// prefilter
		nodeList = nodeList.filter(node => {
			return node instanceof Vertex;
	}).filter(vertex => {
			return vertex.attributes.some(attribute => attribute[0] === this._filterAttributeName);
	});

		// filter
		return nodeList.filter(this._getFilterFunction());
	}

	/**
	 * @returns {function} Function to be used for filtering.
	 */
	_getFilterFunction() {
		let filterFn;
		switch (this._dataType) {
			case FilterDataType.STRING:
				filterFn = this._getStringFilterFunction(this._operation, this._filterAttributeName, this._formData);
				break;

			case FilterDataType.ENUM:
				filterFn = this._getEnumFilterFunction(this._additionalFilter, this._operation, this._filterAttributeName, this._formData);
				break;

			case FilterDataType.DATE:
				filterFn = this._getDateFilterFunction(this._operation, this._filterAttributeName, this._formData);
				break;

			case FilterDataType.NUMBER:
				filterFn = this._getNumberFilterFunction(this._operation, this._filterAttributeName, this._formData);
				break;

			default:
				throw new InvalidArgumentError;
		}

		return filterFn;
	}

	_getStringFilterFunction(operation, filterAttributeName, formData) {
		const filterValue = formData.get('value');

		let comparatorFn;
		switch (operation) {
			case StringFilterOperation.EQ:
				comparatorFn = (a, b) => a === b;
				break;

			case StringFilterOperation.NEQ:
				comparatorFn = (a, b) => a !== b;
				break;

			case StringFilterOperation.CONTAINS:
				comparatorFn = (a, b) => a.includes(b);
				break;

			case StringFilterOperation.STARTS_WITH:
				comparatorFn = (a, b) => a.startsWith(b);
				break;

			case StringFilterOperation.ENDS_WITH:
				comparatorFn = (a, b) => a.endsWith(b);
				break;

			case StringFilterOperation.REGEXP:
				comparatorFn = (a, b) => a.match(new RegExp(b, 'i'));
				break;

			default:
				throw new InvalidArgumentError;
		}

		return vertex => {
			const attribute = vertex.attributes.find(attribute => attribute[0] === filterAttributeName);
			return attribute != null && comparatorFn(attribute[1], filterValue);
		};
	}

	_getEnumFilterFunction(additionalFilter, operation, filterAttributeName, formData) {
		const filterValues = formData.getAll('value').map(value => app.possibleEnumValues[additionalFilter][parseInt(value)]);

		let filterFn;
		switch (operation) {
			case EnumFilterOperation.EQ:
				filterFn = vertex => {
				const attribute = vertex.attributes.find(attribute => attribute[0] === filterAttributeName);
				const attributeValues = attribute[1].split(', ');

				// some (at least one) of the attribute items should be contained in the filters
				return attributeValues.some(attributeValue => {
					return filterValues.indexOf(attributeValue) > -1;
			});
			};
				break;

			case EnumFilterOperation.NEQ:
				filterFn = vertex => {
				const attribute = vertex.attributes.find(attribute => attribute[0] === filterAttributeName);
				const attributeValues = attribute[1].split(', ');

				// every of the attribute items should not be contained in the filters (translated: none of the items should be contained in the filters)
				return attributeValues.every(attributeValue => {
					return filterValues.indexOf(attributeValue) < 0;
			});
			};
				break;

			default:
				throw new InvalidArgumentError;
		}

		return filterFn;
	}

	_getDateFilterFunction(operation, filterAttributeName, formData) {
		let filterFn;
		if (operation === DateFilterOperation.RANGE) {
			const filterValueFrom = formData.get('value-from') !== '' ? Date.parse(formData.get('value-from')) : 0;
			const filterValueTo = formData.get('value-to') !== '' ? Date.parse(formData.get('value-to')) : Date.now();

			filterFn = vertex => {
				const attribute = vertex.attributes.find(attribute => attribute[0] === filterAttributeName);
				const attributeValue = parseInt(attribute[1]);
				return (attributeValue >= filterValueFrom) && (attributeValue <= filterValueTo);
			};

		} else {
			const filterValue = new Date(formData.get('value'));

			let comparatorFn;
			switch (operation) {
				case DateFilterOperation.EQ:
					comparatorFn = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
					break;

				case DateFilterOperation.NEQ:
					comparatorFn = (a, b) => a.getFullYear() !== b.getFullYear() || a.getMonth() !== b.getMonth() || a.getDate() !== b.getDate();
					break;

				default:
					throw new InvalidArgumentError;
			}

			filterFn = vertex => {
				const attribute = vertex.attributes.find(attribute => attribute[0] === filterAttributeName);
				const attributeValue = new Date(parseInt(attribute[1]));
				return comparatorFn(attributeValue, filterValue);
			};
		}

		return filterFn;
	}

	_getNumberFilterFunction(operation, filterAttributeName, formData) {
		let filterFn;
		if (operation === NumberFilterOperation.RANGE) {
			const filterValueFrom = formData.get('value-from') !== '' ? parseFloat(formData.get('value-from')) : Number.MIN_VALUE;
			const filterValueTo = formData.get('value-to') !== '' ? parseFloat(formData.get('value-to')) : Number.MAX_VALUE

			filterFn = vertex => {
				const attribute = vertex.attributes.find(attribute => attribute[0] === filterAttributeName);
				const attributeValue = parseFloat(attribute[1]);
				return (attributeValue >= filterValueFrom) && (attributeValue <= filterValueTo);
			};

		} else {
			const filterValue = parseFloat(formData.get('value'));

			let comparatorFn;
			switch (operation) {
				case NumberFilterOperation.EQ:
					comparatorFn = (a, b) => a === b;
					break;

				case NumberFilterOperation.NEQ:
					comparatorFn = (a, b) => a !== b;
					break;

				case NumberFilterOperation.LT:
					comparatorFn = (a, b) => a < b;
					break;

				case NumberFilterOperation.LTE:
					comparatorFn = (a, b) => a <= b;
					break;

				case NumberFilterOperation.GT:
					comparatorFn = (a, b) => a > b;
					break;

				case NumberFilterOperation.GTE:
					comparatorFn = (a, b) => a >= b;
					break;

				default:
					throw new InvalidArgumentError;
			}

			filterFn = vertex => {
				const attribute = vertex.attributes.find(attribute => attribute[0] === filterAttributeName);
				const attributeValue = parseFloat(attribute[1]);
				return attribute != null && comparatorFn(attributeValue, filterValue);
			};
		}

		return filterFn;
	}
}
