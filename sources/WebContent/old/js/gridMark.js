
/**
* This class represents creating and sorting of marks.
*/
function GridMarks() {
	var CONST_COUNT_MARKS_ON_ROW = 5;
	var CONST_WIDTH_MARK = 21;
	var CONST_HEIGHT_MARK = 21;

	var marks = new Hash();
	var position = {
		rx: -60,
		ry: 13,
		tx: -50,
		ty: 23
	};

	/**
	 * Add mark to list.
	 * 
	 * @param markId id of added mark
	 * @param mark mark with symbol and color
	 */
	this.addMark = function(markId, mark) {
		if (mark.symbol != "undefined" || mark.symbol != "" || mark.symbol !== undefined) {
			var translate = countTranslate(marks.size());
			var markGroup = createMarkSvg(mark, position, translate);

			marks.add(markId, {
				mark: mark,
				$markGroup: $(markGroup)
			});

			mark.$vertexSelector.append(markGroup);
		}
	};

	/**
	 * Removes mark with given id from list.
	 * 
	 * @param markId mark ID
	 */
	this.removeMark = function(markId) {
		var item = marks.remove(markId).$markGroup;
		item.remove();

		reorganizeMarks();
	};

	/**
	 * Tests if mark with given id is in list of mark.
	 * 
	 * @param markId mark ID
	 * @returns {*|boolean} If mark exists, it is returned
	 */
	this.existMark = function(markId) {
		return marks.contains(markId);
	};

	/**
	 * Count translate of mark in grids.
	 * 
	 * @param length length
	 * @returns {{x: number, y: number}} calculated x and y axes
	 */
	function countTranslate(length) {
		return {
			x: (length % CONST_COUNT_MARKS_ON_ROW) * CONST_WIDTH_MARK,
			y: Math.floor(length / CONST_COUNT_MARKS_ON_ROW) * CONST_HEIGHT_MARK
		};
	}

	/**
	* This method organized marks in grid.
	*/
	function reorganizeMarks() {
		var countMark = 0;
		for (var key in marks.getAll()) {
			if (marks.getAll().hasOwnProperty(key)) {
				marks.get(key).$markGroup.remove();

				var translate = countTranslate(countMark);
				var markGroup = createMarkSvg(marks.get(key).mark, position, translate);

				marks.get(key).$markGroup = $(markGroup);
				marks.get(key).mark.$vertexSelector.append(markGroup);
				
				countMark++;
			}
		}
	}
	
	/**
	 * Create svg element which represents mark in graph.
	 * 
	 * @param mark mark
	 * @param position mark position
	 * @param translate translate
	 * @returns {*} group
	 */
	function createMarkSvg(mark, position, translate) {
		var group = createSvgElement('g', {
			'class': mark.id,
			'transform': 'translate(' + (translate.x) + ',' + translate.y + ')'
		});

		var rect = createSvgElement('rect', {
			rx: 4,
			ry: 4,
			height: CONST_HEIGHT_MARK,
			width: CONST_WIDTH_MARK,
		//            x: position['rx'],
		//            y: position['ry'],
			y: 2 * position['ry'],
			stroke: 'black',
			fill: mark.symbol[1]
		});

		var label = createSvgElement('text', {
			'x': 10,
			'y': position['ty'] + 13,
			'fill': 'black',
		});

		var myText = document.createTextNode(mark.symbol[0]);

		label.appendChild(myText);
		group.appendChild(rect);
		group.appendChild(label);

		return group;
	}
}
