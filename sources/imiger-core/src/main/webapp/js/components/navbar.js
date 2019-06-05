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

			this._createFilterListItem(),
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

			this._createDownloadDiagramListItem(),
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
				title: 'zoom out [ctrl and -]',
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
				title: 'zoom in [ctrl and +]',
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
		const searchInput = DOM.h('input', {
			type: 'search',
			placeholder: 'Search nodes...',
			class: 'search-text',
			id: 'searchText',
			title: 'search nodes [ctrl + f]',
			onKeyDown: e => {
				switch (e.key) {
					case 'Enter':
						search(e.target.value);
						break;

					case 'Escape':
						resetSearch();
						break;
				}
			},
		});

		const searchButton = DOM.h('button', {
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

		const searchCounter = DOM.h('span', {
			class: 'search-count',
			id: 'searchCount',
			title: 'Count of components found',
			innerText: 0,
			onClick: () => resetSearch(),
		});

		const groupFoundButton = DOM.h('button', {
			id: 'groupFoundButton',
			innerText: 'Group found vertices',
			onClick: () => {
				const foundVertexList = app.vertexList.filter(node => node.isFound === true && node.group === null);

				if (foundVertexList.length > 0) {
					// create a new group
					let group = Group.create();
					group.isExcluded = true;

					app.nodeList.push(group);
					app.groupList.push(group);

					app.sidebarComponent.excludedNodeListComponent.addNode(group);

					foundVertexList.forEach(node => {
						if (node.isExcluded) {
							app.sidebarComponent.excludedNodeListComponent.removeNode(node);
						}

						group.addVertex(node);
						node.remove(true);
					});
				}

				resetSearch();
			},
		})

		function search(term) {
			if (term.length < 2) return;

			let found = 0;

			let nodeList = app.nodeList;
			nodeList.forEach(node => {
				if (node.name.toLowerCase().includes(term.toLowerCase())) {
					node.isFound = true;
					found++;
				} else {
					node.isFound = false;
				}
			});

			searchCounter.innerText = found;
		}

		function resetSearch() {
			let nodeList = app.nodeList;
			nodeList.filter(node => node.isFound === true).forEach(node => node.isFound = false);

			searchInput.value = '';
			searchCounter.innerText = 0;
		}

		return DOM.h('li', {}, [
			searchInput,
			searchButton,
			searchCounter,
			groupFoundButton,
		]);
	}

	_createFilterListItem() {
		const filterButton = DOM.h('button', {
			class: 'filter',
			id: 'filterButton',
			innerText: 'Select nodes',
			onClick: () => app.filterModalWindowComponent.open(),
		});

		return DOM.h('li', {}, [
			filterButton,
		]);
	}

	_createSwitchModeListItem() {
		return DOM.h('li', {}, [
			DOM.h('form', {
				name: 'modeForm',
			}, [
				DOM.h('label', {
					for: 'move',
					title: 'move node [click]',
				}, [
					DOM.h('input', {
						type: 'radio',
						name: 'mode',
						value: 'move',
						id: 'move',
						checked: 'checked',
					}),
					DOM.t('move'),
					DOM.h('img', {
						src: 'images/move.png',
						alt: 'move',
						class: 'navbar-image',
					}),
				]),
				DOM.h('label', {
					for: 'exclude',
					title: 'exclude node [alt + click]',
				}, [
					DOM.h('input', {
						type: 'radio',
						name: 'mode',
						value: 'exclude',
						id: 'exclude',
					}),
					DOM.t('exclude'),
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
					let vertexList = app.viewportComponent.vertexList;
					if (vertexList.length === 0) return;

					// find vertex with most edges
					let vertexWithMostEdges = vertexList.reduce((prev, vertex) => {
						return vertex.countEdges() > prev.countEdges() ? vertex : prev;
					});

					if (vertexWithMostEdges !== null) {
						vertexWithMostEdges.exclude();
						app.sidebarComponent.excludedNodeListComponent.addNode(vertexWithMostEdges);
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
					let vertexList = app.viewportComponent.vertexList;
					if (vertexList.length === 0) return;

					// find vertex with most edges
					let vertexWithMostEdges = vertexList.reduce((prev, vertex) => {
						return vertex.countEdges() > prev.countEdges() ? vertex : prev;
					});

					// filter vertices with most edges
					let verticesWithMostEdges = vertexList.filter(vertex => {
						return vertex.countEdges() === vertexWithMostEdges.countEdges();
					});

					if (verticesWithMostEdges.length > 0) {
						let group = Group.create();

						verticesWithMostEdges.forEach(vertex => {
							group.addVertex(vertex);
						});

						app.nodeList.push(group);
						app.groupList.push(group);

						app.viewportComponent.addNode(group);
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
						layoutingInterval = window.setInterval(() => app.viewportComponent.forceDirected.run(), 10);
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
				onClick: () => {
					let fileName = `imiger-${app.diagram.name !== null ? app.diagram.name : 'diagram'}.png`;

					saveSvgAsPng(document.getElementById('svg1'), fileName, {
						backgroundColor: '#fff',
						selectorRemap: function(s) {
							return s.replace('.viewport ', '');
						},
					});
				},
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
				title: 'Save diagram [ctrl + s]',
				onClick: () => app.saveDiagramModalWindowComponent.open(),
			}, [
				DOM.h('img', {
					src: 'images/icon_save.png',
					alt: 'Save diagram',
				}),
			]),
		]);
	}

	_createDownloadDiagramListItem() {
		return DOM.h('li', {}, [
			DOM.h('button', {
				class: 'btn download-diagram-as-raw-json',
				title: 'Download diagram as Raw JSON',
				onClick: () => {
					const json = JSON.stringify(app.graphExporter.run());
					const blob = new Blob([json]);
					const downloadLink = DOM.h('a', {
						href: URL.createObjectURL(blob, {
							type: 'application/json',
						}),
						download: app.diagram.name + '.json',
						hidden: 'hidden',
					});

					document.body.appendChild(downloadLink);
					downloadLink.click();
					document.body.removeChild(downloadLink);
				},
			}, [
				DOM.h('img', {
					src: 'images/icomoon/download3.svg',
					alt: 'download diagram icon',
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
			if (Utils.isDefined(e.detail.id)) {
				refreshDiagramLink.setAttribute('href', app.homeUrl + 'graph?diagramId=' + e.detail.id);
			}
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
