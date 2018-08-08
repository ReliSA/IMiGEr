
/**
* GroupManager caters to group.
*/
function GroupManager() {
	var groupList = {};
	var size = 0;

	/**
	 * Low-level access to the hash table.
	 */
	this.getAll = function() {
		return groupList;
	};

	/**
	 * Adds group to list of groups.
	 *
	 * @param idGroup group ID
	 * @param group group which will be added
	 */
	this.addGroupToList = function(idGroup, group) {
		groupList[idGroup] = group;
		size++;
	};

	/**
	 * Removes group from list of groups.
	 *
	 * @param idGroup group ID
	 */
	this.removeGroupFromList = function(idGroup) {
		delete groupList[idGroup];
		size--;
	};

	/**
	 * Finds out if the group with given id is in list of existing group.
	 *
	 * @param idGroup group ID
	 * @returns {boolean} true if group is in list
	 */
	this.existGroup = function(idGroup) {
		if (groupList[idGroup] === null || groupList[idGroup] === undefined) {
			return false;
		}

		return true;
	};

	/**
	 * Gets group with given id.
	 *
	 * @param idGroup group ID
	 * @returns {*} group from list
	 */
	this.getGroup = function(idGroup) {
		return groupList[idGroup];
	};
	
	/**
	* Get count of group in group list.
	*/
	this.size = function() {
		return this.size;
	};
}
