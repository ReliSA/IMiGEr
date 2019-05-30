define([
    'moment'
], function(moment) {
    
moment.locale("cs"); 
moment.defaultFormat = "YYYY-MM-DDTHH:mm:ss";
    
moment.Y1BC = moment.utc("0000-01-01 00:00:00.000");
moment.MID_RANGE = moment.utc("1970-01-01 00:00:00.000");
moment.SECOND = "second";
moment.YEAR = "year";
moment.MIN_MOMENT = moment.utc("-200000-01-01T00:00:00+00:00");
moment.MAX_MOMENT = moment.utc("+200000-12-31T23:59:59+00:00");

moment.fn.iformat = function(formatString) {
    var loc = moment.localeData();
    var year = parseInt(this.format("YYYYYY"));
    var century = Math.floor(year / 100) + (year >= 0 ? 1 : 0);
    var decade = Math.floor((Math.abs(year) % 100) / 10) * 10;
    if(year <= 0) year -= 1;
    formatString = formatString.replace(/([^Y]*)(YYyy)([^yY]*)/, "$1" + Math.abs(year) + (year < 0 ? " př.n.[l]." : "") + "$3");
    formatString = formatString.replace(/([^Y]*)(YYYy)([^yY]*)/, "$1" + year + "$3");
    formatString = formatString.replace(/CC/, loc.ordinal(Math.abs(century)) + " [s]t." + (century < 0 ? " př.n.[l]." : ""));
    formatString = formatString.replace(/dc/, loc.ordinal(decade));
    
    return this.format(formatString);
};

moment.fn.isBetween = function(start, end) {
    return this.isAfter(start) && this.isBefore(end);
};

moment.fn.isBC = function() {
    return this.isBefore(moment.Y1BC);
};


return moment;
});