require.config({
    baseUrl: 'js',
    paths: {
        jquery : 'lib/jquery/jquery-2.1.4.min',
        jqueryui : 'lib/jqueryui/jquery-ui.min',
        snap : 'lib/snapsvg/snap.svg-min',
        moment: 'lib/moment/moment.min',
        "bootstrap-dialog" : 'auxiliary/bootstrap-dialog/bootstrap-dialog.min',
        momentjs : 'moment.extension',
        bootstrap : 'auxiliary/bootstrap/bootstrap.min'
    },
    shim: {
        "jqueryui" : {
            export: "$" ,
            deps: ['jquery']
        },
        "bootstrap" : {
            "deps" : ['jquery']
        },
        "bootstrap-dialog" : {
            "deps" : ["bootstrap"]
        }
    }
});


requirejs([
    'jquery',
    'auxiliary/App',
    'cz/kajda/timeline/Timeline',
    '../data/BandsDistribution'
],

/**
 * Main function.
 * Initiates application.
 * To decide which data source should be used,
 * (un)comment one of the last lines in this function.
 */
function($, App, Timeline, BandsDistribution) {
    
    // create new instance of app support
    var app = new App();
    // FIALA 
    var bandsDistribution = new BandsDistribution();
    
	/** @see cz.kajda.timeline.Timeline~_DEFAULTS */
    var timelineOpts = {
        data : null,
        bands : bandsDistribution.bands,
        bandAssignMethod : function(timeline, entity) {
            if(timeline.getBandGroup().hasBand(entity.getType()))
                return timeline.getBandGroup().getBand(entity.getType());
            return null;
        },

        events : {
            itemRightClick : function(entity) {
                this.adjustTo(entity);             
            },
            
            relationClick : function(relation) {
                var focused = this.getFocusedItem();
                if(focused && relation.isOrigin(focused.getId()))
                    this.focusItem(relation.getDestinationId(), true, false);
                else
                    this.focusItem(relation.getOriginId(), true, false);
            }
        },
        
        locale : {
            "btnSlideBack" : "vzad",
            "btnSlideForward" : "vpřed",
            "btnZoomIn" : "přiblížit (Num +)",
            "btnZoomOut" : "oddálit (Num -)"
        },
        
        popoverTemplateFactory : {
            'entity' : {
                '*' : function(entity) {
                    var elm = new jQuery("<div class='my-popover'>");  
                    
                    if(entity.has("imageSrc")) {
                        elm.append(new jQuery("<img class='img'>")
                            .attr("src", entity.property("imageSrc")));
                    }
                    
                    var start = entity.getStartFormatted();
                    var end = entity.getEndFormatted();
                    var div = new $("<div class='info'>")
                            .append(new $("<h3>" + entity.getTitle() + "</h3>"))
                            .append("<p class='description'><div>" + start + (end !== null ? " — " + end : "") + 
                                "<span class='text-muted'> (" + entity.getDuration().humanize() + ")</span></div></p>");
                        
                    return elm.append(div).append($("<div class='clearfix'>"));
                },
                'person' : function(entity) {
                    var elm = new jQuery("<div class='my-popover'>");                    
                    if(entity.has("imageSrc")) {
                        elm.append(new jQuery("<img class='img'>")
                            .attr("src", entity.property("imageSrc")));
                    }
                    
                    var birth = entity.getStartFormatted();
                    var death = entity.getEndFormatted();
                    var div = new $("<div class='info'>")
                            .append(new $("<h3>" + entity.getTitle() + "</h3>"))
                            .append("<p class='description'><div>* " + birth + (death !== null ? "</div><div>&dagger; " + death : "") + 
                                "<span class='text-muted'> (" + entity.getDuration().humanize() + ")</span></div></p>");
                        
                    return elm.append(div).append($("<div class='clearfix'>"));
                }
            },
            'relation' : {
                '*' : function(relation) {
                    var from = this.getDataSource().getAllMappedEntities().get(relation.getOriginId());
                    var to = this.getDataSource().getAllMappedEntities().get(relation.getDestinationId());
                    var elm = new jQuery("<div class='text-center'>");
                    elm.addClass("my-popover")
                            .html("<div>" + from.getTitle() + " </div><h3>&#x21e9; " + relation.getTitle() + " &#x21e9;</h3><div>" + to.getTitle() + "</div>");
                    return elm;
                }
            },
        }
    };
    
    
    // notify me when the data is loaded
    app.addListener("dataSourceCreated", new Closure(this, function(source, opts) {
        $("#glass-pane").fadeOut();
        var timeline = new Timeline($("#timeline"), opts);
        timeline.setDataSource(source);
        app.setTimeline(timeline);
        app.start();
    }, timelineOpts));
    
    // creates static data source using JSON
    app.createSource();
    
    // creates data source using REST server request
    //app.startDataWizard("http://localhost:8080/timeline-rest/");
    
    // creates source producing random data
    //app.createRandSource({ /* here comes config that changes distribution parameters (see RandSource~_DEFAULTS) */ });
});
