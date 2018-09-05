/**
 * @constructor
 */
function ForceDirected() {

	var forceField = {};
	var canvas = 0;

	// parametry layoutu
	var inumber = 30; // pocet iteraci; default 300
	var inumberClick = 20; // pocet iteraci u tlacitka
	var repulsiveStrength = 400; // odpudiva sila (prima umera); default 450
	var attractiveStrength = 510; // pritazliva sila (neprima umera, nesmi byt 0); default 110
	var dampeningEffect = 1000; // tlumeni sily (nesmi byt 0); default 200
	var borderRatio = 1; // hranice layoutu (cislo kterym se deli velikost canvasu)
	// tahle funkce se mi nelibi, je treba to vyresit jinak, nici to layout (nechat na 1)

	/**
	 * Force directed layout for visible components.
	 */
	this.run = function() {
		var border = canvas / borderRatio;

		var visibleNodes = app.viewportComponent.getNodeList(),
			otherVisibleNodes = [];

		var i = 0,
			j = 0;

		for (i = 0; i < visibleNodes.length; i++) {
			forceField[app.utils.getUniqueId(visibleNodes[i])] = [0, 0];
		}

		// calculate repulsive force
		for (i = 0; i < visibleNodes.length; i++) {
			var currNode = visibleNodes[i];

			// other nodes
			for (var j = 0; j < visibleNodes.length; j++){
				otherVisibleNodes[j] = visibleNodes[j];
			}
			otherVisibleNodes.splice(i, 1);

			// iterate over other nodes
			for (j = 0; j < otherVisibleNodes.length; j++) {
				var otherNode = otherVisibleNodes[j];

				var currPosition = currNode.getPosition();
				var otherPosition = otherNode.getPosition();

				// calculate force
				var x = currPosition.x - otherPosition.x;
				var y = currPosition.y - otherPosition.y;
				
				var sum = Math.pow(x, 2) + Math.pow(y, 2);
				var distance = Math.sqrt(sum);

				if (distance !== 0) {
					forceField[app.utils.getUniqueId(currNode)][0] += Math.floor(x * (repulsiveStrength / distance));
					forceField[app.utils.getUniqueId(currNode)][1] += Math.floor(y * (repulsiveStrength / distance));
				}
			}
		}

		// calculate attractive forces
		for (i = 0; i < visibleNodes.length; i++){
			var currNode = visibleNodes[i];

			for (j = 0; j < currNode.getInEdgeList().length; j++) {
				var otherNode = currNode.getInEdgeList()[j].getFrom();

				var currPosition = currNode.getPosition();
				var otherPosition = otherNode.getPosition();

				// calculate force
				var x = currPosition.x - otherPosition.x;
				var y = currPosition.y - otherPosition.y;

				var sum = Math.pow(x, 2) + Math.pow(y, 2);
				var distance = Math.sqrt(sum);

				forceField[app.utils.getUniqueId(currNode)][0] += Math.round(-1 * x * (distance / attractiveStrength));
				forceField[app.utils.getUniqueId(currNode)][1] += Math.round(-1 * y * (distance / attractiveStrength));
			}

			for (j = 0; j < currNode.getOutEdgeList().length; j++) {
				var otherNode = currNode.getOutEdgeList()[j].getTo();

				var currPosition = currNode.getPosition();
				var otherPosition = otherNode.getPosition();

				// calculate force
				var x = currPosition.x - otherPosition.x;
				var y = currPosition.y - otherPosition.y;

				var sum = Math.pow(x, 2) + Math.pow(y, 2);
				var distance = Math.sqrt(sum);

				forceField[app.utils.getUniqueId(currNode)][0] += Math.round(-1 * x * (distance / attractiveStrength));
				forceField[app.utils.getUniqueId(currNode)][1] += Math.round(-1 * y * (distance / attractiveStrength));
			}
		}

		// applying the force
		for (i = 0; i < visibleNodes.length; i++){
			var currNode = visibleNodes[i],

				halfCan = canvas / 2,

				deltaX = currNode.getPosition().x - halfCan,
				deltaY = currNode.getPosition().y - halfCan;

			// tohle drzi layout uprostred, chtelo by to vymyslet nejak lip, docela ho to kurvi
			/*
			 if (deltaX > 0) {
			 currNode.x = Math.min(currNode.getPosition().x, (canvas/2)+border);
			 } else {
			 currNode.x = Math.max(currNode.getPosition().x, (canvas/2)-border);
			 }
			 if (deltaY > 0) {
			 currNode.y = Math.min(currNode.getPosition().y, (canvas/2)+border);
			 } else {
			 currNode.y = Math.max(currNode.getPosition().y, (canvas/2)-border);
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
			var forceX = Math.floor(forceField[app.utils.getUniqueId(currNode)][0] / dampeningEffect),
				forceY = Math.floor(forceField[app.utils.getUniqueId(currNode)][1] / dampeningEffect);

			// adding a random effect
			/*
			 forceX += -3+Math.floor((Math.random()*6)+1);
			 forceY += -3+Math.floor((Math.random()*6)+1);
			 */


			// moving a component
			if (Math.abs(forceX) > 1 || Math.abs(forceY) > 1) {
				var coords = new Coordinates(
					currNode.getPosition().x + forceX,
					currNode.getPosition().y + forceY,
				);

				currNode.setPosition(coords);
				currNode.move(coords);
			}
		}
	};
}