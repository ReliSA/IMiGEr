class Navbar {

	render() {
		this._rootElement = DOM.h('nav', {
			class: 'navbar',
		});

		// list of buttons
		this._rootElement.appendChild(DOM.h('ul', {}, [
			this._createZoomListItem(),
			this._createSeparatorListItem(),

			this._createSearchListItem(),
			this._createSeparatorListItem(),

			this._createSwitchModeListItem(),
			this._createSeparatorListItem(),

			this._createExcludeNodeWithMostEdgesListItem(),
			this._createSeparatorListItem(),

			this._createExcludeNodeWithMostEdgesToGroupListItem(),
			this._createSeparatorListItem(),

			this._createBackToUploadListItem(),
			this._createSeparatorListItem(),

			this._createApplyLayoutListItem(),
			this._createSeparatorListItem(),

			this._createSaveDiagramAsPNGListItem(),
			this._createSeparatorListItem(true),

			this._createSaveDiagramListItem(),
			this._createSeparatorListItem(),

			this._createRefreshDiagramListItem(),
			this._createSeparatorListItem(),

			this._createResetDiagramListItem(),
		]));

		return this._rootElement;
	}

	get height() {
		return this._rootElement.offsetHeight;
	}

	_createSeparatorListItem(loggedInOnly = false) {
		return DOM.h('li', {
			class: loggedInOnly ? 'loggedInOnly' : '',
		}, [
			DOM.h('hr', {
				class: 'navbar-separator',
			}),
		]);
	}

	_createZoomListItem() {
		return DOM.h('li', {}, [
			DOM.h('button', {
				class: 'btn zoom',
				id: 'zoomOut',
				title: 'zoom -',
				onClick: () => app.zoom.zoomOut(),
			}, [
				DOM.h('img', {
					src: 'images/zoom_out.png',
					alt: 'zoom -',
				}),
			]),
			DOM.h('span', {
				class: 'zoom-value',
				id: 'zoomValue',
				innerText: '',
			}),
			DOM.h('button', {
				class: 'btn zoom',
				id: 'zoomIn',
				title: 'zoom +',
				onClick: () => app.zoom.zoomIn(),
			}, [
				DOM.h('img', {
					src: 'images/zoom_in.png',
					alt: 'zoom +',
				}),
			])
		]);
	}

	_createSearchListItem() {
		let searchInput = DOM.h('input', {
			type: 'search',
			placeholder: 'Search components...',
			class: 'search-text',
			id: 'searchText',
			onKeyUp: e => {
				switch (e.keyCode) {
					// enter key
					case 13:
						search(e.target.value);
						break;

					// escape key
					case 27:
						resetSearch();
						break;
				}
			},
		});

		let searchButton = DOM.h('button', {
			class: 'btn search',
			id: 'searchButton',
			onClick: () => {
				search(searchInput.value);
			},
		}, [
			DOM.h('img', {
				src: 'images/search.png',
				title: 'search',
				alt: 'search',
			}),
		]);

		let searchCounter = DOM.h('span', {
			class: 'search-count',
			id: 'searchCount',
			title: 'Count of components found',
			innerText: 0,
			onClick: () => resetSearch(),
		});

		function search(term) {
			if (term.length < 2) return;

			var found = 0;
			
			app.viewportComponent.nodeList.forEach(function(node) {
				if (node.name.toLowerCase().includes(term.toLowerCase())) {
					node.setFound(true);
					found++;
				} else {
					node.setFound(false);
				}
			});

			searchCounter.innerText = found;
		}

		function resetSearch() {
			app.viewportComponent.nodeList.forEach(function(node) {
				node.setFound(false);
			});

			searchInput.value = '';
			searchCounter.innerText = 0;
		}

		return DOM.h('li', {}, [
			searchInput,
			searchButton,
			searchCounter,
		]);
	}

	_createSwitchModeListItem() {
		return DOM.h('li', {}, [
			DOM.h('form', {
				name: 'modeForm',
			}, [
				DOM.h('label', {
					for: 'move',
				}, [
					DOM.h('input', {
						type: 'radio',
						name: 'mode',
						value: 'move',
						id: 'move',
						checked: 'checked',
					}),
					DOM.createTextElement('move'),
					DOM.h('img', {
						src: 'images/move.png',
						alt: 'move',
						class: 'navbar-image',
					}),
				]),
				DOM.h('label', {
					for: 'exclude',
				}, [
					DOM.h('input', {
						type: 'radio',
						name: 'mode',
						value: 'exclude',
						id: 'exclude',
					}),
					DOM.createTextElement('exclude'),
					DOM.h('img', {
						src: 'images/remove2.png',
						alt: 'exclude',
						class: 'navbar-image',
					}),
				]),
			]),
		]);
	}

	_createExcludeNodeWithMostEdgesListItem() {
		return DOM.h('li', {}, [
			DOM.h('button', {
				class: 'btn exclude-separately',
				id: 'mostEdge',
				title: 'Exclude components with the most count of edges separately.',
				onClick: () => {
					var vertexList = app.viewportComponent.getVertexList();
					if (vertexList.length === 0) return;

					// find vertex with most edges
					var vertexWithMostEdges = vertexList.reduce(function(prev, vertex) {
						return vertex.countEdges() > prev.countEdges() ? vertex : prev;
					});

					if (vertexWithMostEdges !== null) {
						vertexWithMostEdges.exclude();
						app.sidebarComponent.excludedNodeListComponent.add(vertexWithMostEdges);
					}
				},
			}, [
				DOM.h('img', {
					src: 'images/excludeSeparately.png',
					alt: 'excludeSeparately',
				}),
			]),
		]);
	}

	_createExcludeNodeWithMostEdgesToGroupListItem() {
		return DOM.h('li', {}, [
			DOM.h('button', {
				class: 'btn exclude-to-group',
				id: 'vertexToGroup',
				title: 'Exclude components with the most count of edges to group.',
				onClick: () => {
					var vertexList = app.viewportComponent.getVertexList();
					if (vertexList.length === 0) return;

					// find vertex with most edges
					var vertexWithMostEdges = vertexList.reduce(function(prev, vertex) {
						return vertex.countEdges() > prev.countEdges() ? vertex : prev;
					});

					// filter vertices with most edges
					var verticesWithMostEdges = vertexList.filter(function(vertex) {
						return vertex.countEdges() === vertexWithMostEdges.countEdges();
					});

					if (verticesWithMostEdges.length > 0) {
						var group = new Group({});

						verticesWithMostEdges.forEach(function(vertex) {
							group.addVertex(vertex);
						});

						app.nodeList.push(group);
						app.groupList.push(group);

						app.viewportComponent.addGroup(group);
					}
				},
			}, [
				DOM.h('img', {
					src: 'images/package.png',
					alt: 'Exclude components to group',
				}),
			]),
		]);
	}

	_createBackToUploadListItem() {
		return DOM.h('li', {}, [
			DOM.h('a', {
				href: app.homeUrl,
				class: 'btn btn-block back-to-upload',
				id: 'backToUpload',
				title: 'Back to upload',
			}),
		]);
	}

	_createApplyLayoutListItem() {
		let layouting = false;
		let layoutingInterval;

		const applyLayoutImg = DOM.h('img', {
			src: 'images/layout_off.png',
			alt: 'Apply layout to current graph',
		});

		return DOM.h('li', {}, [
			DOM.h('button', {
				class: 'btn',
				title: 'Apply layout to current graph',
				onClick: () => {
					if (layouting) {
						applyLayoutImg.setAttribute('src', 'images/layout_off.png');
		
						layouting = false;
						clearInterval(layoutingInterval);
		
					} else {
						applyLayoutImg.setAttribute('src', 'images/layout_on.png');

						layouting = true;
						layoutingInterval = window.setInterval(app.viewportComponent.forceDirected.run, 10);
					}
				},
			}, [
				applyLayoutImg,
			]),
		]);
	}

	_createSaveDiagramAsPNGListItem() {
		return DOM.h('li', {}, [
			DOM.h('button', {
				class: 'btn save-diagram',
				title: 'Save diagram as PNG',
				onClick: () => saveSvgAsPng(document.getElementById('svg1'), 'diagram.png', { scale: 1 }),
			}, [
				DOM.h('img', {
					src: 'images/png_save.png',
					alt: 'Save diagram as PNG',
				}),
			]),
		]);
	}

	_createSaveDiagramListItem() {
		return DOM.h('li', {
			class: 'loggedInOnly'
		}, [
			DOM.h('button', {
				class: 'btn save-diagram',
				title: 'Save diagram',
				onClick: () => app.modalWindowComponent.open(),
			}, [
				DOM.h('img', {
					src: 'images/icon_save.png',
					alt: 'Save diagram',
				}),
			]),
		]);
	}

	_createRefreshDiagramListItem() {
		const refreshDiagramLink = DOM.h('a', {
			href: location.href,
			class: 'btn btn-block view-refresh-diagram',
			title: 'Refresh diagram',
		});

		document.addEventListener(DiagramUpdatedEvent.name, e => {
			refreshDiagramLink.setAttribute('href', app.homeUrl + 'graph?diagramId=' + e.detail.id);
		});

		return DOM.h('li', {}, [
			refreshDiagramLink,
		]);
	}

	_createResetDiagramListItem() {
		return DOM.h('li', {}, [
			DOM.h('button', {
				class: 'btn btn-block view-refresh-reset-diagram',
				title: 'Refresh diagram - reset positions',
			}),
		]);
	}
}
