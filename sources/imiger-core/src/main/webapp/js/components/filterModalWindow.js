class FilterModalWindow extends ModalWindow {
	/**
	 * @constructor
	 */
	constructor() {
		super();

		this._baseFilterOptions = {
			nodeType: 'Node type',
			vertexArchetype: 'Vertex archetype',
			vertexAttribute: 'Vertex attribute',
		};
		this._operationOptions = {
			STRING: {
				EQ: 'equals',
				NEQ: 'not equals',
				CONTAINS: 'contains',
				STARTS_WITH: 'starts with',
				ENDS_WITH: 'ends with',
				REGEXP: 'regular expression',
			},
			ENUM: {
				EQ: 'equals',
				NEQ: 'not equals',
			},
			DATE: {
				EQ: 'equals',
				NEQ: 'not equals',
				RANGE: 'is in range',
			},
			NUMBER: {
				EQ: 'equals',
				NEQ: 'not equals',
				LT: 'lower than',
				LTE: 'lower than or equals',
				GT: 'greater than',
				GTE: 'greater than or equals',
				RANGE: 'is in range',
			},
		};

		this._vertexAttributeTypeOptions = function() {
			return app.attributeTypeList.map(attributeType => `${attributeType.name} (${attributeType.dataType.toLowerCase()})`);
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
							for: 'baseFilter',
							innerText: 'Filter:',
						}),
					]),
					DOM.h('td', {}, [
						DOM.h('select', {
							name: 'baseFilter',
							id: 'baseFilter',
							onChange: e => this._onBaseFilterChange(e.target.value),
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
			DOM.h('script', {}, [
				DOM.t("$(\"#slider\").dateRangeSlider();")
			]),
		]);
		this._bodyElement.appendChild(this._form);

		// set values
		for (let key in this._baseFilterOptions) {
			let value = this._baseFilterOptions[key];

			this._form.baseFilter.appendChild(DOM.h('option', {
				value: key,
				innerText: value,
			}));
		}

		this._onBaseFilterChange('nodeType');

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

		this._dateRangeField = DOM.h('div', {
			id: "slider"
		}, []);

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
	_onBaseFilterChange(value) {
		switch (value) {
			case 'nodeType':
				this._form.additionalFilter.setAttribute('hidden', 'hidden');

				this._form.dataType.value = FilterDataType.ENUM;

				this._setOperationOptions();
				this._onOperationChange(EnumFilterOperation.EQ);

				this._setEnumOptions(this._nodeTypeEnumValues());

				break;

			case 'vertexArchetype':
				this._form.additionalFilter.setAttribute('hidden', 'hidden');

				this._form.dataType.value = FilterDataType.ENUM;

				this._setOperationOptions();
				this._onOperationChange(EnumFilterOperation.EQ);

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
		this._onOperationChange('EQ');

		if (attributeType.dataType === FilterDataType.ENUM) {
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
			case FilterDataType.STRING:
				this._valueCell.appendChild(this._stringField);
				break;

			case FilterDataType.ENUM:
				this._valueCell.appendChild(this._enumField);
				break;

			case FilterDataType.DATE:
				if (value === DateFilterOperation.RANGE) {
					this._valueCell.appendChild(this._dateRangeField);
				} else {
					this._valueCell.appendChild(this._dateField);
				}
				break;

			case FilterDataType.NUMBER:
				if (value === NumberFilterOperation.RANGE) {
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

	_onFilterFormSubmit(e) {
		e.preventDefault();

		const formData = new FormData(e.target);

		//this._displayFilter(formData);
		this._applyFilter(formData);
	}

	_onFilterFormReset() {
		this._onBaseFilterChange('nodeType');

		app.nodeList.forEach(node => {
			node.isFound = false;
		});
	}

	_displayFilter(formData) {
		// filter
		console.log(this._baseFilterOptions[formData.get('filter')]);

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
			case FilterDataType.STRING:
				console.log(formData.get('value'));
				break;

			case FilterDataType.ENUM:
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

			case FilterDataType.DATE:
				if (formData.get('operation') === DateFilterOperation.range) {
					console.log(formData.get('value-from'), formData.get('value-to'));
				} else {
					console.log(formData.get('value'));
				}
				break;

			case FilterDataType.NUMBER:
				if (formData.get('operation') === NumberFilterOperation.range) {
					console.log(formData.get('value-from'), formData.get('value-to'));
				} else {
					console.log(formData.get('value'));
				}
				break;
		}
	}

	_applyFilter(formData) {
		const baseFilter = formData.get('baseFilter');
		const additionalFilter = formData.get('additionalFilter');
		const dataType = formData.get('dataType');
		const operation = formData.get('operation');

		let nodeFilter;
		switch (baseFilter) {
			case 'nodeType':
				nodeFilter = new NodeTypeFilter(operation, formData);
				break;

			case 'vertexArchetype':
				nodeFilter = new VertexArchetypeFilter(operation, formData);
				break;

			case 'vertexAttribute':
				nodeFilter = new VertexAttributeFilter(additionalFilter, dataType, operation, formData);
				break;
		}

		nodeFilter.run(app.nodeList).forEach(node => {
			node.isFound = true;
		});
	}
}
