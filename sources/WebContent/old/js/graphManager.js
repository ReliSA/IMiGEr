
/**
 * Object which represent graph.
 */
var GraphManager = {
	graph: null,
	unconList: [],
	isEfpGraph : false,
	isCompatibilityGraph: true,
	vertices_position: null,
	forceField: [],
	otherVertex: [],
	canvasSize: 0,

	// parametry layoutu
	inumber: 30, // pocet iteraci; default 300
	inumberClick: 20, // pocet iteraci u tlacitka
	restrength: 400, // odpudiva sila (prima umera); default 450
	atstrength: 510, // pritazliva sila (neprima umera, nesmi byt 0); default 110
	deffect: 1000, // tlumeni sily (nesmi byt 0); default 200
	borderRatio: 1, // hranice layoutu (cislo kterym se deli velikost canvasu)
	// tahle funkce se mi nelibi, je treba to vyresit jinak, nici to layout (nechat na 1)

	layouting: false,
	myVar: null,

	/**
	 * Initialization
	 */
	init: function(){
		this.buildGraph.bind(this);
		this.forceDirectedLayoutOnClick = this.forceDirectedLayoutOnClick.bind(this);
	},

	/**
	 * Apply layout and set interval
	 */
	forceDirectedLayoutOnClick: function(){
		if (this.layouting === true) {
			$('#applyLayoutImg').attr('src', 'images/layout_off.png');
			this.layouting = false;
			clearInterval(this.myVar);
		} else {
			$('#applyLayoutImg').attr('src', 'images/layout_on.png');
			this.layouting = true;
			this.myVar = window.setInterval(this.awesomeFirePenguin.bind(this), 10);
		}
	},

	/**
	 * Force directed layout for visible components
	 */
	awesomeFirePenguin: function(){
		var canvas = this.canvasSize,

			repulsiveStrength = this.restrength, // more is more
			attractiveStrength = this.atstrength, // more is less
			dampeningEffect = this.deffect,
			border = canvas/this.borderRatio,

			visibleVertices = [],
			vertices = this.graph.vertices,
			i = 0,
			j = 0,
			counter = 0,
			otherVisibleVertices = [];

		// gets the visible components
		for (i = 0; i < vertices.length; i++){
			if (vertices[i].$selector[0].isVisible()){
				visibleVertices[counter] = vertices[i];
				counter++;
			}
		}

		for (i = 0; i < this.graph.vertices.length; i++){
			this.forceField[i][0] = 0;
			this.forceField[i][1] = 0;
		}

		// calculate repulsive force
		for (i = 0; i < visibleVertices.length; i++){
			var currVertex = visibleVertices[i];

			// other vertices
			for (var j = 0; j < visibleVertices.length; j++){
				otherVisibleVertices[j] = visibleVertices[j];
			}
			otherVisibleVertices.splice(i, 1);

			// iterate over other vertices
			for (j = 0; j < otherVisibleVertices.length; j++){
				// currVertex position
				var currX = currVertex.x,
					currY = currVertex.y,

				// otherVertex position
					otherX = otherVisibleVertices[j].x,
					otherY = otherVisibleVertices[j].y,

				// calculate force
					x = currX - otherX,
					y = currY - otherY,

					sum = Math.pow(x,2) + Math.pow(y,2),
					distance = Math.sqrt(sum);

				if (distance !== 0) {
					this.forceField[currVertex.id-1][0] += Math.floor((x * (repulsiveStrength / distance)));
					this.forceField[currVertex.id-1][1] += Math.floor((y * (repulsiveStrength / distance)));
				}
			}
		}

		// calculate attractive forces
		for (i = 0; i < visibleVertices.length; i++){
			var currVertex = visibleVertices[i];

			for (j = 0; j < currVertex.edges.length; j++){
				var otherVertex;

				if (currVertex.edges[j].to == currVertex){
					otherVertex = currVertex.edges[j].from;
				} else {
					otherVertex = currVertex.edges[j].to;
				}

				if (otherVertex.$selector[0].isHidden()) continue;

				// currVertex position
				var currX = currVertex.x,
					currY = currVertex.y,

				// otherVertex position
					otherX = otherVertex.x,
					otherY = otherVertex.y,

				// calculate force
					x = currX - otherX,
					y = currY - otherY,

					sum = Math.pow(x, 2) + Math.pow(y, 2),
					distance = Math.sqrt(sum);

				//$('#rightPanel').append(distance+"<BR>");
				this.forceField[visibleVertices[i].id-1][0] += Math.round(-( (x * (distance / attractiveStrength))));
				this.forceField[visibleVertices[i].id-1][1] += Math.round(-( (y * (distance / attractiveStrength))));
				/*
				 this.forceField[otherVertex.id-1][0] -= Math.round(-( (x * (distance / attractiveStrength))));
				 this.forceField[otherVertex.id-1][1] -= Math.round(-( (y * (distance / attractiveStrength))));
				 */
			}
		}

		// applying the force
		for (i = 0; i < this.graph.vertices.length; i++){
			var currVertex = this.graph.vertices[i],

				halfCan = canvas / 2,

				deltaX = currVertex.x - halfCan,
				deltaY = currVertex.y - halfCan;

			// tohle drzi layout uprostred, chtelo by to vymyslet nejak lip, docela ho to kurvi
			/*
			 if (deltaX > 0) {
			 currVertex.x = Math.min(currVertex.x, (canvas/2)+border);
			 } else {
			 currVertex.x = Math.max(currVertex.x, (canvas/2)-border);
			 }
			 if (deltaY > 0) {
			 currVertex.y = Math.min(currVertex.y, (canvas/2)+border);
			 } else {
			 currVertex.y = Math.max(currVertex.y, (canvas/2)-border);
			 }
			 */

			// kolecko
			var dist = Math.sqrt(Math.pow(deltaX,2)+Math.pow(deltaY,+2)),
				maxDist = Math.sqrt(Math.pow(border,2)+Math.pow(border,+2));

			if (dist > maxDist){
				var ratio = maxDist / dist,

					newX = deltaX * ratio,
					newY = deltaY * ratio;

				currVertex.x += newX - deltaX;
				currVertex.y += newY - deltaY;
			}

			// force dampening
			var forceX = Math.floor(this.forceField[i][0]/dampeningEffect),
				forceY = Math.floor(this.forceField[i][1]/dampeningEffect);

			// adding a random effect
			/*
			 forceX += -3+Math.floor((Math.random()*6)+1);
			 forceY += -3+Math.floor((Math.random()*6)+1);
			 */


			// moving a component
			if (Math.abs(forceX) > 1 || Math.abs(forceY) > 1){
				currVertex.x += forceX;
				currVertex.y += forceY;
			}

			// translating the graph
			currVertex.$selector.attr('transform', 'translate(' + currVertex.x + ',' + currVertex.y + ')');

			// translating edges
			var newX, newY, lollipop;

			if (currVertex.edges !== null) {
				for (var k = 0; k< currVertex.edges.length; k++) {
					var edge = currVertex.edges[k],
						sizeOfRectFrom = edge.from.size,
						sizeOfRectTo = edge.to.size;

					if(edge.from.id == currVertex.id){
						newX = currVertex.edges[k].to.x + sizeOfRectTo/2;
						newY = currVertex.edges[k].to.y + 13;
						lollipop = getLollipopPosition(currVertex.x + sizeOfRectFrom/2, currVertex.y +13 , newX, newY);

						edge.$selector.children("line").attr('x1', currVertex.x + sizeOfRectFrom/2);
						edge.$selector.children("line").attr('y1', currVertex.y + 13);
						edge.$selector.children("g").attr('transform', 'rotate(' + lollipop.angle + ',' + lollipop.x + ',' + lollipop.y  + ') translate('+ lollipop.x + ',' + lollipop.y  + ')');

						ViewportManager.preventTickRotation(edge, lollipop);
						ViewportManager.preventCrossRotation(edge, lollipop);
					} else {
						newX = currVertex.edges[k].from.x + sizeOfRectFrom/2;
						newY = currVertex.edges[k].from.y + 13;
						lollipop = getLollipopPosition(newX, newY, currVertex.x + sizeOfRectTo/2, currVertex.y + 13);

						edge.$selector.children("line").attr('x2', currVertex.x + sizeOfRectTo/2);
						edge.$selector.children("line").attr('y2', currVertex.y + 13);
						edge.$selector.children("g").attr('transform', 'rotate(' + lollipop.angle + ',' + lollipop.x + ',' + lollipop.y  + ') translate('+ lollipop.x + ',' + lollipop.y  + ')');

						ViewportManager.preventTickRotation(edge, lollipop);
						ViewportManager.preventCrossRotation(edge, lollipop);
					}
				}
			}
		}
	},

	/**
	 * Force Directed Layout
	 *
	 * @param canvas canvas
	 */
	forceDirectedLayout: function(canvas) {
		var repulsiveStrength = this.restrength, // more is more
			attractiveStrength = this.atstrength, // more is less
			dampeningEffect = this.deffect,
			border = canvas/this.borderRatio;

		//$('#rightPanel').append("s<BR>");

		var length = this.graph.vertices.length;
		// initialize repulsive forces

		for (var i = 0; i < length; i++){
			this.forceField[i][0] = 0;
			this.forceField[i][1] = 0;
		}

		// calculate repulsive force
		for (var i = 0; i < length; i++){

			var currVertex = this.graph.vertices[i];
			//var otherVertex = new Array();

			// other vertices
			for (var j = 0; j < length; j++){
				this.otherVertex[j] = this.graph.vertices[j];
			}
			this.otherVertex.splice(i, 1);

			// iterate over other vertices
			for (var j = 0; j < this.otherVertex.length; j++){
				// currVertex position
				var currX = currVertex.x,
					currY = currVertex.y,

				// otherVertex position
					otherX = this.otherVertex[j].x,
					otherY = this.otherVertex[j].y,

				// calculate force
					x = currX - otherX,
					y = currY - otherY,

					sum = Math.pow(x,2) + Math.pow(y,2),
					distance = Math.sqrt(sum);

				if (distance !== 0) {
					this.forceField[i][0] += Math.floor((x * (repulsiveStrength / distance)));
					this.forceField[i][1] += Math.floor((y * (repulsiveStrength / distance)));
				}
			}

			//$('#rightPanel').append(forceField[i][0]+" | "+forceField[i][1]+" - rf<BR>");
		}

		// calculate attractive forces
		for (var i = 0; i < length; i++){
			var currVertex = this.graph.vertices[i];
			//$('#rightPanel').append(currVertex.id+"<BR>");
			//$('#rightPanel').append(currVertex.edges.length+"<BR>");
			for (var j = 0; j < currVertex.edges.length; j++){
				var otherVertex;

				if (currVertex.edges[j].to == currVertex){
					otherVertex = currVertex.edges[j].from;
				} else {
					otherVertex = currVertex.edges[j].to;
				}

				// currVertex position
				var currX = currVertex.x,
					currY = currVertex.y,

				// otherVertex position
					otherX = otherVertex.x,
					otherY = otherVertex.y,

				// calculate force
					x = currX - otherX,
					y = currY - otherY,

					sum = Math.pow(x, 2) + Math.pow(y, 2),
					distance = Math.sqrt(sum);

				//$('#rightPanel').append(distance+"<BR>");
				this.forceField[i][0] += Math.round(-( (x * (distance / attractiveStrength))));
				this.forceField[i][1] += Math.round(-( (y * (distance / attractiveStrength))));
				/*
				 this.forceField[otherVertex.id-1][0] -= Math.round(-( (x * (distance / attractiveStrength))));
				 this.forceField[otherVertex.id-1][1] -= Math.round(-( (y * (distance / attractiveStrength))));
				 */
			}
			//$('#rightPanel').append(forceField[i][0]+" | "+forceField[i][1]+" - ff<BR>");
		}

		// applying the force
		for (var i = 0; i < length; i++){
			var currVertex = this.graph.vertices[i],

				deltaX = currVertex.x - (canvas/2),
				deltaY = currVertex.y - (canvas/2);

			// tohle drzi layout uprostred, chtelo by to vymyslet nejak lip, docela ho to kurvi
			/*
			 if (deltaX > 0) {
			 currVertex.x = Math.min(currVertex.x, (canvas/2)+border);
			 } else {
			 currVertex.x = Math.max(currVertex.x, (canvas/2)-border);
			 }
			 if (deltaY > 0) {
			 currVertex.y = Math.min(currVertex.y, (canvas/2)+border);
			 } else {
			 currVertex.y = Math.max(currVertex.y, (canvas/2)-border);
			 }
			 */

			//kolecko
			var dist = Math.sqrt(Math.pow(deltaX,2)+Math.pow(deltaY,+2)),
				maxDist = Math.sqrt(Math.pow(border,2)+Math.pow(border,+2));

			if (dist > maxDist){
				var ratio = maxDist / dist,

					newX = deltaX * ratio,
					newY = deltaY * ratio;

				currVertex.x += newX - deltaX;
				currVertex.y += newY - deltaY;
			}

			// force dampening
			var forceX = Math.floor(this.forceField[i][0]/dampeningEffect),
				forceY = Math.floor(this.forceField[i][1]/dampeningEffect);

			// adding a random effect
			/*
			 forceX += -3+Math.floor((Math.random()*6)+1);
			 forceY += -3+Math.floor((Math.random()*6)+1);
			 */

			//$('#rightPanel').append(forceX+" | "+forceY+" - asaf<BR>");

			// moving a component
			currVertex.x += forceX;
			currVertex.y += forceY;
		}
	},

	/**
	 * Create graph from data which were send by server.
	 */
	buildGraph: function(){
		var vertexMap = {},
			verticesBuff = '',
			edgesBuff = '',
			position_loaded = false;

		if (this.graph === null) {
			alert('Error loading graph.');
			window.location.href = app.HOME_URL;
			return;
		}

		if (this.graph !== null && this.graph.cause !== undefined) {
			console.log("Error generating graph.");
			console.log(this.graph);
			app.loader.disable();
			alert("Error generating graph. Check the console for details.");
			return;
		}

		// start generating graph
		var odm = Math.sqrt(this.graph.vertices.length),
			canvas = ((this.graph.vertices.length * 75) / Math.round(odm)) + 1000;

		this.canvasSize = canvas;
		this.graph.vertices.sort(function(a, b) {
			return a.id > b.id;
		});

		// initialize vertices
		for (var i = 0; i < this.graph.vertices.length; i++) {
			var vertex = this.graph.vertices[i];
			vertexMap[vertex.symbolicName] = vertex;
			vertex.edges = [];
			vertex.gridMark = new GridMarks();

			//pokud je nastavena pozice x y u prvku - nastavit tuto pozici
			if (this.vertices_position !== null && this.vertices_position.vertices_position !== null) {
				$.each(this.vertices_position.vertices_position, function(i, item) {
					if ("vertex" + vertex.id == item.id){
						var coords = getCoordinates(item.transform);

						vertex.x = parseFloat(coords.x);
						vertex.y = parseFloat(coords.y);

						position_loaded = true;
						return false;	// break
					}
				});
			}

			// nahodna pozice
			if (position_loaded === false) {
				vertex.x = Math.floor(Math.random() * canvas);
				vertex.y = Math.floor(Math.random() * canvas);
			}
		}

		// initialize edges
		for (var j = 0; j < this.graph.edges.length; j++) {
			var edge = this.graph.edges[j];
			edge.from = vertexMap[edge.from];

			if (typeof vertexMap[edge.to] !== 'undefined') {
				edge.to = vertexMap[edge.to];
			} else {
				edge.to = vertexMap["vertex_NOT_FOUND"];
			}

			edge.from.edges.push(edge);
			edge.to.edges.push(edge);
		}

		// calling force layout
		if (position_loaded === false) {
			//var avgX = 0, avgY = 0;

			for (var x = 0; x < this.graph.vertices.length; x++) {
				this.forceField[x] = [];
			}

			for (var x = 0; x < this.inumber; x++){
				this.forceDirectedLayout(canvas);
			}
		}

		// fill the vertices buffer
		for (var i = 0; i < this.graph.vertices.length; i++) {
			var vertex = this.graph.vertices[i];
			vertex.size = getSizeOfRectangle(vertex.name);

			verticesBuff += SvgFactory.createVertex(vertex);
		}

		// fill the edges buffer
		for (var j = 0; j < this.graph.edges.length; j++){
			var edge = this.graph.edges[j];

			edgesBuff += SvgFactory.createEdge(edge, this.isEfpGraph);
		}

		$("#graph #edges").html(edgesBuff);
		$("#graph #vertices").html(verticesBuff);

		this.setSizeOfSvg();
		this.centerGraphInViewport(1);
		this.setTooltips();
		this.fillUnconnectedList();
		this.setVertexCounters();

		/* Creating text field with total number of components loaded */
		$('#allComps').text(this.graph.vertices.length+ ' components displayed');

		/* Highlight if there are any incompability */
		if (!this.isJarsCompatible()) {
			$('#incomCmpList').empty();

			var missingComponents = this.getMissingComponents();
			missingComponents.forEach(function(component) {
				$('#incomCmpList').append('<li>' + component + '</li>');
			});

			$('#incompatible').show();
			$('#allIncomps').show();
		}

		// vytvoreni seznamu nepropojenych komponent
		for (var i = 0; i < this.unconList.length; i++){
			var ind = this.unconList[i],
				name = this.graph.vertices[ind-1].name;

			$('#unconCmpList').append('<li class="node vertex" id="liuc' + ind + '" data-id="' + ind + '"><p data-vertexId="' + ind + '" data-title="' + name + '">' + name + '</p><img class="" id="liuc_del_' + ind  + '" alt="delete" src="images/button_cancel.png"/></li>');
		}

		app.loader.disable();
	},

	/**
	 * Set size of svg according bounding box of svg.
	 */
	setSizeOfSvg: function(){
		var svg = $("#svg1"),
			bbox = svg.get(0).getBBox(),
			viewportWidth = stringToInt(cutTwoLastCharacters($("#viewport").css("width"))),
			viewportHeight = stringToInt(cutTwoLastCharacters($("#viewport").css("height")));

		if (bbox.width < viewportWidth){
			svg.css("width", viewportWidth*1.5);
		} else {
			svg.css("width", bbox.width*1.5);
		}

		if (bbox.height < viewportHeight){
			svg.css("height", viewportHeight*1.5);
		} else {
			svg.css("height", bbox.height*1.5);
		}
	},

	/**
	 * Centers graph in viewport. 
	 * @param currentZoom
	 */
	centerGraphInViewport: function(currentZoom){
		var svg = $("#svg1"),
			graph = $("#graph"),
			bboxSvg = svg.get(0).getBBox(),
			svgWidth = stringToInt(cutTwoLastCharacters(svg.css("width"))),
			svgHeight = stringToInt(cutTwoLastCharacters(svg.css("height"))),

			centerSvgX = svgWidth/2.0,
			centerSvgY = svgHeight/2.0,

			newPositionGraphX = centerSvgX - bboxSvg.width/2.0 - bboxSvg.x,
			newPositionGraphY = centerSvgY - bboxSvg.height/2.0 - bboxSvg.y,
			viewport = $("#viewport");

		viewport.scrollLeft(-(svgWidth-(viewport.width()-17))/2.0);
		viewport.scrollTop((svgHeight-(viewport.height()-17))/2.0);
		graph.attr("transform", "translate(" + newPositionGraphX/currentZoom + "," + newPositionGraphY/currentZoom + ")");

		return "translate(" + newPositionGraphX/currentZoom + "," + newPositionGraphY/currentZoom + ")";
	},

	/**
	 * Sets qTip tooltips to edge lollipops and vertex interface symbols
	 */
	setTooltips: function() {
		configurationEdgeTooltip(".lollipop");

		// only for non-EFP graphs
		if (!GraphManager.isEfpGraph) {
			configurationVertexTooltip(".interface");
		}
	},

	/**
	 * Fills list of unconnected components in graph.
	 */
	fillUnconnectedList: function() {
		var unCount = 0;

		for (var i = 0; i < this.graph.vertices.length; i++){
			var vertex = this.graph.vertices[i];

			if (vertex.edges.length === 0) {
				this.unconList[unCount] = vertex.id;
				$('#vertex'+ vertex.id).hide();

				vertex.leftAlone = true;

				unCount++;
			}
		}		
	},

	/**
	 * Sets vertex provided and required components counters.
	 */
	setVertexCounters: function() {
		for (var i = 0; i < this.graph.vertices.length; i++){
			var countFrom = 0,
				countTo = 0,
				vertex = this.graph.vertices[i];

			if (this.isEfpGraph) { // legacy method
				// count TO and FROM numbers for lollipops
				for (var j = 0; j < vertex.edges.length;j++){
					if (vertex.id == vertex.edges[j].from.id){
						countFrom++;
					}
				}
				countTo = vertex.edges.length - countFrom;

				$('#rectTopText'+ vertex.id).text(countTo);
				$('#rectBotText'+ vertex.id).text(countFrom);
			} else { // count lollis by packages
				$('#rectTopText'+ vertex.id).text(vertex.importedPackages.length);
				$('#rectBotText'+ vertex.id).text(vertex.exportedPackages.length);
			}
		}
	},
	
	/**
	 * Finds incompatible jars by vertex name.
	 * @returns true if all jars are compatible, otherwise false 
	 */
	isJarsCompatible: function() {
		return this.graph.vertices.every(function(vertex) {
			return vertex.name !== "NOT_FOUND";
		});
	},

	/**
	 * Retrieves all missing components.
	 *
	 * @returns array List of missing components.
	 */
	getMissingComponents: function() {
		var missing = [];

		this.graph.edges.forEach(function(edge) {
			if (edge.from.name === "NOT_FOUND") {
				var compatibilityInfo = JSON.parse(edge.compInfoJSON);

				missing.push(compatibilityInfo[0].causedBy);
			}
		});

		return missing;
	},
};