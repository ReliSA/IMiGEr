/**
 * Object responsible for handling SeCo panel.
 */
var OffScreenKiv = {
	markSymbol: new MarkSymbol(),
	vertexSearchHighlighting: {},
	groupManager: new GroupManager(),
	
	init: function(){
		this.showVertexInRightPanel = this.showVertexInRightPanel.bind(this);
		this.showVertexInGraph = this.showVertexInGraph.bind(this);
		this.notHighlightNeighbour = this.notHighlightNeighbour.bind(this);
		this.highlightAllNeighbour = this.highlightAllNeighbour.bind(this);
		this.highlightProvidedEvent = this.highlightProvidedEvent.bind(this);
		this.highlightRequiredEvent = this.highlightRequiredEvent.bind(this);
		this.showVertexIcons = this.showVertexIcons.bind(this);
		this.hideVertexIcons = this.hideVertexIcons.bind(this);
		this.showGroupIcons = this.showGroupIcons.bind(this);
		this.hideGroupIcons = this.hideGroupIcons.bind(this);

		this.deleteItemFromGroupEvent = this.deleteItemFromGroupEvent.bind(this);
		this.groupHighlightProvided = this.groupHighlightProvided.bind(this);
		this.groupDisHighlightProvided = this.groupDisHighlightProvided.bind(this);
		this.groupHighlightRequired = this.groupHighlightRequired.bind(this);
		this.groupDisHighlightRequired = this.groupDisHighlightRequired.bind(this);
		this.groupHighlightRequiredAndProvided = this.groupHighlightRequiredAndProvided.bind(this);
		this.groupDisHighlightRequiredAndProvided = this.groupDisHighlightRequiredAndProvided.bind(this);
		this.search = this.search.bind(this);
		this.deselectHighlightSearchedVertices = this.deselectHighlightSearchedVertices.bind(this);

		this.excludeVerticesWithMostEdges = this.excludeVerticesWithMostEdges.bind(this);
		this.excludeVerticesWithMostEdgesToGroup = this.excludeVerticesWithMostEdgesToGroup.bind(this);
		
		this.includeUnconItem = this.includeUnconItem.bind(this);
		this.includeUncon = this.includeUncon.bind(this);
		this.deleteUncon = this.deleteUncon.bind(this);		

		this.parseTransform = this.parseTransform.bind(this);

		this.proposeChanges = this.proposeChanges.bind(this);
	},

	/**
	 * Includes the component with passed ID to the diagram area.
	 * 
	 * @param id the component identifier
	 */
	includeUnconnectedComponent: function(id) {
		var list = GraphManager.unconList;
		var i = list.indexOf(id);

		list.splice(i, 1);

		$('#vertex'+ id)[0].classList.add('vertex--unconnected');
		$('#vertex'+ id).show();

		$('#liuc'+ id).hide();
	},
	
	/**
	* Includes all unconnected components in the diagram area.
	*/	
	includeUncon: function() {
		var list = GraphManager.unconList;
		
		// cancel highlight
		ViewportManager.highlightVertex = null;
		
		//ukaze v grafu a odstrani ze seznamu
		for (var i = list.length-1; i >= 0; i--) {
			this.includeUnconnectedComponent(list[i]);
		}
	},
	
	/**
	 * Includes a single unconnected component in the diagram area.
	 */
	includeUnconItem: function(e) {
		var vertexId = $(e.target.parentElement).data('id');

		this.includeUnconnectedComponent(vertexId);
	},
	
	/**
	* Removes unconnected components from the diagram area.
	*/	
	deleteUncon: function() {
		var list = GraphManager.unconList;
		var vertices = GraphManager.graph.vertices;
		
		// pridani nepropojenych do seznamu
		for (var i = 0; i < vertices.length; i++) {
			var vertex = vertices[i];
			
			// test existence sousedu a viditelnosti
			if (vertex.edges.length === 0 && $('#vertex'+ vertex.id)[0].isVisible()) {
				var j = list.length;
				list[j] = vertex.id;
			}
		}
		
		// schova v grafu
		for (var i = 0; i < list.length; i++){
			$('#vertex'+ list[i]).hide();
			$('#liuc'+ list[i]).show();
		}
	},

	/**
	 * Sorts components excluded to SeCo.
	 */
	sortComponents: function(e) {
		e.preventDefault();

		var components;
		switch ($(this).attr('id')) {
			case 'sortComponents_name_asc':
				components = $('#excludedComponents .component').sort(OffScreenKiv.sortByComponentName);
				break;
			case 'sortComponents_name_desc':
				components = $('#excludedComponents .component').sort(OffScreenKiv.sortByComponentName).get().reverse();
				break;
			case 'sortComponents_count_asc':
				components = $('#excludedComponents .component').sort(OffScreenKiv.sortByComponentCount);
				break;
			case 'sortComponents_count_desc':
				components = $('#excludedComponents .component').sort(OffScreenKiv.sortByComponentCount).get().reverse();
				break;
		}

		$('#excludedComponents').append(components);

		$('.sort-button').removeClass('active');
		$(this).addClass('active');
	},
	
	/**
	 * Perfoms the actual sorting by component name in ascending order.
	 */
	sortByComponentName: function(a, b) {
		var $_a_item = $(a).find('g[id^="detailVertex"] text');
		var $_b_item = $(b).find('g[id^="detailVertex"] text');
		
		var a_item_text = '';
		var b_item_text = '';
		
		if ($_a_item.length > 0) {
			a_item_text = $_a_item.text().toLowerCase();
		} else {
			a_item_text = $(a).find('ul li:first p').text().toLowerCase();
		}
		
		if ($_b_item.length > 0) {
			b_item_text = $_b_item.text().toLowerCase();
		} else {
			b_item_text = $(b).find('ul li:first p').text().toLowerCase();
		}
		
		return a_item_text > b_item_text ? 1 : -1;
	},
	
	/**
	 * Perfoms the actual sorting by count of components in ascending order.
	 */
	sortByComponentCount: function(a, b) {
		var $_a_item = $(a).find('g[id^="detailVertex"] text');
		var $_b_item = $(b).find('g[id^="detailVertex"] text');
		
		var a_count_comp = 1;
		var b_count_comp = 1;
		
		if ($_a_item.length > 0) {
			a_count_comp = 1;
		} else {
			a_count_comp = $(a).find('ul li').length;
		}
		
		if ($_b_item.length > 0) {
			b_count_comp = 1;
		} else {
			b_count_comp = $(b).find('ul li').length;
		}
		
		return a_count_comp > b_count_comp ? 1 : -1;
	},	
	
	/**
	* Includes all components in the graph.
	*/
	includeAllComponents: function(e){
		e.preventDefault();

		//show component in graph
		$('#excludedComponents .component').each(function() {
			if (this.classList.contains('vertex')) {
				OffScreenKiv.showVertexInGraph(findId(this));
			} else if (this.classList.contains('group_vertices')) {
				OffScreenKiv.showGroupInGraph(findId(this));
			}
		});

		$('#includeAllComponents').hide();
	},

	/**
	 * Hides include all components button if there are no components or groups displayed in SeCo.
	 */
	hideIncludeAllComponentsButton: function(){
		if ($('#excludedComponents .component').length === 0) {
			$('#includeAllComponents').hide();
		}
	},

	/**
	* This method ensures display icon at the vertex neighbors
	*/
	showIcons: function(vertex) {
		for (var i = 0; i < vertex.edges.length; i++) {
			var targetVertex = this.getEdgeOtherSide(vertex.edges[i], vertex);
			// var markId = vertex.id + 'mark' + targetVertex.id;
			var markId = 'mark' + vertex.symbol[0]+ vertex.symbol[1];
			if (!targetVertex.gridMark.existMark(markId)) {
				var mark = new Mark(vertex.symbol, markId, targetVertex.$selector);
				targetVertex.gridMark.addMark(markId, mark);
			}
		}
	},
	
	/**
	* This method ensures disappearance of icon at the vertex neighbors
	*/
	hideIcons: function(vertex){
		for (var i = 0; i < vertex.edges.length; i++) {
			var targetVertex = this.getEdgeOtherSide(vertex.edges[i], vertex);
			var markId = 'mark' + vertex.symbol[0]+ vertex.symbol[1];

			if (targetVertex.gridMark.existMark(markId)) {
				targetVertex.gridMark.removeMark(markId);
			}
		}
	},
	
	/**
	* Event calls action  showIcons after click to given element.
	* Parameters: e - event
	*/
	showVertexIcons: function(e) {
		var id = findId(e.target);
		var vertex  = GraphManager.graph.vertices[id - 1];
		var color = vertex.symbol[1];
		var buttonElement = $(e.target);

		this.showIcons(vertex);

		buttonElement.attr('class', 'button c' + color.substring(1, color.length));
		buttonElement.unbind('click');
		buttonElement.click(this.hideVertexIcons);
	},
	
	/**
	* Event calls action  hideIcons after click to given element.
	* Parameters: e - event
	*/
	hideVertexIcons: function(e) {
		var id = findId(e.target);
		var vertex  = GraphManager.graph.vertices[id - 1];
		var buttonElement = $(e.target);
		
		this.hideIcons(vertex);
		
		buttonElement.attr('class', 'button buttonClassic');
		buttonElement.unbind('click');
		buttonElement.click(this.showVertexIcons);
	},
	
	/**
	* Event calls action  showIcons after click to given element.
	* It ensures to display icon at all vertex neighbors in group.
	* Parameters: e - event
	*/
	showGroupIcons: function(e){
		var idGroup = findId(e.target);
		var group = this.groupManager.getGroup(idGroup);
		var firstRun = true;
		var symbol;
		var buttonElement = $(e.target);

		for (var key in group.items.getAll()) {
			if (firstRun) {
				symbol = group.items.get(key).symbol;
				firstRun = false;
				buttonElement.attr('class', "button c" + symbol[1].substring(1, symbol[1].length));
			}
			this.showIcons(group.items.get(key));
		}

		buttonElement.unbind('click', this.showGroupIcons);
		buttonElement.click(this.hideGroupIcons);
	},
	
	/**
	* Event calls action  hideIcons after click to given element.
	* It ensures to disappearance icon at all vertex neighbors in group.
	* Parameters: e - event
	*/
	hideGroupIcons: function(e) {
		var idGroup = findId(e.target);
		var group = this.groupManager.getGroup(idGroup);
		var buttonElement = $(e.target);

		for (var key in group.items.getAll()) {
			this.hideIcons(group.items.get(key));
		}
		
		buttonElement.attr('class', 'button buttonClassic');
		buttonElement.unbind('click', this.hideGroupIcons);
		buttonElement.click(this.showGroupIcons);
	},
	
	/**
	*
	* Detect and make opaque the unconnected vertices according to #1751. Detect while removing a vertex from diagram.
	*
	* @param vertex
	*/
	detectAndSetUnconnectedInGraph : function(vertex) {
		for (var i = 0; i < vertex.edges.length; i++) {
			var neighbour = null;
			var adjacent = null;
			
			var visibleAdjacentsCount = 0;
			
			if (vertex.edges[i].from == vertex) {
				neighbour = vertex.edges[i].to;
			} else {
				neighbour = vertex.edges[i].from;
			}
			
			var styleNeighbour = neighbour.$selector.attr('style');
			
			if (!/display: none/.test(styleNeighbour)) {
				for (var j = 0; j < neighbour.edges.length; j++) {
					if (neighbour.edges[j].from == neighbour) {
						adjacent = neighbour.edges[j].to;
					} else {
						adjacent = neighbour.edges[j].from;
					}
					
					// not count the edge to the vertex being removed
					if (adjacent == vertex || adjacent == neighbour) {
						continue;
					}
					
					var styleAdj = adjacent.$selector.attr('style');
					
					if (/display: none/.test(styleAdj)) {
						continue;
					}
					
					visibleAdjacentsCount++;
				}

				if (visibleAdjacentsCount === 0) {
					neighbour.$selector[0].classList.add('vertex--unconnected');
					neighbour.leftAlone = true;
				}
			}
		}
	},
	
	/**
	*
	* Detect and make reset the opacity the previously unconnected vertices according to #1751. Detect while adding a vertex back to diagram.
	*
	* @param vertex
	*/
	detectAndResetReconnectedInGraph : function(vertex) {
		var visibleAdjacentsCount = 0;

		for (var i = 0; i < vertex.edges.length; i++) {
			var neighbour = null;
			
			if (vertex.edges[i].from == vertex) {
				neighbour = vertex.edges[i].to;
			} else {
				neighbour = vertex.edges[i].from;
			}

			// set proper opacity
			if (neighbour.leftAlone && !neighbour.excluded) {
				// not greyed-out by highlighing
				if (!neighbour.dimmed) {
					neighbour.$selector[0].classList.remove('vertex--unconnected');
				} else { // greyed-out by highlighting
					neighbour.$selector[0].classList.add('vertex--dimmed');
				}
				
				neighbour.leftAlone = false;
			}

			// got a neighbour in graph
			if (!neighbour.excluded) {
				visibleAdjacentsCount++;
			}
		}

		// make visible if got a neighbour
		if (visibleAdjacentsCount > 0) {
			if (!vertex.dimmed) {
				vertex.$selector[0].classList.remove('vertex--unconnected');
			} else {
				vertex.$selector[0].classList.add('vertex--dimmed');
			}
		} else { // is alone after returning to graph
			vertex.$selector[0].classList.add('vertex--unconnected');
			vertex.leftAlone = true;
		}
	},
	
	/**
	* Counts dependencies of vertex with other vertices.
	* Parameters: vertex - vertex
	*/
	countDependence: function(vertex){
		var countFrom = 0;
		var countTo = 0;
		
		if(!GraphManager.isEfpGraph) {
			countFrom = vertex.exportedPackages.length;
			countTo = vertex.importedPackages.length;
		} else { // legacy method - for efp graphs
			for (var i = 0; i < vertex.edges.length;i++) {
				if (vertex.id == vertex.edges[i].from.id) {
					countFrom++;
				}
			}
			
			countTo = vertex.edges.length - countFrom;
		}
		
		return {
			countFrom: countFrom,
			countTo: countTo
		};
	},

	/**
	* Counts dependencies of grouped vertices with other vertices outside the group.
	*
	* @param idGroup
	*/
	countDependenceGroup: function(idGroup){
		var countFrom = 0;
		var countTo = 0;
		
		var group = this.groupManager.getGroup(idGroup);
		var vertexList = group.items.getAll();
		
		// iterate over vertices
		$.each(vertexList, function(key, vertex){
			for (var j = 0; j < vertex.edges.length; j++){
				var toEndOk = true, fromEndOk = true;
				
				if (vertex.id == vertex.edges[j].from.id) {
					//check if the TO end of the found edge is NOT in this group too
					$.each(vertexList, function(key, otherEndVertex) {
						if (otherEndVertex.id == vertex.edges[j].to.id) {
							toEndOk = false;
							
							return false;
						}
					});
					
					// increase if OK
					if (toEndOk) {
						countFrom++;
					}
				}
				
				if (vertex.id == vertex.edges[j].to.id) {
					//check if the FROM end of the found edge is NOT in this group too
					$.each(vertexList, function(key, otherEndVertex) {
						if (otherEndVertex.id == vertex.edges[j].from.id) {
							fromEndOk = false;
							
							return false;
						}
					});
					
					// increase if OK
					if (fromEndOk) {
						countTo++;
					}
				}
			}
		});
		
		return {
			countFrom: countFrom,
			countTo: countTo
		};
	},

	isOnOneSideOfEdge: function(vertex, edge) {
		return (edge.to.id == vertex.id) || (edge.from.id != vertex.id);
	},

	getEdgeOtherSide: function(edge, vertex) {
		return (edge.to.id != vertex.id) ? edge.to : edge.from;
	},

	/**
	 * Creates all elements representing the vertex in SeCo and binds click callbacks.
	 * 
	 * @param vertex the vertex
	 */
	createVertexDetail: function(vertex) {
		$('#excludedComponents').append('<div class="component vertex" id="component' + vertex.id + '" data-id="' + vertex.id + '"></div>');

		var componentElement = $('#component' + vertex.id);
		componentElement.append(SvgFactory.createVertexDetail(vertex));
		componentElement.append('<div class="control-buttons"></div>');
		
		var buttonsElement = componentElement.children('.control-buttons');
		buttonsElement.append('<div class="button buttonClassic" id="showIcons' + vertex.id +'">' + vertex.symbol[0] + '</div>');
		if (vertex.name !== 'NOT_FOUND') {
			buttonsElement.append('<div class="button buttonClassic" id="change' + vertex.id +'">'+
								  		'<img class="buttonImage" src="images/tochange/tochange-trans.gif" alt="change" title="Send component to change">'+
								  '</div>');
		}
		buttonsElement.append('<div class="button buttonClassic" id="remove' + vertex.id +'"><img src="images/button_cancel.png" alt="remove" title="remove"/></div>');
		
		// registration of event
		$('#showIcons' + vertex.id).click(this.showVertexIcons);
		$('#change' + vertex.id).click(OffScreenKiv.changeComponent);
		$('#postpone' + vertex.id).click(OffScreenKiv.postponeComponent);
		$('#remove' + vertex.id).click(function(e) {
			OffScreenKiv.showVertexInGraph(vertex.id);
		});

		configurationVertexDetailTooltip('#detailVertex' + vertex.id);

		// assigning actions to parts of detail
		$('#detailVertex' + vertex.id).click(ViewportManager.highlightClckdVertexSeCo);
		$('#provided' + vertex.id).click(ViewportManager.highlightProvGraphSeCo);
		$('#required' + vertex.id).click(ViewportManager.highlightReqGraphSeCo);
	},
	
	/**
	* Create detail of removed vertex from graph and registers all events.
	* Parameters: e - event
	*/
	showVertexInRightPanel: function(e) {
		if (e.which != 1) return;

		var id = findId(e.target);
		var vertex = GraphManager.graph.vertices[id - 1];
		vertex.symbol = OffScreenKiv.markSymbol.getMarkSymbol();
		
		// according to #1751
		this.detectAndSetUnconnectedInGraph(vertex);
		
		vertex.excluded = true;
		
		this.hideEdges(vertex);
		vertex.$selector.hide();
		
		this.addItemToContextMenu(vertex.symbol, vertex.id, vertex.name);

		this.createVertexDetail(vertex);

		$('#includeAllComponents').show();

		// Excludes from graph with the correct highlight color
		$('#detailVertex' + vertex.id).attr('class', vertex.$selector.attr('class'));
		
		// handle search highlight vertieces
		if (this.vertexSearchHighlighting[vertex.symbolicName] !== undefined) {
			var secoVertex = $('#detailVertex' + (vertex.id));
			secoVertex[0].classList.add('vertex--searched');
			
			this.vertexSearchHighlighting['detailVertex' + (vertex.id)] = secoVertex;
		}
	},
	
	/**
	* Display vertex and its edges in graph.
	*/
	showVertexInGraph: function(id) {
		var vertex  = GraphManager.graph.vertices[id - 1];
		
		vertex.$selector.show();
		
		for (var i = 0; i <  vertex.edges.length; i++){
			if (vertex.edges[i].to.id != vertex.id &&
				(vertex.edges[i].to.$selector[0].isVisible() ||
					($('#rightPanel #li'+vertex.edges[i].to.id).length == 1 && $('#rightPanel #li'+ vertex.edges[i].to.id).is(':visible') === false)
				)
			) {
				vertex.edges[i].$selector.show();
			}
			
			if (vertex.edges[i].from.id != vertex.id &&
				(vertex.edges[i].from.$selector[0].isVisible() ||
					($('#rightPanel #li'+vertex.edges[i].to.id).length == 1 && $('#rightPanel #li'+ vertex.edges[i].from.id).is(':visible') === false)
				)
			) {
				vertex.edges[i].$selector.show();
			}
		}
		
		$("#detailVertex" + vertex.id).qtip('destroy');
		for (var j = 0; j < vertex.edges.length; j++) {
			var targetVertex = this.getEdgeOtherSide(vertex.edges[j], vertex);
			var markId = 'mark' + vertex.symbol[0]+ vertex.symbol[1];

			if (targetVertex.gridMark.existMark(markId)) {
				targetVertex.gridMark.removeMark(markId);
			}
		}

		$('#component' + vertex.id).remove();
		$('#proposed' + vertex.id).remove();

		vertex.excluded = false;
		this.markSymbol.removeSymbol(vertex.symbol);
		var itemId = vertex.symbol[1].substring(1) + vertex.symbol[0];
		this.deleteItemFromContextMenu(itemId);

		this.hideIncludeAllComponentsButton();
		
		// check if opacity needs to be reset
		this.detectAndResetReconnectedInGraph(vertex);
	},

	/**
	 * Shows component and in the propose-change list in SeCo.
	 */
	changeComponent: function(e){
		if (e.which != 1) return;

		var id = findId(e.target);
		var vertex = GraphManager.graph.vertices[id - 1];
		vertex.symbol = OffScreenKiv.markSymbol.getMarkSymbol();
		
		$('#component' + vertex.id).remove();
		$('#rightPanel .to-change-components').append('<div class="component vertex" id="component' + vertex.id + '" data-id="' + vertex.id + '"></div>');

		var componentElement = $('#component' + vertex.id);
		componentElement.append(SvgFactory.createVertexDetail(vertex));
		componentElement.append('<div class="control-buttons"></div>');
		componentElement.append('<div class="compatibility-list">' + getTooltipEdge(vertex.id) + '</div>');
		
		var buttonsElement = componentElement.children('.control-buttons');
		if (vertex.name !== 'NOT_FOUND') {
			buttonsElement.append('<div class="button buttonClassic" id="postpone' + vertex.id +'">'+
								  		'<img class="buttonImage" src="images/tochange/postpone-trans.gif" alt="Postpone" title="Postpone component change">'+
								  '</div>');
		}
		buttonsElement.append('<div class="button buttonClassic" id="remove' + vertex.id +'"><img src="images/button_cancel.png" alt="remove" title="remove"/></div>');

		// registration of event
		$('#postpone' + vertex.id).click(function(e) {
			OffScreenKiv.postponeComponent(e);
		});
		$('#remove' + vertex.id).click(function(e) {
			OffScreenKiv.showVertexInGraph(vertex.id);
		});

		/*
		$('#rightPanel').append('<div class="component" id="proposed' + vertex.id + '">');

		$('#proposed' + vertex.id).append('<hr class="verticalSeparator clean"/>');
		$('#proposed' + vertex.id).append('<h5 class="text">Proposed</h5>');
		$('#proposed' + vertex.id).append(SvgFactory.createVertexDetail(vertex));

		$('#proposed' + vertex.id).append('<div id ="proposedCb' + vertex.id + '" class="controlButton">');
		//todo change to IMG
		$('#proposedCb' + vertex.id).append('<div class="button buttonClassic" id="ok' + vertex.id +'" disabled>\n\
			<img src="images/efp_qtip/OK.png" alt="confirm" title="confirm"/></div>');
		$('#proposedCb' + vertex.id).append('<div class="button buttonClassic" id="db' + vertex.id +'" disabled>\n\
			<img src="images/button_cancel.png" alt="remove" title="remove"/></div>');
		$('#proposed' + vertex.id).append('</div><br class="clean"/>');
		$('#proposed' + vertex.id).append('<hr class="verticalSeparator clean"/>');
		$('#rightPanel').append('</div>');
		*/

		setUpTooltipList(componentElement.find('#edgeTooltipListDiv' + (id - 1)));
	},

	/**
	 * Shows component and in the postponed list in SeCo.
	 */
	postponeComponent: function(e) {
		if (e.which != 1) return;

		var id = findId(e.target);
		var vertex = GraphManager.graph.vertices[id - 1];
		vertex.symbol = OffScreenKiv.markSymbol.getMarkSymbol();
		
		$('#component' + vertex.id).remove();
		$('#rightPanel .postponed-components').append('<div class="component vertex" id="component' + vertex.id + '" data-id="' + vertex.id + '"></div>');

		var componentElement = $('#component' + vertex.id);
		componentElement.append(SvgFactory.createVertexDetail(vertex));
		componentElement.append('<div class="control-buttons"></div>');
		
		var buttonsElement = componentElement.children('.control-buttons');
		if (vertex.name !== 'NOT_FOUND') {
			buttonsElement.append('<div class="button buttonClassic" id="change' + vertex.id +'">'+
								  		'<img class="buttonImage" src="images/tochange/tochange-trans.gif" alt="ToChange" title="Send component to change">'+
									'</div>');
		}
		buttonsElement.append('<div class="button buttonClassic" id="remove' + vertex.id +'"><img src="images/button_cancel.png" alt="remove" title="remove"/></div>');

		// registration of event
		$('#change' + vertex.id).click(function(e) {
			OffScreenKiv.changeComponent(e);
		});
		$('#remove' + vertex.id).click(function(e) {
			OffScreenKiv.showVertexInGraph(vertex.id);
		});
	},

	/**
	 * Send changes to crce
	 */
	proposeChanges: function(e) {
		var javaClasses = {
			boolean: 'java.lang.Boolean',
			string: 'java.lang.String',
			list: 'java.util.List',
			set: 'java.util.Set',
		};

		var crceClasses = {
			package: 'crce.api.java.package',
			class: 'crce.api.java.class',
			method: 'crce.api.java.method',
			property: 'crce.api.java.property',
		};

		var ns = '';	// http://relisa.kiv.zcu.cz
		var xsi = 'http://www.w3.org/2001/XMLSchema-instance';
		var xsd = 'crce.xsd';

		var xmlDocument;
		var xmlSerializer = new XMLSerializer();
		var requirementsCounter;

		var toChangeComponents = $('#toChangeComps > .vertex');
		var changedComponentsCounter = 0;

		if (toChangeComponents.length > 0) {
			changeComponent(toChangeComponents[changedComponentsCounter]);
		}

		function appendRequirementsTree(element, node) {
			var type = node.desc.type;

			if (typeof type === 'undefined') {
				node.subtree.forEach(function(node) {
					appendRequirementsTree(element, node);
				});

			} else {
				// add package for classes
				if (type === 'class') {
					var packageRequirementEl = xmlDocument.createElementNS(ns, 'requirement');
					packageRequirementEl.setAttribute('uuid', requirementsCounter++);
					packageRequirementEl.setAttribute('namespace', crceClasses['package']);

					var packageAttributeEl = xmlDocument.createElementNS(ns, 'attribute');
					packageAttributeEl.setAttribute('name', 'name');
					packageAttributeEl.setAttribute('type', javaClasses.string);
					packageAttributeEl.setAttribute('value', node.desc.details.package);

					packageRequirementEl.appendChild(packageAttributeEl);

					delete node.desc.details.package;
				}

				var requirementEl = xmlDocument.createElementNS(ns, 'requirement');
				requirementEl.setAttribute('uuid', requirementsCounter++);
				requirementEl.setAttribute('namespace', crceClasses[type]);

				// attributes
				var details = node.desc.details;
				for (var key in details) {
					if (!details.hasOwnProperty(key)) continue;

					var value = details[key];

					var attributeType;
					switch (typeof value) {
						case 'boolean':
							attributeType = javaClasses.boolean;
							break;
						case 'object':
							if (value.constructor.name === 'Array') {
								attributeType = javaClasses.list;
								break;
							}
						default:
							attributeType = javaClasses.string;
					}

					var attributeEl = xmlDocument.createElementNS(ns, 'attribute');
					attributeEl.setAttribute('name', key);
					attributeEl.setAttribute('type', attributeType);
					attributeEl.setAttribute('value', value);
		
					requirementEl.appendChild(attributeEl);
				}

				// children
				node.subtree.forEach(function(node) {
					appendRequirementsTree(requirementEl, node);
				});

				// add package for classes
				if (type === 'class') {
					packageRequirementEl.appendChild(requirementEl);
					element.appendChild(packageRequirementEl);
				} else {
					element.appendChild(requirementEl);
				}
			}
		}

		function changeComponent(component) {
			app.loader.enable();

			var id = findId(component);
			var vertex = GraphManager.graph.vertices[id - 1];

			// initialize requirements XML to be send to CRCE
			xmlDocument = document.implementation.createDocument(ns, 'requirements', null);
			//xmlDocument.documentElement.setAttributeNS(xsi, 'xsi:schemaLocation', ns + ' ' + xsd);

			requirementsCounter = 0;

			// construct functionality requirements tree
			vertex.edges.forEach(function(edge) {
				//var compatibilityInfo = JSON.parse(edge.compInfoJSON);

				// TODO: mocked compatibility info
				var compatibilityInfo = [
					{
						"details": {
							"abstract": false,
							"annotation": false,
							"final": false,
							"static": false,
							"name": "Dashboard",
							"package": "cz.zcu.kiv.osgi.demo.parking.dashboard",
							"enum": false,
							"interface": false
						},
						"causedBy": "cz.zcu.kiv.osgi.demo.parking.dashboard.DashboardActivator",
						"type": "class",
						"incomps": [
							{
								"subtree": [
									{
										"subtree": [],
										"desc": {
											"isIncompCause": false,
											"propertyName": "Fields",
											"contentCode": "cmp.child.fields",
											"level": 1,
											"name": "Fields"
										}
									}, {
										"subtree": [{
											"subtree": [],
											"desc": {
												"difference": "DEL",
												"isIncompCause": true,
												"propertyName": "Method",
												"contentCode": "cmp.child.method",
												"level": 2,
												"details": {
													"abstract": false,
													"final": false,
													"exceptions": [],
													"static": false,
													"synchronized": false,
													"name": "clear",
													"paramTypes": [],
													"returnType": "void",
													"constructor": false
												},
												"incompName": "<span class='entity'>M<\/span> void clear() is missing -> REFACTOR",
												"name": "M void clear()",
												"strategy": "REFACTOR",
												"type": "method"
											}
										}],
										"desc": {
											"isIncompCause": false,
											"propertyName": "Methods",
											"contentCode": "cmp.child.methods",
											"level": 1,
											"name": "Methods"
										}
									}, {
										"subtree": [],
										"desc": {
											"isIncompCause": false,
											"propertyName": "Constructors",
											"contentCode": "cmp.child.constructors",
											"level": 1,
											"name": "Constructors"
										}
									}
								],
								"desc": {
									"isIncompCause": false,
									"propertyName": "Class",
									"contentCode": "cmp.child.class",
									"level": 0,
									"details": {
										"name": "LaneStatistics",
										"abstract": false,
										"annotation": false,
										"final": false,
										"static": false,
										"package": "cz.zcu.kiv.osgi.demo.parking.lane.statistics",
										"enum": false,
										"interface": false
									},
									"name": "Class: cz.zcu.kiv.osgi.demo.parking.lane.statistics.ILaneStatistics",
									"type": "class"
								}
							}
						]
					}
				];

				compatibilityInfo.forEach(function(component) {
					component.incomps.forEach(function(node) {
						appendRequirementsTree(xmlDocument.documentElement, node);
					});
				});
			});

			// get components related to the one being changed
			var relatedJars = [];

			vertex.edges.forEach(function(edge) {
				// store related jars
				relatedJars.push(edge.from.name);
				relatedJars.push(edge.to.name);
			});

			relatedJars = relatedJars.filter(function(jarName) {
				return jarName !== 'NOT_FOUND' && jarName !== vertex.name;
			});

			// trigger change
			$.ajax({
				type: 'POST',	// jQuery docs tells to use "method" but it doesn't work and always sends GET -> use "type" instead
				url: 'http://localhost:8081/rest/v2/metadata/catalogue/',
				data: xmlSerializer.serializeToString(xmlDocument),
				contentType: 'application/xml',
				timeout: 180 * 1000,	// in milliseconds
			}).then(function(data, textStatus, jqXHR) {
				app.loader.disable();

				var proposals = [];

				var resources = data.childNodes[0];
				resources.childNodes.forEach(function(resource) {
					var proposal = {
						crceUuid: resource.getAttribute('uuid'),
					};

					var capability = resource.childNodes[0];
					capability.childNodes.forEach(function(attribute) {
						if (['name', 'version'].includes(attribute.getAttribute('name'))) {
							proposal[attribute.getAttribute('name')] = attribute.getAttribute('value');
						}
					});

					proposals.push(proposal);
				});

				$(component).prepend('<h5>Current change</h5>');
				$(component).addClass('active');

				var proposedList = $('<ul id="proposed"></ul>');
				$(component).append(proposedList);

				for (var i = 0; i < proposals.length; i++) {
					proposal = proposals[i];

					var maven = proposal.name.split('.');
					proposedList.append('<li><span class="download-component-link" data-uuid="' + proposal.crceUuid + '">' + proposal.name + ' ' + proposal.version + '</span><a href="https://mvnrepository.com/artifact/' + maven[0] + '/' + maven[1] + '/' + proposal.version + '" target="_blank">Maven</a></li>');
				}

				$('.download-component-link').click(function(e) {
					app.loader.enable();

					var uuid = $(this).data('uuid');

					return $.ajax({
						type: 'POST',
						url: 'api/download-component?uuid=' + encodeURIComponent(uuid),
						timeout: 180 * 1000,	// in milliseconds
					}).done(function(data, textStatus, jqXHR) {
						relatedJars.push(data.jarName);

						return $.ajax({
							type: 'GET',
							url: 'graph-data?jarNames=' + encodeURIComponent(relatedJars.join(',')),
							timeout: 180 * 1000,	// in milliseconds
						}).done(function(data, textStatus, jqXHR) {
							GraphManager.graph = data;

							GraphManager.buildGraph();
							ViewportManager.revive();
						});	
					});
				});

			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.info('Server failed:');
				console.log(errorThrown);
			});
		}
	},
	
	/**
	* Hides vertex edges
	* @param vertex 	vertex whose edges will be hidden
	*/
	hideEdges: function(vertex){
		for (var i = 0; i < vertex.edges.length; i++) {
			vertex.edges[i].$selector.hide();
		}

		$('[data-from-id='+ vertex.id +']').each(function(){
			$(this).hide();
		});
	},
	
	/**
	* Adds item to context menu.
	* Parameters: symbol - symbol which will be in context menu.
	*             vertexId - id of vertex which is linked with item of context menu.
	*/
	addItemToContextMenu: function(symbol, vertexId, vertexName){
		var color = symbol[1].substring(1);
		var itemId = color + symbol[0];
		$('#myMenu').append('<li id="' + itemId + '"  data-vertexId="' + vertexId + '"><a href="#' + itemId +
		'" class="component_color"><img class="imgContextMenu" src="images/'+color +'.png" alt="'+color+'"/>' + symbol[0] +
		'</a><a class="cont_menu_group" href="#" onclick="OffScreenKiv.showDescription(\''+itemId+'\'); return false;">[+]</a><span class="contextMenuDescription" id="contMenu_'+vertexId+'" style="display:none">' + vertexName + '</span>'+
		'<span class="cleaner"></span></li>');
		
		// $('#myMenu li#'+itemId+' .cont_menu_group').unbind('mousedown').unbind('mouseup');
		
	},

	showDescription: function (itemId) {
		if ($('#myMenu li#'+itemId+' .contextMenuDescription:hidden').length) {
			$('#myMenu li#'+itemId+' .contextMenuDescription').show();
			$('#myMenu li#'+itemId+' a.cont_menu_group').text('[-]');
		} else {
			$('#myMenu li#'+itemId+' .contextMenuDescription').hide();
			$('#myMenu li#'+itemId+' a.cont_menu_group').text('[+]');
		}
		
		// set css height of li#idGroup by count li elements
		/*
		var count_in_li = $('#myMenu li#' + itemId + ' .contextMenuDescription').length;
		$('#myMenu li#' + itemId).css('height', (22 + (count_in_li * 16)) + 'px'); */
		
		var count_in_li = $('#myMenu li#' + itemId + ' .contextMenuDescription:not(:hidden)').length;
		$('#myMenu li#' + itemId).css('height', (22 + (count_in_li * 16)) + 'px');
		$('#myMenu li#' + itemId).show();
	},

	/**
	* Delete item from context menu.
	* Parameters: groupID - id item from context menu which will be deleted.
	*/
	deleteItemFromContextMenu: function(groupID){
		$('#' + groupID).remove();
	},
	
	/**
	* Check and set highlighting when grouping vertices.
	* @param vertex
	*/
	checkHighlightingAtGrouping: function(vertex){
		var $groupedVertex = $('#li' + (vertex.id));
		if ($("#vertex" + (vertex.id) + "[class~='colorHighProvB']").length) {
			$groupedVertex.attr('style', 'background-color: #5896FF');
		}
		
		if ($("#vertex" + (vertex.id) + "[class~='colorHighReqR']").length) {
			$groupedVertex.attr('style', 'background-color: red');
		}
	},
	
	/**
	* Adds vertex to group.
	* Parameters: action - id of element from context menu
	*             element - id vertex element
	*/
	addVertexToGroup: function(action, element) {
		var id = element.data('id');
		var idGroup = action;

		var vertex = GraphManager.graph.vertices[id - 1];
		vertex.$selector.hide();

		this.hideEdges(vertex);
		
		// detect if removing the vertex causes some unconnection(s)
		this.detectAndSetUnconnectedInGraph(vertex);
		
		var group = null;
		var defaultVertex = GraphManager.graph.vertices[$("#" + idGroup).attr('data-vertexId')-1];
		defaultVertex.excluded = true;
		vertex.symbol = defaultVertex.symbol;
		var color = defaultVertex.symbol[1];
		var isSetClassOnButton = $('#b' + defaultVertex.id).hasClass('c' + color.substring(1, color.length));
		
		if (!this.groupManager.existGroup(idGroup)) {
			$('#component' + defaultVertex.id).remove();
			group = new Group(defaultVertex.symbol, idGroup);
			group.addToGroup(defaultVertex.id, defaultVertex);
			group.addProvidedPackage(defaultVertex.exportedPackages);
			group.addRequiredPackage(defaultVertex.importedPackages);
			group.addProvidedPackage(vertex.exportedPackages);
			group.addRequiredPackage(vertex.importedPackages);
			this.createGroup(group, defaultVertex, vertex);
			this.groupManager.addGroupToList(idGroup, group);
			
		} else {
			group = this.groupManager.getGroup(idGroup);
			group.addProvidedPackage(vertex.exportedPackages);
			group.addRequiredPackage(vertex.importedPackages);
			$('#ul' + idGroup).append('<li id="li' + vertex.id + '"><p data-vertexId="' + vertex.id + '" data-title="' + vertex.name + '">' + vertex.name + '</p><img class="deleteItemGroup" id="li_del_' + vertex.id  + '" alt="delete" src="images/button_cancel.png"/></li>');
			configurationVertexDetailTooltip('#li' + vertex.id + " p");
			
			// add highlighting possiblity
			$('#li' + vertex.id + ' p').click(ViewportManager.highlightClckdVertexGroupSeCo);
			
			// highlight the newly added vertex if already highlight in move area
			this.checkHighlightingAtGrouping(vertex);
			
			// highlight the newly added vertex if searched
			if (this.vertexSearchHighlighting[vertex.symbolicName] !== undefined) {
				this.highlightSearchedVertexInGroup(vertex);
			}
		}		

		var is_in_group = false;
		$.each(group.items.getAll(), function(index, value) {
			if ( value.id  == vertex.id) {
				is_in_group = true;
			}
		});
		
		
		if (is_in_group === false) {
			var style_display = ' style="display:none" ';
			if ( $('#myMenu li#' + idGroup + ' .contextMenuDescription:not(:hidden)').length ) {
				$('#myMenu li#' + idGroup + ' .contextMenuDescription:last').after('<span class="contextMenuDescription b" id="contMenu_'+vertex.id+'" >'+vertex.name+'</span>');
			}else{
				$('#myMenu li#' + idGroup + ' .contextMenuDescription:last').after('<span class="contextMenuDescription b" id="contMenu_'+vertex.id+'" '+style_display+'>'+vertex.name+'</span>');
			}
			
		}
		
		//set css height of li#idGroup by count li elements
		var count_in_li = $('#myMenu li#' + idGroup + ' .contextMenuDescription:not(:hidden)').length;
		$('#myMenu li#' + idGroup).css('height', (22 + (count_in_li * 16)) + 'px');
		
		vertex.excluded = true;
		group.addToGroup(vertex.id, vertex);
		
		
		
		$('.deleteItemGroup').unbind('click',this.deleteItemFromGroupEvent);
		$('.deleteItemGroup').click(this.deleteItemFromGroupEvent);
		
		if (group.getGroupItemsLength() > 2) {
			this.editHeightOfGroup(group);
		}
		this.updateCountOfProvidedAndRequired(group);
		var buttonGroupId = $("#b" + idGroup);
		
		if (isSetClassOnButton) {
			this.showIcons(vertex);
			buttonGroupId.attr('class', 'button c'+idGroup.substring(0,idGroup.length-1));
			buttonGroupId.unbind('click');
			buttonGroupId.click(this.hideIconsAllItemGroup);
		}
		
		if ($("#b" + idGroup).hasClass("c"+idGroup.substring(0,idGroup.length-1))) {
			this.showIcons(vertex);
		}
		
		$('#gr' + group.idGroup).click(this.groupHighlightRequiredAndProvided);
		$('#provided' + group.idGroup).click(this.groupHighlightProvided);
		$('#required' + group.idGroup).click(this.groupHighlightRequired);
		
		$(".contextMenu").hide();
		// $(".contextMenuDescription").hide();
		
		// kontrola, zda je skupina komponent zobrazena v grafu
		//  -> pokud ano zobrazit hrany vedouci z komponenty, ktera byla pridana do grafu
		
		if ($('g#gv_'+group.idGroup).length > 0) {
			//show all edges removed vertex from group.
			//TODO: nastavit správnou pozici komponenty
			
			for (var i = 0; i <  vertex.edges.length; i++) {
				if (vertex.edges[i].to.id != vertex.id && (
						vertex.edges[i].to.$selector[0].isVisible() ||
						($('#rightPanel #li'+vertex.edges[i].to.id).length == 1 && $('#rightPanel #li'+vertex.edges[i].to.id).is(':visible') === false)
					)
				){
					vertex.edges[i].$selector.show();
				}
				
				if (vertex.edges[i].from.id != vertex.id && (
						vertex.edges[i].from.$selector[0].isVisible() ||
						($('#rightPanel #li'+vertex.edges[i].to.id).length == 1 && $('#rightPanel #li'+vertex.edges[i].from.id).is(':visible') === false)
					)
				) {
					vertex.edges[i].$selector.show();
				}

				vertex.edges[i].to.$selector.attr('class','node vertex colorNormal');
				vertex.edges[i].from.$selector.attr('class','node vertex colorNormal');
			}
			
			var coords  = getCoordinates($('#gv_'+ idGroup )[0].getAttribute('transform'));
			posX = coords.x;
			posY = coords.y;
			
			posX_reset = posX;
			
			//nastavení pozice prvků
			id_vert =vertex.id;
			
			
			var newX;
			var newY;
			
			var lollipop;
			posX = posX_reset;
			posX = parseFloat(posX);
			
			//posun pozice, aby byla komponenta vycentrovana
			hidden_component_width = $('g#vertex' + id_vert + ' rect').attr('width');
			
			if (group.decompose) {
				$('#gv_'+ idGroup).children(' rect').attr('height',group.items.size() * 34 + 55);
				posY = parseFloat(posY) + group.items.size() * 26 +34;
				
				$item = $('g#vertex' + id_vert);
				
				moveElementTopSVG("graph", 'vertex' + id_vert);
				$item.show();
			} else {
				posY = parseFloat(posY);
			}
			
			//vystredeni na stred
			posX = posX  - (hidden_component_width/2) + 40;
			
			group.items.get(id_vert).x = posX;
			group.items.get(id_vert).y = posY ;
			
			
			$item.attr('transform', 'translate('+ posX +', '+ posY +')');
			$item.trigger('click', {
				move_edges: true,
			});
			
			for (var i = 0; i< group.items.get(id_vert).edges.length; i++) {
				var edge = group.items.get(id_vert).edges[i];
				var sizeOfRectFrom = getSizeOfRectangle(edge.from.name);
				var sizeOfRectTo = getSizeOfRectangle(edge.to.name);

				if (edge.from.id == id_vert) {
					newX = group.items.get(id_vert).edges[i].to.x + sizeOfRectTo/2;
					newY = group.items.get(id_vert).edges[i].to.y + 13;
					lollipop = getLollipopPosition(posX + sizeOfRectFrom/2, posY +13 , newX, newY);
					
					edge.$selector.children("line").attr('x1', posX + sizeOfRectFrom/2);
					edge.$selector.children("line").attr('y1', posY + 13);
					edge.$selector.children("g").attr('transform', 'rotate(' + lollipop.angle + ',' + lollipop.x + ',' + lollipop.y  + ') translate('+ lollipop.x + ',' + lollipop.y  + ')');
					
					ViewportManager.preventTickRotation(edge, lollipop);
					ViewportManager.preventCrossRotation(edge, lollipop);
					
					//hrana k vrcholu se zobrazi pouze pokud je vrchol zobrazen
					if ($('#vertex'+ edge.to.id )[0].isVisible() ||
						($('#rightPanel li#li'+edge.to.id).is(':visible') === false && $('#rightPanel li#li'+edge.to.id).length > 0)
					) {
						edge.$selector.show();
					}

				} else {
					newX = group.items.get(id_vert).edges[i].from.x + sizeOfRectFrom/2;
					newY = group.items.get(id_vert).edges[i].from.y + 13;
					lollipop = getLollipopPosition(newX, newY, posX + sizeOfRectTo/2, posY + 13);
					
					edge.$selector.children("line").attr('x2', posX + sizeOfRectTo/2);
					edge.$selector.children("line").attr('y2', posY + 13);
					edge.$selector.children("g").attr('transform', 'rotate(' + lollipop.angle + ',' + lollipop.x + ',' + lollipop.y  + ') translate('+ lollipop.x + ',' + lollipop.y  + ')');
					
					ViewportManager.preventTickRotation(edge, lollipop);
					ViewportManager.preventCrossRotation(edge, lollipop);
					
					//hrana k vrcholu se zobrazi pouze pokud je vrchol zobrazen
					if ($('#vertex'+ edge.from.id )[0].isVisible() ||
						($('#rightPanel #li'+edge.from.id).is(':visible') === false && $('#rightPanel li#li'+edge.from.id).length > 0)
					) {
						edge.$selector.show();
					}
				}
			}
		}
	},
	
	/**
	* Event, which ensures deleting of vertex from group and modified all highlighting.
	*/
	deleteItemFromGroupEvent: function(e){
		var liItem = e.target.parentElement;
		var groupIdUl = liItem.parentElement.id;
		var itemId = liItem.id;
		$("#" + itemId + " p").qtip('destroy');
		$('#' + itemId).remove();
		var vertex = GraphManager.graph.vertices[(getIndexFromId(itemId, 2)-1)];
		
		var groupId = $('#' + groupIdUl).attr('data-groupId');
		var group = this.groupManager.getGroup(groupId);
		
		if ($("#b" + groupId).hasClass("c"+groupId.substring(0,groupId.length-1))) {
			for (var key in group.items.getAll()) {
				this.hideIconEvent(group.items.get(key));
			}
		}
		
		
		$('#myMenu li#' + groupId + ' #contMenu_'+vertex.id).remove();
		//set css height of li#idGroup by count li elements
		var count_in_li = $('#myMenu li#' + groupId + ' .contextMenuDescription:not(:hidden)').length;
		$('#myMenu li#' + groupId).css('height', (22 + (count_in_li * 16)) + 'px');
		
		vertex.excluded = false;
		var lengthGroup = group.items.size();
		group.removeFromGroup(vertex.id);
		if ($("#b" + groupId).hasClass("c"+groupId.substring(0,groupId.length-1))) {
			for (var key1 in group.items.getAll()) {
				this.showIcons(group.items.get(key1));
				
			}
		}
		lengthGroup = group.items.size();
		group.deleteProvidedPackage(vertex.exportedPackages);
		group.deleteRequiredPackage(vertex.importedPackages);
		this.updateCountOfProvidedAndRequired(group);
		
		if (lengthGroup >= 2) { 
			this.editHeightOfGroup(group);
		}
		
		//if length of group is 0, removed all html and svg elements linked with given group.
		if (lengthGroup <= 0) {
			$('#group' + groupId).remove();
			this.groupManager.removeGroupFromList(groupId);
			this.deleteItemFromContextMenu(groupId);
			this.markSymbol.removeSymbol([groupId.substring(groupId.length-1),("#"+groupId.substring(0, groupId.length-1))]);
		}
		
		vertex.$selector.show();
		
		//show all edges removed vertex from group.
		for (var i = 0; i <  vertex.edges.length; i++) {
			if (vertex.edges[i].to.id != vertex.id && vertex.edges[i].to.$selector[0].isVisible()) {
				vertex.edges[i].$selector.show();
			}
			if (vertex.edges[i].from.id != vertex.id && vertex.edges[i].from.$selector[0].isVisible()) {
				vertex.edges[i].$selector.show();
			}
			/*
			vertex.edges[i].to.$selector.attr('class','node vertex colorNormal');
			vertex.edges[i].from.$selector.attr('class','node vertex colorNormal');
			*/
		}

		this.hideIncludeAllComponentsButton();
		
		// check if opacity needs to be reset
		this.detectAndResetReconnectedInGraph(vertex);
	},
	
	/**
	 * Creates all elements representing the group in SeCo and binds click callbacks.
	 * 
	 * @param group the group
	 * @param symbol the symbol of the group
	 */
	createGroupDetail: function(group, symbol) {
		$('#rightPanel').append('<div class="component group_vertices" id="group' + group.idGroup + '" data-id="' + group.idGroup + '"></div>');

		var componentElement = $('#group' + group.idGroup);
		componentElement.append('<div class="group-label"><strong>G: </strong><span id="label' + group.idGroup + '">Group</span></div>');
		componentElement.append(SvgFactory.createGroupDetail(group));
		componentElement.append('<ul data-groupID="' + group.idGroup + '" id="ul' + group.idGroup + '"></ul>');
		componentElement.append('<div class="control-buttons"></div>');
		
		var buttonsElement = componentElement.children('.control-buttons');
		buttonsElement.append('<div class="button buttonClassic" id="showIcons' + group.idGroup +'">' + symbol[0] + '</div>');
		
		// set click handler for group renaming
		$('#label' + group.idGroup).click(function() {
			$('#dialog').data('group', group)
				.data('groupLabel', $('#label' + group.idGroup))
				.data('isSvgElement', false)
				.dialog('open');
		});

		// set click handler for showing group items
		$('#showIcons' + group.idGroup).click(this.showGroupIcons);
	},
	
	/**
	* Creates all elements which represent given group and adds passed vertices to the group.
	* Parameters: group - group
	*             defaultVertex - first vertex which will be added to the group
	*             vertex - second vertex
	*/
	createGroup: function(group, defaultVertex, vertex) {
		this.createGroupDetail(group, defaultVertex.symbol);

		$('#ul' + group.idGroup).append('<li id="li' + defaultVertex.id + '"><p  data-vertexId="' + defaultVertex.id + '" data-title="' + defaultVertex.name + '">' + defaultVertex.name + '</p><img class="deleteItemGroup" id="li_del_' + defaultVertex.id  + '" alt="delete" src="images/button_cancel.png"/></li>');
		$('#ul' + group.idGroup).append('<li id="li' + vertex.id + '"><p data-vertexId="' + vertex.id + '" data-title="' + vertex.name + '">' + vertex.name + '</p><img class="deleteItemGroup" id="li_del_' + vertex.id  + '" alt="delete" src="images/button_cancel.png"/></li>');

		configurationVertexDetailTooltip('#li' + defaultVertex.id + " p");
		configurationVertexDetailTooltip('#li' + vertex.id + " p");
		
		// add highlight
		$('#li' + defaultVertex.id + ' p').click(ViewportManager.highlightClckdVertexGroupSeCo);
		$('#li' + vertex.id + ' p').click(ViewportManager.highlightClckdVertexGroupSeCo);
		
		// highlight the newly added vertices if already highlight in the move area
		this.checkHighlightingAtGrouping(vertex);
		this.checkHighlightingAtGrouping(defaultVertex);
		
		// highlight the default vertex if searched
		if (this.vertexSearchHighlighting[defaultVertex.symbolicName] !== undefined) {
			this.highlightSearchedVertexInGroup(defaultVertex);
		}
		
		// highlight the newly added vertex if searched
		if (this.vertexSearchHighlighting[vertex.symbolicName] !== undefined) {
			this.highlightSearchedVertexInGroup(vertex);
		}
	},

	/**
	 * Zobrazeni skupiny komponent v pravem sloupci.
	 */
	showGroupInRightPanel: function(group_name){
		// remove possible transformations
		$('#required' + group_name).removeAttr('transform');
		$('#provided' + group_name).removeAttr('transform');

		// hide decomposed-spreat vertices
		$('ul[data-groupid=' + group_name + '] li').each(function() {
			id_vert = $(this).find('p').attr('data-vertexid');

			$('g#vertex' + id_vert).hide();
		});

		// set proper label
		var selected_group = this.groupManager.getGroup(group_name);
		$('#rightPanel #group' + group_name + ' #label' + group_name).html(selected_group.label);

		$('#rightPanel #group'+group_name).show();

		//odstraneni skupiny komponent
		$('#graph #gv_'+group_name).remove();

		//skryti
		group2 = this.groupManager.getGroup(group_name);

		$('ul[data-groupid=' + group_name + '] li').each(function() {
			id_vert = $(this).find('p').attr('data-vertexid');

			for(var i = 0; i< group2.items.get(id_vert).edges.length; i++){
				var edge = group2.items.get(id_vert).edges[i];

				if(edge.from.id == id_vert){
					edge.$selector.hide();
				} else {
					edge.$selector.hide();
				}
			}
		});

		// check if opacity needs to be set to unconnected - for vertices grouped in the group
		var vertexList = selected_group.items.getAll();

		// iterate through the object filled with vertices
		$.each(vertexList, function(key, value){
			// vertex is not excluded anymore
			value.excluded = true;

			OffScreenKiv.detectAndSetUnconnectedInGraph(value);
		});

		$('#includeAllComponents').show();
	},
	
	/**
	 * Called when group's left arrow icon is clicked in SeCo to display the group in the diagram area.
	 * 
	 * @param  idGroup	identifier of a group
	 */
	showGroupInGraph: function(idGroup){
		var graph = $('#graph')[0];
		
		var group = this.groupManager.getGroup(idGroup);
		var svg = SvgFactory.createGroup(group);
		
		// add to the main graph svg
		graph.appendChild(svg);

		// drag only by rectangle or the symbol
		var groupElement = $('#gv_' + idGroup + ' > rect, #symbol' + idGroup + ', #labelTextElement' + idGroup);
		groupElement.mousedown(group.idGroup, ViewportManager.groupVertexMousedownHandler);
		groupElement.mouseup(ViewportManager.viewportEndDraggingHandler);
		
		// bind lollipop highlighting
		$('#provided' + idGroup).click(OffScreenKiv.groupHighlightProvided);
		$('#required' + idGroup).click(OffScreenKiv.groupHighlightRequired);

		// bind label change that doesn't click if dragged
		var flag;
		$('#labelTextElement' + idGroup + ', #symbol' + idGroup).mousedown(function(){
			flag = 0;
		});
		$('#labelTextElement' + idGroup + ', #symbol' + idGroup).mousemove(function(){
			flag = 1;
		});
		$('#labelTextElement' + idGroup + ', #symbol' + idGroup).mouseup(function(){
			if (flag == 0) {
				$('#dialog').data('group', group)
				.data('groupLabel', $('#label' + group.idGroup))
				.data('isSvgElement', true)
				.dialog('open');
			}
		});

		this.moveElementAfter(svg, group.idGroup);
		
		// update the numbers in lollis
		this.updateCountOfProvidedAndRequired(group);
		
		// check if opacity needs to be reset - for vertices grouped in the group
		var vertexList = group.items.getAll();
		
		// iterate through the object filled with vertices
		$.each(vertexList, function(key, value){
			// vertex has became excluded from the diagram area
			value.excluded = false;
			
			OffScreenKiv.detectAndResetReconnectedInGraph(value);
		});
	},
	
	/**
	 * Moves group element in DOM after it is created to have right z-index.
	 */
	moveElementAfter: function(group_elm, group_name){
		var coords = getCoordinates(group_elm.getAttribute('transform'));
		posX = coords.x;
		posY = coords.y;
		
		posX_reset = posX;
		
		group2 = this.groupManager.getGroup(group_name);
		group2.x = posX;
		group2.y = posY;

		id_vert = 0;
		
		$('ul[data-groupid=' + group_name + '] li').each(function() {
			id_vert = $(this).find('p').attr('data-vertexid');
			
			var newX;
			var newY;
			
			var lollipop;
			posX = posX_reset;
			posX = parseFloat(posX);
			posY = parseFloat(posY);
			
			//posun pozice, aby byla komponenta vycentrovana
			hidden_component_width = $('g#vertex' + id_vert + ' rect').attr('width');
			
			//vystredeni na stred
			posX = posX  - (hidden_component_width/2) + 40;
			
			group2.items.get(id_vert).x = posX;
			group2.items.get(id_vert).y = posY;

			$vertexentTarget = $('g#vertex' + id_vert);
			$vertexentTarget.attr('transform', 'translate('+posX+','+posY+')');
			$vertexentTarget.trigger('click',{move_edges:true});
			
			for(var i = 0; i< group2.items.get(id_vert).edges.length; i++){
				var edge = group2.items.get(id_vert).edges[i];
				var sizeOfRectFrom = getSizeOfRectangle(edge.from.name);
				var sizeOfRectTo = getSizeOfRectangle(edge.to.name);
				
				if (edge.from.id == id_vert) {
					newX = group2.items.get(id_vert).edges[i].to.x + sizeOfRectTo/2;
					newY = group2.items.get(id_vert).edges[i].to.y + 13;
					lollipop = getLollipopPosition(posX + sizeOfRectFrom/2, posY +13 , newX, newY);
					
					edge.$selector.children("line").attr('x1', posX + sizeOfRectFrom/2);
					edge.$selector.children("line").attr('y1', posY + 13);
					edge.$selector.children("g").attr('transform', 'rotate(' + lollipop.angle + ',' + lollipop.x + ',' + lollipop.y  + ') translate('+ lollipop.x + ',' + lollipop.y  + ')');
					
					ViewportManager.preventTickRotation(edge, lollipop);
					ViewportManager.preventCrossRotation(edge, lollipop);
					
					//hrana k vrcholu se zobrazi pouze pokud je vrchol zobrazen
					if ($('#vertex'+ edge.to.id)[0].isVisible() ||
						($('#rightPanel li#li'+edge.to.id).is(':visible') === false && $('#rightPanel li#li'+edge.to.id).length > 0)
					) {
						edge.$selector.show();
					}
					
				} else {
					newX = group2.items.get(id_vert).edges[i].from.x + sizeOfRectFrom/2;
					newY = group2.items.get(id_vert).edges[i].from.y + 13;
					lollipop = getLollipopPosition(newX, newY, posX + sizeOfRectTo/2, posY + 13);
					
					edge.$selector.children("line").attr('x2', posX + sizeOfRectTo/2);
					edge.$selector.children("line").attr('y2', posY + 13);
					edge.$selector.children("g").attr('transform', 'rotate(' + lollipop.angle + ',' + lollipop.x + ',' + lollipop.y  + ') translate('+ lollipop.x + ',' + lollipop.y  + ')');
					
					ViewportManager.preventTickRotation(edge, lollipop);
					ViewportManager.preventCrossRotation(edge, lollipop);
					
					//hrana k vrcholu se zobrazi pouze pokud je vrchol zobrazen
					if ($('g#vertex'+ edge.from.id)[0].isVisible() || 
						($('#rightPanel #li'+edge.from.id).is(':visible') === false && $('#rightPanel li#li'+edge.from.id).length > 0)
					) {
						edge.$selector.show();
					}
				}
			}
			
			
			//skryti komponenty
			$vertexentTarget.hide();
		});
		
		$('#rightPanel div#group' + group_name).hide();
		
		// set it as decomposed initially
		group2.decompose = false;
	},

	/**
	 * Displays a group of components as a detached viewport in the diagram area.
	 *
	 * @param  idGroup 		ID of the group
	 */
	showGroupInViewport: function(idGroup) {
		$('#gv_'+ idGroup).remove();

		var groupViewport = $('#groupViewport_'+ idGroup);

		if (groupViewport.length !== 0) {
			groupViewport.show();
			return;
		}

		var group = this.groupManager.getGroup(idGroup);
		group.decompose = true;

		// positions
		var coords = {
			x: stringToFloat(group.x),
			y: stringToFloat(group.y) + 5,
		};

		var width = 600;
		var height = 300;

		// move other nodes to make space for viewport
		var boundaries = {
			top: coords.y,
			bottom: coords.y + height,
			left: coords.x,
			right: coords.x + width,
		};

		ViewportManager.moveNodes(boundaries);

		// add to the main graph svg
		$('#graph .edges').after(SvgFactory.createGroupViewport(group, coords));

	
		 // bind drag
		 var viewportElement = $('#graph #groupViewport_' + idGroup + ' .handle');
		 viewportElement.mousedown(idGroup, ViewportManager.viewportMousedownHandler);
		 viewportElement.mouseup(ViewportManager.viewportEndDraggingHandler);
		 

		// bind label change
		$('#labelTextElement' + idGroup).click(function(){
			$('#dialog').data('group', group)
				.data('groupLabel', $('#label' + group.idGroup))
				.data('isSvgElement', true)
				.dialog('open');
		});


		// remove edges
		$('ul[data-groupid=' + idGroup + '] li').each(function() {
			vertexId = $(this).find('p').attr('data-vertexid');
			for (var i = 0; i < group.items.get(vertexId).edges.length; i++) {
				var edge = group.items.get(vertexId).edges[i];

				if (edge.from.id == vertexId) {
					edge.$selector.hide();
				} else {
					edge.$selector.hide();
				}
			}
		});

		// iterate through the object filled with vertices
		$.each(group.items.getAll(), function(key, value){
			// vertex is not excluded anymore
			value.excluded = true;

			OffScreenKiv.detectAndSetUnconnectedInGraph(value);
		});
	},

	/**
	 *  Nifty little snippet to parse the transform attribute into usable a format
	 *  @param transformString		Value of the transform attribute
	 */
	
	parseTransform: function(transformString)
	{
		
		var b={};
		for (var i in transformString = String(transformString).match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?)+\))+/g))
		{
			var c = String(transformString[i]).match(/[\w\.\-]+/g);
			b[c.shift()] = c;
		}
		return b;
		
	},

	/**
	 * Hides the detached viewport of a group displayed in graph and displays it as a simple group node instead.
	 * @param  idGroup 		ID of the group
	 */
	hideGroupViewport: function(idGroup) {
		//$('#gv_'+ idGroup).show();
		
		var group = this.groupManager.getGroup(idGroup);

		var viewportTransform = $('#groupViewport_' + idGroup + ' > .viewportTransform');
		var coords  = getCoordinates(viewportTransform[0].getAttribute('transform'));

		group.x = coords.x;
		group.y = coords.y - 5;

		this.showGroupInGraph(idGroup);

		var groupViewport = $('#groupViewport_'+ idGroup);	
		if (groupViewport.length) {
			groupViewport.remove();
			$('.edge-viewport-out').remove();
			return;
		}
	},

	/**
	 * Odstraneni vsech komponent ze skupiny
	 * @param idGroup 	ID of the group
	 */
	removeAllComponentFromGroup: function(idGroup){
		//show group of components in graph
		$('#rightPanel #group'+ idGroup +' .deleteItemGroup').each(function() {
			$(this).trigger('click');
		});

		var group = $('#gv_'+ idGroup);
		if (group.length) {
			group.remove();
		}

		var viewport = $('#groupViewport_'+ idGroup);
		if (viewport.length) {
			viewport.remove();
			$('.edge-viewport-out').remove();
			return;
		}
	},

	/**
	 * Count height of group in dependency of count of item in group.
	 * Parameters: group - group
	 */
	countHeightOfGroup: function(group){
		var heightOneItem = 17;
		var height = heightOneItem*group.getGroupItemsLength();
		return height;
	},

	/**
	 * Edit height of group in dependency of count of item in group.
	 * Parameters: group - group
	 */
	editHeightOfGroup: function(group){
		var height = this.countHeightOfGroup(group);
		var svg_new_height = height;
		var new_height = height;
		if ( svg_new_height < 60 ) {
			svg_new_height = 70;
			new_height = 56;
		} else {
			svg_new_height += 18;
		}
		$("#svgGroup" + group.idGroup).attr('height', svg_new_height);
		$("#gr" + group.idGroup).children('rect').attr('height', new_height);
	},

	/**
	 * Update count of provided end required packages.
	 */
	updateCountOfProvidedAndRequired: function(group){
		var dependence = null;
		var provided = 0, required = 0;

		if(!GraphManager.isEfpGraph){ // legacy method
			provided = group.providedPackage.size();
			required = group.requiredPackage.size();
		} else { // count real dependancies for EFP graphs
			dependence = this.countDependenceGroup(group.idGroup);

			provided = dependence.countFrom;
			required = dependence.countTo;
		}

		$("#provided" + group.idGroup).children('text').text(provided);
		$("#required" + group.idGroup).children('text').text(required);
	},

	/*
	* Cancels highlighting of provided neighbours of given vertex.
	* Parameters: vertex - vertex
	*             id - id of element on which was be clicked
	*/
	disHighlightProvided: function(parentId, vertex){
		for (var i = 0; i < vertex.edges.length; i++) {
			var edgeId = vertex.edges[i].to.id;
			
			$('#detailVertex' + (edgeId)).attr('class', 'detail colorNormal');
		}
		
		$('#' + parentId).attr('class', 'whiteColor');
		for (var k = 0; k < vertex.edges.length; k++) {
			vertex.edges[k].to.$selector.attr('class', 'node vertex colorNormal');
		}
	},
	
	
	/**
	* Highlights of provided neighbour of given vertex.
	* Parameters: vertex - vertex
	*             id - id of element on which was be clicked
	*/
	highlightProvided:function(parentId, vertex){
		var idd = getIndexFromId(parentId, 8) - 1;
		
		for (var i = 0; i < vertex.edges.length; i++) {
			var edgeId = vertex.edges[i].to.id;
			
			$('#detailVertex' + (edgeId)).attr('class', 'detail colorHighlightProvided');
			$('#detailVertex' + (idd+1)).attr('class', 'detail colorNormal');
		}
		
		$('#' + parentId).attr('class', 'colorHighlightProvided');
		this.deselectHighlightSearchedVertices();
		for (var i = 0; i < vertex.edges.length; i++) {
			vertex.edges[i].to.$selector.attr('class', 'node vertex colorHighlightProvided');
		}
	},
	
	/**
	* Cancels highlighting of required neighbour of given vertex.
	* Parameters: vertex - vertex
	*             id - id of element on which was be clicked
	*/
	disHighlightRequired: function(id, vertex){
		for (var i = 0; i < vertex.edges.length; i++) {
			var edgeId = vertex.edges[i].from.id;
			
			$('#detailVertex' + (edgeId)).attr('class', 'detail colorNormal');
		}

		$('#' + id).attr('class', 'whiteColor');
		for (var l = 0; l < vertex.edges.length; l++) {
			vertex.edges[l].from.$selector.attr('class', 'node vertex colorNormal');
		}
	},
	
	/**
	* Highlights of required neighbour of given vertex.
	* Parameters: vertex - vertex
	*             id - id of element on which was be clicked
	*/
	highlightRequired:function(parentId, vertex){
		var idd = getIndexFromId(parentId, 8) - 1;
		
		for (var i = 0; i < vertex.edges.length; i++) {
			var edgeId = vertex.edges[i].from.id;
			
			$('#detailVertex' + (edgeId)).attr('class', 'detail colorHighlightRequired');
			$('#detailVertex' + (idd+1)).attr('class', 'detail colorNormal');
		}
		
		
		$('#' + parentId).attr('class', 'colorHighlightRequired'); // tohle je zvyrazneni lizatka
		this.deselectHighlightSearchedVertices();
		for (var j = 0; j < vertex.edges.length; j++) {
			vertex.edges[j].from.$selector.attr('class', 'node vertex colorHighlightRequired');
		}
	},
	
	/**
	* Event calls action  disHighlightProvided or highlightProvided depending on what element was clicked.
	* Parameters: e - event
	*/
	highlightProvidedEvent: function(e){
		var parentId = e.target.parentElement.id;
		var id = getIndexFromId(parentId, 8) - 1;
		var vertex  = GraphManager.graph.vertices[id];
		this.deselectHighlightSearchedVertices();
		
		if ($('#' + parentId).attr('class') != 'whiteColor') {
			this.disHighlightProvided(parentId, vertex);
		} else {
			this.highlightProvided(parentId, vertex);
		}
		
		if (($('#provided' + (id+1)).attr('class') != 'whiteColor') && ($('#required' + (id+1)).attr('class') != 'whiteColor')) {
			$('#detailVertex' + (id+1)).unbind('click');
			$('#detailVertex' + (id+1)).click(this.notHighlightNeighbour);
		} else {
			$('#detailVertex' + (id+1)).unbind('click');
			$('#detailVertex' + (id+1)).click(this.highlightAllNeighbour);
		}
	},
	
	/**
	* Event calls action  disHighlightRequired or highlightRequired depending on what element was clicked.
	* Parameters: e - event
	*/
	highlightRequiredEvent: function(e){
		var parentId = e.target.parentElement.id;
		var id = getIndexFromId(parentId, 8) - 1;
		var vertex  = GraphManager.graph.vertices[id];
		
		if ($('#' + parentId).attr('class') != 'whiteColor') {
			this.disHighlightRequired(parentId, vertex);
		}else {
			this.highlightRequired(parentId, vertex);
		}
		
		if (($('#provided' + (id+1)).attr('class') != 'whiteColor') && ($('#required' + (id+1)).attr('class') != 'whiteColor')) {
			$('#detailVertex' + (id+1)).unbind('click');
			$('#detailVertex' + (id+1)).click(this.notHighlightNeighbour);
		} else {
			$('#detailVertex' + (id+1)).unbind('click');
			$('#detailVertex' + (id+1)).click(this.highlightAllNeighbour);
		}
	},
	
	/**
	* Cancels all highlighting of neigbour given vertex.
	* Parameters: vertex - vertex
	*             id - id of element on which was be clicked
	*/
	disHighlihgtAll: function(id, vertex){
		for(var i = 0; i < vertex.edges.length; i++){
			var edgeFrom = vertex.edges[i].from;
			var edgeTo = vertex.edges[i].to;
			
			$('#detailVertex' + (edgeFrom.id)).attr('class', 'detail colorNormal');
			$('#detailVertex' + (edgeTo.id)).attr('class', 'detail colorNormal');
			
			edgeFrom.$selector.attr('class', 'node vertex colorNormal');
			edgeTo.$selector.attr('class', 'node vertex colorNormal');

			if (vertex.id === edgeFrom.id) {
				vertex.edges[i].$selector.css('stroke', '');
			} else if (vertex.id === edgeTo.id) {
				vertex.edges[i].$selector.css('stroke', '');
			}
		}

		$('#provided'+ id).attr('class', 'whiteColor');
		$('#required'+ id).attr('class', 'whiteColor');
	},
	
	/**
	* Event calls action  disHighlihgtAll after click to given element.
	* Parameters: e - event
	*/
	notHighlightNeighbour: function(e){
		var id = getIndexFromId(e.target.parentElement.id, 12) - 1;
		var vertex  = GraphManager.graph.vertices[id];
		
		this.disHighlihgtAll((id+1), vertex);
		$('#' + e.target.parentElement.id).unbind('click', this.notHighlightNeighbour);
		$('#' + e.target.parentElement.id).click(this.highlightAllNeighbour);
	},
	
	/**
	* Highlights all neigbours given vertex.
	* Parameters: vertex - vertex
	*             id - id of element on which was be clicked
	*/
	highlihgtAll: function(id, vertex) {
		this.deselectHighlightSearchedVertices();
		
		for (var i = 0; i < vertex.edges.length; i++){
			var edgeFrom = vertex.edges[i].from;
			var edgeTo = vertex.edges[i].to;
			
			$('#detailVertex' + (edgeFrom.id)).attr('class', 'detail colorHighlightRequired');
			$('#detailVertex' + (edgeTo.id)).attr('class', 'detail colorHighlightProvided');
			$('#detailVertex' + (id)).attr('class', 'detail colorNormal');
			
			edgeFrom.$selector.attr('class', 'node vertex colorHighlightRequired');
			edgeTo.$selector.attr('class', 'node vertex colorHighlightProvided');

			if (vertex.id === edgeFrom.id) {
				vertex.edges[i].$selector[0].classList.remove('edge--dimmed');
			} else if (vertex.id === edgeTo.id) {
				vertex.edges[i].$selector[0].classList.remove('edge--dimmed');
			}
		}

		$('#provided'+ id).attr('class', 'colorHighlightProvided');
		$('#required'+ id).attr('class', 'colorHighlightRequired');
	},
	
	/**
	* Event calls action  highlihgtAll after click to given element.
	* Parameters: e - event
	*/
	highlightAllNeighbour: function(e){
		var id = getIndexFromId(e.target.parentElement.id, 12) - 1;
		var vertex  = GraphManager.graph.vertices[id];
		this.highlihgtAll((id+1), vertex);
		
		$('#' + e.target.parentElement.id).unbind('click', this.highlightAllNeighbour);
		$('#' + e.target.parentElement.id).click(this.notHighlightNeighbour);
	},

	/**
	 * Cancels highlighting of all neighbors (provided) of vertex in group.
	 * Parameters: e - event
	 */
	groupDisHighlightProvided: function(e){
		var providedElement = e.target.parentElement.id;

		var id = findId(e.target);
		var group = this.groupManager.getGroup(id);

		for (var key in group.items) {
			if (group.items.contains(key)) {
				this.disHighlightProvided(providedElement, group.items.get(key));
			}
		}

		$('#' + providedElement).unbind('click', this.groupDisHightlightProvided);
		$('#' + providedElement).click(this.groupHighlightProvided);

		if (($('#provided' + id).attr('class') != 'whiteColor') && ($('#required' + id).attr('class') != 'whiteColor')) {
			$('#gr' + id).unbind('click',this.groupHighlightRequiredAndProvided);
			$('#gr' + id).click(this.groupDisHighlightRequiredAndProvided);
		} else {
			$('#gr' + id).unbind('click', this.groupDisHighlightRequiredAndProvided);
			$('#gr' + id).click(this.groupHighlightRequiredAndProvided);
		}
	},

	/**
	 * Highlights  all neighbors (provided) of vertex in group.
	 * Parameters: e - event
	 */
	groupHighlightProvided: function(e){
		var providedElement = e.target.parentElement.id;

		var id = findId(e.target);
		var group = this.groupManager.getGroup(id);

		for (var key in group.items) {
			if (group.items.contains(key)) {
				this.highlightProvided(providedElement, group.items.get(key));
			}
		}

		$('#' + providedElement).unbind('click',this.groupHighlightProvided);
		$('#' + providedElement).click(this.groupDisHighlightProvided);

		if (($('#provided' + id).attr('class') != 'whiteColor') && ($('#required' + id).attr('class') != 'whiteColor')) {
			$('#gr' + id).unbind('click',this.groupHighlightRequiredAndProvided);
			$('#gr' + id).click(this.groupDisHighlightRequiredAndProvided);
		} else {
			$('#gr' + id).unbind('click', this.groupDisHighlightRequiredAndProvided);
			$('#gr' + id).click(this.groupHighlightRequiredAndProvided);
		}
	},


	/**
	 * Cancels highlighting of all neighbors (required) of vertex in group.
	 * Parameters: e - event
	 */
	groupDisHighlightRequired: function(e){
		var providedElement = e.target.parentElement.id;

		var id = findId(e.target);
		var group = this.groupManager.getGroup(id);

		for (var key in group.items) {
			if (group.items.contains(key)) {
				this.disHighlightRequired(providedElement, group.items.get(key));
			}
		}

		$('#' + providedElement).unbind('click', this.groupDisHightlightRequired);
		$('#' + providedElement).click(this.groupHighlightRequired);

		if (($('#provided' + id).attr('class') != 'whiteColor') && ($('#required' + id).attr('class') != 'whiteColor')) {
			$('#gr' + id).unbind('click',this.groupHighlightRequiredAndProvided);
			$('#gr' + id).click(this.groupDisHighlightRequiredAndProvided);
		} else {
			$('#gr' + id).unbind('click', this.groupDisHighlightRequiredAndProvided);
			$('#gr' + id).click(this.groupHighlightRequiredAndProvided);
		}
	},

	/**
	 * Highlights  all neighbors (required) of vertex in group.
	 * Parameters: e - event
	 */
	groupHighlightRequired: function(e){
		var providedElement = e.target.parentElement.id;

		var id = findId(e.target);
		var group = this.groupManager.getGroup(id);

		for (var key in group.items) {
			if (group.items.contains(key)) {
				this.highlightRequired(providedElement, group.items.get(key));
			}
		}

		$('#' + providedElement).unbind('click',this.groupHighlightRequired);
		$('#' + providedElement).click(this.groupDisHighlightRequired);

		if (($('#provided' + id).attr('class') != 'whiteColor') && ($('#required' + id).attr('class') != 'whiteColor')) {
			$('#gr' + id).unbind('click',this.groupHighlightRequiredAndProvided);
			$('#gr' + id).click(this.groupDisHighlightRequiredAndProvided);
		} else {
			$('#gr' + id).unbind('click', this.groupDisHighlightRequiredAndProvided);
			$('#gr' + id).click(this.groupHighlightRequiredAndProvided);
		}
	},

	/**
	 * Highlights required and provided components of a group in SeCo or viewport by its ID.
	 * @param  id 		the group identifier
	 */
	groupHighlight: function(id) {
		var group = this.groupManager.getGroup(id);

		for (var key in group.items) {
			if (group.items.contains(key)) {
				this.highlihgtAll(id, group.items.get(key));
			}
		}

		$('#required' + id).unbind('click',this.groupHighlightRequired);
		$('#required' + id).click(this.groupDisHighlightRequired);
		$('#provided' + id).unbind('click',this.groupHighlightProvided);
		$('#provided' + id).click(this.groupDisHighlightProvided);
	},

	/**
	 * Dishighlights required and provided components of a group in SeCo or viewport by its ID.
	 * @param  id 		the group identifier
	 */
	groupDisHighlight: function(id) {
		var group = this.groupManager.getGroup(id);

		for (var key in group.items) {
			if (group.items.contains(key)) {
				this.disHighlihgtAll(id, group.items.get(key));
			}
		}

		$('#required' + id).unbind('click',this.groupDisHighlightRequired);
		$('#required' + id).click(this.groupHighlightRequired);
		$('#provided' + id).unbind('click',this.groupDisHighlightProvided);
		$('#provided' + id).click(this.groupHighlightProvided);
	},

	/**
	 * Highlights  all neighbors of vertex in group.
	 * Parameters: e - event
	 */
	groupHighlightRequiredAndProvided: function(e) {
		var providedElement = e.target.parentElement.id;
		var id = findId(e.target);

		$('#' + providedElement).unbind('click', this.groupHighlightRequiredAndProvided);
		$('#' + providedElement).click(this.groupDisHighlightRequiredAndProvided);

		this.groupHighlight(id);
	},

	/**
	 * Cancels highlighting of all neighbors of vertex in group.
	 * Parameters: e - event
	 */
	groupDisHighlightRequiredAndProvided: function(e){
		var providedElement = e.target.parentElement.id;
		var id = findId(e.target);

		$('#' + providedElement).unbind('click', this.groupDisHighlightRequiredAndProvided);
		$('#' + providedElement).click(this.groupHighlightRequiredAndProvided);

		this.groupDisHighlight(id);
	},

	/**
	 * Cancels highlighting of all group related lollipops.
	 */
	groupDisHighlightAllLollipops: function(){
		$('.colorHighlightProvided:not(.vertex), .colorHighlightRequired:not(.vertex)').attr('class', 'whiteColor');
	},

	/**
	 * Cancels highlighting of vertices which were searched.
	 */
	deselectHighlightSearchedVertices: function(){
		for (var key in this.vertexSearchHighlighting) {
			this.vertexSearchHighlighting[key][0].classList.remove('vertex--searched');

			delete this.vertexSearchHighlighting[key];
		}

		$('#countOfFinded').text(0);
	},

	/**
	 * Highlights the searched vertex in group.
	 */
	highlightSearchedVertexInGroup: function(vertex) {
		// set background of <p> in <li>
		var $selector = $('#li' + (vertex.id) + ' p');
		$selector[0].classList.add('vertex--searched');

		this.vertexSearchHighlighting['li' + (vertex.id)] = $selector;
	},

	/**
	 * Highlights all vertex if their name contains searched string.
	 */
	search: function(){
		var vertices = GraphManager.graph.vertices;
		var text = $("#searchText").val();
		this.deselectHighlightSearchedVertices();

		// handle empty search string - tool tip
		if (text === ""){
			$("#searchText").qtip({
				content: {
					text: "Please fill out this field."
				},
				style: {
					classes: "ui-tooltip-yellow ui-tooltip-rounded ui-tooltip-shadow"
				}
			}).qtip("show");

			$(window).mousemove(function(){
				setTimeout(OffScreenKiv.hideTooltip, 2000);
				$(this).unbind("mousemove");
			});
			return;
		}

		var countOfFound = 0;

		for (var i = 0; i < vertices.length; i++) {
			if (vertices[i].name.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
				$(vertices[i].$selector)[0].classList.add('vertex--searched');
				this.vertexSearchHighlighting[vertices[i].symbolicName] = vertices[i].$selector;
				countOfFound++;

				// handle SeCo panel - w/o unconnected
				if (vertices[i].excluded === true) {
					var $selector = $('#detailVertex' + (vertices[i].id));

					if ($selector.length) { // is not grouped
						$selector[0].classList.add('vertex--searched');

						this.vertexSearchHighlighting['detailVertex' + (vertices[i].id)] = $selector;
					} else { // is grouped
						this.highlightSearchedVertexInGroup(vertices[i]);
					}
				}

				// handle unconnected
				if (vertices[i].edges.length === 0) {
					// show the list if hidden
					if ($('#unconComps').is(':hidden')) {
						$('#unconComps').show();
					}

					var $selector = $('#liuc' + (vertices[i].id) + ' p');
					$selector[0].classList.add('vertex--searched');

					this.vertexSearchHighlighting['liuc' + (vertices[i].id)] = $selector;
				}
			}
		}

		$("#countOfFinded").html(countOfFound);
	},

	/**
	 * Hide tooltip of search textfield.
	 */
	hideTooltip: function(){
		$("#searchText").qtip("hide");
		$("#searchText").qtip("destroy");
	},

	/**
	 * TODO could be merged with the "excludeVerticesWithMostEdgesToGroup" function
	 * Excludes vertices whith the most edges from graph to the right panel.
	 */
	excludeVerticesWithMostEdges: function() {
		var vertices = GraphManager.graph.vertices;
		var sortedMappingToVertex = new Array(vertices.length);

		for (var j = 0; j < vertices.length; j++) {
			sortedMappingToVertex[j] = j;
		}

		sortedMappingToVertex.sort(function(a, b) {
			if(vertices[a].edges.length > vertices[b].edges.length){
				return -1;
			}
			if(vertices[a].edges.length == vertices[b].edges.length){
				return 0;
			}
			return 1;
		});

		var countExcludedVertices = Math.round(sortedMappingToVertex.length*0.15);
		var vertex;
		if (countExcludedVertices >= 1) {
			$('input[name="actionMove"]:eq("move")').click();
		}

		for (var i = 0; i < countExcludedVertices; i++) {
			vertex = vertices[sortedMappingToVertex[i]];

			if (!vertex.excluded) {
				var e = jQuery.Event('mousedown');
				e.which = 1;
				e.target = vertex.$selector[0];
				this.showVertexInRightPanel(e);
			}
		}
	},

	/**
	 * Merge vertices whith the most edges to one group and excludes them from graph to the right panel.
	 */
	excludeVerticesWithMostEdgesToGroup: function() {
		var vertices = GraphManager.graph.vertices;
		var sortedMappingToVertex = new Array(vertices.length);

		for (var j = 0; j < vertices.length; j++) {
			sortedMappingToVertex[j] = j;
		}

		sortedMappingToVertex.sort(function(a, b) {
			if (vertices[a].edges.length > vertices[b].edges.length) {
				return -1;
			}
			if (vertices[a].edges.length == vertices[b].edges.length) {
				return 0;
			}
			return 1;
		});

		var countExcludedVertices = Math.round(sortedMappingToVertex.length*0.15);
		var vertex;
		if (countExcludedVertices >= 1) {
			$('input[name="actionMove"]:eq("move")').click();
		}

		var symbol = this.markSymbol.getMarkSymbol();
		var group;
		var idGroup;

		for (var i = 0; i < countExcludedVertices; i++) {
			vertex = vertices[sortedMappingToVertex[i]];

			if (!vertex.excluded) {
				vertex.symbol = symbol;
				idGroup = symbol[1].substring(1, symbol[1].length) + symbol[0];

				if (i === 0) {
					this.addItemToContextMenu(symbol, vertex.id, vertex.name);
					group = new Group(vertex.symbol, idGroup);
					this.groupManager.addGroupToList(idGroup, group);
					this.createGroupDetail(group, vertex.symbol);
				}

				this.addVertexToGroup(idGroup, $("#vertex"+ vertex.id));
			}
		}

		$('#includeAllComponents').show();
	}
};