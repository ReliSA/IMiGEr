/**
* Function set height of elements #content,#proposal,#rightPanel
*/
function setHeight() {
	var headerHeight = $('#header').height() + $('#navigation').height() + 5;	/* magic 5, dunno where it comes from */
	var contentHeight = $(window).height() - headerHeight;
	
	$('#viewport').height(contentHeight);
	$('#rightPanel').height(contentHeight - 40); /* 40px is the sidebar-navbar */
}

/**
* Convert radian to degrees.
*
* @param radian - radian which will be converted
*/
function radianToDegrees(radian){
	return radian*(180.0/Math.PI);
}

/**
* Return position and direction of lollipop.
*
* @param x1 - x coordinate of the first point
* @param y1 - y coordinate of the first point
* @param x2 - x coordinate of the second point
* @param y2 - y coordinate of the second point
*/
function getLollipopPosition(x1, y1, x2, y2){
	var lollipop = {},
		vector1 = {};

	vector1.x = x2 - x1;
	vector1.y = y2 - y1;
	
	var lengthX = vector1.x*0.25,
		lengthY = vector1.y*0.25;

	lollipop.x = (x1 + lengthX);
	lollipop.y = (y1 + lengthY);
	//    lollipop.x = (x1 + x2)/2;
	//    lollipop.y = (y1 + y2)/2;
	
	lollipop.angle = -radianToDegrees(Math.atan2(vector1.x, vector1.y))+90;

	return lollipop;
}

/**
* Return id, which is parsed from string.
*
* @param idStr string which will be parsed
* @param indexFrom index
* @returns {Number} ID in int form
*/
function getIndexFromId(idStr, indexFrom){
	return parseInt(idStr.substr(indexFrom));
}

/**
 * Remove item from array
 *
 * @param array array from which will be removed
 * @param myKey item which will be removed
 * @returns {ArrayBuffer|Array.<T>|*|string|Blob} Array without removed item
 */
function removeItem(array,myKey) {
	var i = 0;

	for (var key in array){
		if (array.hasOwnProperty(key)) {
			if (key == myKey) {
				var del = array.slice(i, 1);
				return del;
			}
		}
		i++;
	}
}

/**
* Create svg element.
 *
* @param tag type of element (circle, rect, ...)
* @param attrs attributes of element
* @returns {Element} svg element.
*/
function createSvgElement(tag, attrs) {
	var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs) {
		el.setAttribute(k, attrs[k]);
	}
	return el;
}

/**
* Compute size of rectangle on the basic count of chars.7
 *
* @param name name
* @returns {number} size of rectangle
*/
function getSizeOfRectangle(name){
	return name.length * 8 + 35;
}

/**
 * Cut two last character from string.
 *
 * @param string string which will be cutted.
 * @returns {*} cutted string.
 */
function cutTwoLastCharacters(string){
	return string.substring(0,string.length-2);
}

/**
 * Parse string to int.
 *
 * @param string string which will be converted to int
 * @returns {Number} int
 */
function stringToInt(string){
	return parseInt(string);
}

/**
 * Parse string to float.
 *
 * @param string string which will be converted to float
 * @returns {Number} float
 */
function stringToFloat(string){
	return parseFloat(string);
}

/**
 * Set size of svg element.
 *
 * @param bbox bounding box of svg element
 */
function setSizeSvg(bbox){
	$("#svg1").css('width', bbox.width);
	$("#svg1").css('height', bbox.height);
}

/**
 * Set position of svg element with id #graph.
 *
 * @param x x axe position
 * @param y y axe position
 */
function setPositionSvg(x, y){
	$("#graph").attr('transform', 'translate('+ (-x) + ", " + (-y) + ')');
}

/** 
 * Extract coordinates from string stored in transform attribute.
 *
 * @param  transform	string contained in the attribute
 * @return object with x and y coordinates
 */
function getCoordinates(transform) {
	var parts  = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(transform);

	return {
		x: stringToFloat(parts[1]),
		y: stringToFloat(parts[2]),
	};
}

/**
 * Finds identifier of the component.
 * 
 * @param {any} element
 * @returns
 */
function findId(element) {
	while (element.getAttribute('data-id') === null) {
		element = element.parentElement;
	}

	return element.getAttribute('data-id');
}

/**
 * Move element to SVG
 *
 * @param id_parent_element parent element
 * @param id_element_to_move where to move element
 */
function moveElementTopSVG(id_parent_element, id_element_to_move){
	var graph_elmnt = document.getElementById(id_parent_element),
		item = document.getElementById(id_element_to_move);

	graph_elmnt.removeChild(item);
	graph_elmnt.appendChild(item);
}

var TimeBarrier = {
	lastTime: 0,
	CONST_WAITING_TIME: 50,
	
	wait: function(){
		var currentTime = new Date().getTime();
		
		if ((currentTime - this.lastTime) > this.CONST_WAITING_TIME){
			this.lastTime = new Date().getTime();
			return false;
		}
		return true;
	}
};

/**
 * Usage:
 * - for plain JS DOM element:		element.isVisible()
 * - for jQuery-wrapped element:	element[0].isVisible()
 * 
 * @returns true if SVG element is visible, otherwise false
 */
SVGElement.prototype.isVisible = function() {
	return $(this).css('display') !== 'none';
};

/**
 * @returns true if SVG element is not visible, otherwise false
 */
SVGElement.prototype.isHidden = function() {
	return $(this).css('display') === 'none';
};
