class ForceDirected {
	/**
	 * @constructor
	 */
	constructor() {
		this._forceField = {};
		this._canvas = 0;

		// parametry layoutu
		this._repulsiveStrength = 400; // odpudiva sila (prima umera); default 450
		this._attractiveStrength = 510; // pritazliva sila (neprima umera, nesmi byt 0); default 110
		this._dampeningEffect = 1000; // tlumeni sily (nesmi byt 0); default 200
		this._borderRatio = 1; // hranice layoutu (cislo kterym se deli velikost canvasu)
		// tahle funkce se mi nelibi, je treba to vyresit jinak, nici to layout (nechat na 1)
	}

	/**
	 * Force directed layout for visible components.
	 */
	run() {
		var border = this._canvas / this._borderRatio;

		var visibleNodes = app.viewportComponent.nodeList;
		var otherVisibleNodes = [];

		for (let i = 0; i < visibleNodes.length; i++) {
			this._forceField[visibleNodes[i].uniqueId] = [0, 0];
		}

		// calculate repulsive force
		for (let i = 0; i < visibleNodes.length; i++) {
			let currNode = visibleNodes[i];

			// other nodes
			for (let j = 0; j < visibleNodes.length; j++){
				otherVisibleNodes[j] = visibleNodes[j];
			}
			otherVisibleNodes.splice(i, 1);

			// iterate over other nodes
			for (let j = 0; j < otherVisibleNodes.length; j++) {
				var otherNode = otherVisibleNodes[j];

				var currPosition = currNode.position;
				var otherPosition = otherNode.position;

				// calculate force
				var x = currPosition.x - otherPosition.x;
				var y = currPosition.y - otherPosition.y;
				
				var sum = Math.pow(x, 2) + Math.pow(y, 2);
				var distance = Math.sqrt(sum);

				if (distance !== 0) {
					this._forceField[currNode.uniqueId][0] += Math.floor(x * (this._repulsiveStrength / distance));
					this._forceField[currNode.uniqueId][1] += Math.floor(y * (this._repulsiveStrength / distance));
				}
			}
		}

		// calculate attractive forces
		for (let i = 0; i < visibleNodes.length; i++) {
			let currNode = visibleNodes[i];

			let inEdgeList = currNode.inEdgeList;
			for (let j = 0; j < inEdgeList.length; j++) {
				let otherNode = inEdgeList[j].from;

				var currPosition = currNode.position;
				var otherPosition = otherNode.position;

				// calculate force
				var x = currPosition.x - otherPosition.x;
				var y = currPosition.y - otherPosition.y;

				var sum = Math.pow(x, 2) + Math.pow(y, 2);
				var distance = Math.sqrt(sum);

				this._forceField[currNode.uniqueId][0] += Math.round(-1 * x * (distance / this._attractiveStrength));
				this._forceField[currNode.uniqueId][1] += Math.round(-1 * y * (distance / this._attractiveStrength));
			}

			let outEdgeList = currNode.outEdgeList;
			for (let j = 0; j < outEdgeList.length; j++) {
				let otherNode = outEdgeList[j].to;

				var currPosition = currNode.position;
				var otherPosition = otherNode.position;

				// calculate force
				var x = currPosition.x - otherPosition.x;
				var y = currPosition.y - otherPosition.y;

				var sum = Math.pow(x, 2) + Math.pow(y, 2);
				var distance = Math.sqrt(sum);

				this._forceField[currNode.uniqueId][0] += Math.round(-1 * x * (distance / this._attractiveStrength));
				this._forceField[currNode.uniqueId][1] += Math.round(-1 * y * (distance / this._attractiveStrength));
			}
		}

		// applying the force
		for (let i = 0; i < visibleNodes.length; i++){
			var currNode = visibleNodes[i],

				halfCan = this._canvas / 2,

				deltaX = currNode.position.x - halfCan,
				deltaY = currNode.position.y - halfCan;

			// tohle drzi layout uprostred, chtelo by to vymyslet nejak lip, docela ho to kurvi
			/*
			 if (deltaX > 0) {
			 currNode.x = Math.min(currNode.position.x, (this._canvas/2)+border);
			 } else {
			 currNode.x = Math.max(currNode.position.x, (this._canvas/2)-border);
			 }
			 if (deltaY > 0) {
			 currNode.y = Math.min(currNode.position.y, (this._canvas/2)+border);
			 } else {
			 currNode.y = Math.max(currNode.position.y, (this._canvas/2)-border);
			 }
			 */

			// kolecko
			var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, +2)),
				maxDist = Math.sqrt(Math.pow(border, 2) + Math.pow(border, +2));

			if (dist > maxDist){
				var ratio = maxDist / dist,

					newX = deltaX * ratio,
					newY = deltaY * ratio;

				currNode.x += newX - deltaX;
				currNode.y += newY - deltaY;
			}

			// force dampening
			var forceX = Math.floor(this._forceField[currNode.uniqueId][0] / this._dampeningEffect),
				forceY = Math.floor(this._forceField[currNode.uniqueId][1] / this._dampeningEffect);

			// adding a random effect
			/*
			 forceX += -3+Math.floor((Math.random()*6)+1);
			 forceY += -3+Math.floor((Math.random()*6)+1);
			 */


			// moving a component
			if (Math.abs(forceX) > 1 || Math.abs(forceY) > 1) {
				let coords = new Coordinates(
					currNode.position.x + forceX,
					currNode.position.y + forceY,
				);

				currNode.position = coords;
				currNode.move(coords);
			}
		}
	}
}
