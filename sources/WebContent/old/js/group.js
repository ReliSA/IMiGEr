
/**
 * The class represents group.
 * @param groupSymbol group symbol
 * @param idGroup group id
 */
function Group(groupSymbol, idGroup) {
	this.groupSymbol = groupSymbol;
	this.idGroup = idGroup;
	this.label = 'Group';
	this.x = 0;
	this.y = 0;

	this.items = new Hash();
	this.providedPackage = new Hash();
	this.requiredPackage = new Hash();

	var countRequired = 0;
	var countProvided = 0;
	var decompose = false;

	/**
	 * Adds provided packages.
	 * @param exportPackages package which be added.
	 */
	this.addProvidedPackage = function(exportPackages) {
		var frequency = 1;
		
		for (var i = 0; i < exportPackages.length; i++){
			if (providedPackage.contains(exportPackages[i])) {
				frequency = providedPackage.get(exportPackages[i]) + 1;
			}
			
			providedPackage.add(exportPackages[i], frequency);
			frequency = 1;
			
			// this new provided bundle satisfies required of some old bundle
			if (requiredPackage.contains(exportPackages[i])) {
				requiredPackage.remove(exportPackages[i]);
			}
		}
	};
	
	/**
	 * Adds required packages.
	 * 
	 * @param importPackages package which be added.
	 */
	this.addRequiredPackage = function(importPackages) {
		var frequency = 1, i;
		
		for (i = 0; i < importPackages.length; i++){
			// no old provided bundle satisfies required of this new bundle
			if (!providedPackage.contains(importPackages[i])) {
				if (requiredPackage.contains(importPackages[i])) {
					frequency = requiredPackage.get(importPackages[i]) + 1;
				}

				requiredPackage.add(importPackages[i], frequency);
				frequency = 1;
			}
		}
	};
	
	/**
	 * Delete provided packages.
	 * 
	 * @param exportPackages package which will be deleted.
	 */
	this.deleteProvidedPackage = function(exportPackages) {
		var frequency = -1;
		var i;
		
		for (i = 0; i < exportPackages.length; i++) {
			if (providedPackage.contains(exportPackages[i])) {
				frequency = providedPackage.get(exportPackages[i]) - 1;
				
				if (frequency == 0) {
					providedPackage.remove(exportPackages[i]);
				} else {
					providedPackage.add(exportPackages[i], frequency);
				}

				frequency = -1;
			}
		}
	};
	
	/**
	 * Delete required packages.
	 * 
	 * @param importPackages package which will be deleted.
	 */
	this.deleteRequiredPackage = function(importPackages) {
		var frequency = -1;
		var i;
		
		for (i = 0; i < importPackages.length; i++) {
			if (requiredPackage.contains(importPackages[i])){
				frequency = requiredPackage.get(importPackages[i]) - 1;
				
				if (frequency == 0) {
					requiredPackage.remove(importPackages[i]);
				} else {
					requiredPackage.add(importPackages[i], frequency);
				}

				frequency = -1;
			}
		}
	};

	/**
	 * Adds new item to group.
	 * 
	 * @param itemId id of saved item (vertex)
	 * @param item vertex which will be added
	 */
	this.addToGroup = function(itemId, item) {
		this.items.add(itemId, item);
	};

	/**
	 * Removes item from group.
	 * 
	 * @param itemId id of deleted item (vertex)
	 */
	this.removeFromGroup = function(itemId) {
		this.items.remove(itemId);
	};

	/**
	 * Gets count of item in group.
	 * 
	 * @returns {number} number of items
	 */
	this.getGroupItemsLength = function() {
		return this.items.size();
	};

	/**
	 * Writes group item name into console
	 */
	this.toString = function() {
		var groupItems = this.items.getAll();

		for (var key in groupItems) {
			if (groupItems.hasOwnProperty(key)) {
				console.info('>> ' + groupItems.get(key).name);
			}
		}
	};
}
