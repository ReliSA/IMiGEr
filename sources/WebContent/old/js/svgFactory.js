/**
 * Factory creating all SVG elements used by the application.
 */
var SvgFactory = {
	/* jshint multistr: true */

	ns_str: 'http://www.w3.org/2000/svg',	
	efpMinIntDiameter : null,
	efpMaxIntDiameter : null,
	composedGroupInitialWidth: 186,

	/**
	 * Creates element for image of interfaces.
	 *
	 * @param size size
	 * @param vertexId vertex ID
	 * @returns {string} String with part of svg
	 */
	createInterface: function(size, vertexId) {
		return '<g class="interface" data-vertexId="' + vertexId + '" transform="translate(8,6)">\
			<rect width="10" height="15" x="0" y="0"/>\
			<rect width="6" height="3" x="-3" y="3"/>\
			<rect width="6" height="3" x="-3" y="9"/>\
			</g>';
	},

	/**
	 * Creates element for edge displayed in diagram area.
	 */
	createEdge: function(edge, isEfpGraph) {
		var svg;
		var sizeOfRectFrom = getSizeOfRectangle(edge.from.name),
			sizeOfRectTo = getSizeOfRectangle(edge.to.name),
			lollipop = getLollipopPosition(edge.from.x + sizeOfRectFrom / 2, edge.from.y + 13, edge.to.x + sizeOfRectTo / 2, edge.to.y + 13);
		
		svg = '<g class="edge" id="e' + edge.id + '">\
			<line x1="' + (edge.from.x + sizeOfRectFrom / 2) + '" y1="' + (edge.from.y + 13) + '" x2="' + (edge.to.x + sizeOfRectTo / 2) + '" y2="' + (edge.to.y + 13) + '" stroke="white" stroke-width="5"/>\
			<line x1="'+ (edge.from.x + sizeOfRectFrom / 2) + '" y1="' + (edge.from.y + 13) + '" x2="'+ (edge.to.x + sizeOfRectTo / 2) + '" y2="' + (edge.to.y + 13) + '" stroke-width="1"/>\
			<g class="lollipop" data-edgeId="' + edge.id + '" transform="rotate(' + lollipop.angle + ',' + lollipop.x + ',' + lollipop.y  + ')\
			translate('+ lollipop.x + ',' + lollipop.y  + ')">\
			<path class="SamplePath" d="M0,';

		// EFP graph should have paths based on settings
		if (isEfpGraph) {
			var yDistance = this.efpMinIntDiameter / 2 + 4;
			// X distance of half-circle's "draggers" should be equal to 2/3 of circle diameter (eg. circle diametr=24, draggers=16)
			var xDistance = yDistance * 4 / 3;

			svg += -yDistance + ' C' + xDistance + ',' + -yDistance + ' ' + xDistance + ',' + yDistance + ' 0,' + yDistance + '"/>';
		} else {
			svg += '-12 C16,-12 16,12 0,12"/>';
		}

		svg += '<circle cx="0" cy="0" r="';

		// EFP graph should have circles based on settings
		if (isEfpGraph) {
			// r = d/2
			svg += this.efpMinIntDiameter / 2;
		} else {
			svg += 8;
		}
		svg += '" />';

		// LM: fajfka/kriz - nekompatibilni komponenty
		if (edge.isCompatible) {
			svg += '<line class="lollipop-tick" x1="6" y1="-4" x2="-4" y2="6" transform="rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)" id="lollipop-tick_a_' + edge.id + '"></line>';
			svg += '<line class="lollipop-tick" x1="-5" y1="-3" x2="-4" y2="5"  transform="rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)" id="lollipop-tick_b_' + edge.id + '"></line>';
		} else {
			svg += '<line class="lollipop-cross" x1="-5" y1="-5" x2="5" y2="5" transform="rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)" id="lollipop-cross_a_' + edge.id + '"></line>';
			svg += '<line class="lollipop-cross" x1="-5" y1="5" x2="5" y2="-5" transform="rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)" id="lollipop-cross_b_' + edge.id + '"></line>';
		}

		// add EFP failure mark to edge if needed
		if (GraphManager.isEfpGraph && !edge.edgeStatusOk) {
			svg += '<line x1="'+ -4 +'" y1="' + -4 + '" x2="' + 4 + '" y2="' + 4 + '"\
				transform="rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)" class="lollipop-line' + edge.id + '" stroke="red" />\
				<line x1="'+ -4 +'" y1="' + 4 + '" x2="' + 4 + '" y2="' + -4 + '"\
				transform="rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)" class="lollipop-line' + edge.id + '" stroke="red" />';
		}

		svg += '</g></g>';

		return svg;
	},

	/**
	 * Creates element for vertex displayed in diagram area.
	 */
	createVertex: function(vertex) {
		var svg;

		svg = '<g class="node vertex colorNormal" id="vertex' + vertex.id + '" data-id="'+ vertex.id +'" transform="translate(' + vertex.x + ',' + vertex.y + ')">\
			<rect width="' + (vertex.size + 20) + '" height="26" />\
			<text x="' + vertex.size / 2 + '" y="13">' + vertex.name + '</text>';

		svg += this.createInterface(vertex.size, vertex.id);

		// pridani malych ctvercu vpravo
		svg += '<g id="rectTop'+ vertex.id +'" transform="translate('+ (vertex.size - 25) +', 0)" stroke-width="1">\
			<g id="lolGL'+ vertex.id +'" class="whiteColor" transform="translate(17,44) rotate(90,0,0) scale(0.8)">\
			<line x1="-25" y1="5" x2="-30" y2="5" stroke="black"/>\
			<path class="SamplePath" d="M-42,-5 C-27,-5 -27,15 -42,15" stroke="black" />\
			</g>\
			<text id="rectTopText'+ vertex.id +'" x="13" y="12"></text>\
			</g>';

		svg += '<g id="rectBot'+ vertex.id +'" transform="translate('+ (vertex.size - 5) +', 0)" stroke-width="1">\
			<g id="lolGP'+ vertex.id +'" class="whiteColor" transform="translate(38, 45) rotate(90,0,0) scale(0.8)">\
			<line x1="-25" y1="31" x2="-30" y2="31" stroke="black"/>\
			<circle cx="-42" cy="31" r="11" stroke="black" /> \
			</g>\
			<text id="rectBotText'+ vertex.id +'" x="13" y="12"></text>\
			</g>';

		svg += '</g>';

		return svg;
	},

	/**
	 * Creates element for group displayed in diagram area.
	 */
	createGroup: function(group) {
		var svg_w = $('#svg1').width();
		var svg_h_scroll_top = $('#viewport').scrollTop();
		var viewport_h =  $('#viewport').height();
		var svg_w_scroll_left = $('#viewport').scrollLeft() * -1; // musi se vynasobit -1 protoze vraci zapornou pozici
		var viewport_w =  $('#viewport').width();
		
		// positions
		var rand_x = Math.floor((Math.random()*200) - 100);
		var rand_y = Math.floor((Math.random()*200) - 100);
		
		var pos_x = group.x;
		var pos_y = group.y;
		
		// wrapper
		var svg_elm_g = document.createElementNS(this.ns_str, 'g');
		if (pos_x && pos_y) {
			svg_elm_g.setAttributeNS(null, 'transform', 'translate('+ pos_x +','+ pos_y+')');
		} else {
			var translate_x = (svg_w - (svg_w_scroll_left  + viewport_w/2 ) - rand_x);
			var translate_y = (svg_h_scroll_top + viewport_h/2 - rand_y);
			svg_elm_g.setAttributeNS(null, 'transform', 'translate(' + translate_x + ',' + translate_y + ')');
		}
		
		svg_elm_g.setAttributeNS(null, 'class', 'node group_vertices');
		svg_elm_g.setAttributeNS(null, 'id', 'gv_' + group.idGroup);
		svg_elm_g.setAttributeNS(null, 'data-id', group.idGroup);
		
		var rect_width = this.composedGroupInitialWidth;
		
		// rectangle
		var svg_elm_rect = document.createElementNS(this.ns_str, 'rect');
		svg_elm_rect.setAttributeNS(null,'height', 50);
		svg_elm_rect.setAttributeNS(null,'width', rect_width);
		svg_elm_rect.setAttributeNS(null,'stroke','black');
		svg_elm_rect.setAttributeNS(null,'fill', $('#rect' + group.idGroup).attr('fill')); // keep the SeCo group's color
		svg_elm_g.appendChild(svg_elm_rect);
		
		// group symbol
		var svg_elm_text = document.createElementNS(this.ns_str, 'text');
		svg_elm_text.setAttributeNS(null,'x', rect_width/2);
		svg_elm_text.setAttributeNS(null,'y', 38);
		svg_elm_text.setAttributeNS(null,'class', 'group-symbol');
		svg_elm_text.setAttributeNS(null,'id', 'symbol' + group.idGroup);
		
		var innerText = document.createTextNode(group.groupSymbol[0]);
		svg_elm_text.appendChild(innerText);

		svg_elm_g.appendChild(svg_elm_text);
		
		// group name
		var svg_elm_label = document.createElementNS(this.ns_str, 'text');
		svg_elm_label.setAttributeNS(null,'x', rect_width/2);
		svg_elm_label.setAttributeNS(null,'y', 35);
		svg_elm_label.setAttributeNS(null,'class', 'group-label');
		svg_elm_label.setAttributeNS(null,'id', 'labelTextElement' + group.idGroup);
		svg_elm_label.setAttributeNS(null,'display', 'none');
		
		var groupLabel = document.createTextNode(group.label);
		svg_elm_label.appendChild(groupLabel);
		
		svg_elm_g.appendChild(svg_elm_label);

		if (group.label == "Group") {
			
			svg_elm_text.setAttributeNS(null,'x', 20);
			svg_elm_text.setAttributeNS(null,'y', 20);
			svg_elm_text.setAttributeNS(null,'class', 'group-symbol group-symbol-big');

		} else {

			svg_elm_label.setAttributeNS(null,'display', '');
		}



		// required lollipop
		var svg_elm_req = document.createElementNS(this.ns_str, 'g');
		svg_elm_req.setAttributeNS(null,'id', 'required' + group.idGroup);
		
		if ($('#required' + group.idGroup).attr('class') == 'colorHighlightRequired') {
			svg_elm_req.setAttributeNS(null,'class', 'colorHighlightRequired');
		} else {
			svg_elm_req.setAttributeNS(null,'class', 'whiteColor');
		}
		
		var svg_elm_req_line = document.createElementNS(this.ns_str, 'line');
		svg_elm_req_line.setAttributeNS(null,'x1', rect_width - 31);
		svg_elm_req_line.setAttributeNS(null,'y1', '21');
		svg_elm_req_line.setAttributeNS(null,'x2', rect_width - 31);
		svg_elm_req_line.setAttributeNS(null,'y2', '27');
		svg_elm_req_line.setAttributeNS(null,'stroke', 'black');
		
		var svg_elm_req_path = document.createElementNS(this.ns_str, 'path');
		svg_elm_req_path.setAttributeNS(null,'class', 'SamplePath');
		svg_elm_req_path.setAttributeNS(null,'d', 'M146,12 C146,24 164,24 164,12');
		svg_elm_req_path.setAttributeNS(null,'stroke', 'black');
		
		var svg_elm_req_text = document.createElementNS(this.ns_str, 'text');
		svg_elm_req_text.setAttributeNS(null,'id', 'lolipC');
		svg_elm_req_text.setAttributeNS(null,'x', rect_width - 31);
		svg_elm_req_text.setAttributeNS(null,'y', '12');
		svg_elm_req_text.setAttributeNS(null,'text-anchor', 'middle');
		svg_elm_req_text.setAttributeNS(null,'fill', 'black');
		svg_elm_req_text.setAttributeNS(null,'dominant-baseline', 'central');
		svg_elm_req_text.setAttributeNS(null,'font-size', '11');
		
		var svg_elm_req_text_inner = document.createTextNode(group.requiredPackage.size());
		
		svg_elm_req_text.appendChild(svg_elm_req_text_inner);
		
		svg_elm_req.appendChild(svg_elm_req_line);
		svg_elm_req.appendChild(svg_elm_req_path);
		svg_elm_req.appendChild(svg_elm_req_text);


		// provided lollipop
		var svg_elm_prov = document.createElementNS(this.ns_str, 'g');
		svg_elm_prov.setAttributeNS(null,'id', 'provided' + group.idGroup);
		
		if ($('#provided' + group.idGroup).attr('class') == 'colorHighlightProvided') {
			svg_elm_prov.setAttributeNS(null,'class', 'colorHighlightProvided');
		} else {
			svg_elm_prov.setAttributeNS(null,'class', 'whiteColor');
		}
		
		var svg_elm_prov_line = document.createElementNS(this.ns_str, 'line');
		svg_elm_prov_line.setAttributeNS(null,'x1', rect_width - 11);
		svg_elm_prov_line.setAttributeNS(null,'y1', '21');
		svg_elm_prov_line.setAttributeNS(null,'x2', rect_width - 11);
		svg_elm_prov_line.setAttributeNS(null,'y2', '27');
		svg_elm_prov_line.setAttributeNS(null,'stroke', 'black');
		
		var svg_elm_prov_circle = document.createElementNS(this.ns_str, 'circle');
		svg_elm_prov_circle.setAttributeNS(null,'cx', rect_width - 11);
		svg_elm_prov_circle.setAttributeNS(null,'cy', '12');
		svg_elm_prov_circle.setAttributeNS(null,'r', '9');
		svg_elm_prov_circle.setAttributeNS(null,'stroke', 'black');
		
		var svg_elm_prov_text = document.createElementNS(this.ns_str, 'text');
		svg_elm_prov_text.setAttributeNS(null,'id', 'lolipD');
		svg_elm_prov_text.setAttributeNS(null,'x', rect_width - 11);
		svg_elm_prov_text.setAttributeNS(null,'y', '12');
		svg_elm_prov_text.setAttributeNS(null,'text-anchor', 'middle');
		svg_elm_prov_text.setAttributeNS(null,'fill', 'black');
		svg_elm_prov_text.setAttributeNS(null,'dominant-baseline', 'central');
		svg_elm_prov_text.setAttributeNS(null,'font-size', '11');
		
		var svg_elm_prov_text_inner = document.createTextNode(group.providedPackage.size());
		
		svg_elm_prov_text.appendChild(svg_elm_prov_text_inner);
		
		svg_elm_prov.appendChild(svg_elm_prov_line);
		svg_elm_prov.appendChild(svg_elm_prov_circle);
		svg_elm_prov.appendChild(svg_elm_prov_text);
		
		// add both lollipops to group
		svg_elm_g.appendChild(svg_elm_req);
		svg_elm_g.appendChild(svg_elm_prov);


		// decompose group into detached viewport link
		var svg_elm_ab2 = document.createElementNS(this.ns_str, 'a');
		svg_elm_ab2.setAttributeNS(this.ns_str,'xlink:href', '#');
		svg_elm_ab2.setAttributeNS(null, 'onclick', 'OffScreenKiv.showGroupInViewport("' + group.idGroup + '"); return false;');
		
		var svg_elm_r_inner_a2 = document.createElementNS(this.ns_str, 'rect');
		svg_elm_r_inner_a2.setAttributeNS(null,'rx', 4);
		svg_elm_r_inner_a2.setAttributeNS(null,'ry', 4);
		svg_elm_r_inner_a2.setAttributeNS(null,'x', rect_width - 86);
		svg_elm_r_inner_a2.setAttributeNS(null,'y', 4);
		svg_elm_r_inner_a2.setAttributeNS(null,'height', 14);
		svg_elm_r_inner_a2.setAttributeNS(null,'width', 14);
		svg_elm_r_inner_a2.setAttributeNS(null,'stroke','black');
		svg_elm_r_inner_a2.setAttributeNS(null,'fill','#FFFFFF');
		
		//  čára v plus směr: -
		var svg_elm_l1_inner_a2 = document.createElementNS(this.ns_str, 'line');
		svg_elm_l1_inner_a2.setAttributeNS(null,'x1', rect_width - 86 + 2);
		svg_elm_l1_inner_a2.setAttributeNS(null,'y1', 11);
		svg_elm_l1_inner_a2.setAttributeNS(null,'x2', rect_width - 86 + 12);
		svg_elm_l1_inner_a2.setAttributeNS(null,'y2', 11);
		svg_elm_l1_inner_a2.setAttributeNS(null,'height', 14);
		svg_elm_l1_inner_a2.setAttributeNS(null,'width', 14);
		svg_elm_l1_inner_a2.setAttributeNS(null,'style','stroke:#000000;stroke-width:2;');
		
		// čára v plus směr: |
		var svg_elm_l2_inner_a2 = document.createElementNS(this.ns_str, 'line');
		svg_elm_l2_inner_a2.setAttributeNS(null,'x1', rect_width - 86 + 7);
		svg_elm_l2_inner_a2.setAttributeNS(null,'y1', 6);
		svg_elm_l2_inner_a2.setAttributeNS(null,'x2', rect_width - 86 + 7);
		svg_elm_l2_inner_a2.setAttributeNS(null,'y2', 16);
		svg_elm_l2_inner_a2.setAttributeNS(null,'height', 14);
		svg_elm_l2_inner_a2.setAttributeNS(null,'width', 14);
		svg_elm_l2_inner_a2.setAttributeNS(null,'style','stroke:#000000;stroke-width:2;');
		
		svg_elm_ab2.appendChild(svg_elm_r_inner_a2);
		svg_elm_ab2.appendChild(svg_elm_l1_inner_a2);
		svg_elm_ab2.appendChild(svg_elm_l2_inner_a2);
		
		svg_elm_g.appendChild(svg_elm_ab2);


		// remove all components from group link
		var svg_elm_ab = document.createElementNS(this.ns_str, 'a');
		svg_elm_ab.setAttributeNS(this.ns_str,'xlink:href', '#');
		svg_elm_ab.setAttributeNS(null, 'onclick', 'OffScreenKiv.removeAllComponentFromGroup("'+ group.idGroup +'"); return false;');
		
		var svg_elm_r_inner_a = document.createElementNS(this.ns_str, 'rect');
		svg_elm_r_inner_a.setAttributeNS(null,'rx', 4);
		svg_elm_r_inner_a.setAttributeNS(null,'ry', 4);
		svg_elm_r_inner_a.setAttributeNS(null,'x', rect_width - 66);
		svg_elm_r_inner_a.setAttributeNS(null,'y', 4);
		svg_elm_r_inner_a.setAttributeNS(null,'height', 14);
		svg_elm_r_inner_a.setAttributeNS(null,'width', 14);
		svg_elm_r_inner_a.setAttributeNS(null,'stroke','black');
		svg_elm_r_inner_a.setAttributeNS(null,'fill','#FFFFFF');
		
		var svg_elm_l1_inner_a = document.createElementNS(this.ns_str, 'line');
		svg_elm_l1_inner_a.setAttributeNS(null,'x1', rect_width - 66 + 4);
		svg_elm_l1_inner_a.setAttributeNS(null,'y1', 8);
		svg_elm_l1_inner_a.setAttributeNS(null,'x2', rect_width - 66 + 11);
		svg_elm_l1_inner_a.setAttributeNS(null,'y2', 15);
		svg_elm_l1_inner_a.setAttributeNS(null,'height', 14);
		svg_elm_l1_inner_a.setAttributeNS(null,'width', 14);
		svg_elm_l1_inner_a.setAttributeNS(null,'style','stroke:#CA0000;stroke-width:2;');
		
		var svg_elm_l2_inner_a = document.createElementNS(this.ns_str, 'line');
		svg_elm_l2_inner_a.setAttributeNS(null,'x1', rect_width - 66 + 11);
		svg_elm_l2_inner_a.setAttributeNS(null,'y1', 8);
		svg_elm_l2_inner_a.setAttributeNS(null,'x2', rect_width - 66 + 4);
		svg_elm_l2_inner_a.setAttributeNS(null,'y2', 15);
		svg_elm_l2_inner_a.setAttributeNS(null,'height', 14);
		svg_elm_l2_inner_a.setAttributeNS(null,'width', 14);
		svg_elm_l2_inner_a.setAttributeNS(null,'style','stroke:#CA0000;stroke-width:2;');
		
		svg_elm_ab.appendChild(svg_elm_r_inner_a);
		svg_elm_ab.appendChild(svg_elm_l1_inner_a);
		svg_elm_ab.appendChild(svg_elm_l2_inner_a);
		
		svg_elm_g.appendChild(svg_elm_ab);

		return svg_elm_g;
	},

	/**
	 * Creates element for group displayed in diagram area as detached viewport.
	 */
	createGroupViewport: function(group, coords, dependencies) {
		var width = 600;
		var height = 300;
		var paddingHorizontal = 60;
		var paddingVertical = 10;
		var headerWidth = 200;
		var groupFill = $('#rect' + group.idGroup).attr('fill');

		// wrapper
		var wrapper = createSvgElement('g', {
			'class': 'node group_viewport',
			'id': 'groupViewport_' + group.idGroup,
			'data-groupId': group.idGroup,
		});


		var inner1 = createSvgElement('g', {
			'transform': 'translate(' + coords.x + ',' + coords.y + ')',			
		});

		// inner silver rectangle
		inner1.appendChild(createSvgElement('rect', {
			'width': width,
			'height': height,
			'class': 'handle',
			'fill': '#EEE',
		}));

		// inner viewport area
		inner1.appendChild(createSvgElement('rect', {
			'width': width - (2 * paddingHorizontal),
			'height': height - (2 * paddingVertical),
			'x': paddingHorizontal,
			'y': paddingVertical,
			'fill': '#FFF',
		}));

		// header
		var size = getSizeOfRectangle(group.idGroup);

		var header = createSvgElement('g', {
			'class': 'handle',
			'transform': 'translate(0, -5)',
		});

		header.appendChild(createSvgElement('rect', {
			'height': 25,
			'width': headerWidth,
			'fill': groupFill,
		}));

		// group name
		var label = createSvgElement('text', {
			'x': 40,
			'y': 11,
			'class': 'group-label',
			'id': 'labelTextElement' + group.idGroup,
		});
		label.appendChild(document.createTextNode(group.label));

		header.appendChild(label);

		// hide detached viewport link
		var hideLink = document.createElementNS(this.ns_str, 'a');
		hideLink.setAttributeNS(this.ns_str,'xlink:href', '#');
		hideLink.setAttributeNS(null, 'onclick', 'OffScreenKiv.hideGroupViewport("' + group.idGroup + '"); return false;');

		// icon
		var hideLink_1 = document.createElementNS(this.ns_str, 'rect');
		hideLink_1.setAttributeNS(null, 'rx', 4);
		hideLink_1.setAttributeNS(null, 'ry', 4);
		hideLink_1.setAttributeNS(null, 'x', size + 10);
		hideLink_1.setAttributeNS(null, 'y', 5);
		hideLink_1.setAttributeNS(null, 'height', 14);
		hideLink_1.setAttributeNS(null, 'width', 14);
		hideLink_1.setAttributeNS(null, 'stroke', 'black');
		hideLink_1.setAttributeNS(null, 'fill', '#FFFFFF');

		var hideLink_2 = document.createElementNS(this.ns_str, 'line');
		hideLink_2.setAttributeNS(null, 'x1', size + 10 + 2);
		hideLink_2.setAttributeNS(null, 'y1', 15);
		hideLink_2.setAttributeNS(null, 'x2', size + 10 + 12);
		hideLink_2.setAttributeNS(null, 'y2', 15);
		hideLink_2.setAttributeNS(null, 'stroke', 'black');
		hideLink_2.setAttributeNS(null, 'class', 'compose');
		hideLink_2.setAttributeNS(null, 'style', 'stroke-width:2;');

		hideLink.appendChild(hideLink_1);
		hideLink.appendChild(hideLink_2);

		header.appendChild(hideLink);


		// remove all components from group link
		var removeLink = document.createElementNS(this.ns_str, 'a');
		removeLink.setAttributeNS(this.ns_str,'xlink:href', '#');
		removeLink.setAttributeNS(null, 'onclick', 'OffScreenKiv.removeAllComponentFromGroup("' + group.idGroup + '"); return false;');

		var removeLink_1 = document.createElementNS(this.ns_str, 'rect');
		removeLink_1.setAttributeNS(null, 'rx', 4);
		removeLink_1.setAttributeNS(null, 'ry', 4);
		removeLink_1.setAttributeNS(null, 'x', size + 10 + 20);
		removeLink_1.setAttributeNS(null, 'y', 5);
		removeLink_1.setAttributeNS(null, 'height', 14);
		removeLink_1.setAttributeNS(null, 'width', 14);
		removeLink_1.setAttributeNS(null, 'stroke', 'black');
		removeLink_1.setAttributeNS(null, 'fill', '#FFFFFF');

		var removeLink_2 = document.createElementNS(this.ns_str, 'line');
		removeLink_2.setAttributeNS(null, 'x1', size + 10 + 23);
		removeLink_2.setAttributeNS(null, 'y1', 9);
		removeLink_2.setAttributeNS(null, 'x2', size + 10 + 31);
		removeLink_2.setAttributeNS(null, 'y2', 16);
		removeLink_2.setAttributeNS(null, 'height', 14);
		removeLink_2.setAttributeNS(null, 'width', 14);
		removeLink_2.setAttributeNS(null, 'style', 'stroke:#CA0000;stroke-width:2;');

		var removeLink_3 = document.createElementNS(this.ns_str, 'line');
		removeLink_3.setAttributeNS(null, 'x1', size + 10 + 23);
		removeLink_3.setAttributeNS(null, 'y1', 16);
		removeLink_3.setAttributeNS(null, 'x2', size + 10 + 31);
		removeLink_3.setAttributeNS(null, 'y2', 9);
		removeLink_3.setAttributeNS(null, 'height', 14);
		removeLink_3.setAttributeNS(null, 'width', 14);
		removeLink_3.setAttributeNS(null, 'style', 'stroke:#CA0000;stroke-width:2;');

		removeLink.appendChild(removeLink_1);
		removeLink.appendChild(removeLink_2);
		removeLink.appendChild(removeLink_3);

		header.appendChild(removeLink);

		inner1.appendChild(header);


		var inner2 = createSvgElement('g', {
			'class': 'viewportTransform',
			'transform': 'translate(' + coords.x + ',' + coords.y + ')',			
		});

		// add components
		var edgesIn = {};
		var edgesOut = {};
		var edgesOuter = {};

		var edgesOutElements = [];

		var vertexId;
		var vertex;
		var edgeId;
		var edge;
		var g;

		for (vertexId in group.items.getAll()) {
			vertex = group.items.get(vertexId);

			vertex.x = paddingHorizontal + Math.random() * (width - (2 * paddingHorizontal) - vertex.size);
			vertex.y = paddingVertical + Math.random() * (height - (2 * paddingVertical) - 20);

			// handle edges
			for (i = 0; i < vertex.edges.length; i++) {
				edge = vertex.edges[i];

				// edge between two nodes of the group
				if ((edge.from.id != vertex.id && group.items.contains(edge.from.id)) ||
					(edge.to.id != vertex.id && group.items.contains(edge.to.id))
				) {
					if (edgesIn.hasOwnProperty(edge.id)) continue;

					edgesIn[edge.id] = edge;

					// edge leads outside of the group
				} else {
					if (edgesOut.hasOwnProperty(edge.id)) continue;

					edgesOut[edge.id] = edge;
				}
			}
		}

		for (edgeId in edgesOut) {
			edge = edgesOut[edgeId];

			var isRequired = group.items.contains(edge.from.id);

			var vertexFrom,
				vertexTo;

			if (isRequired) {
				vertexFrom = edge.from;
				vertexTo = edge.to;
			} else {
				vertexFrom = edge.to;
				vertexTo = edge.from;
			}

			var edgeOuter;
			if (edgesOuter.hasOwnProperty(vertexFrom.id)) {
				edgeOuter = edgesOuter[vertexFrom.id];
			} else {
				edgeOuter = {
					from: vertexFrom,
					dependencies: OffScreenKiv.countDependence(vertexFrom),
					requiredComponents: [],
					providedComponents: [],
				};

				edgesOuter[vertexFrom.id] = edgeOuter;
			}

			if (isRequired) {
				edgeOuter.requiredComponents.push(edge.to);
			} else {
				edgeOuter.providedComponents.push(edge.from);
			}
		}

		// draw edges
		for (edgeId in edgesIn) {
			edge = edgesIn[edgeId];

			var sizeOfRectFrom = edge.from.size;
			var sizeOfRectTo = edge.to.size;

			g = createSvgElement('g', {
				class: 'egde',
				id: 'e' + edge.id,
			});

			g.appendChild(createSvgElement('line', {
				x1: edge.from.x + sizeOfRectFrom/2,
				y1: edge.from.y + 13,
				x2: edge.to.x + sizeOfRectTo/2,
				y2: edge.to.y + 13,
				stroke: 'white',
				'stroke-width': 5,
			}));
			g.appendChild(createSvgElement('line', {
				x1: edge.from.x + sizeOfRectFrom/2,
				y1: edge.from.y + 13,
				x2: edge.to.x + sizeOfRectTo/2,
				y2: edge.to.y + 13,
				'stroke-width': 1,
			}));

			// lollipop
			var lollipop = getLollipopPosition(edge.from.x + sizeOfRectFrom/2, edge.from.y + 13, edge.to.x + sizeOfRectTo/2, edge.to.y + 13);
			var icon = createSvgElement('g', {
				class: 'lollipop',
				'data-edgeId': edge.id,
				transform: 'translate(' + lollipop.x + ',' + lollipop.y + ') rotate(' + lollipop.angle  + ')',
				fill: 'white',
			});

			icon.appendChild(createSvgElement('path', {
				class: 'SamplePath',
				d: 'M0,-12 C16,-12 16,12 0,12',
			}));
			icon.appendChild(createSvgElement('circle', {
				cx: 0,
				cy: 0,
				r: 8,
			}));
			if (edge.isCompatible) {
				icon.appendChild(createSvgElement('line', {
					class: 'lollipop-tick',
					id: 'lollipop-tick_a_' + edge.id,
					x1: 6,
					y1: -4,
					x2: -4,
					y2: 6,
					transform: 'rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)',
				}));
				icon.appendChild(createSvgElement('line', {
					class: 'lollipop-tick',
					id: 'lollipop-tick_b_' + edge.id,
					x1: -5,
					y1: -3,
					x2: -4,
					y2: 5,
					transform: 'rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)',
				}));

			} else {
				icon.appendChild(createSvgElement('line', {
					class: 'lollipop-cross',
					x1: -5,
					y1: -5,
					x2: 5,
					y2: 5,
					transform: 'rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)',
				}));
				icon.appendChild(createSvgElement('line', {
					class: 'lollipop-cross',
					x1: -5,
					y1: 5,
					x2: 5,
					y2: -5,
					transform: 'rotate(' + (-lollipop.angle) + ',0,0) translate(0,0)',
				}));
			}

			g.appendChild(icon);

			inner2.appendChild(g);
		}

		for (edgeId in edgesOuter) {
			edge = edgesOuter[edgeId];

			// get coordinates
			var left = (edge.from.x + edge.from.size / 2) < (width / 2);
			var x = edge.from.x + edge.from.size / 2;
			var y = edge.from.y;
			var x2 = left ? (paddingHorizontal / 2) : (width - (paddingHorizontal / 2));
			var x2_1 = left ? x2 + 15 : x2 - 15;
			var x2_2 = left ? x2 - 15 : x2 + 15;

			// required
			(function(edgeId){
				var inEdge = createSvgElement('g', {
					class: 'egde edge-viewport-in',
				});

				inEdge.appendChild(createSvgElement('line', {
					x1: x,
					y1: y + 5,
					x2: x2_1,
					y2: y - 5,
					stroke: 'white',
					'stroke-width': 5,
				}));
				inEdge.appendChild(createSvgElement('line', {
					x1: x,
					y1: y + 5,
					x2: x2_1,
					y2: y - 5,
					'stroke-width': 1,
				}));

				// line connecting lollipop and proxy counter
				inEdge.appendChild(createSvgElement('line', {
					x1: x2_1,
					y1: (y - 5),
					x2: x2_2,
					y2: (y - 5),
					'stroke-width': 1,
				}));

				// lollipop
				var lollipop = createSvgElement('g', {
					class: 'lollipop whiteColor',
					transform: 'translate(' + x2_1 + ',' + (y - 5)  + ')',
				});

				var path = left ? 'M0,-12 C-16,-12 -16,12 0,12' : 'M0,-12 C16,-12 16,12 0,12';
				lollipop.appendChild(createSvgElement('path', {
					d: path,
				}));
				lollipop.appendChild(createSvgElement('circle', {
					cx: 0,
					cy: 0,
					r: 8,
				}));

				var providedText = createSvgElement('text', {
					'class': 'lollipop-required',
				});
				providedText.appendChild(document.createTextNode(edge.dependencies.countFrom));

				lollipop.appendChild(providedText);

				inEdge.appendChild(lollipop);

				// proxy counter
				var proxyCounter = createSvgElement('g', {
					class: 'proxy-counter whiteColor',
					transform: 'translate('+ x2_2 +', '+ (y - 5) +')',
				});

				proxyCounter.appendChild(createSvgElement('rect', {
					x: -10,
					y: -10,
					width: 20,
					height: 20,
					rx: 5,
					ry: 5,
				}));

				var componentsCountText = createSvgElement('text', {
					'class': 'counter-required',
				});
				componentsCountText.appendChild(document.createTextNode(edge.requiredComponents.length));
				proxyCounter.appendChild(componentsCountText);

				$(proxyCounter).click(function(e){
					$('.edge-required-'+ edgeId).toggle();
				});

				inEdge.appendChild(proxyCounter);


				inner2.appendChild(inEdge);


				for (var i = 0; i < edge.requiredComponents.length; i++) {
					var vertex = edge.requiredComponents[i];

					var outEdge = createSvgElement('g', {
						'class': 'egde edge-viewport-out edge-required-'+ edgeId,
						'data-from-id': vertex.id,
					});

					outEdge.appendChild(createSvgElement('line', {
						x1: coords.x + x2_2,
						y1: coords.y + y - 5,
						x2: vertex.x + (vertex.size / 2),
						y2: vertex.y + 13,
						stroke: 'white',
						'stroke-width': 5,
					}));
					outEdge.appendChild(createSvgElement('line', {
						x1: coords.x + x2_2,
						y1: coords.y + y - 5,
						x2: vertex.x + (vertex.size / 2),
						y2: vertex.y + 13,
						'stroke-width': 1,
					}));

					edgesOutElements.push(outEdge);
				}
			})(edgeId);

			// provided
			(function(edgeId){
				var inEdge = createSvgElement('g', {
					class: 'egde edge-viewport-in',
				});

				inEdge.appendChild(createSvgElement('line', {
					x1: x,
					y1: y + 15,
					x2: x2_1,
					y2: y + 25,
					stroke: 'white',
					'stroke-width': 5,
				}));
				inEdge.appendChild(createSvgElement('line', {
					x1: x,
					y1: y + 15,
					x2: x2_1,
					y2: y + 25,
					'stroke-width': 1,
				}));

				// line connecting lollipop and proxy counter
				inEdge.appendChild(createSvgElement('line', {
					x1: x2_1,
					y1: (y + 25),
					x2: x2_2,
					y2: (y + 25),
					'stroke-width': 1,
				}));

				// lollipop
				var lollipop = createSvgElement('g', {
					class: 'lollipop whiteColor',
					transform: 'translate(' + (left ? x2_1 - 3 : x2_1 + 3) + ',' + (y + 25)  + ')',
				});

				var path = left ? 'M0,-12 C16,-12 16,12 0,12' : 'M0,-12 C-16,-12 -16,12 0,12';
				lollipop.appendChild(createSvgElement('path', {
					d: path,
				}));
				lollipop.appendChild(createSvgElement('circle', {
					cx: 0,
					cy: 0,
					r: 8,
				}));

				var requiredText = createSvgElement('text', {
					'class': 'lollipop-provided',
				});
				requiredText.appendChild(document.createTextNode(edge.dependencies.countTo));
				lollipop.appendChild(requiredText);

				inEdge.appendChild(lollipop);

				// proxy counter
				var proxyCounter = createSvgElement('g', {
					class: 'proxy-counter whiteColor',
					transform: 'translate('+ x2_2 +', '+ (y + 25) +')',
				});

				proxyCounter.appendChild(createSvgElement('rect', {
					x: -10,
					y: -10,
					width: 20,
					height: 20,
					rx: 5,
					ry: 5,
				}));

				var componentsCountText = createSvgElement('text', {
					'class': 'counter-provided',
				});
				componentsCountText.appendChild(document.createTextNode(edge.providedComponents.length));
				proxyCounter.appendChild(componentsCountText);

				$(proxyCounter).click(function(e){
					$('.edge-provided-'+ edgeId).toggle();
				});

				inEdge.appendChild(proxyCounter);

				inner2.appendChild(inEdge);


				for (var i = 0; i < edge.providedComponents.length; i++) {
					var vertex = edge.providedComponents[i];

					var outEdge = createSvgElement('g', {
						'class': 'egde edge-viewport-out edge-provided-'+ edgeId,
						'data-from-id': vertex.id,
					});

					outEdge.appendChild(createSvgElement('line', {
						x1: coords.x + x2_2,
						y1: coords.y + y + 25,
						x2: vertex.x + (vertex.size / 2),
						y2: vertex.y + 13,
						stroke: 'white',
						'stroke-width': 5,
					}));
					outEdge.appendChild(createSvgElement('line', {
						x1: coords.x + x2_2,
						y1: coords.y + y + 25,
						x2: vertex.x + (vertex.size / 2),
						y2: vertex.y + 13,
						'stroke-width': 1,
					}));

					edgesOutElements.push(outEdge);
				}
			})(edgeId);
		}

		// draw vertices
		for (vertexId in group.items.getAll()) {
			vertex = group.items.get(vertexId);

			g = createSvgElement('g', {
				class: 'node vertex colorNormal',
				id : 'vertex'+ vertex.id,
				transform: 'translate('+ vertex.x +','+ vertex.y +')',
			});

			g.appendChild(createSvgElement('rect', {
				width: vertex.size + 20,
				height: 26,
			}));

			var text = createSvgElement('text', {
				x: vertex.size / 2,
				y: 13,
				'text-anchor': 'middle',
				'dominant-baseline': 'baseline',
			});
			text.appendChild(document.createTextNode(vertex.name));
			g.appendChild(text);

			var interface = createSvgElement('g', {
				'data-vertexId': vertex.id,
				transform: 'translate(8,6)',
			});
			interface.appendChild(createSvgElement('rect', {
				width: 10,
				height: 15,
				x: 0,
				y: 0,
			}));
			interface.appendChild(createSvgElement('rect', {
				width: 6,
				height: 3,
				x: -3,
				y: 3,
			}));
			interface.appendChild(createSvgElement('rect', {
				width: 6,
				height: 3,
				x: -3,
				y: 9,
			}));
			g.appendChild(interface);

			inner2.appendChild(g);
		}

		
		// put it all together
		wrapper.appendChild(inner1);

		for (var i = 0; i < edgesOutElements.length; i++) {
			wrapper.appendChild(edgesOutElements[i]);
		}

		wrapper.appendChild(inner2);

		return wrapper;
	},

	/**
	 * Creates SVG element for vertex displayed in SeCo.
	 */
	createVertexDetail: function(vertex) {
		var name,
			dependencies = OffScreenKiv.countDependence(vertex),
			svg;

		if (vertex.name.length > 30) {
			name = vertex.name.substring(0, 27) + '...';
		} else {
			name = vertex.name;
		}
		
		svg = '<svg id="d' + vertex.id + '" xmlns="http://www.w3.org/2000/svg" version="1.1" width="272" height="60">';
		svg += '<g transform="translate(60,10)" class="colorNormal vertex" id="component' + vertex.id + '">\
			<g class="detail colorNormal" id="detailVertex' + vertex.id + '" data-vertexId="' + vertex.id + '">\
			<rect height="40" width="220" y="0" x="-10" />\
			<text y="20" x="-5">' + name + '</text>\
			</g>';
		svg += '<g id="required' + vertex.id + '" class="whiteColor">\
			<line x1="-10" y1="5" x2="-30" y2="5" stroke="black"/>\
			<path class="SamplePath" d="M-42,-5 C-27,-5 -27,15 -42,15" stroke="black" />\
			<text id="lolipA" x="-42" y="5">' + dependencies.countTo + '</text>\
			</g>';
		svg += '<g id="provided' + vertex.id + '" class="whiteColor">\
			<line x1="-10" y1="35" x2="-30" y2="35" stroke="black"/>\
			<circle cx="-42" cy="35" r="11" stroke="black" /> \
			<text id="lolipB" x="-42" y="35">' + dependencies.countFrom + '</text>\
			</g>';
		svg += '</g>';
		svg += '</svg>';
		
		return svg;        
	},

	createGroupDetail: function(group) {
		var svg;

		svg = '<svg id="svgGroup' + group.idGroup + '" xmlns="http://www.w3.org/2000/svg" version="1.1" width="73" height="57" xmlns:xlink="http://www.w3.org/1999/xlink">';
		svg += '<g id="gr' + group.idGroup + '" class="vertex colorNormal" transform="translate(60,10)">\
			<rect id="rect'+ group.idGroup +'" ry="4" rx="4" height="56" width="20" y="0" x="-10" fill="' + group.groupSymbol[1] + '" stroke="black"/>\
			<text class="group-symbol" y="12" x="0" fill="black" stroke="none">' + group.groupSymbol[0] +'</text>';
		svg += '<a xlink:href="#" onclick="OffScreenKiv.showGroupInGraph(\''+ group.idGroup +'\'); return false;">\
			<rect y="21" x="-7" width="14" height="14" style="fill:rgb(255,255,255);stroke-width:1;stroke:rgb(0,0,0)"/>\
			<line x1="-5" y1="28" x2="2" y2="24" style="stroke:rgb(33,33,33);stroke-width:2" />\
			<line x1="-5" y1="28" x2="2" y2="32" style="stroke:rgb(33,33,33);stroke-width:2" />\
			<line x1="-5" y1="28" x2="5" y2="28" style="stroke:rgb(33,33,3);stroke-width:2" />\
			</a>';
		svg += '<a xlink:href="#" onclick="OffScreenKiv.removeAllComponentFromGroup(\''+ group.idGroup +'\'); return false;">\
			<rect y="38" x="-7" width="14" height="14" style="fill:rgb(255,255,255);stroke-width:1;stroke:rgb(0,0,0)"/>\
			<line x1="-4" y1="41" x2="4" y2="49" style="stroke:rgb(202,0,0);stroke-width:2" />\
			<line x1="-4" y1="49" x2="4" y2="41" style="stroke:rgb(202,0,0);stroke-width:2" />\
			</a>';
		svg += '<g id="required' + group.idGroup + '" class="whiteColor">\
			<line x1="-10" y1="5" x2="-30" y2="5" stroke="black"/>\
			<path class="SamplePath" d="M-42,-5 C-27,-5 -27,15 -42,15" stroke="black" />\
			<text id="lolipC" x="-42" y="5" fill="black">' + group.requiredPackage.size() + '</text>\
			</g>';
		svg += '<g id="provided' + group.idGroup + '" class="whiteColor">\
			<line x1="-10" y1="31" x2="-30" y2="31" stroke="black"/>\
			<circle cx="-42" cy="31" r="11" stroke="black" /> \
			<text id="lolipD" x="-42" y="31" fill="black">' + group.providedPackage.size() + '</text>\
			</g>';
		svg += '</g>';

		return svg;
	}

};