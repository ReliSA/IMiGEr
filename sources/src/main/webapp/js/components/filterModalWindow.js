class FilterModalWindow extends ModalWindow {
	/**
	 * @constructor
	 */
	constructor() {
		super();

		this._filterOptions = {
			nodeType: 'Node type',
			vertexArchetype: 'Vertex archetype',
			vertexAttribute: 'Vertex attribute',
		};

		this._vertexAttributeTypeOptions = function() {
			return app.attributeTypeList.map(attributeType => `${attributeType.name} (${attributeType.dataType.toLowerCase()})`);
		};

		this._operationOptions = {
			STRING: {
				eq: 'equals',
				neq: 'not equals',
				contains: 'contains',
				startsWith: 'starts with',
				endsWith: 'ends with',
				regexp: 'regular expression',
			},
			ENUM: {
				eq: 'equals',
				neq: 'not equals',
			},
			DATE: {
				eq: 'equals',
				neq: 'not equals',
				range: 'is in range',
			},
			NUMBER: {
				eq: 'equals',
				neq: 'not equals',
				lt: 'lower than',
				lte: 'lower than or equals',
				gt: 'greater than',
				gte: 'greater than or equals',
				range: 'is in range',
			},
		};

		this._nodeTypeEnumValues = function() {
			return ['Vertex', 'Group'];
		};
		this._vertexArchetypeEnumValues = function() {
			return app.archetype.vertex.map(archetype => archetype.name);
		};
		this._vertexAttributeEnumValues = function(index) {
			const values = app.possibleEnumValues[index];
			return Utils.isDefined(values) ? values : [];
		};
	}

	/**
	 * @inheritdoc
	 */
	render() {
		super.render();

		this._initializeFormFields();

		this._rootElement.classList.add('filter-modal');

		// value field(s) cell
		this._valueCell = DOM.h('td');

		// form
		this._form = DOM.h('form', {
			onSubmit: this._onFilterFormSubmit.bind(this),
			onReset: this._onFilterFormReset.bind(this),
		}, [
			DOM.h('input', {
				type: 'hidden',
				name: 'dataType',
			}),
			DOM.h('table', {}, [
				DOM.h('tr', {}, [
					DOM.h('td', {}, [
						DOM.h('label', {
							for: 'filter',
							innerText: 'Filter:',
						}),
					]),
					DOM.h('td', {}, [
						DOM.h('select', {
							name: 'filter',
							id: 'filter',
							onChange: e => this._onFilterChange(e.target.value),
						}),
						DOM.h('select', {
							name: 'additionalFilter',
							onChange: e => this._onAdditionalFilterChange(e.target.value),
						}),
					]),
				]),
				DOM.h('tr', {}, [
					DOM.h('td', {}, [
						DOM.h('label', {
							for: 'operation',
							innerText: 'Operation:',
						}),
					]),
					DOM.h('td', {}, [
						DOM.h('select', {
							name: 'operation',
							id: 'operation',
							onChange: e => this._onOperationChange(e.target.value),
						}),
					]),
				]),
				DOM.h('tr', {}, [
					DOM.h('td', {}, [
						DOM.h('label', {
							innerText: 'Value:',
						}),
					]),
					this._valueCell,
				]),
				DOM.h('tr', {}, [
					DOM.h('td'),
					DOM.h('td', {}, [
						DOM.h('button', {
							type: 'submit',
							class: 'button',
							innerText: 'Apply filter',
						}),
						DOM.h('button', {
							type: 'reset',
							class: 'button',
							innerText: 'Reset',
						}),
					]),
				]),
			]),
		]);
		this._bodyElement.appendChild(this._form);

		// set values
		for (let key in this._filterOptions) {
			let value = this._filterOptions[key];

			this._form.filter.appendChild(DOM.h('option', {
				value: key,
				innerText: value,
			}));
		}

		this._onFilterChange('nodeType');

		/*
			// filter mode
			DOM.h('select', {
				name: 'filterMode',
			}, [
				DOM.h('option', {
					value: 'and',
					innerText: 'and',
				}),
				DOM.h('option', {
					value: 'or',
					innerText: 'or',
				}),
				DOM.h('option', {
					value: 'xor',
					innerText: 'xor',
				}),
			]),

		this._filterList = DOM.h('ul');
		this._bodyElement.appendChild(this._filterList);
		*/

		return this._rootElement;
	}

	_initializeFormFields() {
		// string
		this._stringField = DOM.h('input', {
			type: 'text',
			name: 'value',
			required: 'required',
		});

		// enum
		this._enumField = DOM.h('select', {
			name: 'value',
			multiple: 'multiple',
			required: 'required',
		});

		// date
		this._dateField = DOM.h('input', {
			type: 'date',
			name: 'value',
			required: 'required',
		});
		
		this._dateRangeField = DOM.h('div', {}, [
			DOM.h('input', {
				type: 'date',
				name: 'value-from',
			}),
			DOM.t(' - '),
			DOM.h('input', {
				type: 'date',
				name: 'value-to',
			}),
		]);

		// number
		this._numberField = DOM.h('input', {
			type: 'number',
			name: 'value',
			required: 'required',
		});

		this._numberRangeField = DOM.h('div', {}, [
			DOM.h('input', {
				type: 'number',
				name: 'value-from',
			}),
			DOM.t(' - '),
			DOM.h('input', {
				type: 'number',
				name: 'value-to',
			}),
		]);
	}

	/**
	 * 
	 * @param {string} value 
	 */
	_onFilterChange(value) {
		switch (value) {
			case 'nodeType':
				this._form.additionalFilter.setAttribute('hidden', 'hidden');

				this._form.dataType.value = 'ENUM';

				this._setOperationOptions();
				this._onOperationChange('equals');

				this._setEnumOptions(this._nodeTypeEnumValues());

				break;

			case 'vertexArchetype':
				this._form.additionalFilter.setAttribute('hidden', 'hidden');

				this._form.dataType.value = 'ENUM';

				this._setOperationOptions();
				this._onOperationChange('equals');

				this._setEnumOptions(this._vertexArchetypeEnumValues());

				break;

			case 'vertexAttribute':
				this._form.additionalFilter.removeAttribute('hidden');

				this._setAdditionalFilterOptions(this._vertexAttributeTypeOptions());
				this._onAdditionalFilterChange(0);

				break;
		}
	}

	_setAdditionalFilterOptions(options) {
		this._form.additionalFilter.innerHTML = '';
		options.forEach((value, key) => {
			this._form.additionalFilter.appendChild(DOM.h('option', {
				value: key,
				innerText: value,
			}));
		});
	}

	/**
	 * 
	 * @param {int} value 
	 */
	_onAdditionalFilterChange(value) {
		let attributeType = app.attributeTypeList[value];

		this._form.dataType.value = attributeType.dataType;
		this._setOperationOptions();
		this._onOperationChange('equals');

		if (attributeType.dataType === 'ENUM') {
			this._setEnumOptions(this._vertexAttributeEnumValues(value));
		}
	}

	_setOperationOptions() {
		let dataType = this._form.dataType.value;

		this._form.operation.innerHTML = '';
		for (let key in this._operationOptions[dataType]) {
			let value = this._operationOptions[dataType][key];

			this._form.operation.appendChild(DOM.h('option', {
				value: key,
				innerText: value,
			}));
		}
	}

	/**
	 * 
	 * @param {string} value 
	 */
	_onOperationChange(value) {
		let dataType = this._form.dataType.value;

		this._valueCell.innerHTML = '';
		switch (dataType) {
			case 'STRING':
				this._valueCell.appendChild(this._stringField);
				break;
			case 'ENUM':
				this._valueCell.appendChild(this._enumField);
				break;
			case 'DATE':
				if (value === 'range') {
					this._valueCell.appendChild(this._dateRangeField);
				} else {
					this._valueCell.appendChild(this._dateField);
				}
				break;
			case 'NUMBER':
				if (value === 'range') {
					this._valueCell.appendChild(this._numberRangeField);
				} else {
					this._valueCell.appendChild(this._numberField);
				}
				break;
		}
	}

	_setEnumOptions(options) {
		this._enumField.innerHTML = '';
		options.forEach((value, key) => {
			this._enumField.appendChild(DOM.h('option', {
				value: key,
				innerText: value,
			}));
		});
	}

	/**
	 * 
	 * @param {*} e 
	 */
	_onFilterFormSubmit(e) {
		e.preventDefault();

		const formData = new FormData(e.target);

		//this._displayFilter(formData);
		this._applyFilter(formData);
	}

	_onFilterFormReset() {
		this._onFilterChange('nodeType');

		app.nodeList.forEach(node => {
			node.isFound = false;
		});
	}

	_displayFilter(formData) {
		// filter
		console.log(this._filterOptions[formData.get('filter')]);

		// additional filter
		switch (formData.get('filter')) {
			case 'vertexAttribute':
				console.log(app.attributeTypeList[formData.get('additionalFilter')].name);
				break;
		}

		// operation
		console.log(this._operationOptions[formData.get('dataType')][formData.get('operation')]);

		// value(s)
		switch (formData.get('dataType')) {
			case 'STRING':
				console.log(formData.get('value'));
				break;
			case 'ENUM':
				switch (formData.get('filter')) {
					case 'nodeType':
						console.log(formData.getAll('value'));
						break;
					case 'vertexArchetype':
						console.log(formData.getAll('value'));
						break;
					case 'vertexAttribute':
						console.log(formData.getAll('value').map(value => app.possibleEnumValues[formData.get('additionalFilter')][parseInt(value)]).join(', '));
						break;
				}
				break;
			case 'DATE':
				if (formData.get('operation') === 'range') {
					console.log(formData.get('value-from'), formData.get('value-to'));
				} else {
					console.log(formData.get('value'));
				}
				break;
			case 'NUMBER':
				if (formData.get('operation') === 'range') {
					console.log(formData.get('value-from'), formData.get('value-to'));
				} else {
					console.log(formData.get('value'));
				}
				break;
		}
	}

	_applyFilter(formData) {
		let nodeListCopy = app.nodeList.slice(0);

		const filter = formData.get('filter');
		const additionalFilter = formData.get('additionalFilter');
		const dataType = formData.get('dataType');
		const operation = formData.get('operation');

		let filterFunction;

		switch (filter) {
			case 'nodeType':
				var values = formData.getAll('value').map(value => parseInt(value));

				// datatype is always enum
				switch (operation) {
					case 'eq':
						filterFunction = node => {
							return (node instanceof Vertex && values.indexOf(0) > -1)
								|| (node instanceof Group && values.indexOf(1) > -1);
						};
						break;

					case 'neq':
						filterFunction = node => {
							return (node instanceof Vertex && values.indexOf(0) < 0)
								|| (node instanceof Group && values.indexOf(1) < 0);
						};
						break;
				}
				break;

			case 'vertexArchetype':
				// prefilter
				nodeListCopy = nodeListCopy.filter(node => {
					return node instanceof Vertex;
				});

				var values = formData.getAll('value').map(value => parseInt(value));

				// datatype is always enum
				switch (operation) {
					case 'eq':
						filterFunction = vertex => {
							return (values.indexOf(vertex.archetype) > -1);
						};
						break;

					case 'neq':
						filterFunction = vertex => {
							return (values.indexOf(vertex.archetype) < 0);
						};
						break;
				}
				break;

			case 'vertexAttribute':
				const filterAttributeName = app.attributeTypeList[additionalFilter].name;

				// prefilter
				nodeListCopy = nodeListCopy.filter(node => {
					return node instanceof Vertex;
				}).filter(vertex => {
					return vertex.attributes.some(attribute => attribute[0] === filterAttributeName);
				});

				switch (dataType) {
					case 'STRING':
						var comparatorFn;
						switch (operation) {
							case 'eq':
								comparatorFn = (a, b) => a === b;
								break;
							case 'neq':
								comparatorFn = (a, b) => a !== b;
								break;
							case 'contains':
								comparatorFn = (a, b) => a.includes(b);
								break;
							case 'startsWith':
								comparatorFn = (a, b) => a.startsWith(b);
								break;
							case 'endsWith':
								comparatorFn = (a, b) => a.endsWith(b);
								break;
							case 'regexp':
								comparatorFn = (a, b) => a.match(new RegExp(b, 'i'));
								break;
						}

						filterFunction = vertex => {
							const attribute = vertex.attributes.find(attribute => attribute[0] === filterAttributeName);
							return attribute != null && comparatorFn(attribute[1], formData.get('value'));
						};
						break;

					case 'ENUM':
						var values = formData.getAll('value').map(value => app.possibleEnumValues[additionalFilter][parseInt(value)]);

						switch (operation) {
							case 'eq':
								filterFunction = vertex => {
									const attribute = vertex.attributes.find(attribute => attribute[0] === filterAttributeName);
									const attributeValues = attribute[1].split(', ');

									return attributeValues.some(attributeValue => {
										return values.indexOf(attributeValue) > -1;
									});
								};
								break;

							case 'neq':
								filterFunction = vertex => {
									const attribute = vertex.attributes.find(attribute => attribute[0] === filterAttributeName);
									const attributeValues = attribute[1].split(', ');

									return attributeValues.some(attributeValue => {
										return values.indexOf(attributeValue) < 0;
									});
								};
								break;
						}
						break;

					case 'DATE':
						if (operation === 'range') {
							filterFunction = vertex => {
								const attribute = vertex.attributes.find(attribute => attribute[0] === filterAttributeName);
								const a = parseInt(attribute[1]);
								const b = formData.get('value-from') !== '' ? Date.parse(formData.get('value-from')) : Date.now();
								const c = formData.get('value-to') !== '' ? Date.parse(formData.get('value-to')) : Date.now();
								return (a >= b) && (a <= c);
							};

						} else {
							var comparatorFn;
							switch (operation) {
								case 'eq':
									comparatorFn = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
									break;
								case 'neq':
									comparatorFn = (a, b) => a.getFullYear() !== b.getFullYear() || a.getMonth() !== b.getMonth() || a.getDate() !== b.getDate();
									break;
							}

							filterFunction = vertex => {
								const attribute = vertex.attributes.find(attribute => attribute[0] === filterAttributeName);
								return comparatorFn(new Date(attribute[1]), new Date(formData.get('value')));
							};
						}
						break;

					case 'NUMBER':
						if (operation === 'range') {
							filterFunction = vertex => {
								const attribute = vertex.attributes.find(attribute => attribute[0] === filterAttributeName);
								const a = parseFloat(attribute[1]);
								const b = formData.get('value-from') !== '' ? parseFloat(formData.get('value-from')) : Number.MIN_VALUE;
								const c = formData.get('value-to') !== '' ? parseFloat(formData.get('value-to')) : Number.MAX_VALUE;
								return (a >= b) && (a <= c);
							};

						} else {
							var comparatorFn;
							switch (operation) {
								case 'eq':
									comparatorFn = (a, b) => a === b;
									break;
								case 'neq':
									comparatorFn = (a, b) => a !== b;
									break;
								case 'lt':
									comparatorFn = (a, b) => a < b;
									break;
								case 'lte':
									comparatorFn = (a, b) => a <= b;
									break;
								case 'gt':
									comparatorFn = (a, b) => a > b;
									break;
								case 'gte':
									comparatorFn = (a, b) => a >= b;
									break;
							}

							filterFunction = vertex => {
								const attribute = vertex.attributes.find(attribute => attribute[0] === filterAttributeName);
								return attribute != null && comparatorFn(parseFloat(attribute[1]), parseFloat(formData.get('value')));
							};
						}
						break;
				}
				break;
		}

		nodeListCopy.filter(filterFunction).forEach(node => {
			node.isFound = true;
		});
	}
}