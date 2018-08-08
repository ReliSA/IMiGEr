
/**
* Representation of EFP interface functionality.
*/
var EFPs = {
	elementName : "#EFPselector",
	graph : null,
	// map {EFP name, EFP ID}
	efpsIds : {},
	// array [EFP ID, edge ID]
	efpsStruct : new Array(),
	currentEfpSeclected : null,
	minDiameter : null,
	maxDiameter : null,
	// left - required - misticka
	minEfpsValuesLeft : {},
	maxEfpsValuesLeft : {},
	// right - provided - lizatko
	minEfpsValuesRight : {},
	maxEfpsValuesRight : {},
	
	/**
	* Init.
	*
	* @param graph
	*/
	init : function(graph) {
		this.graph = graph;
		this.minDiameter = GraphManager.efpMinIntDiameter;
		this.maxDiameter = GraphManager.efpMaxIntDiameter;
		
		// min is really min
		if (parseFloat(this.minDiameter) > parseFloat(this.maxDiameter)) {
			var tmp = this.minDiameter;
			this.minDiameter = this.maxDiameter;
			this.maxDiameter = tmp;
		}
		
		this.currentEfpSeclected = $(this.elementName).val();
		this.associateEfpsToEdgeIds();
	},
	
	/**
	* Make cached association EFP;edgeID.
	*/
	associateEfpsToEdgeIds : function() {
		// array of EFPs
		var efpsCount = $(this.elementName + " option").length - 1;
		
		var tmp = 0;
		
		// hack for "this" when entering to
		var ids = this.efpsIds;
		var minEfpsLeft = this.minEfpsValuesLeft;
		var maxEfpsLeft = this.maxEfpsValuesLeft;
		var minEfpsRight = this.minEfpsValuesRight;
		var maxEfpsRight = this.maxEfpsValuesRight;
		
		// fill map
		$("#EFPselector option").each(function(e) {
			if ($(this).val() != "") {
				ids[$(this).val()] = tmp++;
				
				// init the min/max arrays
				minEfpsLeft[$(this).val()] = Number.MAX_VALUE;
				maxEfpsLeft[$(this).val()] = -Number.MAX_VALUE;
				
				minEfpsRight[$(this).val()] = Number.MAX_VALUE;
				maxEfpsRight[$(this).val()] = -Number.MAX_VALUE;
			}
		});
		
		for ( var i = 0; i < efpsCount; i++) {
			// efpsStruct[i].push(new Array());
			this.efpsStruct[i] = new Array();
		}
		
		// edges
		for (var i = 0; i < this.graph.edges.length; i++) {
			var features = this.graph.edges[i].features;
			
			// features
			for (var j = 0; j < features.length; j++) {
				var efps = features[j].efps;
				
				// efps
				for (var k = 0; k < efps.length; k++) {
					if (efps[k].efpName != "") {
						var tmpEfpId = this.efpsIds[efps[k].efpName];
						var tmpEdgeId = this.graph.edges[i].id;
						
						// assign edge to the efps
						if (this.efpsStruct[tmpEfpId].indexOf(tmpEdgeId) < 0) {
							// check if the EFP values are really valid numbers
							if(!isNaN(efps[k].leftEfpValue) && !isNaN(efps[k].rightEfpValue)) {
								this.efpsStruct[tmpEfpId].push(tmpEdgeId);;
							}
						}
						
						/* LEFT numeric values */
						if (!isNaN(efps[k].leftEfpValue)) {
							// check and set min
							if (parseFloat(efps[k].leftEfpValue) < parseFloat(this.minEfpsValuesLeft[efps[k].efpName])) {
								this.minEfpsValuesLeft[efps[k].efpName] = efps[k].leftEfpValue;
							}
							
							// check and set max
							if (parseFloat(efps[k].leftEfpValue) > parseFloat(this.maxEfpsValuesLeft[efps[k].efpName])) {
								this.maxEfpsValuesLeft[efps[k].efpName] = efps[k].leftEfpValue;
							}
						}
						
						/* RIGHT numeric values */
						if (!isNaN(efps[k].rightEfpValue)) {
							// check and set min
							if (parseFloat(efps[k].rightEfpValue) < parseFloat(this.minEfpsValuesRight[efps[k].efpName])) {
								this.minEfpsValuesRight[efps[k].efpName] = efps[k].rightEfpValue;
							}
							
							// check and set max
							if (parseFloat(efps[k].rightEfpValue) > parseFloat(this.maxEfpsValuesRight[efps[k].efpName])) {
								this.maxEfpsValuesRight[efps[k].efpName] = efps[k].rightEfpValue;
							}
						}
					}
				}
			}
		}
	},
	
	/**
	* Triggered after a change of selected EFP.
	*
	* @param element
	*/
	recalculate : function(element) {
		var efpName = $(element).val();
		
		// empty selected => reset
		if (efpName == "") {
			this.changeEdges(this.currentEfpSeclected, true);
			
			this.currentEfpSeclected = efpName;
			
			return;
		}
		
		// is already empty => no need for a reset
		if (this.currentEfpSeclected != "") {
			this.changeEdges(this.currentEfpSeclected, true);
		}
		
		this.changeEdges(efpName, false);
		
		// set new selected value
		this.currentEfpSeclected = efpName;
	},
	
	/**
	*
	* Calculate average of all selected EFPs on given edge.
	*
	* @param efpName
	* @param edge
	* @returns {Array}
	*/
	calculateEfpAvg : function(efpName, edge) {
		var foundEFps = 0;
		var avgStructLeftRight = [Number(0),Number(0)];
		
		// get the EFP and its values
		for(var j = 0; j < edge.features.length; j++) {
			var tmpEdgeFeature = edge.features[j];
			
			for(var k = 0; k < tmpEdgeFeature.efps.length; k++) {
				var tmpEdgeFeatureEfp = tmpEdgeFeature.efps[k];
				
				// set the EFP if matched and numeric
				if(tmpEdgeFeatureEfp.efpName == efpName){
					if(!isNaN(tmpEdgeFeatureEfp.leftEfpValue) && !isNaN(tmpEdgeFeatureEfp.rightEfpValue)) {
						foundEFps++;
						
						avgStructLeftRight[0] += parseFloat(tmpEdgeFeatureEfp.leftEfpValue);
						avgStructLeftRight[0] /= foundEFps;
						
						avgStructLeftRight[1] += parseFloat(tmpEdgeFeatureEfp.rightEfpValue);
						avgStructLeftRight[1] /= foundEFps;
						}else {
						// found some non-numeric -> error state
						return null;
					}
				}
			}
		}
		
		return avgStructLeftRight;
	},
	
	/**
	*
	* @param efpName
	* @param reset
	*/
	changeEdges : function(efpName, reset) {
		var diameterLeft = null, diameterRight = this.minDiameter;
		var tmpEfpId = this.efpsIds[efpName];
		
		var singleSelectedEfpInDiagram = false;
		
		var kLeft = null, qLeft = null, kRight = null, qRight = null;
		
		// [minDiameter][maxDiameter] of chosen EFP
		var minMaxDiameterOfEfpLeft = [this.minEfpsValuesLeft[efpName], this.maxEfpsValuesLeft[efpName]];
		var minMaxDiameterOfEfpRight = [this.minEfpsValuesRight[efpName], this.maxEfpsValuesRight[efpName]];
		
		// check if we won't run into the DIV 0
		if((minMaxDiameterOfEfpLeft[0] - minMaxDiameterOfEfpLeft[1]) == 0 || (minMaxDiameterOfEfpRight[0] - minMaxDiameterOfEfpRight[1]) == 0){
			singleSelectedEfpInDiagram = true;
			}else {
			// y = k * x + q
			kLeft = (this.minDiameter - this.maxDiameter) / (minMaxDiameterOfEfpLeft[0] - minMaxDiameterOfEfpLeft[1]);
			qLeft = this.maxDiameter - kLeft * minMaxDiameterOfEfpLeft[1];
			
			kRight = (this.minDiameter - this.maxDiameter) / (minMaxDiameterOfEfpRight[0] - minMaxDiameterOfEfpRight[1]);
			qRight = this.maxDiameter - kRight * minMaxDiameterOfEfpRight[1];
		}
		
		// iterates through all edges which have the selected EFP
		for (var i = 0; i < this.efpsStruct[tmpEfpId].length; i++) {
			var tmpEdgeId = this.efpsStruct[tmpEfpId][i];
			diameterLeft = this.minDiameter;
			diameterRight = this.minDiameter;
			
			// calculate avg
			var selectedEfpAvg = this.calculateEfpAvg(efpName, this.graph.edges[tmpEdgeId - 1]);
			
			if (reset) {
				// remove tick symbol
				var lolliToRemove = document.getElementById("lollipop-tick" + tmpEdgeId);
				
				if(lolliToRemove != null) {
					var lolliParent = lolliToRemove.parentNode;
					lolliParent.removeChild(lolliToRemove);
				}
				
				}else {
				if(selectedEfpAvg != null && !singleSelectedEfpInDiagram) {
					// calculate the size - linear scaling
					diameterLeft = kLeft * selectedEfpAvg[0] + qLeft;
					diameterRight = kRight * selectedEfpAvg[1] + qRight;
				}
			}
			
			// set circle radius
			$(".lollipop[data-edgeid='" + tmpEdgeId + "'] circle").attr("r", diameterRight / 2);
			
			
			if (!reset) {
				if(selectedEfpAvg != null) {
					// set path dimensions
					var yDistance = diameterLeft / 2 + 4;
					// X distance of half-circle's "draggers" should be equal to 2/3 of circle diameter (eg. circle diametr=24, draggers=16)
					var xDistance = yDistance * 4 / 3;
					var distanceOffsetToRight = diameterRight / 2;
					// add distance between lolli and circle
					var dString = 'M' + distanceOffsetToRight + ',' + -yDistance + ' C' + (xDistance + distanceOffsetToRight) + ',' + -yDistance + ' ' + (xDistance + distanceOffsetToRight) + ',' + yDistance + ' ' + distanceOffsetToRight + ',' + yDistance;
					
					$(".lollipop[data-edgeid='" + tmpEdgeId + "'] path").first().attr("d", dString);
				}
				
				// add tick symbol if needed
				if(this.graph.edges[tmpEdgeId-1].edgeStatusOk) {
					// create tick element
					var tick = document.createElementNS('http://www.w3.org/2000/svg','path');
					tick.setAttribute('class','SamplePath');
					tick.setAttribute('id', 'lollipop-tick' + tmpEdgeId);
					tick.setAttribute('d','M-4,-2 C-3,12 1,0 5,-7');
					tick.setAttribute('stroke','green');
					
					// get the angle
					var xforms = $(".lollipop[data-edgeid='" + tmpEdgeId + "']").attr('transform');
					var parts  = /rotate\(\s*([^\s,)]+)[ ,]([^\s,)]+)[ ,]([^\s,)]+)/.exec(xforms);
					var angle = parts[1];
					
					// prevent rotation
					tick.setAttribute('transform','rotate(' + (-angle) + ',0,0) translate(0,0)');
					
					// add the tick
					var lollipop = $(".lollipop[data-edgeid='" + tmpEdgeId + "']")[0];
					lollipop.appendChild(tick);
				}
				}else {
				// set path dimensions
				var yDistance = diameterLeft / 2 + 4;
				// X distance of half-circle's "draggers" should be equal to 2/3 of circle diameter (eg. circle diametr=24, draggers=16)
				var xDistance = yDistance * 4 / 3;
				var dString = 'M0,' + -yDistance + ' C' + xDistance + ',' + -yDistance + ' ' + xDistance + ',' + yDistance + ' 0,' + yDistance;
				
				$(".lollipop[data-edgeid='" + tmpEdgeId + "'] path").first().attr("d", dString);
			}
		}
		
	},
	
};