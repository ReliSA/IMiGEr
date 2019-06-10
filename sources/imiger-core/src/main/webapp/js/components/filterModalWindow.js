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
			DOM.h('table', {
				style: "width:100%;"
			}, [
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
			type: FilterDataType.STRING,
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
			type: FilterDataType.DATE,
			name: 'value',
			required: 'required',
		});

		this._dateRangeLabel = DOM.h('div', {}, [
			DOM.h('span', {
				id: 'event-start'
			}, [
				DOM.t('dd. mm. yyyy')
			]),
			DOM.t(' - '),
			DOM.h('span', {
				id: 'event-end'
			}, [
				DOM.t('dd. mm. yyyy')
			]),
		]);

		this._dateRangeField = DOM.h('div', {
			id: "slider"
		}, [
			DOM.h('input', {
				type: 'hidden',
				name: 'value-from',
				id: 'value-from',
			}),
			//DOM.t(' - '),
			DOM.h('input', {
				type: 'hidden',
				name: 'value-to',
				id: 'value-to',
			}),
		]);

		this._showSlider = DOM.h('script', {
			id: "sliderScript",
		}, [
			DOM.t(
				"function timestamp(str) {" +
				"    return new Date(str).getTime();" +
				"}" +
				"var dateSlider = document.getElementById('slider');" +
				"window.noUiSlider.create(dateSlider, {" +
				"	 connect: true," +
				"    range: {" +
				"        min: timestamp(1970)," +
				"        max: timestamp(new Date())" +
				"    }," +
				"    step: 24 * 60 * 60 * 1000," +
				"    start: [timestamp(1970), timestamp(new Date())]," +
				"    format: wNumb({" +
				"        decimals: 0" +
				"    })" +
				"});" +
				"var dateValues = [" +
				"    document.getElementById('event-start')," +
				"    document.getElementById('event-end')" +
				"];" +
				"dateSlider.noUiSlider.on('update', function (values, handle) {" +
				"	var date = new Date(+values[handle]);" +
				"   dateValues[handle].innerHTML = date.toLocaleDateString('cs-CZ');" +
				"});" +
				"var filterValues = [" +
				"    document.getElementById('value-from')," +
				"    document.getElementById('value-to')" +
				"];" +
				"dateSlider.noUiSlider.on('update', function (values, handle) {" +
				"	var date = new Date(+values[handle]);" +
				"   filterValues[handle].value = date;" +
				"});")
		]);

		// number
		this._numberField = DOM.h('input', {
			type: FilterDataType.NUMBER,
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
					this._valueCell.appendChild(this._dateRangeLabel);
					this._valueCell.appendChild(this._dateRangeField);
					this._valueCell.appendChild(this._showSlider);
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

		this.resetFilter();
	}

	resetFilter() {
		var n = app.nodeList;
		var v = app.vertexList;
		var e = app.edgeList;
		app.deletedNodeList.forEach(node =>{
			n.push(node);
		});
		app.deletedVertexList.forEach(vertex => {
			v.push(vertex);
			app.viewportComponent.addNode(vertex);
		});
		app.deletedEdgeList.forEach(edge => {
			e.push(edge);
		});
		n.filter(node => node._rootElement.style.display === 'none').forEach(node => node._rootElement.style.display = '');
		e.filter(edge => edge._rootElement.style.display === 'none').forEach(edge => edge._rootElement.style.display = '');
		app.deletedEdgeList = [];
		app.deletedVertexList = [];
		app.deletedNodeList = [];
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
			if(node instanceof Group) {
				let outEdges = node.outEdgeList;
				let inEdges = node.inEdgeList;
				this._hideEdges(outEdges);
				this._hideEdges(inEdges);
				node._rootElement.style.display = 'none';
			} else {
				if(node._group === null) {
					node._rootElement.style.display = 'none';
					app.edgeList.forEach(edge => {
						if(edge.from.id === node.id || edge.to.id === node.id) {
							edge._rootElement.style.display = 'none';
						}
					});
				}
			}
			app.viewportComponent.removeNode(node);
		});

		var newNodeList = [];
		var newVertexList = [];
		var newEdgeList = [];

		app.nodeList.forEach(node => {
			if(node._rootElement.style.display !== 'none') {
				newNodeList.push(node);
			} else {
				app.deletedNodeList.push(node);
			}
		});
		app.vertexList.forEach(vertex => {
			if(vertex._rootElement.style.display !== 'none') {
				newVertexList.push(vertex);
			} else {
				app.deletedVertexList.push(vertex);
			}
		});
		app.edgeList.forEach(edge => {
			if(edge._rootElement.style.display !== 'none') {
				newEdgeList.push(edge);
			} else {
				app.deletedEdgeList.push(edge);
			}
		});

		app.nodeList = newNodeList;
		app.vertexList = newVertexList;
		app.edgeList = newEdgeList;
	}

	_hideEdges(edges) {
		edges.forEach(edge => {
			edge._rootElement.style.display = 'none';
		});
	}

	setDateBounds(minDate, maxDate) {
		if(minDate !== null && maxDate !== null) {
			this._showSlider = DOM.h('script', {
				id: "sliderScript",
			}, [
				DOM.t(
					"function timestamp(str) {" +
					"    return new Date(str).getTime();" +
					"}" +
					"var dateSlider = document.getElementById('slider');" +
					"window.noUiSlider.create(dateSlider, {" +
					"	 connect: true," +
					"    range: {" +
					"        min: " + minDate.getTime() + "," +
					"        max: " + maxDate.getTime() + "" +
					"    }," +
					"    step: 24 * 60 * 60 * 1000," +
					"    start: [" + minDate.getTime() + ", " + maxDate.getTime() + "]," +
					"    format: wNumb({" +
					"        decimals: 0" +
					"    })" +
					"});" +
					"var dateValues = [" +
					"    document.getElementById('event-start')," +
					"    document.getElementById('event-end')" +
					"];" +
					"dateSlider.noUiSlider.on('update', function (values, handle) {" +
					"	var date = new Date(+values[handle]);" +
					"   dateValues[handle].innerHTML = date.toLocaleDateString('cs-CZ');" +
					"});" +
					"var filterValues = [" +
					"    document.getElementById('value-from')," +
					"    document.getElementById('value-to')" +
					"];" +
					"dateSlider.noUiSlider.on('update', function (values, handle) {" +
					"	var date = new Date(+values[handle]);" +
					"   filterValues[handle].value = date;" +
					"});")
			]);
		}
	}
}
