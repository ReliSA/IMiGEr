/**
* This class represents creation of symbols.
*/
class MarkSymbol {
	/**
	 * @constructor
	 */
	constructor() {
		this._removedSymbolList = [];
		this._index = 0;
		this._symbolIndex = -1;
		this._colorIndex = -1;
		this._startColorIndex = 0;
	}

	/**
	* Returns symbol with unique char and color.
	*/
	getMarkSymbol() {
		if (this._removedSymbolList.length > 0) {
			return this._removedSymbolList.shift();
		}
		
		this._symbolIndex++;
		this._colorIndex++;
		
		if (this._colorIndex === MarkSymbol.CONST_MARK_COLORS.length) {
			this._colorIndex = 0;
		}
		
		if (this._symbolIndex === MarkSymbol.CONST_MARK_SYMBOLS.length) {
			if (this._startColorIndex === MarkSymbol.CONST_MARK_COLORS.length) {
				this._startColorIndex = 0;
			}

			this._symbolIndex = 0;
			this._startColorIndex++;
			this._colorIndex = this._startColorIndex;
		}
		
		return [
			MarkSymbol.CONST_MARK_SYMBOLS[this._symbolIndex],
			MarkSymbol.CONST_MARK_COLORS[this._colorIndex],
			'symbol-' + this._index++,
		];
	}

	/**
	 * Save removed symbol (char + color) to the list of removes symbols.
	 *
	 * @param symbol symbol to be removed
	 */
	removeSymbol(symbol) {
		this._removedSymbolList.push(symbol);
	}
}

MarkSymbol.CONST_MARK_SYMBOLS = [
	"☺", "☻", "♥", "♦", "♣", "♠", "♫", "☼", "►", "◄", "▲", "▼", "■", "▬",
	"░", "▒", "↕", "↑", "↓", "→", "←", "↔", "╣", "╩", "╠", "╚", "╝", "║",
	"╔", "╦", "═", "╬", "╗", "┴", "┬", "∟", "┌", "├", "┤", "⌂", "+", "-",
	"*", "÷", "×", "=", "±", "Ø", "~", "«", "»", "¤", "¶", "§", "‼", "!",
	"#", "$", "%", "&", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I",
	"J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W",
	"X", "Y", "Z", "©", "®", "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι",
	"κ", "λ", "μ", "ν", "ξ", "π", "ρ", "σ", "τ", "υ", "φ", "χ", "ψ", "ω",
	"Ω", "Φ", "Σ", "Λ", "Δ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
];

MarkSymbol.CONST_MARK_COLORS = [
	"#DC143C", "#B23AEE", "#63B8FF", "#3D9140", "#B3EE3A",
	"#FFD700", "#B7B7B7", "#FF8000",
];
