/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    "jquery",
    "cz/kajda/common/Observable"
],
function($, Observable) {

/**
 * Simple REST client.
 * Enables user to send POST and GET request including plain text or json payload.
 */
var RestClient = new Class("RestClient", {

    _extends : Observable,

    /**
     * @constructor
     * @param {String} base URL for REST requests
     * @param {String} type data type used for request and responses (default: TYPE_JSON)
     */
    _constructor : function(baseUrl, type /* = RestClient.TYPE_JSON */) {
        Observable.call(this);
        this._baseUrl = baseUrl;
        this._type = !isset(type) || type === null ? this.TYPE_JSON : type;
    },

    /** HTTP method constants */
    METHOD_GET : "GET",
    METHOD_POST : "POST",

    /** data type constants */
    TYPE_JSON : "json",
    TYPE_PLAIN : "text",

    /** mime types corresponding with data types */
    MIMETYPES : {
        "json" : "application/json",
        "text" : "text/plain"
    },
    
    //<editor-fold defaultstate="collapsed" desc="private members">
   
        /** @member {String} base URL for requests */
        _baseUrl : null,

        /** @member {String} datatype (in jQuery notation), use TYPE_* constants */
        _type : null,

        /** functions that converts data to plain text */
        _CONVERTORS : {
            "json" : JSON.stringify,
            "text" : Window.String
        },
    
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="private methods">
    
        /**
         * Performs REST request.
         * @param {String} method HTTP method
         * @param {String} query URL query
         * @param {Object} payload data to be send in the request body
         * @param {Closure|Function} callback actions to be called after the request completation
         */
        _performRequest : function(method, query, payload, callback) {
            var okClosure = new Closure(this, this._requestSucceed); 
            var opts = {
                "url" : this._baseUrl + query,
                "dataType" : this._type,
                "method" : method
            };

            // if POST used, specify content type and convert data to a string
            if(method === this.METHOD_POST) {
                opts.contentType = this.MIMETYPES[this._type];
                opts.data = this._CONVERTORS[this._type].call(null, payload);
            }

            $.ajax(opts).then( // when the request is completed
                function(data) {
                    okClosure.call(null, data, callback);
                },
                new Closure(this, this._requestFailed)
            );
        },

        /**
         * Called when request returns any other code than 200.
         * Notifies event handlers.
         * @param {jqXHR} jqXHR
         * @param {String} textStatus
         * @param {String} errorThrown
         */
        _requestFailed : function(jqXHR, textStatus, errorThrown) {
            this._fireEvent("requestFailed", jqXHR, textStatus, errorThrown);
        },

        /**
         * Called when the request responses 200 code.
         * @param {Object} data
         * @param {Closure|Function} callback
         */
        _requestSucceed : function(data, callback) {
            callback.call(null, data, this);
        },

    //</editor-fold>

    /**
     * Performs GET request.
     * @param {String} query request relative URL
     * @param {Closure|FUnction} callback actons to be done after the request completation
     */
    get : function(query, callback) {
        this._performRequest(this.METHOD_GET, query, null, callback);
    },

    /**
     * Performs POST request.
     * @param {String} query request relative URL
     * @param {Object} payload data to be send with
     * @param {Closure|FUnction} callback actons to be done after the request completation
     */
    post : function(query, payload, callback) {
        this._performRequest(this.METHOD_POST, query, payload, callback);
    }

});

return RestClient;    
});

