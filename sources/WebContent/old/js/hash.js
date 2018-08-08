/**
* The class represents hash table.
*/
function Hash() {
	var size = 0;
	var list = {};

	/**
	 * Low-level access to the hash table.
	 */
	this.getAll = function() {
		return list;
	};

	/**
	 * Add item
	 * 
	 * @param key key of added item
	 * @param val value of added item
	 */
	this.add = function(key, val) {
		if (!this.contains(key)) {
			size++;
		}

		list[key] = val;
	};

	/**
	 * Gets item with given key
	 * 
	 * @param key key of searched item
	 * @returns {*} item
	 */
	this.get = function(key) {
		return list[key];
	};
	
	/**
	 * Remove item with given key
	 * 
	 * @param key key of item
	 * @returns {*} removed item
	 */
	this.remove = function(key) {
		var val = list[key];
		delete list[key];
		size--;

		return val;
	};
	
	/**
	* Gets count of item in "hash list".
	*/
	this.size = function() {
		return size;
	};
	
	/**
	 * Tests if the item with given key is in "hash table".
	 * 
	 * @param key key of item
	 * @returns {boolean} true if item with key is in "hash table"
	 */
	this.contains = function(key) {
		if (list[key] == "undefined" || list[key] == null) {
			return false;
		}

		return true;
	};
}
