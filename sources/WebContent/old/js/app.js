/**
 * Main class of the application. 
 */
function App() {
	this.loader = new Loader;

	this.HOME_URL = null;

	this.api = {
		loadGraph: 'LoadGraphData',
		loadDiagram: 'LoadDiagram',
	};

	/**
	 * Loads graph using diagram (if available).
	 * @param diagramId Diagram identifier.
	 * @param diagramHash Diagram hash.
	 */
	this.diagramLoader = function(diagramId, diagramHash) {
		return function() {
			loadGraphData(diagramId, diagramHash, null, null);
		};
	};

	/**
	 * Loads graph using EFP data.
	 * @param withEfps Is EFPs in graph?
	 * @param efpSettings EFP settings.
	 */
	this.efpLoader = function(withEfps, efpSettings) {
		return function() {
			loadGraphData(null, null, withEfps, efpSettings);
		};
	};

	this.run = function(startFn) {
		console.log('running...');

		bootstrap();
		startFn();
	};

	function bootstrap() {
		GraphManager.init();
		ViewportManager.init();
		OffScreenKiv.init();

		// when user changes window size then set height and width #viewport and #rightPanel
		$(window).bind('resize', setHeight);

		setHeight();

		// zoom
		$('#zoomIn').click(function() {
			ViewportManager.zoom.zoomIn();
		});

		$('#zoomOut').click(function() {
			ViewportManager.zoom.zoomOut();
		});

		// viewport mode
		$("input[name='actionMove']").change(function() {
			var action = $("input[name='actionMove']:checked").val();
			var vertex;

			if (action == 'move') {
				for (var i = 0; i < GraphManager.graph.vertices.length; i++) {
					// remove context menu
					ViewportManager.removeContextMenu('#vertex'+ (i+1));
					
					vertex = GraphManager.graph.vertices[i];
					vertex.$selector.unbind('mousedown', OffScreenKiv.showVertexInRightPanel);
					vertex.$selector.mousedown(ViewportManager.vertexMousedownHandler);
				}

			} else if (action == 'exclude') {
				for (var j = 0; j < GraphManager.graph.vertices.length; j++) {
					vertex = GraphManager.graph.vertices[j];
					vertex.$selector.unbind('mousedown', ViewportManager.vertexMousedownHandler);
					vertex.$selector.mousedown(OffScreenKiv.showVertexInRightPanel);
					
					// add context menu
					ViewportManager.addContextMenu('#vertex'+ (j+1));
				}
			}
		});

		// search
		$("#search").click(OffScreenKiv.search);
		$("#searchText").focusin(function() {
			if ($(this).val() == 'Search components...') {
				$(this).val('');
			}
		});

		$("#countOfFinded").click(OffScreenKiv.deselectHighlightSearchedVertices);
		$("#mostEdge").click(OffScreenKiv.excludeVerticesWithMostEdges);
		$("#vertexToGroup").click(OffScreenKiv.excludeVerticesWithMostEdgesToGroup);
		$('#applyLayout').click(GraphManager.forceDirectedLayoutOnClick);

		$('.sort-button').click(OffScreenKiv.sortComponents);
		$('#includeAllComponents').click(OffScreenKiv.includeAllComponents);

		initSearchOnEnterPressed();
		initZoomKeys();
		initViewportMove();
	}

	function loadGraphData(diagram_id, diagram_hash, with_efps, efp_settings) {
		app.loader.enable();
	
		var load_url = app.api.loadGraph;
		var load_diagram_url = app.api.loadDiagram;
		
		if (diagram_id !== null) {
			load_url += "?diagram_id=" + diagram_id;
			load_diagram_url += "?diagram_id=" + diagram_id;
		}
		
		if (diagram_hash !== null) {
			load_url +=  "&diagram_hash=" + diagram_hash;
			load_diagram_url += "&diagram_hash=" + diagram_hash;
		}

		if (with_efps !== null) {
			/* Build graph with EFPs */
			GraphManager.isEfpGraph = true;
	
			// set EFP settings
			GraphManager.efpMinIntDiameter = efp_settings.minInterfaceDiameter;
			GraphManager.efpMaxIntDiameter = efp_settings.maxInterfaceDiameter;
		}

		// gets vertex position data
		$.getJSON(load_diagram_url, function(data) {
			GraphManager.vertices_position = data;
		});

		// build the graph
		$.getJSON(load_url, function(data) {
			GraphManager.graph = data;

			GraphManager.buildGraph();
			ViewportManager.revive();
		});
	}

	/**
	 * Set height of viewport and right panel.
	 */
	function setHeight() {
		var headerHeight = $('#header').height() + $('#navigation').height() + 5;	/* magic 5, dunno where it comes from */
		var contentHeight = $(window).height() - headerHeight;
		
		$('#viewport').height(contentHeight);
		$('#rightPanel').height(contentHeight - 40); /* 40px is the sidebar-navbar */
	}

	/**
	 * Set Enter as accelerator for the searching box
	 */
	function initSearchOnEnterPressed() {
		$("#searchText").keydown(function(event) {
			// react on Enter key pressed
			if (event.which === 13) {
				OffScreenKiv.search();
			}
		});
	}

	/**
	 * Initialize zoom keys.
	 */
	function initZoomKeys() {
		var scrollViewportOnZoom = function(e) {
			e = e ? e : window.event;
			var raw = e.detail ? e.detail : e.deltaY;
			
			if (event.ctrlKey === true) {
				e.preventDefault();

				if (raw > 0){
					ViewportManager.zoom.zoomOut();
				}
				if (raw < 0){
					ViewportManager.zoom.zoomIn();
				}
			}
		};

		$(window).keydown(function(event) {
			if (event.ctrlKey === false) return;
	
			$('#zoom_help').show();

			// key code 107 is the plus sign
			if (event.which === 107) {
				event.preventDefault();

				ViewportManager.zoom.zoomIn();
			}
	
			// key code 109 is the plus sign
			if (event.which === 109) {
				event.preventDefault();

				ViewportManager.zoom.zoomOut();
			}
		});
	
		$(window).keyup(function(event) {
			if (event.ctrlKey === false) {
				$('#zoom_help').hide();
			}
		});

		document.getElementById('envelope').addEventListener('wheel', scrollViewportOnZoom);
		document.getElementById('zoom_help').addEventListener('wheel', scrollViewportOnZoom);
	}

	/**
	 * Initialization of moving with viewport
	 */
	function initViewportMove() {
		var viewport = $('#viewport'),
			viewportX, viewportY,
			startX, startY;
		
		var bindMove = function(e) {
			if (e.button === 0) {
				document.getElementById('envelope').addEventListener('mousemove', move);
				
				viewportX = viewport.scrollLeft();
				viewportY = viewport.scrollTop();
				
				startX = e.screenX;
				startY = e.screenY;
			}
		};
		
		var unbindMove = function(e) {
			document.getElementById('envelope').removeEventListener('mousemove', move);
		};
		
		var move = function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			viewport.scrollLeft(viewportX + startX - e.screenX);
			viewport.scrollTop(viewportY + startY - e.screenY);
		};
		
		document.getElementById('viewport').addEventListener('mousedown', bindMove);
		document.getElementById('envelope').addEventListener('mouseup', unbindMove);
		document.getElementById('envelope').addEventListener('mouseleave', unbindMove);
	}

}
