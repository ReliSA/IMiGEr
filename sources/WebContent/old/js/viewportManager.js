/**
* Ensures drag and drop of elements in graph.
*/
var ViewportManager = {
	CONST_EXPAND_ZONE_SIZE : 20,
	leftMouseButtonDown : false,
	$currentTarget : null,
	current : null,
	$svg : null,
	offsetX : 0,
	offsetY : 0,
	vertices : null,
	highlightEdge : null,
	highlightVertex : null,
	highlightVertexProv: null,
	highlightVertexReq: null,
	highlightGroup : null,
	zoom : new Zoom(),
	clickedPosX : 0,
	clickedPosY : 0,
	oscarMike : false,		// differs between mouseMove and plain mouseDown to control node highlighting
	lastColor : null,
	
	/**
	 * Initialization
	 */
	init: function() {
		this.highlightReqGraph = this.highlightReqGraph.bind(this);
		this.highlightProvGraph = this.highlightProvGraph.bind(this);
		this.highlightClckdVertexSeCo = this.highlightClckdVertexSeCo.bind(this);
		this.highlightReqGraphSeCo = this.highlightReqGraphSeCo.bind(this);
		this.highlightProvGraphSeCo = this.highlightProvGraphSeCo.bind(this);

		this.vertexMousedownHandler = this.vertexMousedownHandler.bind(this);
		this.groupVertexMousedownHandler = this.groupVertexMousedownHandler.bind(this);
		this.viewportMousedownHandler = this.viewportMousedownHandler.bind(this);
		this.viewportMousemoveHandler = this.viewportMousemoveHandler.bind(this);
		this.viewportEndDraggingHandler = this.viewportEndDraggingHandler.bind(this);
		this.edgeMousedownHandler = this.edgeMousedownHandler.bind(this);

		this.revive = this.revive.bind(this);
		this.addContextMenu = this.addContextMenu.bind(this);

		Dialog.setDialog();
	},
	
	/**
	* Initial registration events on elements of graph.
	*/
	revive: function() {
		this.$svg = $('#svg1');
		
		// nastavovani clicku
		$('#showUnconnected').click(OffScreenKiv.includeUncon);
		$('#hideUnconnected').click(OffScreenKiv.deleteUncon);

		$('#postponed').click(function(e){
			$('#postponedComps').toggle();
		});
		$('#toChange').click(function(e){
			$('#toChangeComps').toggle();
		});
		$('#unconnected').click(function(e){
			$('#unconComps').toggle();
		});
		$('#incompatible').click(function(e){
			$('#allIncomps').toggle();
		});

		$('#proposeChanges').click(OffScreenKiv.proposeChanges);
		
		var i;
		for (i = 0; i < GraphManager.unconList.length; i++) {
			$('#liuc_del_'+GraphManager.unconList[i]).click(OffScreenKiv.includeUnconItem);
		}
		
		for (i = 0; i < GraphManager.graph.vertices.length; i++) {
			var vertex = GraphManager.graph.vertices[i];
			vertex.$selector = $('#vertex' + vertex.id);

			vertex.$selector.mousedown(vertex, this.vertexMousedownHandler);
			vertex.$selector.mouseup(this.viewportEndDraggingHandler);
			
			$('#rectTop'+vertex.id).click(ViewportManager.highlightReqGraph);
			$('#rectBot'+vertex.id).click(ViewportManager.highlightProvGraph);
		}
		
		for (var j = 0; j < GraphManager.graph.edges.length; j++) {
			var edge = GraphManager.graph.edges[j];
			var idEdge = '#e' + edge.id;
			edge.$selector = $(idEdge);
			edge.$selector.click(this.edgeMousedownHandler);
		}
		
		this.$svg.mousemove(this.viewportMousemoveHandler);
		this.$svg.bind('dragstart', function(event) {
			event.preventDefault();
		});
		
		/**
		* EFP diagram only.
		*/
		if (GraphManager.isEfpGraph) {
			// init EFP selecting mechanics
			EFPs.init(GraphManager.graph);
			
			// set listener onChange of the slector
			$('#EFPselector').change(function(){
				EFPs.recalculate(this);
			});
		}

		// hack na vystredeni grafu
		ViewportManager.zoom.zoomOut();
	},


	/**
	 * Handles mousedown event on vertex displayed in graph.
	 * @param  e 	event descriptor, contains vertex object in e.data property
	 */
	vertexMousedownHandler: function(e) {
		var action = $("input[name='actionMove']:checked").val();
		var vertex = e.data;

		if (action == 'move'){
			this.highlightVertexHandler(e);
		} else if (action == 'exclude') {
			OffScreenKiv.showVertexInRightPanel(e);
		}
	},

	/**
	 * Handles mousedown event on group of vertices displayed in graph.
	 * @param  e 	event descriptor, contains group ID in e.data property
	 */
	groupVertexMousedownHandler: function(e) {
		var action = $("input[name='actionMove']:checked").val();
		var idGroup = e.data;

		if (action == 'move'){
			this.highlightGroupVerticesHandler(e);
		} else if (action == 'exclude') {
			OffScreenKiv.showGroupInRightPanel(idGroup);
		}
	},

	/**
	 * Handles mousedown event on a detached viewport of a group displayed in graph.
	 * @param  e 	event descriptor, contains group ID in e.data property
	 */
	viewportMousedownHandler: function(e) {
		this.highlightViewportHandler(e);
	},


	outOffSeCoReqEdge: function (secoVertex){
		var graph = $('#svg1 #graph')[0];
		var panel = $('#rightPanel')[0];
		var viewport = $("#viewport");
		var required = $('#required' + secoVertex.id);

		var inEdge = createSvgElement('g', {
			class: 'egde edge-to-seco',
			style: 'inline',
			id: 'secoEdge' + secoVertex.id,
		});

		for (var i=0;i<secoVertex.edges.length;i++) {
			if (secoVertex.edges[i].from !== secoVertex) {
				inEdge.appendChild(createSvgElement('line', {
					x1: viewport[0].clientWidth,
					y1: panel.lastElementChild.offsetTop,
					x2: secoVertex.edges[i].from.x,
					y2: secoVertex.edges[i].from.y,
					'stroke-width': 1,
					stroke: 'red'
				}));
			}
		}
		graph.appendChild(inEdge);
	},

	outOffSeCoProvEdge: function (secoVertex){
		var graph = $('#svg1 #graph')[0];
		var panel = $('#rightPanel')[0];
		var viewport = $("#viewport");

		var inEdge = createSvgElement('g', {
			class: 'egde edge-to-seco',
			style: 'inline',
			id: 'secoEdge' + secoVertex.id,
		});

		for (var i=0;i<secoVertex.edges.length;i++) {
			if(secoVertex.edges[i].to !== secoVertex){
				inEdge.appendChild(createSvgElement('line', {
					x1: viewport[0].clientWidth,
					y1: panel.lastElementChild.offsetTop + panel.clientHeight,
					x2: secoVertex.edges[i].to.x,
					y2: secoVertex.edges[i].to.y,
					'stroke-width': 1,
					stroke: 'blue'
				}));
			}
		}
		graph.appendChild(inEdge);
	},

	clearOutOfSecoEdges: function (secoVertex) {
		$('#secoEdge' + secoVertex.id).remove();
	},
	
	/**
	*  Highlight required (clicked in graph)
	*/
	highlightReqGraph: function(e) {
		var id = findId(e.target);
		var vertex = GraphManager.graph.vertices[id - 1];
		
		// Dishighlights one edge
		this.deleteBorder();
		this.highlightEdge = null;
		
		this.disableHighlightEdges();
		
		if (vertex != this.highlightVertexReq) {
			this.dimAll();
			
			this.highlightVertexReq = vertex;
			this.highlightVertex = vertex;
			
			$('#rectTop'+vertex.id).css('stroke','red');
			$('#lolGL'+vertex.id).attr('class', 'detail colorHighReqR');
			
			vertex.$selector.attr('class', 'node vertex colorNormal');
			vertex.$selector.css('stroke-width', '3');
			vertex.$selector.css('stroke','red');
			
			if (!vertex.leftAlone) {
				vertex.$selector[0].classList.remove('vertex--dimmed');
			}
			
			vertex.dimmed = false;
			
			// highlight required
			for (var i = 0; i < vertex.edges.length; i++) {
				var cedge = vertex.edges[i];
				
				if (cedge.to == vertex) {
					cedge.from.$selector.attr('class', 'node vertex colorHighReqR');
					
					if (!cedge.from.leftAlone) {
						cedge.from.$selector[0].classList.remove('vertex--dimmed');
					}
					
					vertex.dimmed = false;
					
					cedge.$selector.css('stroke', 'red');
					cedge.$selector[0].classList.remove('edge--dimmed');
				}
			}
			
			// Highlights connected vertices in the SeCo panel
			for ( var i = 0; i < vertex.edges.length; i++) {
				var edgeIdFrom = vertex.edges[i].from.id;
				
				$('#detailVertex' + (edgeIdFrom)).attr('class', 'detail colorHighReqR');
				$('#li'+edgeIdFrom).attr('style', 'background-color: red');
			}
		} else {
			this.highlightVertexReq = null;
			this.highlightVertex = null;
		}
		
		this.highlightVertexProv = null;
	},

	/**
	*  Highlight required (clicked in SeCo)
	*/
	highlightReqGraphSeCo: function(e) {
		var id = findId(e.target);
		var vertex = GraphManager.graph.vertices[id - 1];
		
		// Dishighlights one edge
		this.deleteBorder();
		this.highlightEdge = null;
		
		this.disableHighlightEdges();
		
		if (vertex != this.highlightVertexReq) {
			//this.outOffSeCoReqEdge(vertex);
			this.dimAll();
			
			this.highlightVertexReq = vertex;
			this.highlightVertex = vertex;
			
			$('#rectTop'+vertex.id).css('stroke','red');
			$('#lolGL'+vertex.id).attr('class', 'detail colorHighReqR');
			$('#required'+vertex.id).attr('class', 'colorHighReqR');
			
			vertex.$selector.attr('class', 'node vertex colorNormal');
			vertex.$selector.css('stroke-width', '3');
			vertex.$selector.css('stroke','red');
			
			if (!vertex.leftAlone) {
				vertex.$selector[0].classList.remove('vertex--dimmed');
			}
			
			vertex.dimmed = false;
			
			// highlight required
			for (var i = 0; i < vertex.edges.length; i++) {
				var cedge = vertex.edges[i];
				
				if (cedge.to == vertex) {
					cedge.from.$selector.attr('class', 'node vertex colorHighReqR');
					
					if(!cedge.from.leftAlone) {
						cedge.from.$selector[0].classList.remove('vertex--dimmed');
					}
					
					vertex.dimmed = false;
					
					cedge.$selector.css('stroke', 'red');
					cedge.$selector[0].classList.remove('edge--dimmed');
				}
			}
			
			// Highlights connected vertices in the SeCo panel
			for (var i = 0; i < vertex.edges.length; i++) {
				var edgeIdFrom = vertex.edges[i].from.id;
				
				$('#detailVertex' + (edgeIdFrom)).attr('class', 'detail colorHighReqR');
				$('#li'+edgeIdFrom).attr('style', 'background-color: red');
			}
			$('#detailVertex'+id).attr('class', 'detail colorNormal');

		} else {
			this.clearOutOfSecoEdges(vertex);
			this.highlightVertexReq = null;
			this.highlightVertex = null;
		}
		
		this.highlightVertexProv = null;
	},
	
	/**
	*  Highlight provided (clicked in graph)
	*/
	highlightProvGraph: function(e) {
		var id = findId(e.target);
		var vertex = GraphManager.graph.vertices[id - 1];
		
		// Dishighlights one edge
		this.deleteBorder();
		this.highlightEdge = null;
		
		this.disableHighlightEdges();
		
		if (vertex != this.highlightVertexProv){
			this.dimAll();
			this.highlightVertexProv = vertex;
			this.highlightVertex = vertex;
			
			$('#rectBot'+vertex.id).css('stroke','red');
			$('#lolGP'+vertex.id).attr('class', 'detail colorHighProvB');
			
			vertex.$selector.attr('class', 'node vertex colorNormal');
			vertex.$selector.css('stroke-width', '3');
			vertex.$selector.css('stroke','red');
			
			if (!vertex.leftAlone) {
				vertex.$selector[0].classList.remove('vertex--dimmed');
			}
			
			vertex.dimmed = false;
			
			// highlight provided
			for ( var i = 0; i < vertex.edges.length; i++) {
				var cedge = vertex.edges[i];
				
				if (cedge.from == vertex) {
					cedge.to.$selector.attr('class', 'node vertex colorHighProvB');
					
					if (!cedge.to.leftAlone) {
						cedge.to.$selector[0].classList.remove('vertex--dimmed');
					}
					
					vertex.dimmed = false;
					
					cedge.$selector.css('stroke', 'blue');
					cedge.$selector[0].classList.remove('edge--dimmed');
				}
			}
			
			// Highlights connected vertices (provided) in the SeCo panel
			for ( var i = 0; i < vertex.edges.length; i++) {
				var edgeIdTo = vertex.edges[i].to.id;
				
				$('#detailVertex' + (edgeIdTo)).attr('class', 'detail colorHighProvB');
				$('#li'+edgeIdTo).attr('style', 'background-color: #5896ff');
			}
		}
		else{
			this.highlightVertexProv = null;
			this.highlightVertex = null;
		}
		
		this.highlightVertexReq = null;
		
	},
	
	/**
	* Highlight provided (clicked in SeCo)
	*/
	highlightProvGraphSeCo: function(e) {
		var id = findId(e.target);
		var vertex = GraphManager.graph.vertices[id - 1];

		// Dishighlights one edge
		this.deleteBorder();
		this.highlightEdge = null;
		
		this.disableHighlightEdges();		

		if (vertex != this.highlightVertexProv){
			//this.outOffSeCoProvEdge(vertex);
			this.dimAll();
			this.highlightVertexProv = vertex;
			this.highlightVertex = vertex;
			
			$('#rectBot'+vertex.id).css('stroke','red');
			$('#lolGP'+vertex.id).attr('class', 'detail colorHighProvB');
			$('#provided'+vertex.id).attr('class', 'colorHighProvB');
			
			vertex.$selector.attr('class', 'node vertex colorNormal');
			vertex.$selector.css('stroke-width', '3');
			vertex.$selector.css('stroke','red');
			
			if (!vertex.leftAlone) {
				vertex.$selector[0].classList.remove('vertex--dimmed');
			}
			
			vertex.dimmed = false;
			
			// highlight provided
			for (var i = 0; i < vertex.edges.length; i++) {
				var cedge = vertex.edges[i];
				
				if (cedge.from == vertex) {
					cedge.to.$selector.attr('class', 'node vertex colorHighProvB');
					
					if (!cedge.to.leftAlone) {
						cedge.to.$selector[0].classList.remove('vertex--dimmed');
					}
					
					vertex.dimmed = false;
					
					cedge.$selector.css('stroke', 'blue');
					cedge.$selector[0].classList.remove('edge--dimmed');
				}
			}
			
			// Highlights connected vertices (provided) in the SeCo panel
			for (var i = 0; i < vertex.edges.length; i++) {
				var edgeIdTo = vertex.edges[i].to.id;
				
				$('#detailVertex' + (edgeIdTo)).attr('class', 'detail colorHighProvB');
				$('#li'+edgeIdTo).attr('style', 'background-color: #5896ff');
				
				
			}
			$('#detailVertex'+id).attr('class', 'detail colorNormal');

		} else {
			this.clearOutOfSecoEdges(vertex);
			this.highlightVertexProv = null;
			this.highlightVertex = null;
		}
		
		this.highlightVertexReq = null;
		
	},
	
	/**
	* Highlights vertices and edges connected to selected vertex
	*/
	highlightClckdVertex : function(vertex) {
		// Dishighlights one edge
		this.deleteBorder();
		this.highlightEdge = null;

		this.disableHighlightEdges();
		OffScreenKiv.groupDisHighlightAllLollipops();
		
		// Highlights the selected vertex and edges connected to it
		if (this.highlightVertex != vertex || vertex == this.highlightVertexProv || vertex == this.highlightVertexReq) {
			this.highlightVertex = vertex;
			this.highlightVertexProv = null;
			this.highlightVertexReq = null;
			
			this.dimAll();
			vertex.dimmed = false;
			
			if (!vertex.leftAlone) {
				vertex.$selector[0].classList.remove('vertex--dimmed');
			}

			vertex.$selector.css('stroke', 'red');
			vertex.$selector.css('stroke-width', '3');
			
			$('#lolGL'+vertex.id).attr('class', 'detail colorHighReqR');
			$('#lolGP'+vertex.id).attr('class', 'detail colorHighProvB');
			
			// Highlights connected vertices and edges
			for (var i = 0; i < vertex.edges.length; i++) {
				var cedge = vertex.edges[i];
				var idTo = cedge.to.id;
				var idFrom = cedge.from.id;
				
				var groupList = OffScreenKiv.groupManager.getAll();
				for (var key in groupList) {
					var group = groupList[key];
					var verList = group.items.getAll();

					for (var ver in verList) {
						var groupElement = $('#gv_'+ group.idGroup);
						if (groupElement.length > 0) {
							groupElement[0].classList.remove('group_vertices--dimmed');
						}

						if (ver == idTo) {
							$('#li'+ ver).attr('style', 'background-color: #5896ff');
						} else if (ver == idFrom) {
							$('#li'+ ver).attr('style', 'background-color: red');
						}
					}
				}
				
				if (cedge.to == vertex) {
					cedge.$selector.css('stroke', 'red');
					cedge.$selector[0].classList.remove('edge--dimmed');
					
					if (!cedge.from.leftAlone) {
						cedge.from.$selector[0].classList.remove('vertex--dimmed');
					}
					
					cedge.from.dimmed = false;
					cedge.from.$selector.attr('class', 'node vertex colorHighReqR');
					
				} else {
					cedge.$selector.css('stroke', 'blue');
					cedge.$selector[0].classList.remove('edge--dimmed');
					
					if (!cedge.to.leftAlone) {
						cedge.to.$selector[0].classList.remove('vertex--dimmed');
					}
					
					cedge.to.dimmed = false;
					cedge.to.$selector.attr('class', 'node vertex colorHighProvB');
				}
			}
			
			// Highlights connected vertices in the SeCo panel
			for ( var i = 0; i < vertex.edges.length; i++) {
				var edgeIdFrom = vertex.edges[i].from.id;
				var edgeIdTo = vertex.edges[i].to.id;

				$('#detailVertex' + (edgeIdFrom)).attr('class', 'detail colorHighReqR');
				$('#detailVertex' + (edgeIdTo)).attr('class', 'detail colorHighProvB');
			}

		} else {
			this.highlightVertex = null;
		}
	},
	
	/**
	* Highlights vertices and edges connected to vertex selected in SeCo panel
	*/
	highlightClckdVertexSeCo : function(e) {
		// Dishighlights one edge
		this.deleteBorder();
		this.highlightEdge = null;
		
		this.disableHighlightEdges();
		
		var id = findId(e.target);
		var vertex = GraphManager.graph.vertices[id - 1];

		//this.outOffSeCoReqEdge(vertex);
		//this.outOffSeCoProvEdge(vertex);
		
		this.highlightClckdVertexProceed(vertex, null);
	},

	/**
	 * Highlights vertices connected to grouped vertex
	 * 
	 * @param  group 	group object in graph
	 */
	highlightClckdVertexGroup : function(group) {
		// Dishighlights one edge
		this.deleteBorder();
		this.highlightEdge = null;

		this.disableHighlightEdges();

		// Highlights the selected group and vertices connected to it
		if (this.highlightGroup === null || this.highlightGroup.id != group.id) {
			this.highlightGroup = group;

			this.dimAll();
			group.dimmed = false;

			group.$selector[0].classList.remove('group_vertices--dimmed');
			
			group.$selector.children('rect').css('stroke', 'red');
			group.$selector.children('rect').css('stroke-width', '3');

			OffScreenKiv.groupHighlight(group.id);

			// highlights connected edges
			var group2 = OffScreenKiv.groupManager.getGroup(group.id);

			var i;

			for (i in group2.items.getAll()) {
				if (group2.items.contains(i) === false) continue;

				var vertex = group2.items.get(i);

				for (i = 0; i < vertex.edges.length; i++) {
					var edge = vertex.edges[i];

					$('#vertex'+ edge.from.id)[0].classList.remove('vertex--dimmed');
					$('#vertex'+ edge.to.id)[0].classList.remove('vertex--dimmed');
				}
			}

		} else {
			OffScreenKiv.groupDisHighlight(group.id);

			this.highlightGroup = null;
		}
	},
	
	/**
	* Triggers highlighting of vertices and edges connected to grouped vertex selected in SeCo panel
	*
	* @param e
	*/
	highlightClckdVertexGroupSeCo : function(e) {
		// Dishighlights one edge
		ViewportManager.deleteBorder();
		ViewportManager.highlightEdge = null;
		
		ViewportManager.disableHighlightEdges();

		var vertexName = e.target.parentElement.id;
		var vertexId = parseInt(vertexName.substr(2));
		
		var vertex = GraphManager.graph.vertices[vertexId-1];
		
		var groupName = e.target.parentElement.parentElement.id;
		var groupId = groupName.substr(2);
		
		ViewportManager.highlightClckdVertexProceed(vertex, groupId);
	},
	
	/**
	* Performs the highlighting actions themselves.
	*
	* @param vertex
	* @param inGroup
	*/
	highlightClckdVertexProceed : function(vertex, inGroup) {
		// Highlights the selected vertex and edges connected to it
		if (this.highlightVertex != vertex || vertex == this.highlightVertexProv || vertex == this.highlightVertexReq) {
			this.dimAll();
			
			this.highlightVertex = vertex;
			this.highlightVertexProv = null;
			this.highlightVertexReq = null;
			
			vertex.$selector.css('stroke', 'red');
			vertex.$selector.css('stroke-width', '3');
			
			if (!vertex.leftAlone) {
				vertex.$selector[0].classList.remove('vertex--dimmed');
			}
			
			vertex.dimmed = false;
			
			$('#lolGL'+vertex.id).attr('class', 'detail colorHighReqR');
			$('#lolGP'+vertex.id).attr('class', 'detail colorHighProvB');
			$('#required'+vertex.id).attr('class', 'colorHighReqR');
			$('#provided'+vertex.id).attr('class', 'colorHighProvB');
			
			// Highlights connected vertices and edges
			for ( var i = 0; i < vertex.edges.length; i++) {
				var cedge = vertex.edges[i];
				var idTo = cedge.to.id;
				var idFrom = cedge.from.id;
				
				var groupList = OffScreenKiv.groupManager.getAll();
				for (var key in groupList) {
					var currGroup = OffScreenKiv.groupManager.getGroup(key);
					var verList = currGroup.items.getAll();
					
					for (var ver in verList) {
						// dont highlight itself in group
						if (ver == vertex.id && inGroup !== null) continue;
						
						if (ver == idTo) {
							$('#li'+ ver).attr('style', 'background-color: #5896FF');
						} else if (ver == idFrom) {
							$('#li'+ ver).attr('style', 'background-color: red');
						}
					}
				}
				
				// highligh border for itself
				if (inGroup !== null) {
					$('#li' + vertex.id).css('border', '2px solid red');
					$('#required' + inGroup).attr('class', 'colorHighReqR');
					$('#provided' + inGroup).attr('class', 'colorHighProvB');
				}
				
				if (cedge.to == vertex) {
					cedge.from.$selector.attr('class', 'node vertex colorHighReqR');
					
					if (!cedge.from.leftAlone) {
						cedge.from.$selector[0].classList.remove('vertex--dimmed');
					}
					
					cedge.from.dimmed = false;
					
					cedge.$selector.css('stroke', 'red');
					cedge.$selector[0].classList.remove('edge--dimmed');

				} else {
					cedge.$selector.css('stroke', 'blue');
					cedge.$selector[0].classList.remove('edge--dimmed');
					
					if (!cedge.to.leftAlone) {
						cedge.to.$selector[0].classList.remove('vertex--dimmed');
					}
					
					cedge.to.dimmed = false;
					
					cedge.to.$selector.attr('class', 'node vertex colorHighProvB');
				}
			}
			
			// Highlights connected vertices in the SeCo panel
			for (var i = 0; i < vertex.edges.length; i++) {
				var edgeIdFrom = vertex.edges[i].from.id;
				var edgeIdTo = vertex.edges[i].to.id;

				$('#detailVertex' + (edgeIdFrom)).attr('class', 'detail colorHighReqR');
				$('#detailVertex' + (edgeIdTo)).attr('class', 'detail colorHighProvB');
			}
			$('#detailVertex'+ vertex.id).attr('class', 'detail colorNormal');

		} else {
			this.clearOutOfSecoEdges(vertex);
			this.highlightVertex = null;
		}
	},
	
	/**
	 * Dims the vertices
	 */
	dimAll: function(){
		var i;

		// dim vertices
		for (i = 0; i < GraphManager.graph.vertices.length; i++) {
			var vertex = GraphManager.graph.vertices[i];
			
			if (!vertex.leftAlone) {
				$('#vertex'+vertex.id)[0].classList.add('vertex--dimmed');
			}
			
			vertex.dimmed = true;
		}
		
		// dim edges
		for (i = 0; i < GraphManager.graph.edges.length; i++) {
			var edge = GraphManager.graph.edges[i];
			
			edge.$selector[0].classList.add('edge--dimmed');
		}

		// dim groups
		var groupList = OffScreenKiv.groupManager.getAll();
		for (var groupId in groupList) {
			var group = $('#gv_'+ groupId);

			if (group.length > 0) {
				group[0].classList.add('group_vertices--dimmed');
			}
		}
	},

	/**
	* Disables highlighting of edges and vertices connected to the last selected node
	*/
	disableHighlightEdges : function() {
		var node;

		if (this.highlightVertex !== null) {
			node = this.highlightVertex;
		} else if (this.highlightGroup !== null) {
			node = this.highlightGroup;
		} else {
			return;
		}

		if (node.$selector === undefined) return;

		var classes = node.$selector[0].classList;

		if (classes.contains('vertex')) {
			this.disHighlightVertex(this.highlightVertex);

		} else if (classes.contains('group_vertices')) {
			this.disHighlightGroup(this.highlightGroup);
		}


		for (var i = 0; i < GraphManager.graph.vertices.length; i++){
			var vertex = GraphManager.graph.vertices[i];
			
			$('#vertex'+vertex.id).attr('class', 'node vertex colorNormal');
			
			if (!vertex.leftAlone) {
				$('#vertex'+vertex.id)[0].classList.remove('vertex--dimmed');
				
				vertex.dimmed = false;
			}
		}
		
		for (var i = 0; i < GraphManager.graph.edges.length; i++){
			var edge = GraphManager.graph.edges[i];
			
			edge.$selector[0].classList.remove('edge--dimmed');
		}
	},

	disHighlightVertex : function(vertex) {
		vertex.$selector.css('stroke', '');
		vertex.$selector.css('stroke-width', 1);

		var idSelected = vertex.id;
		
		if (this.highlightVertex.leftAlone) {
			this.highlightVertex.$selector[0].classList.add('vertex--unconnected');
		}
		
		$('#rectTop'+idSelected).css('stroke', '');
		$('#rectBot'+idSelected).css('stroke', '');
		
		$('#lolGL'+idSelected).attr('class', 'whiteColor');
		$('#lolGP'+idSelected).attr('class', 'whiteColor');
		
		$('#provided'+idSelected).attr('class', 'whiteColor');
		$('#required'+idSelected).attr('class', 'whiteColor');
		
		for (var i = 0; i < this.highlightVertex.edges.length; i++) {
			var cedge = this.highlightVertex.edges[i];
			
			cedge.to.$selector.attr('class', 'node vertex colorNormal');
			cedge.from.$selector.attr('class', 'node vertex colorNormal');
			cedge.$selector.css('stroke', '');
		}
		
		// Disables highlight in seco
		for (var i = 0; i < this.highlightVertex.edges.length; i++) {
			var edgeIdFrom = this.highlightVertex.edges[i].from.id;
			var edgeIdTo = this.highlightVertex.edges[i].to.id;

			$('#detailVertex' + (edgeIdFrom)).attr('class', 'detail colorNormal');
			$('#detailVertex' + (edgeIdTo)).attr('class', 'detail colorNormal');
			// $('#detailVertex' + (idd+1)).attr('class', 'detail colorNormal');
		}
		
		var groupList = OffScreenKiv.groupManager.getAll();
		for (var key in groupList) {
			var currGroup = OffScreenKiv.groupManager.getGroup(key);
			var verList = currGroup.items.getAll();
			
			// Disables highlight of groups in SeCo
			for (var ver in verList) {
				$('#li'+ver).attr('style', 'background-color: white');
				$('#li'+ver).attr('style', 'background-color: white');
			}
			
			$('#required' + currGroup.idGroup).attr('class', 'whiteColor');
			$('#provided' + currGroup.idGroup).attr('class', 'whiteColor');

			// disable highlight of groups in graph area
			var groupNode = $('#gv_' + currGroup.idGroup);
			if (groupNode.length > 0) {
				groupNode[0].classList.remove('group_vertices--dimmed');
			}
		}
	},

	disHighlightGroup : function(group) {
		group.$selector.children('rect').css('stroke', '');
		group.$selector.children('rect').css('stroke-width', 1);
	},
	
	/**
	* Highlights node from graph, which is chosen.
	*/
	highlight : function(node) {
		if (node.$selector === undefined) return;

		this.oscarMike = false;
		this.lastColor = node.$selector.attr('class');

		node.dimmed = false;
		node.$selector[0].classList.add('colorHighlight');
	},
	
	/**
	* Cancels highlighting of node after finish move.
	*/
	disableHighlight : function(node) {
		if (node.$selector === undefined) return;

		node.$selector.attr('class', this.lastColor);
	},

	/**
	* Registretes event after mouseUp and mouseLeave, set current position of
	* mouse cursor after click to mouse button.
	*/
	highlightVertexHandler: function(e) {
		e.stopPropagation();
		
		var node = e.target.parentElement;
		
		if (node.classList.contains('vertex')) {
			var id = $(node).data('id');

			this.current = GraphManager.graph.vertices[id - 1];
			this.$currentTarget = this.current.$selector;

		} else {
			return;
		}

		this.offsetX = e.pageX;
		this.offsetY = e.pageY;
		
		if (e.which == 1) {
			this.clickedPosX = e.pageX;
			this.clickedPosY = e.pageY;
			this.leftMouseButtonDown = true;

			this.current.$selector.mouseup(this.viewportEndDraggingHandler);
			this.$svg.mouseleave(this.viewportEndDraggingHandler);
			this.$svg.mouseup(this.viewportEndDraggingHandler);

			this.highlight(this.current);
		}
	},

	/**
	* Registrates event after mouseUp and mouseLeave, set current position of
	* mouse cursor after click to mouse button.
	*/
	highlightGroupVerticesHandler: function(e) {
		e.stopPropagation();
		
		var node = e.target.parentElement;
		var idGroup = e.data;

		if (node.classList.contains('group_vertices')) {
			var coords  = getCoordinates(node.getAttribute('transform'));

			this.current = {
				$selector: $('#gv_'+ idGroup),
				dimmed: false,
				edges: [],
				id: idGroup,
				x: coords.x,
				y: coords.y,
			};
			this.$currentTarget = this.current.$selector;

		} else {
			if (node.id === '') {
				node = node.parentElement;
			}

			this.$currentTarget = this.current.$selector;
		}
		
		this.offsetX = e.pageX;
		this.offsetY = e.pageY;
		
		if (e.which == 1) {
			this.clickedPosX = e.pageX;
			this.clickedPosY = e.pageY;
			this.leftMouseButtonDown = true;

			this.current.$selector.mouseup(this.viewportEndDraggingHandler);
			this.$svg.mouseleave(this.viewportEndDraggingHandler);
			this.$svg.mouseup(this.viewportEndDraggingHandler);

			this.highlight(this.current);
		}
	},

	/**
	 * Registrates event after mouseUp and mouseLeave, set current position of
	 * mouse cursor after click to mouse button.
	 */
	highlightViewportHandler: function(e) {
		e.stopPropagation();
		
		var idGroup = e.data;		

		var viewportTransform = $('#groupViewport_' + idGroup + ' > .viewportTransform');

		var coords  = getCoordinates(viewportTransform[0].getAttribute('transform'));

		this.current = {
			$selector: viewportTransform,
			edges: [],
			id: idGroup,
			x: coords.x,
			y: coords.y,
		};
		this.$currentTarget = this.current.$selector;

		this.offsetX = e.pageX;
		this.offsetY = e.pageY;
		
		if (e.which == 1) {
			this.clickedPosX = e.pageX;
			this.clickedPosY = e.pageY;
			this.leftMouseButtonDown = true;

			this.$svg.mouseleave(this.viewportEndDraggingHandler);
			this.$svg.mouseup(this.viewportEndDraggingHandler);

			this.highlight(this.current);
		}
	},
	
	/**
	* Ensures move of elements in graph.
	*/
	viewportMousemoveHandler: function (e) {
		if (this.leftMouseButtonDown === false) return;

		if (TimeBarrier.wait()) return;

		var diffX = this.offsetX - e.pageX;
		var diffY = this.offsetY - e.pageY;
			
		if (diffX === 0 && diffY === 0) return;

		this.current.x = this.current.x - diffX / this.zoom.currentZoom;
		this.current.y = this.current.y - diffY / this.zoom.currentZoom;
		this.moveNode(diffX, diffY);

		this.offsetX = e.pageX;
		this.offsetY = e.pageY;
	},

	/**
	 * Moves node that is currently stored in this.current (respectively this.$currentTarget) including its edges.
	 */
	moveNode: function(diffX, diffY) {

		this.$currentTarget.attr('transform', 'translate('+ this.current.x +','+ this.current.y +')');

		var classes = this.$currentTarget[0].classList;

		if (classes.contains('vertex')) {
			this.oscarMike = true;

			var newX;
			var newY;
			var lollipop;

			// posouvani a rotace car
			if (this.current.edges !== null) {
				for (var i = 0; i< this.current.edges.length; i++) {
					var edge = this.current.edges[i];
					var sizeOfRectFrom = getSizeOfRectangle(edge.from.name);
					var sizeOfRectTo = getSizeOfRectangle(edge.to.name);

					if (edge.from.id == this.current.id) {
						newX = this.current.edges[i].to.x + sizeOfRectTo/2;
						newY = this.current.edges[i].to.y + 13;
						lollipop = getLollipopPosition(this.current.x + sizeOfRectFrom/2, this.current.y +13 , newX, newY);
						
						edge.$selector.children("line").attr('x1', this.current.x + sizeOfRectFrom/2);
						edge.$selector.children("line").attr('y1', this.current.y + 13);
						edge.$selector.children("g").attr('transform', 'rotate(' + lollipop.angle + ',' + lollipop.x + ',' + lollipop.y  + ') translate('+ lollipop.x + ',' + lollipop.y  + ')');
						
						this.preventTickRotation(edge, lollipop);
						this.preventCrossRotation(edge, lollipop);
					} else {
						newX = this.current.edges[i].from.x + sizeOfRectFrom/2;
						newY = this.current.edges[i].from.y + 13;
						lollipop = getLollipopPosition(newX, newY, this.current.x + sizeOfRectTo/2, this.current.y + 13);
						
						edge.$selector.children("line").attr('x2', this.current.x + sizeOfRectTo/2);
						edge.$selector.children("line").attr('y2', this.current.y + 13);
						edge.$selector.children("g").attr('transform', 'rotate(' + lollipop.angle + ',' + lollipop.x + ',' + lollipop.y  + ') translate('+ lollipop.x + ',' + lollipop.y  + ')');
						
						this.preventTickRotation(edge, lollipop);
						this.preventCrossRotation(edge, lollipop);
					}
				}
			}

			var vertex = this.current;
			$('[data-from-id='+ this.current.id +']').each(function(){
				var sizeOfRectFrom = getSizeOfRectangle(vertex.name);

				$(this).children('line').attr('x2', vertex.x + sizeOfRectFrom/2);
				$(this).children('line').attr('y2', vertex.y + 13);
			});

		} else if (classes.contains('group_vertices')) {
			this.oscarMike = true;

			posX = this.current.x;
			posY = this.current.y;
			
			var group2 = OffScreenKiv.groupManager.getGroup(this.current.id);

			group2.x = posX;
			group2.y = posY;
			
			// nastavení pozice prvků
			id_vert = 0;
			
			posX_reset = posX;
			
			$.each(group.items.getAll(), function(index, value) {
				id_vert = index;
				//get current vertex
				
				var newX;
				var newY;
				
				var lollipop;
				posX = posX_reset;
				//  posX = posX_reset;
				//  posX = parseFloat(posX);
				//  posY = parseFloat(posY);
				
				//posun pozice, aby byla komponenta vycentrovana
				hidden_component_width = $('g#vertex' + id_vert + ' rect').attr('width');

				//vystredeni na stred
				posX = posX  - (hidden_component_width/2) + 40;
				
				group2.items.get(id_vert).x = posX;
				group2.items.get(id_vert).y = posY;
				
				$currentTarget = $('g#vertex' + id_vert);
				
				$currentTarget.attr('transform', 'translate('+posX+','+posY+')');

				$currentTarget.trigger('click',{move_edges:true});

				for (var i = 0; i< group2.items.get(id_vert).edges.length; i++){
					var edge = group2.items.get(id_vert).edges[i];
					var sizeOfRectFrom = getSizeOfRectangle(edge.from.name);
					var sizeOfRectTo = getSizeOfRectangle(edge.to.name);

					if (edge.from.id == id_vert){
						newX = group2.items.get(id_vert).edges[i].to.x + sizeOfRectTo/2;
						newY = group2.items.get(id_vert).edges[i].to.y + 13;
						lollipop = getLollipopPosition(posX + sizeOfRectFrom/2, posY +13 , newX, newY);
						
						edge.$selector.children("line").attr('x1', posX + sizeOfRectFrom/2);
						edge.$selector.children("line").attr('y1', posY + 13);
						edge.$selector.children("g").attr('transform', 'rotate(' + lollipop.angle + ',' + lollipop.x + ',' + lollipop.y  + ') translate('+ lollipop.x + ',' + lollipop.y  + ')');
						
						ViewportManager.preventTickRotation(edge, lollipop);
						ViewportManager.preventCrossRotation(edge, lollipop);
					} else {
						newX = group2.items.get(id_vert).edges[i].from.x + sizeOfRectFrom/2;
						newY = group2.items.get(id_vert).edges[i].from.y + 13;
						lollipop = getLollipopPosition(newX, newY, posX + sizeOfRectTo/2, posY + 13);
						
						edge.$selector.children("line").attr('x2', posX + sizeOfRectTo/2);
						edge.$selector.children("line").attr('y2', posY + 13);
						edge.$selector.children("g").attr('transform', 'rotate(' + lollipop.angle + ',' + lollipop.x + ',' + lollipop.y  + ') translate('+ lollipop.x + ',' + lollipop.y  + ')');
						
						ViewportManager.preventTickRotation(edge, lollipop);
						ViewportManager.preventCrossRotation(edge, lollipop);
					}
				}
			});
		} else if (classes.contains('viewportTransform')) {
			this.oscarMike = true;

			posX = this.current.x;
			posY = this.current.y;
			
			var group2 = OffScreenKiv.groupManager.getGroup(this.current.id);

			// iterate through all vertices in the group
			for (id_vert in group2.items.getAll()) {
				var edgeSelector = $('.edge-required-' + id_vert + ' > line');

				$('.edge-required-' + id_vert + ' > line').each(function(i, obj) {
					var x = $(obj).attr('x1');
					var y = $(obj).attr('y1');

					$(obj).attr('x1', x - diffX);
					$(obj).attr('y1', y - diffY);
				});

				$('.edge-provided-' + id_vert + ' > line').each(function(i, obj) {
					var x = $(obj).attr('x1');
					var y = $(obj).attr('y1');

					$(obj).attr('x1', x - diffX);
					$(obj).attr('y1', y - diffY);
				});

/*
				for (id in edgeSelector) {

					var xx = edgeSelector[id];
					var yy = edgeSelector[id];

					var x = xx.x1.baseVal.value;
					var y = xx.y1.baseVal.value;

					edgeSelector[id].$selector.attr('x1', x - diffX);
					edgeSelector[id].$selector.attr('y1', y - diffX);

				}
*/
			}

			var a = 5;
		}
	},

	/**
	 * Moves nodes visible in graph to make space for area defined by its boundaries.
	 *
	 * @param  boundaries 	boundaries of the area
	 */
	moveNodes: function(boundaries) {
		var width = boundaries.right - boundaries.left,
			height = boundaries.bottom - boundaries.top;

		var center = {
			x: boundaries.left + (width / 2),
			y: boundaries.top + (height / 2),
		};

		$('#graph .node').each(function(){
			var element = $(this);

			if (element[0].isHidden()) return;

			var boundingRect = element[0].getBoundingClientRect();

			var coords = getCoordinates(element.attr('transform')),
				elementWidth = boundingRect.width / ViewportManager.zoom.currentZoom,
				elementHeight = boundingRect.height / ViewportManager.zoom.currentZoom;

			if ((coords.x + elementWidth < boundaries.left || coords.x > boundaries.right) || (coords.y + elementHeight < boundaries.top || coords.y > boundaries.bottom)) return;

			var elementCenter = {
				x: coords.x + (elementWidth / 2),
				y: coords.y + (elementHeight / 2),
			};

			var diff = {
				x: elementCenter.x - center.x,
				y: elementCenter.y - center.y,
			};

			var classes = element[0].classList;
			var id = element.data('id');

			if (classes.contains('vertex')) {
				ViewportManager.current = GraphManager.graph.vertices[id - 1];

			} else if (classes.contains('group_vertices')) {
				ViewportManager.current = {
					$selector: element,
					dimmed: false,
					edges: [],
					id: id,
					x: coords.x,
					y: coords.y,
				};
			}

			/**
			 * mechanism to move vertices in the direction and distance they have from the viewport center at the moment
			 * - vertices close to the viewport center stay close to the viewport and vice versa
			 * - vertices that are top-left from the viewport center stay top-left, they are just further
			 */
			ViewportManager.current.x += (diff.x < 0 ? -1 : 1) * (1 + Math.random() * Math.abs(diff.x) / (width / 2)) * (width / 2);
			ViewportManager.current.y += (diff.y < 0 ? -1 : 1) * (1 + Math.random() * Math.abs(diff.y) / (height / 2)) * (height / 2);

			ViewportManager.$currentTarget = element;

			ViewportManager.moveNode();
		});
	},
	
	/**
	* Event which will be executed after mouseup.
	* Cancels hihghlighting of a node that was moved.
	*/
	viewportEndDraggingHandler: function (e) {
		// Highlighting connected vertices only on click (not on drag)
		if (this.oscarMike === false && this.offsetX !== 0 && this.current.$selector) {
			var classes = this.current.$selector[0].classList;

			if (classes.contains('vertex')) {
				this.highlightClckdVertex(this.current);
			} else if (classes.contains('group_vertices')) {
				this.highlightClckdVertexGroup(this.current);
			}
		}

		if (this.leftMouseButtonDown) {
			this.leftMouseButtonDown = false;
			this.offsetX = 0;
			this.offsetY = 0;
			
			this.disableHighlight(this.current);
			this.$svg.unbind('mouseup');
			
			if (OffScreenKiv.vertexSearchHighlighting[this.current.symbolicName] !== undefined) {
				this.current.$selector[0].classList.add('vertex--searched');
			}
			
			this.$svg.mouseleave(function(){
				// do nothing
			});
		}
	},

	/**
	* Prevent the tick from rotating with the lollipop.
	*
	* @param edge
	* @param lollipop
	*/
	preventTickRotation: function(edge, lollipop) {
		// prevent the tick from being rotated
		var tick = document.getElementById('lollipop-tick' + edge.id);
		if(tick !== null) {
			tick.setAttribute('transform', 'rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)');
		}
		
		var crossA = document.getElementById('lollipop-cross_a_' + edge.id);
		var crossB = document.getElementById('lollipop-cross_b_' + edge.id);
		if(crossA !== null) {
			crossA.setAttribute('transform', 'rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)');
		}
		if(crossB !== null) {
			crossB.setAttribute('transform', 'rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)');
		}
		
		var tickA = document.getElementById('lollipop-tick_a_' + edge.id);
		var tickB = document.getElementById('lollipop-tick_b_' + edge.id);
		if(tickA !== null) {
			tickA.setAttribute('transform', 'rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)');
		}
		if(tickB !== null) {
			tickB.setAttribute('transform', 'rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)');
		}
	},
	
	/**
	* Prevent the error cross from rotating with the lollipop.
	*
	* @param edge
	* @param lollipop
	*/
	preventCrossRotation: function(edge, lollipop) {
		// prevent the cross from being rotated
		var lines = document.getElementsByClassName('lollipop-line' + edge.id);
		
		if (lines.length !== 0) {
			lines[0].setAttribute('transform', 'rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)');
			lines[1].setAttribute('transform', 'rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)');
		}
	},
	
	/**
	* Highlights the edge that was clicked
	*/
	edgeMousedownHandler: function(e){
		this.deleteBorder();
		
		// disables highlited edges connected to last clicked vertex
		this.disableHighlightEdges();
		this.highlightVertex = null;
		this.highlightGroup = null;
		
		var id = getIndexFromId(e.target.parentElement.parentElement.id, 1)-1;
		var edge = GraphManager.graph.edges[id];

		if (this.highlightEdge != edge) {
			this.highlightEdge = edge;
			edge.from.$selector.css('stroke', 'red');
			edge.to.$selector.css('stroke', 'red');
			edge.$selector.css('stroke', 'red');

		} else {
			this.highlightEdge = null;
		}
	},
	
	/**
	* Stop highlighting edge.
	*/
	deleteBorder: function(){
		if (this.highlightEdge !== null) {
			this.highlightEdge.from.$selector.css('stroke', '');
			this.highlightEdge.to.$selector.css('stroke', '');
			this.highlightEdge.$selector.css('stroke', '');
		}
	},
	
	/**
	* Add context menu to html.
	*/
	addContextMenu: function(id){
		$(id).contextMenu({
			menu: 'myMenu',
		},
		function(action, el, pos) {
			OffScreenKiv.addVertexToGroup(action, el);
		});
	},
	
	/**
	* Remove context menu from selector.
	*/
	removeContextMenu: function(id){
		$(id).destroyContextMenu();
	}
};