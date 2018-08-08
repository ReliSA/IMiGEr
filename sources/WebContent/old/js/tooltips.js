var compatibilityTooltip = "";

/**
 * Configuration of detail vertex tooltip (setting style).
 *
 * @param selectorString selector as string
 */
function configurationVertexDetailTooltip(selectorString) {
	$(selectorString).each(function() {
		$(this).qtip({
			show : {
				solo : true,
				delay : 1000 // display after a 1sec hover
			},
			hide : {
				event : 'click'
			},
			content : {
				text : getTooltipVertex(stringToInt($(this).attr("data-vertexId"))),
				title : {
					text : getSymbolicName(stringToInt($(this).attr("data-vertexId"))),
					button : 'Close'
				}
			},
			position : {
				my : "top right",
				at : "bottom right",
				adjust : {
					y : 2
				}
				// ,viewport: $("#viewport")
			},
			style : {
				tip : {
					corner : 'top right'
				},
				classes : "qtip-green qtip-rounded qtip-shadow"
			}
		});
	});
}

/**
 * Configuration of vertex tooltip (setting style).
 *
 * @param selectorString selector as String
 */
function configurationVertexTooltip(selectorString) {
	$(selectorString).each(function() {
		$(this).qtip({
			show: {
				solo : true,
				delay : 0,
				event : 'click'
			},
			hide: {
				when: 'mouseout',
				fixed: true
			},
			content: {
				text : getTooltipVertex(stringToInt($(this).attr("data-vertexId"))),
				title : {
					text : getSymbolicName(stringToInt($(this).attr("data-vertexId"))),
					button : 'Close'
				}
			},
			position : {
				my : "top center",
				at : "bottom center",
				adjust : {
					x : 2
				}
			},
			style : {
				tip : {
					corner : 'top center'
				},
				classes : "qtip-green qtip-rounded qtip-shadow"
			}
		});
	});
}

/**
 * Configuration of edge tooltip (setting style).
 *
 * @param selectorString selector as String
 */
function configurationEdgeTooltip(selectorString) {
	$(selectorString).each(function() {
		$(this).qtip({
			show: {
				solo: true,
				delay: 0,
				event: 'click'
			},
			hide: {
				when: 'mouseout',
				fixed: true
			},
			content: {
				text: getTooltipEdge(stringToInt($(this).attr("data-edgeId"))),
				title: {
					text: getEdgeTipTitle(),
					button: 'Close',
				}
			},
			position: {
				//target: 'mouse',//[$(selectorString).offset().left, $(selectorString).offset().top],
				my: 'top left', // forces clicked thing to top left relatively to the top left corner of the tip-box
				at: 'top left',
				container: $("#content"),
				adjust: {
					x: 15,
					y: 140,
					mouse: false
				}
				//,viewport : $("#viewport") // source of a horrible BUGFEST... - loudilj
			},
			style: {
				classes: getTooltipEdgeClasses()
			},
			events: {
				visible: function (event, api) {
					if (GraphManager.isEfpGraph || GraphManager.isCompatibilityGraph) {
						// set up the jsTree instead of plain list for EFP graphs
						setUpTooltipList($(this).find('ul').parent());
					}
				}
			}
		});
	});
}

/**
 * Return tooltip fo vertex wiht given id.
 *
 * @param id id of vertex
 * @returns {string} tooltip text
 */
function getTooltipVertex(id) {
	var tooltip = "<div><ul class='tooltip_vertex_left'>",
		exportedPackages = getExportedPackages(id),
		importedPackages = getImportedPackages(id);
	
	if (!GraphManager.isEfpGraph) {
		tooltip += "<li class='tooltip_import_package'>" + "Import packages:" + "</li>";
	} else {
		tooltip += "<li class='tooltip_import_package'>" + "Import features:" + "</li>";
	}

	for (var i = 0; i < importedPackages.length; i++) {
		tooltip += "<li>" + importedPackages[i] + "</li>";
	}
	
	tooltip += "</ul><ul class='tooltip_vertex_right'>";
	
	if (!GraphManager.isEfpGraph) {
		tooltip += "<li class='tooltip_export_package'>" + "Export packages:" + "</li>";
	} else {
		tooltip += "<li class='tooltip_export_package'>" + "Export features:" + "</li>";
	}
	
	for (var j = 0; j < exportedPackages.length; j++) {
		tooltip += "<li>" + exportedPackages[j] + "</li>";
	}
	tooltip += "</ul><br class='clean'/></div>";
	
	return tooltip;
}

/**
 * Set tooltip to edge.
 *
 * @param id id of edge
 * @returns {string} tooltip of edge with given id.
 */
function getTooltipEdge(id) {
	var tooltip = "<div id='edgeTooltipListDiv" + (id - 1) + "'><ul id='edgeTooltipList" + (id - 1) + "'>",
		i;
	
	if (GraphManager.isCompatibilityGraph) {
		var edge = GraphManager.graph.edges[(id - 1)];
		if (edge.hasOwnProperty('compInfoJSON')) {
			tooltip += getCompatibilityInfo(JSON.parse(edge.compInfoJSON));
		}
	} else if (!GraphManager.isEfpGraph) { // EFP graph or not
		var connectionList = getConnections(id);
		
		if (connectionList.length === 0) {
			tooltip += "<li>No packages</li>";
		}
		for (i = 0; i < connectionList.length; i++) {
			tooltip += "<li>" + connectionList[i] + "</li>";
		}
	} else {
		var features = GraphManager.graph.edges[(id - 1)].features;
		
		// sort features by name
		features.sort(function (a, b) {
			var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
			
			if (nameA < nameB) { //sort string ascending
				return -1;
			}
			
			if (nameA > nameB) {
				return 1;
			}
			
			//default return value (no sorting)
			return 0;
		});
		
		for (i = 0; i < features.length; i++) {
			var featureIcon, efpIcon;
			
			if (features[i].featureStatus == "OK") {
				featureIcon = "OK.png";
			} else {
				featureIcon = "ERROR.png";
			}
			
			tooltip += "<li><a href='#' class='featureListItem'>";
			
			// add icon if there are any EFPs
			if (features[i].efps.length !== 0) {
				tooltip += "</img src='images/efp_qtip/" + featureIcon + "' alt='" + features[i].featureStatus + "'>";
			}
			
			tooltip += features[i].name + "</a>";
			
			// no EFPs on this feature
			if (features[i].efps.length === 0) {
				tooltip += "</li>";
				continue;
			}
			
			tooltip += "<ul>";
			
			// sort efps by name
			features[i].efps.sort(function(a, b) {
				var nameA = a.efpName.toLowerCase(),
					nameB = b.efpName.toLowerCase();
				
				if (nameA < nameB) { //sort string ascending
					return -1;
				}
				
				if (nameA > nameB) {
					return 1;
				}
				
				//default return value (no sorting)
				return 0;
			});
			
			// all efps
			for (var j = 0; j < features[i].efps.length; j++) {
				if (features[i].efps[j].comparisonStatus == "OK") {
					efpIcon = "OK.png";
				} else {
					efpIcon = "ERROR.png";
				}
				
				tooltip += "<li><a href='#'></img src='images/efp_qtip/" + efpIcon + "' alt='" + features[i].efps[j].comparisonStatus + "'>" + features[i].efps[j].efpName + "</a>";
				
				var leftEfpValue = features[i].efps[j].leftEfpValue;
				if (!leftEfpValue) {
					leftEfpValue = 'No value';
				}
				
				var rightEfpValue = features[i].efps[j].rightEfpValue;
				if (!rightEfpValue) {
					rightEfpValue = 'No value';
				}
				
				tooltip += "<ul><li><a href='#'><span class='efpListLabel'></span> " + getTypeClassName(features[i].efps[j].typeName) + ", <span class='efpListLabel'></span> </img src='images/efp_qtip/required.png' alt='required'>" + leftEfpValue + ", </img src='images/efp_qtip/provided.png' alt='provided'>" + rightEfpValue + "</a></li></ul></li>";
			}
			tooltip += "</ul></li>";
		}
	}
	tooltip += "</ul></div>";
	
	return tooltip;
}

/**
 * Return the class name from full type name - cut the pkg path out.
 *
 * @param typeFullName full type name
 * @returns {string} type name without .pkg
 */
function getTypeClassName(typeFullName) {
	return typeFullName.substring(typeFullName.lastIndexOf(".") + 1);
}

/**
 * Return symbolic name of vertex with given id.
 *
 * @param idVertex id of vertex
 * @returns {*}  symbolic name of vertex
 */
function getSymbolicName(idVertex) {
	return GraphManager.graph.vertices[idVertex - 1].symbolicName;
}

/**
 * Get title for edge tooltip
 *
 * @returns {*} title for edge tooltip.
 */
function getEdgeTipTitle() {
	var title = 'Involved ';
	
	if (!GraphManager.isEfpGraph) {
		title += 'packages';
	} else {
		title += 'features';
	}
	
	if (GraphManager.isCompatibilityGraph) {
		return 'Incompatibility Details';
	}

	return title;
}

/**
 * Adds special class for EFP graphs in order to display lists properly.
 *
 * @returns {string} edge tooltip classes
 */
function getTooltipEdgeClasses() {
	var classes = "qtip-green qtip-rounded qtip-shadow";
	
	if (GraphManager.isEfpGraph) {
		classes += " ui-tooltip-with-efp";
	}
	
	if (GraphManager.isCompatibilityGraph) {
		classes += " qtip_width_setting";
	}
	
	return classes;
}

/**
*
* Sets jsTree to tooltip's content.
*
* @param list list of the desired qtip.
*/
function setUpTooltipList(list) {
	list.jstree({
		core : {
			"animation" : 25
		},
		themes : {
			"theme" : "classic",
			"dots" : true,
			"icons" : false
		},
		plugins : [ "themes", "html_data" ]
	});
}

/**
 * Return exported packages one vertex.
 *
 * @param idVertex id of vertex for which wil be returned exported packages
 * @returns {*}exported package
 */
function getExportedPackages(idVertex) {
	return GraphManager.graph.vertices[(idVertex - 1)].exportedPackages;
}

/**
 * Return imported packages one vertex.
 *
 * @param idVertex id of vertex for which wil be return imported packages
 * @returns {*}imported packages
 */
function getImportedPackages(idVertex) {
	return GraphManager.graph.vertices[(idVertex - 1)].importedPackages;
}

/**
 * Return package that are connected two vertices.
 * 
 * @param idEdge edge ID
 * @returns {*} package connecting two vertices
 */
function getConnections(idEdge) {
	return GraphManager.graph.edges[(idEdge - 1)].packageConnections;
}

/**
 * Return HTML for incompatibility tooltip
 * 
 * @param compatibilityInfo tooltip data
 * @returns {string} HTML with incompability tooltip
 */
function getCompatibilityInfo(compatibilityInfo) {
	compatibilityTooltip = "";
	for (var i = 0; i < compatibilityInfo.length; i++) {
		var cause = compatibilityInfo[i];

		compatibilityTooltip += "<li><strong>" + cause.causedBy + "</strong><ul>";
		for (var j = 0; j < cause.incomps.length; j++) {
			if (cause.incomps[j] &&  cause.incomps[j].subtree.length) {
				parseCompatibilityInfo(cause.incomps[j]);
			}
		}
		compatibilityTooltip += "</ul></li>";
	}
	compatibilityTooltip += "";

	return compatibilityTooltip;
}

/**
 * Traverses incompatibility JSON object and creates HTML nested list
 * 
 * @param data data to be parsed
 */
function parseCompatibilityInfo(data) {
	if (data.desc.isIncompCause) {
		compatibilityTooltip += "<li><strong class=\"incomp\">" + data.desc.incompName + "</strong>";
		compatibilityTooltip += "<ul class=\"compatibility-list\">";
		
		if (data.desc.difference != "DEL") {
			compatibilityTooltip += "<li><span><img src=\"images/efp_qtip/provided.png\"> <span class=\"second\">" + data.desc.objectNameSecond + "</span></span></li>";
			compatibilityTooltip += "<li><span><img src=\"images/efp_qtip/required.png\"> <span class=\"first\">" + data.desc.objectNameFirst + "</span></span></li>";
		}
		compatibilityTooltip += "</ul>";
	} else {
		if (data.desc.level > 0) {
			compatibilityTooltip += "<li><strong>" + data.desc.name + "</strong>";
		}
	}
	
	if (data.subtree.length) {
		if (data.desc.level > 0) {
			compatibilityTooltip += "<ul class=\"compatibility-list\">";
		}
		for (var i = 0; i < data.subtree.length; i++) {
			if (data.subtree[i].subtree.length || data.subtree[i].desc.isIncompCause) {
				parseCompatibilityInfo(data.subtree[i]);
			}
		}
		if (data.desc.level > 0) {
			compatibilityTooltip += "</ul>";
		}
	}
	if (data.desc.level > 0) {
		compatibilityTooltip += "</li>";
	}
}