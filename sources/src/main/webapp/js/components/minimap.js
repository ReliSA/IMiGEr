/**
 * Class representing minimap of the viewport displayed in sidebar. It is used to have a quick overview of the current viewport layout.
 * @constructor
 */
function Minimap() {
	var rootElement;
	var viewportElement;

	var width = 350;
	var height = 200;
	var scale = 0.1;
	var useElement = '#graph';

	/**
	 * Resizes the minimap viewport using current viewport size and minimap scale.
	 * @param {Dimensions} dimensions Object holding current dimensions of the viewport component.
	 */
	this.setViewportSize = function(dimensions) {
		viewportElement.setAttribute('width', dimensions.width * scale);
		viewportElement.setAttribute('height', dimensions.height * scale);
	};

	/**
	 * @returns {Coordinates} Current coordinates of the viewport.
	 */
	this.getViewportPosition = function() {
		return new Coordinates(
			+viewportElement.getAttribute('x'),
			+viewportElement.getAttribute('y'),
		);
	};

	/**
	 * Moves the minimap viewport to a new position based on current viewport position and minimap scale.
	 * @param {Coordinates} coords Coordinates of the viewport.
	 */
	this.setViewportPosition = function(coords) {
		viewportElement.setAttribute('x', coords.x * -1 * scale);
		viewportElement.setAttribute('y', coords.y * -1 * scale);
	};

	/**
	 * Creates a new DOM element representing the minimap in memory.
	 * @returns {Element} HTML DOM element.
	 */
	this.render = function() {
		rootElement = DOM.createSvgElement('svg', {
			'class': 'minimap',
			'id': 'minimapComponent',
			'viewBox': `-100 -50 ${width} ${height}`,
		});
		rootElement.addEventListener('mousedown', onRootMouseDown.bind(this));

		var graphElement = DOM.createSvgElement('use', {
			'transform': `scale(${scale})`,
		});
		graphElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', useElement);
		rootElement.appendChild(graphElement);

		viewportElement = DOM.createSvgElement('rect', {
			'class': 'minimap-viewport',
		});
		viewportElement.addEventListener('mousedown', onViewportMouseDown.bind(this));
		rootElement.appendChild(viewportElement);

		return rootElement;
	};

	function onRootMouseDown(e) {
		var start = new Coordinates(e.clientX, e.clientY);

		var viewBox = rootElement.getAttribute('viewBox').split(' ');
		var minimapRootPosition = new Coordinates(parseInt(viewBox[0]), parseInt(viewBox[1]));

		document.body.addEventListener('mousemove', mouseMove);
		document.body.addEventListener('mouseup', mouseUp);

		function mouseMove(e) {
			e.preventDefault();

			var offset = new Coordinates(start.x - e.clientX, start.y - e.clientY);

			rootElement.setAttribute('viewBox', `${minimapRootPosition.x + offset.x} ${minimapRootPosition.y + offset.y} ${width} ${height}`);
		}

		function mouseUp(e) {
			start = null;

			document.body.removeEventListener('mousemove', mouseMove);
			document.body.removeEventListener('mouseup', mouseUp);
		}
	}

	function onViewportMouseDown(e) {
		e.stopPropagation();

		var start = new Coordinates(e.clientX, e.clientY);
		var minimapViewportPosition = this.getViewportPosition();
		var viewportPosition = app.viewportComponent.getPosition();

		document.body.addEventListener('mousemove', mouseMove);
		document.body.addEventListener('mouseup', mouseUp);

		function mouseMove(e) {
			e.preventDefault();

			var offset = new Coordinates(start.x - e.clientX, start.y - e.clientY);

			viewportElement.setAttribute('x', minimapViewportPosition.x - offset.x);
			viewportElement.setAttribute('y', minimapViewportPosition.y - offset.y);

			app.viewportComponent.setPosition(new Coordinates(viewportPosition.x + (1 / scale) * offset.x, viewportPosition.y + (1 / scale) * offset.y));
		}

		function mouseUp(e) {
			start = null;
			minimapViewportPosition = null;
			viewportPosition = null;

			document.body.removeEventListener('mousemove', mouseMove);
			document.body.removeEventListener('mouseup', mouseUp);
			
			app.redrawEdges();
		}
	}
}
