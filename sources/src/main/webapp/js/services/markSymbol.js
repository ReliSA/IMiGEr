/**
* This class represents creation of symbols.
 * @constructor
*/
function MarkSymbol() {
	var CONST_MARK_SYMBOLS = ["☺", "☻", "♥", "♦", "♣", "♠", "♫", "☼", "►", "◄",
	"▲", "▼", "■", "▬", "░", "▒", "↕", "↑", "↓", "→", "←", "↔", "╣", "╩", "╠",
	"╚", "╝", "║", "╔", "╦", "═", "╬", "╗", "┴", "┬", "∟", "┌", "├", "┤",
	"⌂", "+", "-", "*", "÷", "×", "=", "±", "Ø", "~", "«", "»", "¤", "¶", "§",
	"‼", "!", "#", "$", "%", "&", "@", "A", "B", "C", "D", "E", "F", "G", "H",
	"I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W",
	"X", "Y", "Z",   "©", "®", "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ",
	"λ", "μ", "ν", "ξ", "π", "ρ", "σ", "τ", "υ", "φ", "χ", "ψ", "ω", "Ω", "Φ",
	"Σ", "Λ", "Δ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	
	var CONST_MARK_COLORS = ["#DC143C", "#B23AEE", "#63B8FF", "#3D9140", "#B3EE3A",
	"#FFD700", "#B7B7B7", "#FF8000"];

	var removeMarkSymbolList = [];
	var index = 0;
	var symbolIndex = -1;
	var colorIndex = -1;
	var startColorIndex = 0;

	/**
	* Returns symbol with unique char and color.
	*/
	this.getMarkSymbol = function() {
		if (removeMarkSymbolList.length > 0) {
			return removeMarkSymbolList.shift();
		}
		
		symbolIndex++;
		colorIndex++;
		
		if (colorIndex === CONST_MARK_COLORS.length) {
			colorIndex = 0;
		}
		
		if (symbolIndex === CONST_MARK_SYMBOLS.length) {
			if (startColorIndex === CONST_MARK_COLORS.length) {
				startColorIndex = 0;
			}
			
			symbolIndex = 0;
			startColorIndex++;
			colorIndex = startColorIndex;
		}
		
		return [CONST_MARK_SYMBOLS[symbolIndex], CONST_MARK_COLORS[colorIndex], 'symbol-' + index++];
	};

	/**
	 * Save removed symbol (char + color) to the list of removes symbols.
	 *
	 * @param symbol symbol to be removed
	 */
	this.removeSymbol = function(symbol) {
		removeMarkSymbolList.push(symbol);
	};
}
