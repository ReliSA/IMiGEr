/**
* Funkce zavola servlet, ktery odstrani diagram z databáze a ze serveru.
*
* @param id_diagram - id diagramu
*/
function deleteDiagram(id_diagram) {
	var really = confirm('Do you really want to remove diagram?');
	if (really === false) {
		return false;
	}

	$.ajax({
		url: 'api/diagram?id_diagram=' + id_diagram,
		type: 'DELETE',
		success: function(result) {
			$('#diagram_id_' + id_diagram).remove();
			$('#public_diagram_id_' + id_diagram).remove();
		},
	});
}

/**
* Funkce nalezne vsechny komponenty zobrazene ve viewportu, ulozi je jako json a odesle servletu.
* 
* @param id_diagram ID diagramu
*/
function saveDiagram(id_diagram) {
	var vertex_position = new Array(),
		vertex_position_counter = 0;
	
	$('g.vertex').each(function () {
		vertex_position[vertex_position_counter] = ' {"id":"' + $(this).attr('id') + '" , ' +
		'  "transform":"' + $(this).attr('transform') + '" }';
		vertex_position_counter++;
	});
	
	vertex_position.join(',');
	vertex_position = '{"vertices_position": [ ' + vertex_position + ' ]}';
	
	$.post('api/diagram', {
		id_diagram: id_diagram,
		vertices_position: vertex_position,
	}).done(function () {
		alert("Diagram saved.");
	}).fail(function () {
		alert("Error - Diagram not saved!");
	});
}

/**
* Funkce zobrazi vyskakovaci okno s potvrzenim
*
* @param id_diagram ID diagramu
* @param diagram_hash hash diagramu
* @returns {Boolean} true if reset confirmed
*/
function reset_diagram(id_diagram, diagram_hash) {
	var really = confirm('Do you want to reset components position and refresh page?');
	if (really === false) {
		return false;
	}

	$.post('api/diagram', {
		id_diagram: id_diagram,
		vertices_position: "",
	});

	return true;
}