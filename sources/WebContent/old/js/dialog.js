
/**
*
* Group rename dialog.
*/
var Dialog = {
	
	/**
	* Set up the dialog - settings and such.
	*/
	setDialog : function() {
		
		$("#dialog").dialog({
			dialogClass : "no-close",
			buttons : [ {
				text : "OK",
				
				click : function(e) {
					Dialog.saveDialogValue(this);
				}
			}, {
				text : "Cancel",
				click : function() {
					$(this).dialog("close");
				}
			} ],
			closeOnEscape : true,
			draggable : false,
			modal : true,
			autoOpen : false
		});
		
		// setup clearing button
		$("#clearNameButton").click(function() { $("#groupNameTextarea").val(""); });
		
		// when focused
		$("#dialog").on("dialogfocus", function(event, ui) {
			// set Enter as dialog completion accelerator
			$(this).keypress(function(e) {
				if(e.which == 13) {
					Dialog.saveDialogValue($("#dialog").dialog());
				}
			});
			
			// get the group object and set the input field value
			var group = $("#dialog").dialog().data('group');
			$("#groupNameTextarea").val(group.label);
		} );
	},

	/**
	 * Save the values in dialog textarea to the group.
	 * 
	 * @param callingParent parent
	 * 
	 * group - group object itself
	 * groupLabel - group label element
	 * isSvgElement - if SVG element then true, false otherwise
	 */
	saveDialogValue : function(callingParent) {
		var MAX_CHARS = 15;
		
		var newName = $("#groupNameTextarea").val();
		var group = $(callingParent).data('group');
		var groupLabel = $(callingParent).data('groupLabel');
		var isSVG = $(callingParent).data('isSvgElement');
		
		if (newName.replace(/ /g, '').length === 0) {
			// default name
			newName = 'Group';
			} else {
			if (newName.length > MAX_CHARS) {
				newName = newName.substring(0, MAX_CHARS);
				newName += "..";
			}
		}
		
		if(isSVG) {
			var test = document.getElementById('labelTextElement' + group.idGroup);
			test.textContent = newName;
			}else {
			groupLabel.html(newName);
		}
		
		// set new group label
		group.label = newName;
		
		// makes the label visible if newName isn't Group and adjusts position and size of the icon
		if (newName != 'Group') {
			$('#labelTextElement' + group.idGroup).attr('display', '');

			$('#symbol' + group.idGroup).attr('class', 'group-symbol');
			$('#symbol' + group.idGroup).attr('x', '20');
			$('#symbol' + group.idGroup).attr('y', '11');
		}



		$(callingParent).dialog("close");
	}
};