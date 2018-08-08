/**
 * Represents one mark.
 * @param symbol symbol with char and color
 * @param id ID of mark
 * @param selector selector of vertex
*/
function Mark(symbol, id, selector) {
	this.symbol = symbol;
	this.id = id;
	this.$vertexSelector = selector;
}
