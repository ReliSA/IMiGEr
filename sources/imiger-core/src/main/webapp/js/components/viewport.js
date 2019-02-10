class Viewport {
	/**
	 * @constructor
	 */
	constructor() {
		/** @prop {VertexContextMenuList} contextMenuComponent */
		this.contextMenuComponent = null;
		/** @prop {VertexPopoverComponent} vertexPopoverComponent */
		this.vertexPopoverComponent = null;
		/** @prop {EdgePopoverComponent} edgePopoverComponent */
		this.edgePopoverComponent = null;

		/** @prop {ForceDirected} forceDirected */
		this.forceDirected = new ForceDirected;

		this._edgeList = [];
		this._nodeList = [];
		this._vertexList = [];
		this._groupList = [];
	}

	addEdge(edge) {
		if (!(edge instanceof Edge)) {
			throw new TypeError(edge.toString() + ' is not an instance of Edge');
		}

		this._edgeList.push(edge);

		if (edge.from === null || edge.from.isExcluded) return;
		if (edge.to === null || edge.to.isExcluded) return;

		this._edgesContainer.appendChild(edge.render());
	}

	addNode(node) {
		if (!(node instanceof Node)) {
			throw new TypeError(node.toString() + ' is not an instance of Node');
		}

		this._nodeList.push(node);

		if (node instanceof Vertex) {
			this._vertexList.push(node);
			this._verticesContainer.appendChild(node.render());
		} else if (node instanceof Group) {
			this._groupList.push(node);
			this._groupsContainer.appendChild(node.render());
		}
	}

	removeNode(node) {
		if (!(node instanceof Node)) {
			throw new TypeError(node.toString() + ' is not an instance of Node');
		}

		this._nodeList.splice(this._nodeList.indexOf(node), 1);

		if (node instanceof Vertex) {
			this._vertexList.splice(this._vertexList.indexOf(node), 1);
		} else if (node instanceof Group) {
			this._groupList.splice(this._groupList.indexOf(node), 1);
		}
	}

	get edgeList() {
		return this._edgeList;
	}
	
	get nodeList() {
		return this._nodeList;
	}

	get vertexList() {
		return this._vertexList;
	}

	get groupList() {
		return this._groupList;
	}

	addSvgDefinition(id, svgString) {
		this._definitions.appendChild(DOM.s('g', {
			id,
			innerHTML: svgString,
		}));
	}

	get size() {
		return new Dimensions(
			this._rootElement.offsetWidth,
			this._rootElement.offsetHeight,
		);
	}

	get position() {
		return new Coordinates(
			+this._innerSvgElement.getAttribute('x'),
			+this._innerSvgElement.getAttribute('y'),
		);
	}

	set position(coords) {
		this._innerSvgElement.setAttribute('x', coords.x);
		this._innerSvgElement.setAttribute('y', coords.y);
	}

	center() {
		let sumOfCenters = new Coordinates(0, 0);
		let bbox = this._rootElement.getBoundingClientRect();

		let nodeList = this.nodeList;
		nodeList.forEach(node => {
			let center = node.center;

			sumOfCenters.x += center.x;
			sumOfCenters.y += center.y;
		});

		let center = new Coordinates(
			-1 * sumOfCenters.x / nodeList.length + (bbox.width / 2),
			-1 * sumOfCenters.y / nodeList.length + bbox.height / 2,
		);

		this._innerSvgElement.setAttribute('x', center.x);
		this._innerSvgElement.setAttribute('y', center.y);

		app.sidebarComponent.minimapComponent.viewportPosition = center;
	}

	render() {
		this.contextMenuComponent = new VertexContextMenuList;
		this.vertexPopoverComponent = new VertexPopover;
		this.edgePopoverComponent = new EdgePopover;

		// graph canvas
		const mainSvg = DOM.s('svg', {
			width: '100%',
			height: '100%',
			style: 'margin-bottom: -4px;',
		});
		
		this._innerSvgElement = DOM.s('svg', {
			x: 0,
			y: 0,
			id: 'svg1',
			style: 'overflow: visible;',
		});
		mainSvg.appendChild(this._innerSvgElement);

		const graph = DOM.s('g', {
			id: 'graph',
		});
		this._innerSvgElement.appendChild(graph);

		// graph feature containers
		this._edgesContainer = DOM.s('g', {
			'data-id': 'edges',
		});
		graph.appendChild(this._edgesContainer);

		this._verticesContainer = DOM.s('g', {
			'data-id': 'vertices',
		});
		graph.appendChild(this._verticesContainer);

		this._groupsContainer = DOM.s('g', {
			'data-id': 'groups',
		});
		graph.appendChild(this._groupsContainer);

		// reusable definitions
		this._definitions = DOM.s('defs', {}, [
			// linear gradient
			DOM.s('linearGradient', {
				id: 'node--highlighted-as-required-provided',
			}, [
				DOM.s('stop', {
					offset: '0%',
					'stop-color': 'red',
				}),
				DOM.s('stop', {
					offset: '100%',
					'stop-color': '#5896ff',
				}),
			]),
			// drop shadow for found nodes
			DOM.s('filter', {
				id: 'node--found',
				width: '200%',
				height: '200%',
				x: '-50%',
				y: '-50%',
			}, [
				// use feDropShadow once supported in all major browsers
				DOM.s('feGaussianBlur', {
					in: 'SourceAlpha',
					stdDeviation: '16 8',
				}),
				DOM.s('feOffset', {
					dx: 0,
					dy: 0,
					result: 'offsetBlur',
				}),
				DOM.s('feFlood', {
					'flood-color': '#ffa500',
					'flood-opacity': 1,
				}),
				DOM.s('feComposite', {
					in2: 'offsetBlur',
					operator: 'in',
				}),
				DOM.s('feMerge', {}, [
					DOM.s('feMergeNode'),
					DOM.s('feMergeNode', {
						in: 'SourceGraphic',
					}),
				]),
			]),
		]);
		graph.appendChild(this._definitions);

		// root
		this._rootElement = DOM.h('div', {
			class: 'viewport',
			id: 'viewport',
			onWheel: this._onRootWheel.bind(this),
			onMouseDown: this._onRootMouseDown.bind(this),
			onDblClick: this._onRootDoubleClick.bind(this),
		}, [
			mainSvg,
			this.contextMenuComponent.render(),
			this.vertexPopoverComponent.render(),
			this.edgePopoverComponent.render(),
		]);

		return this._rootElement;
	}

	reset() {
		this._edgeList = [];
		this._nodeList = [];
		this._vertexList = [];
		this._groupList = [];

		this._edgesContainer.innerHTML = '';
		this._verticesContainer.innerHTML = '';
		this._groupsContainer.innerHTML = '';
	}

	_onRootWheel(e) {
		app.closeFloatingComponents();

		// prevent pinch-to-zoom gesture from zooming the whole page
		if (e.ctrlKey) {	// pinch gesture is mapped as mouse wheel with control key pressed
			e.preventDefault();
		}

		if (e.deltaY < 0) {
			app.zoom.zoomIn(new Coordinates(e.offsetX, e.offsetY));
		} else {
			app.zoom.zoomOut(new Coordinates(e.offsetX, e.offsetY));
		}
	}

	_onRootMouseDown(e) {
		let start = new Coordinates(e.clientX, e.clientY);
		let viewportPosition = this.position;

		let that = this;

		document.body.addEventListener('mousemove', mouseMove);
		document.body.addEventListener('mouseup', mouseUp);

		function mouseMove(e) {
			let offset = new Coordinates(start.x - e.clientX, start.y - e.clientY);

			that._innerSvgElement.setAttribute('x', viewportPosition.x - offset.x);
			that._innerSvgElement.setAttribute('y', viewportPosition.y - offset.y);

			app.sidebarComponent.minimapComponent.viewportPosition = new Coordinates(viewportPosition.x - offset.x, viewportPosition.y - offset.y);
		}

		function mouseUp() {
			document.body.removeEventListener('mousemove', mouseMove);
			document.body.removeEventListener('mouseup', mouseUp);

			app.redrawEdges();
		}
	}

	_onRootDoubleClick(e) {
		e.preventDefault();

		app.closeFloatingComponents();

		app.zoom.zoomIn(new Coordinates(e.offsetX, e.offsetY));
	}
}
