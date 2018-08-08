/**
 * The class which ensures zoom.
 */
function Zoom() {
	var CONST_ZOOM_VALUES = [10, 25, 40, 50, 60, 70, 80, 90, 100, 125, 150, 200, 300, 400, 500];

	this.currentZoom = 1;
	this.currentZoomIndex = CONST_ZOOM_VALUES.indexOf(100);

	var mouseX = 0;
	var mouseY = 0;

	$(document).mousemove(function(e) {
		mouseX = e.pageX;
		mouseY = e.pageY - 100; //odecteni horniho okraje od viewportu
	});

	/**
	 * Gets zoom step (no per cent).
	 *
	 * @param zoomStepInPercent zoom step in per cent
	 * @returns {number} zoom step
	 */
	function getZoomStep(zoomStepInPercent) {
		return zoomStepInPercent/100.0;
	}
	
	/**
	* This method ensures zoom in.
	*/
	this.zoomIn = function() {
		if (this.currentZoomIndex >= (CONST_ZOOM_VALUES.length - 1)) return;
		
		var viewport_pos_top_bef_zoom = $('#viewport').scrollTop(),//pozice odshora
			viewport_pos_left_bef_zoom = $('#viewport').scrollLeft(),//pozice odshora
			svg_width_bef = $('#svg1').width(),//pozice odshora
			svg_height_bef = $('#svg1').height();//pozice odshora
		
		
		$("#zoomOut").removeAttr("disabled");
		$("#zoomOut img").attr("src", "images/zoom_out.png");
		this.currentZoomIndex++;

		var zoomStepInPercent = CONST_ZOOM_VALUES[this.currentZoomIndex];
		this.currentZoom = getZoomStep(zoomStepInPercent);

		var graph = $("#graph");
		graph.attr('transform', 'scale('+ this.currentZoom + ')');
		
		GraphManager.setSizeOfSvg();
		graph.attr('transform', 'scale('+ this.currentZoom + ') ' +  GraphManager.centerGraphInViewport(this.currentZoom));
		$("#zoomValue").html(CONST_ZOOM_VALUES[this.currentZoomIndex] + "%");

		var viewport_pos_top_after_zoom = $('#viewport').scrollTop(),    //pozice odshora
			viewport_pos_left_after_zoom = $('#viewport').scrollLeft();  //pozice odshora

		//pokud se rozsiruje #svg1
		if ( viewport_pos_top_bef_zoom != viewport_pos_top_after_zoom ) {
			var svg_height_after = $('#svg1').height(),//pozice odshora
				new_viewport_top = (mouseY + viewport_pos_top_bef_zoom ) / svg_height_bef;
			
			new_viewport_top = (new_viewport_top * svg_height_after) - mouseY ;
			
			var diff_konst = 0;
			if (mouseX < ($('#viewport').height() / 2) ){
				diff_konst = diff_konst * -1;
			}
			$('#viewport').scrollTop( (new_viewport_top)  + diff_konst * new_viewport_top);
		}
		
		if ( viewport_pos_left_bef_zoom != viewport_pos_left_after_zoom ) {
			var viewport_width = $('#viewport').width(),
				svg_width_after = $('#svg1').width();//pozice odshora
			
			viewport_pos_left_bef_zoom *= -1;
			var new_viewport_left = (viewport_width - mouseX + viewport_pos_left_bef_zoom ) / svg_width_bef;
			
			new_viewport_left = (new_viewport_left * svg_width_after) - (viewport_width - mouseX);
			
			var diff_konst = 0;
			if (mouseY < ($('#viewport').width() / 2) ){
				diff_konst = diff_konst * -1;
			}
			new_viewport_left *=-1;
			$('#viewport').scrollLeft( new_viewport_left  - (diff_konst * new_viewport_left));
		}
		
		if (this.currentZoomIndex >= (CONST_ZOOM_VALUES.length - 1)) {
			$("#zoomIn").attr("disabled", "disabled");
			$("#zoomIn img").attr("src", "images/zoom_in_disabled.png");
		}
	};
	
	/**
	* This method ensures zoom out.
	*/
	this.zoomOut = function() {
		if (this.currentZoomIndex <= 0) return;

		var viewport_pos_top_bef_zoom = $('#viewport').scrollTop(),//pozice odshora
			viewport_pos_left_bef_zoom = $('#viewport').scrollLeft(),//pozice odshora
			svg_width_bef = $('#svg1').width(),//pozice odshora
			svg_height_bef = $('#svg1').height();//pozice odshora
		
		
		$("#zoomIn").removeAttr("disabled");
		$("#zoomIn img").attr("src", "images/zoom_in.png");
		this.currentZoomIndex--;

		var zoomStepInPercent = CONST_ZOOM_VALUES[this.currentZoomIndex];
		this.currentZoom = getZoomStep(zoomStepInPercent);
		
		var graph = $("#graph");
		graph.attr('transform', 'scale('+ this.currentZoom + ')');
		
		GraphManager.setSizeOfSvg();

		graph.attr('transform', 'scale('+ this.currentZoom + ') ' +  GraphManager.centerGraphInViewport(this.currentZoom));
		$("#zoomValue").html(CONST_ZOOM_VALUES[this.currentZoomIndex] + "%");

		var viewport_pos_top_after_zoom = $('#viewport').scrollTop(),    //pozice odshora
			viewport_pos_left_after_zoom = $('#viewport').scrollLeft();  //pozice odshora

		if ( viewport_pos_top_bef_zoom != viewport_pos_top_after_zoom ) {
			
			var svg_height_after = $('#svg1').height(),//pozice odshora
				new_viewport_top = (mouseY + viewport_pos_top_bef_zoom ) / svg_height_bef;
			
			new_viewport_top = (new_viewport_top * svg_height_after) - mouseY;
			
			$('#viewport').scrollTop( new_viewport_top );
		}
		
		if ( viewport_pos_left_bef_zoom != viewport_pos_left_after_zoom ) {
			var viewport_width = $('#viewport').width(),
				svg_width_after = $('#svg1').width();//šířka
			
			viewport_pos_left_bef_zoom *= -1;
			var new_viewport_left = (viewport_width - mouseX + viewport_pos_left_bef_zoom ) / svg_width_bef;
			
			new_viewport_left = (new_viewport_left * svg_width_after) - (viewport_width - mouseX);
			
			$('#viewport').scrollLeft( new_viewport_left * -1 );
		}
		
		if (this.currentZoomIndex <= 0) {
			$("#zoomOut").attr("disabled", "disabled");
			$("#zoomOut img").attr("src", "images/zoom_out_disabled.png");
		}
	};
}
