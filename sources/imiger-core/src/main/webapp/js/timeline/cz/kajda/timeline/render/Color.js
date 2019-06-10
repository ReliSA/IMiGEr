define([],
function() {
    
/**
 * Color representation.
 * @memberOf cz.kajda.timeline.render
 */
var Color = new Class("cz.kajda.timeline.render.Color", {
    
    /**
     * @constructor
     * @param {Number} r red <0; 255>
     * @param {Number} g green <0; 255>
     * @param {Number} b blue <0; 255>
     * @param {Number} a alpha (opacity) <0; 1>
     */
    _constructor : function(r, g, b, a) {
        this.red = this._normalizeChannel(r);
        this.green = this._normalizeChannel(g);
        this.blue = this._normalizeChannel(b);
        this.alpha = a ? this._normalizeAlpha(a) : 1;
    },
    
    //<editor-fold defaultstate="collapsed" desc="members">
    
        red : 0,
        green : 0,
        blue : 0,
        alpha : 1,

    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="private methods">
    
        /**
         * Changes color alpha by the passed percentage.
         * @param {Number} percentage <0; 100>
         * @returns {cz.kajda.timeline.render.Color} self
         */
        _fade : function(percentage) {
            this.alpha += this.alpha * percentage;
            return this;
        },
    
        /**
         * Crops the passed value to the standard color channel interval values.
         * @param {Number} num
         * @returns {Number}
         */
        _normalizeChannel : function(num) {
            if(num < 0) return 0;
            if(num > 255) return 255;
            return num;
        },

    
        /**
         * Crops the passed value to the standard alpha channel interval values.
         * @param {Number} num
         * @returns {Number}
         */
        _normalizeAlpha : function(num) {
            if(num < 0) return 0;
            if(num > 1) return 1;
            return num;
        },
    
    //</editor-fold>


    /**
     * @returns {String} hexadecimal color representation
     */
    getHex : function() {
        return "#" + 
            this.red.toString(16) +
            this.green.toString(16) + 
            this.blue.toString(16);
    },
    
    /**
     * @returns {String} CSS rgb(r,g,b) format color representation
     */
    getRgb : function() {
        return "rgb(" +
            this.red + "," +
            this.green + "," +
            this.blue + ")";
    },
    
    /**
     * @returns {String} CSS rgba(r,g,b,a) format color representation
     */
    getRgba : function() {
        return "rgba(" +
            this.red + "," +
            this.green + "," +
            this.blue + "," + 
            this.alpha + ")";        
    },
    
    /**
     * Using this instance creates new one 
     * that is darker by the passed percentage.
     * If the percentage is negative, the color is lighten instead.
     * @param {Number} percentage <-100; 100>
     * @returns {cz.kajda.timeline.render.Color} new color
     */
    darken : function(percentage) {
        return new this._constructor(
        Math.round(this.red * (1 - percentage / 100)),
        Math.round(this.green * (1 - percentage / 100)),
        Math.round(this.blue * (1 - percentage / 100)),
        this.alpha
        );
    },
    
    /**
     * Changes (descreases) the color alpha channel by the passed percentage.
     * @param {Number} percentage <0; 100>
     * @returns {cz.kajda.timeline.render.Color} self
     */
    fadeout : function(percentage) {
        return this._fade(-percentage / 100);
    },
    
    /**
     * Changes (increses) the color alpha channel by the passed percentage.
     * @param {Number} percentage <0; 100>
     * @returns {cz.kajda.timeline.render.Color} self
     */
    fadein : function(percentage) {
        return this._fade(percentage) / 100;
    },
    
    /**
     * Checks whether the color has the alpha channel.
     * @returns {Boolean}
     */
    hasAlpha : function() {
        return this.alpha >= 0;
    },
    
    /**
     * Sets color alpha channel value 
     * @param {Number} a <0; 1>
     * @returns {cz.kajda.timeline.render.Color} self
     */
    setAlpha : function(a) {
        this.alpha = this._normalizeAlpha(a);
        return this;
    },
    
    /**
     * @returns {Number} alpha channel value
     */
    getAlpha : function() {
        return this.alpha;
    },
    
    /**
     * Duplicates color instance.
     * @returns {cz.kajda.timeline.render.Color} color duplicate instance
     */
    clone : function() {
        return new this._constructor(this.red, this.green, this.blue, this.alpha);
    }
    
});


/**
 * @static
 * Creates color instance using its hexadecimal representation.
 * @param {String} hex
 * @param {Number} alpha alpha channel (optional) (default: 1.0)
 * @returns {cz.kajda.timeline.render.Color}
 */
Color.fromHex = function(hex, alpha /* = 1.0 */) {
    hex = parseInt(hex.replace("#", "0x"));
    b = parseInt(hex) & 255;
    hex >>= 8;
    g = parseInt(hex) & 255;
    hex >>= 8;
    r = parseInt(hex) & 255;
    return new Color(r, g, b, alpha ? alpha : 1.0);
};



return Color;
});

