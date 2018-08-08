/**
 * Class representing a change. In a single change, lists of components to be changed and proposals are stored. 
 * Changes can be postponed and back activated.
 * @constructor
 */
function Change() {
	var rootElement;
	var buttonGroup;
	var includeNotFoundCheckbox;
	var replaceComponentsCheckbox;
	var triggerChangeButton;
	var oldVertexListComponent;
	var newVertexListComponent;

	var oldVertexList = [];
	var newVertexList = [];

	var postponed = false;
	var triggered = false;
	var detailsLoaded = false;

	/* TODO: display change in modal window
	app.changeModalWindow.setChange(this);
	app.changeModalWindow.open();
	*/

	/**
	 * Adds a new vertex to the list of components to be changed. The vertex is set as excluded and its DOM element 
	 * is removed from document. Its edges are moved so that they end at the group.
	 * @param {Vertex} vertex Vertex to be added to the change.
	 */
	this.addVertex = function(vertex) {
		if (!(vertex instanceof Vertex)) {
			throw new TypeError(vertex.toString() + 'is not instance of Vertex');
		}

		// set remove hook
		vertex.removeFromSidebarList = this.removeVertex.bind(this, vertex);

		oldVertexList.push(vertex);
		oldVertexListComponent.appendChild(vertex);

		app.redrawEdges();

		// vertex list changed so different results could be retrieved when triggered again
		this.setTriggered(false);
		this.setDetailsLoaded(false);

		toggleButtonGroup.call(this);
	};

	/**
	 * Removes a vertex from the list of component to be changed. The vertex is returned back to the viewport and 
	 * its edges are moved to it.
	 * @param {Vertex} vertex Vertex to be removed from the change.
	 */
	this.removeVertex = function(vertex) {
		if (!(vertex instanceof Vertex)) {
			throw new TypeError(vertex.toString() + 'is not instance of Vertex');
		}

		// unset remove hook
		vertex.removeFromSidebarList = app.utils.noop;

		oldVertexList.splice(oldVertexList.indexOf(vertex), 1);
		oldVertexListComponent.removeChild(vertex);

		app.redrawEdges();

		// vertex list changed so different results could be retrieved when triggered again
		this.setTriggered(false);
		this.setDetailsLoaded(false);

		toggleButtonGroup.call(this);
	};

	/**
	 * @returns {array<Vertex>} List of components to be changed.
	 */
	this.getOldVertexList = function() {
		return oldVertexList;
	};

	/**
	 * @returns {boolean} True if the change was already triggered, otherwise false.
	 */
	this.isTriggered = function() {
		return triggered;
	};

	/**
	 * Sets the change as triggered.
	 * @param {boolean} newValue True to set the change as trigger, otherwise false.
	 */
	this.setTriggered = function(newValue) {
		triggered = newValue;

		if (newValue) {
			rootElement.classList.add('change--triggered');
		} else {
			rootElement.classList.remove('change--triggered');
		}
	};

	/**
	 * @returns {boolean} True if the details of proposed component were loaded, otherwise false.
	 */
	this.isDetailsLoaded = function() {
		return detailsLoaded;
	};

	/**
	 * Sets the change details as loaded.
	 * @param {boolean} newValue True to set the change as it has details loaded, otherwise false.
	 */
	this.setDetailsLoaded = function(newValue) {
		detailsLoaded = newValue;

		if (newValue) {
			rootElement.classList.add('change--details-loaded');
		} else {
			rootElement.classList.remove('change--details-loaded');
		}
	};

	/**
	 * @returns {boolean} True if the change is currently postponed, otherwise false.
	 */
	this.isPostponed = function() {
		return postponed;
	};

	/**
	 * Sets the change postponed.
	 * @param {boolean} newValue True to set the change as postponed, otherwise false.
	 */
	this.setPostponed = function(newValue) {
		postponed = newValue;

		if (newValue) {
			rootElement.classList.add('change--postponed');
		} else {
			rootElement.classList.remove('change--postponed');
		}
	};

	/**
	 * Postpones the change. Removes its current DOM element from document.
	 */
	this.postpone = function() {
		this.setPostponed(true);
		this.remove();
	};

	/**
	 * Activates the change. Removes its current DOM element from document.
	 */
	this.activate = function() {
		this.setPostponed(false);
		this.remove();
	};

	/**
	 * Creates a new DOM element representing the change in memory. The element being created depends on whether the change
	 * is postponed at the moment. Binds user interactions to local handler functions.
	 * @returns {Element} HTML or SVG DOM element depending on whether the change is postponed.
	 */
	this.render = function() {
		rootElement = postponed ? renderPostponed.call(this) : renderActive.call(this);

		this.setPostponed(postponed);
		this.setDetailsLoaded(detailsLoaded);
		this.setTriggered(triggered);
		toggleButtonGroup.call(this);

		return rootElement;
	};

	/**
	 * Removes the DOM element representing the change from document.
	 */
	this.remove = function() {
		rootElement.remove();
	};

	function renderActive() {
		rootElement = app.utils.createHtmlElement('div', {
			'class': 'change',
		});

		// buttons
		buttonGroup = app.utils.createHtmlElement('div', {
			'class': 'button-group hidden',
		});
		rootElement.appendChild(buttonGroup);

		// include not found classes checkbox
		includeNotFoundCheckbox = app.utils.createHtmlElement('input', {
			'type': 'checkbox',
			'name': 'includeNotFoundClasses',
			'class': 'include-not-found-checkbox',
			'title': 'Include not found classes in the change',
			'data-tooltip': 'left',
		});
		buttonGroup.appendChild(includeNotFoundCheckbox);

		// trigger change button
		triggerChangeButton = app.utils.createHtmlElement('button', {
			'class': 'trigger-change-button button',
			'title': 'Change components',
		});
		triggerChangeButton.appendChild(app.utils.createHtmlElement('img', {
			'src': 'images/tochange/crce-call-trans.gif',
			'alt': 'Icon of "change components" action',
		}));
		triggerChangeButton.addEventListener('click', triggerChange.bind(this));
		buttonGroup.appendChild(triggerChangeButton);

		// postpone button
		var postponeButton = app.utils.createHtmlElement('button', {
			'class': 'postpone-button button',
			'title': 'Postpone change',
		});
		postponeButton.appendChild(app.utils.createHtmlElement('img', {
			'src': 'images/tochange/postpone-trans.gif',
			'alt': 'Icon of "postpone current change" action',
		}));
		postponeButton.addEventListener('click', moveToPostponed.bind(this));
		buttonGroup.appendChild(postponeButton);


		// old vertex list
		oldVertexListComponent = new ChangeVertexList(this);
		rootElement.appendChild(oldVertexListComponent.render());

		oldVertexList.forEach(function(vertex) {
			oldVertexListComponent.appendChild(vertex);
		}, this);


		// controls
		var changeControls = app.utils.createHtmlElement('div', {
			'class': 'change-controls',
		});
		rootElement.appendChild(changeControls);

		// transition arrow
		var arrow = app.utils.createHtmlElement('span', {
			'class': 'transition-arrow',
		});
		arrow.appendChild(app.utils.createTextElement('🡻'));
		changeControls.appendChild(arrow);

		// control buttons
		var controlButtonGroup = app.utils.createHtmlElement('div', {
			'class': 'button-group',
		});
		changeControls.appendChild(controlButtonGroup);

		// load change details button
		var loadDetailsButton = app.utils.createHtmlElement('button', {
			'class': 'load-details-button button',
			'title': 'Load change details',
		});
		loadDetailsButton.appendChild(app.utils.createTextElement('…'));
		loadDetailsButton.addEventListener('click', loadChangeDetails.bind(this));
		controlButtonGroup.appendChild(loadDetailsButton);

		// replace old components by new ones checkbox
		replaceComponentsCheckbox = app.utils.createHtmlElement('input', {
			'type': 'checkbox',
			'name': 'replaceComponents',
			'class': 'replace-components-checkbox',
			'title': 'Replace old components by new ones',
			'checked': 'checked',
			'data-tooltip': 'left',
		});
		controlButtonGroup.appendChild(replaceComponentsCheckbox);

		// accept change button
		var acceptButton = app.utils.createHtmlElement('button', {
			'class': 'accept-button button',
			'title': 'Accept proposed change',
		});
		acceptButton.appendChild(app.utils.createHtmlElement('img', {
			'src': 'images/tochange/accept-trans.gif',
			'alt': 'Icon of "accept proposed change" action',
		}));
		acceptButton.addEventListener('click', acceptChange.bind(this));
		controlButtonGroup.appendChild(acceptButton);

		// revoke change button
		var revokeButton = app.utils.createHtmlElement('button', {
			'class': 'revoke-button button',
			'title': 'Revoke proposed change',
		});
		revokeButton.appendChild(app.utils.createHtmlElement('img', {
			'src': 'images/button_cancel.png',
			'alt': 'Icon of "revoke proposed change" action',
		}));
		revokeButton.addEventListener('click', revokeChange.bind(this));
		controlButtonGroup.appendChild(revokeButton);


		// new vertex list
		newVertexListComponent = new ChangeVertexList(this);
		rootElement.appendChild(newVertexListComponent.render());

		newVertexList.forEach(function(vertex) {
			newVertexListComponent.appendChild(vertex);
		}, this);

		return rootElement;
	}

	function renderPostponed() {
		rootElement = app.utils.createHtmlElement('li', {
			'class': 'change',
		});


		// buttons
		var buttonGroup = app.utils.createHtmlElement('div', {
			'class': 'button-group',
		});
		rootElement.appendChild(buttonGroup);

		// activate change button
		var activateButton = app.utils.createHtmlElement('button', {
			'class': 'activate-button button',
			'title': 'Set change active',
		});
		activateButton.appendChild(app.utils.createHtmlElement('img', {
			'src': 'images/tochange/tochange-trans.gif',
			'alt': 'Icon of "set change active" action',
		}));
		activateButton.addEventListener('click', moveToActive.bind(this));
		buttonGroup.appendChild(activateButton);


		// original vertex list
		oldVertexListComponent = new ChangeVertexList(this);
		rootElement.appendChild(oldVertexListComponent.render());

		oldVertexList.forEach(function(vertex) {
			oldVertexListComponent.appendChild(vertex);
		}, this);


		// new vertex list
		newVertexListComponent = new ChangeVertexList(this);
		rootElement.appendChild(newVertexListComponent.render());

		newVertexList.forEach(function(vertex) {
			newVertexListComponent.appendChild(vertex);
		}, this);


		return rootElement;
	}

	function triggerChange() {
		var self = this;
		var includeNotFound = includeNotFoundCheckbox.checked;

		app.loader.enable();

		app.componentChanger.run(oldVertexList, includeNotFound).then(function(data) {
			self.setTriggered(true);

			data.forEach(function(component) {
				var vertex = new VertexLight(component);

				newVertexList.push(vertex);
				newVertexListComponent.appendChild(vertex);
			});

		}, function(reason) {
			if (typeof reason === 'string') {
				alert(reason);
			} else {
				alert('Error occurred while querying CRCE. See JS console for more details.');
				console.error(reason);
			}

		}).always(function() {
			app.loader.disable();
		});
	}

	function loadChangeDetails() {
		var self = this;
		var graphVersion = parseInt(app.cookies.get('graphVersion'));
		var uuidToNameMap = {};

		app.loader.enable();

		downloadComponents(graphVersion + 1, newVertexList).then(function(responses) {
			// get map with component's UUID as key and its filename as value
			uuidToNameMap = responses.map(function(response) {
				return response[0];
			}).reduce(function(map, component) {
				map[component.uuid] = component.name;
				return map;
			}, {});

			return copyComponents(app.vertexList);

		}).then(function() {
			return loadGraphData(graphVersion + 1);

		}).then(function(data) {
			// vertices
			data.vertices.forEach(function(component) {
				var vertex = app.findVertexByName(component.name);

				if (app.utils.isDefined(vertex)) {
					// vertex already exists in graph
					return;

				} else {
					// create a new vertex
					var vertex = new Vertex(component);
					vertex.setPosition(new Coordinates(0, 0));

					app.nodeList.push(vertex);
					app.vertexList.push(vertex);

					app.viewportComponent.addVertex(vertex);
				}

				// replace light vertex placeholder by vertex component
				var placeholdingVertex = newVertexList.find(function(newVertex) {
					return uuidToNameMap[newVertex.id] == this.name;
				}, vertex);

				if (app.utils.isDefined(placeholdingVertex)) {
					newVertexList.splice(newVertexList.indexOf(placeholdingVertex), 1);
					newVertexListComponent.removeChild(placeholdingVertex);
				}

				newVertexList.push(vertex);
			});

			var newVertexNameList = newVertexList.map(function(vertex) {
				return vertex.name;
			});

			// edges
			data.edges.forEach(function(component) {
				// vertex names are prefixed by "vertex_" string, cut it off
				var fromNodeName = component.from.substring(7);
				var toNodeName = component.to.substring(7);

				// neither end of the edge is a newly added vertex
				if (newVertexNameList.indexOf(fromNodeName) < 0 && newVertexNameList.indexOf(toNodeName) < 0) return;

				var edge = new Edge(component);

				var fromNode = app.findVertexByName(fromNodeName);
				if (fromNode) {
					fromNode.addOutEdge(edge);
				}

				var toNode = app.findVertexByName(toNodeName);
				if (toNode) {
					toNode.addInEdge(edge);
				}

				app.edgeList.push(edge);

				app.viewportComponent.addEdge(edge);
			});


			newVertexList.forEach(function(vertex) {
				vertex.exclude();

				newVertexListComponent.appendChild(vertex);
			});

			app.redrawEdges();

			self.setDetailsLoaded(true);

		}).always(function() {
			app.loader.disable();
		});
	}

	function downloadComponents(graphVersion, vertexList) {
		var downloadPromises = [];
		vertexList.forEach(function(vertex) {
			var downloadPromise = $.ajax({
				type: 'POST',
				url: 'api/download-component?graphVersion=' + graphVersion + '&uuid=' + encodeURIComponent(vertex.id),
				contentType: 'application/json',
				timeout: 180 * 1000,	// in milliseconds
			});

			downloadPromises.push(downloadPromise);
		});

		return app.utils.promiseAll(downloadPromises);
	}

	function deleteComponents(graphVersion, vertexList) {
		var deletePromises = [];
		vertexList.forEach(function(vertex) {
			var deletePromise = $.ajax({
				type: 'GET',
				url: 'delete-component?graphVersion=' + graphVersion + '&name=' + encodeURIComponent(vertex.name),
				timeout: 180 * 1000,	// in milliseconds
			});

			deletePromises.push(deletePromise);
		});

		return app.utils.promiseAll(deletePromises);
	}

	function copyComponents(vertexList) {
		var involvedComponents = vertexList.filter(function(vertex) {
			return vertex.name !== app.constants.notFoundVertexName;
		}).map(function(vertex) {
			return {
				'id': vertex.id,
				'name': vertex.name,
			};
		});

		return $.ajax({
			type: 'POST',
			url: 'api/copy-components',
			data: JSON.stringify({
				'components': involvedComponents,
			}),
			contentType: 'application/json',
			timeout: 180 * 1000,	// in milliseconds
		});
	}

	function loadGraphData(graphVersion) {
		return $.getJSON(app.API.loadGraph + '?graphVersion=' + graphVersion);
	}

	function acceptChange() {
		var self = this;
		var graphVersion = parseInt(app.cookies.get('graphVersion'));
		var replaceComponents = replaceComponentsCheckbox.checked;

		app.loader.enable();

		var promise;
		if (this.isDetailsLoaded()) {
			var deleteComponentsPromise;
			if (replaceComponents) {
				deleteComponentsPromise = deleteComponents(graphVersion + 1, oldVertexList);
			} else {
				deleteComponentsPromise = $.when();
			}

			promise = deleteComponentsPromise.then(function() {
				return loadGraphData(graphVersion + 1);
			});

		} else {
			// download and copy components on the server side and then load the graph
			promise = downloadComponents(graphVersion + 1, newVertexList).then(function(responses) {
				var involvedVertexList = app.vertexList;

				if (replaceComponents) {
					involvedVertexList = involvedVertexList.filter(function(vertex) {
						return oldVertexList.some(function(oldVertex) {
							return oldVertex.name !== vertex.name;
						});
					});
				}

				return copyComponents(involvedVertexList);

			}).then(function() {
				return loadGraphData(graphVersion + 1);
			});
		}

		promise.then(function(data) {
			// increment graph version number
			app.cookies.set('graphVersion', graphVersion + 1);

			var graphExportData = app.graphExporter.run();

			app.reset();
			app.graphLoader.run(data, graphExportData);

		}).always(function() {
			app.loader.disable();
		});
	}

	function revokeChange() {
		var self = this;
		var graphVersion = parseInt(app.cookies.get('graphVersion'));

		app.loader.enable();

		var deleteComponentsPromise;
		if (this.isDetailsLoaded()) {
			// delete components on the server side
			deleteComponentsPromise = deleteComponents(graphVersion + 1, newVertexList);
		} else {
			deleteComponentsPromise = $.when();
		}

		deleteComponentsPromise.then(function() {
			newVertexList.forEach(function(vertex) {
				// change details were loaded
				if (self.isDetailsLoaded()) {
					// remove edges connected with the vertex
					vertex.getInEdgeList().forEach(function(edge) {
						edge.remove();
					});
					vertex.getOutEdgeList().forEach(function(edge) {
						edge.remove();
					});

					var existingVertex = app.findVertexByName(vertex.name);
					if (app.utils.isDefined(existingVertex)) {
						// remove vertex from app
						app.nodeList.splice(app.nodeList.indexOf(existingVertex), 1);
						app.vertexList.splice(app.vertexList.indexOf(existingVertex), 1);
					}
				}

				// remove vertex from this change
				newVertexListComponent.removeChild(vertex);
			});

			newVertexList = [];

			self.setTriggered(false);
			self.setDetailsLoaded(false);

		}).always(function() {
			app.loader.disable();
		});
	}

	function moveToPostponed() {
		if (oldVertexList.length === 0) return;
		
		newVertexList.forEach(function(vertex) {
			// remove vertex from app
			var existingVertex = app.findVertexByName(vertex.name);
			if (app.utils.isDefined(existingVertex)) {
				app.nodeList.splice(app.nodeList.indexOf(existingVertex), 1);
				app.vertexList.splice(app.vertexList.indexOf(existingVertex), 1);
			}
		});

		this.setPostponed(true);
		this.remove();

		app.sidebarComponent.setChangePostponed(this);
	}

	function moveToActive() {
		newVertexList.forEach(function(vertex) {
			// add vertex to app
			app.nodeList.push(vertex);
			app.vertexList.push(vertex);
		});

		this.setPostponed(false);
		this.remove();

		app.sidebarComponent.setChangeActive(this);
	}

	function toggleButtonGroup() {
		if (oldVertexList.length > 0) {
			buttonGroup.classList.remove('hidden');
		} else {
			buttonGroup.classList.add('hidden');
		}
	}

	function getInvolvedComponents() {
		var involvedComponents = [];

		oldVertexList.forEach(function(vertex) {
			vertex.getInEdgeList().forEach(function(edge) {
				involvedComponents.push(edge.getFrom());
			});

			vertex.getOutEdgeList().forEach(function(edge) {
				involvedComponents.push(edge.getTo());
			});
		});

		return involvedComponents;
	}
}
