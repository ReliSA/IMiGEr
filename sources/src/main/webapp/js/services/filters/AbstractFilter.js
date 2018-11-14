class AbstractFilter {
	/**
	 * @abstract
	 * @param {array<Node>} nodeList List of nodes to be filtered.
	 * @returns {array<Node>} Filtered list of nodes.
	 */
	run(nodeList) {
		throw new AbstractMethodError;
	}
}
