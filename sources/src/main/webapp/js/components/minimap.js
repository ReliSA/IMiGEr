/**
 * @constructor
 */
function Minimap() {
	var rootElement;
	var viewportElement;

	var zoom = 0.1;
	var useElement = '#graph';

	/**
	 * 
	 * @param {object} size Object holding current dimensions of the viewport component.
	 */
	this.setViewportSize = function(size) {
		viewportElement.setAttribute('width', size.width * zoom);
		viewportElement.setAttribute('height', size.height * zoom);
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
	 * TODO: jsDoc
	 * @param {Coordinates} coords Coordinates of the viewport.
	 */
	this.setViewportPosition = function(coords) {
		viewportElement.setAttribute('x', coords.x * -1 * zoom);
		viewportElement.setAttribute('y', coords.y * -1 * zoom);
	};

	/**
	 * Creates a new DOM element representing the minimap in memory.
	 * @returns {Element} HTML DOM element.
	 */
	this.render = function() {
		rootElement = app.utils.createSvgElement('svg', {
			'class': 'minimap',
			'id': 'minimapComponent',
			'viewBox': '-100 -50 350 200',
		});

		var graphElement = app.dom.createSvgElement('use', {
			'transform': `scale(${zoom})`,
		});
		graphElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', useElement);
		rootElement.appendChild(graphElement);

		viewportElement = app.dom.createSvgElement('rect', {
			'class': 'minimap-viewport',
		});
		viewportElement.addEventListener('mousedown', onMouseDown.bind(this));
		rootElement.appendChild(viewportElement);

		return rootElement;
	};

	function onMouseDown(e) {
		var start = new Coordinates(e.clientX, e.clientY);
		var minimapViewportPosition = this.getViewportPosition();
		var viewportPosition = app.viewportComponent.getPosition();

		viewportElement.addEventListener('mousemove', mouseMove);
		viewportElement.addEventListener('mouseup', mouseUp);
		
		function mouseMove(e) {
			e.preventDefault();

			var offset = new Coordinates(start.x - e.clientX, start.y - e.clientY);

			viewportElement.setAttribute('x', minimapViewportPosition.x - offset.x);
			viewportElement.setAttribute('y', minimapViewportPosition.y - offset.y);

			app.viewportComponent.setPosition(new Coordinates(viewportPosition.x + (1 / zoom) * offset.x, viewportPosition.y + (1 / zoom) * offset.y));
		}

		function mouseUp(e) {
			start = null;
			minimapViewportPosition = null;
			viewportPosition = null;

			viewportElement.removeEventListener('mousemove', mouseMove);
			viewportElement.removeEventListener('mouseup', mouseUp);
		}
	}
}
