/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */
define([
    'auxiliary/DataWizard',
    'cz/kajda/common/Observable',
    'cz/kajda/data/Entity',
    'cz/kajda/data/Relation',
    'auxiliary/RestSource',
    'momentjs',
],
function(DataWizard, Observable, Entity, Relation, RestSource, moment) {
    
/**
 * Demo application support for the widget.
 */
var App = new Class("App", {
    
    _extends : Observable,
    
    _constructor : function() {
        Observable.call(this);
    },

    /** @member {cz.kajda.data.AbstractDataSource} */
    _source : null,
    /** @member {cz.kajda.timeline.Timeline} */
    _timeline : null,
    /** @member {Number} timeout that delays the entity search */
    _searchDelayTimer : null,
    
    /** @member {Object} relation translations */
    _RELATION_TRANSLATE : {
        "part_of" : "součást",
        "relationship" : "vztah",
        "participation" : "účast",
        "takes_place" : "místo konání",
        "creation" : "zapříčinění vzniku",
        "cause" : "zapříčinění",
        "interaction" : "interakce"
    },

    
    /**
     * Creates data source using static JSON object 
     */
    createSource : function() {
        this._source = new RestSource(Entity, Relation, "http://localhost:8080/imiger/", null);
        this._source.addListener("dataLoaded", new Closure(this, this._sourceReady));
        this._source.loadData();
    },
    
    /**
     * When the timeline is initiated, adds event listeners to be able to handle some timeline events
     * and adds listeners to the sidebar controls.
     * @param {cz.kajda.timeline.Timeline} timeline
     */
    setTimeline : function(timeline) {
        this._timeline = timeline;
        this._timeline.addListener("zoomChanged", new Closure(this, this._updateZoomLevel))
                .addListener("timeChanged", new Closure(this, this._updateTimeInfo))
                .addListener("itemFocus", new Closure(this, this._updateFocused, true))
                .addListener("itemBlur", new Closure(this, this._updateFocused, false));
        
        
        $("#zoomin_btn").on("click", new Closure(this, this._timelineZoom, +1));
        $("#zoomout_btn").on("click", new Closure(this, this._timelineZoom, -1));
        $("#slideLeft_btn").on("click", new Closure(this, this._timelineSlide, -1));
        $("#slideRight_btn").on("click", new Closure(this, this._timelineSlide, +1));
        $("#jump_ad_btn").on("click", new Closure(this, this._timelineJumpAD));
        $("#bandLabels_chb").on("click", new Closure(this, this._timelineBandLabels));
        $("#zoombar_chb").on("click", new Closure(this, this._timelineZoombar));
        $("#timepointer_chb").on("click", new Closure(this, this._timelineTimePointer));
        $("#popover_chb").on("click", new Closure(this, this._timelinePopover));
        $("#guidelines_chb").on("click", new Closure(this, this._timelineGuidelines));
        $("#relations_chb").on("click", new Closure(this, this._timelineRelations));
        $("#item_search_term").on("input", new Closure(this, this._searchInTimeline));
        /** Michal Fiala */
        $("#start_test_btn").on("click", new Closure(this, this._startTest));
    },

    /**
     * Shows the sidebar.
     */
    start : function() {
        $("#sidebar").fadeIn();
    },
    
    /**
     * Called when the data wizard finishes the REST request and maps the data.
     * @param {cz.kajda.data.AbstractDataSource} source
     * @fires dataSourceCreated
     */
    _sourceReady : function(source) {
        this._source = source;
        this._fireEvent("dataSourceCreated", this._source);
    },
    
    //<editor-fold defaultstate="collapsed" desc="sidebar controling">

        /** When a band item is selected, updates its detail in the sidebar */
        updateSidebar : function(entity) {
            if(entity === null) {
                $("#item_search").removeClass("hidden");
                $("#item_detail_pane").addClass("hidden");
                return;
            } else {
                $("#item_search").addClass("hidden");
                $("#item_detail_pane").removeClass("hidden");
            }
            $("#item_title").text(entity.getTitle());
            $("#item_description").text(entity.getDescription() ? entity.getDescription() : "");
            var start = entity.getStartFormatted();
            var end = entity.getEndFormatted();
            $("#item_timerange").html(start + (end !== null ? "&ndash;" + end : "") + 
                   " <span class='text-muted'>(" + entity.getDuration().humanize()  + ")</span>");
            if(entity.has("imageSrc")) {
                var imageContainer = $("#item_image").show();
                imageContainer.find("img").attr("src", entity.property("imageSrc"));
            } else {
                $("#item_image").hide();
            }

            this._fillRelationTable(entity);
        },

        /** onItemFocus handler */
        _updateFocused : function(entity, focused) {
            if(focused) {
                $("#focused_entity_td").text(entity.getTitle());
                this.updateSidebar(entity);
            } else {
                $("#focused_entity_td").html("<em>žádný</em>");
                this.updateSidebar(null);
            }
        },

        /** Performs zooming */
        _timelineZoom : function(e, dir) {
            this._timeline.zoom(dir);
        },

        /** Performs sliding the wrapper */
        _timelineSlide : function(e, dir) {
            this._timeline.slide(dir);
        },
        
        /** Performs specific date jump */
        _timelineJumpAD : function(e) {
            this._timeline.goTo("0001-01-01T00:00");
        },

        /** Shows or hides band labels */
        _timelineBandLabels : function(e) {
            this._timeline.showBandLabels($(e.target).prop("checked"));
        },

        /** Shows or hides zoom bar */
        _timelineZoombar : function(e) {
            this._timeline.showZoombar($(e.target).prop("checked"));
        },

        /** Shows or hides time pointer */
        _timelineTimePointer : function(e) {
            this._timeline.showTimePointer($(e.target).prop("checked"));
        },

        /** Enables or disables showing popovers */
        _timelinePopover : function(e) {
            this._timeline.option("showItemPopovers",$(e.target).prop("checked"));
            this._timeline.option("showRelationPopovers",$(e.target).prop("checked"));
        },

        /** Enables or disables showing guidelines */
        _timelineGuidelines : function(e) {
            this._timeline.option("showGuidelines",$(e.target).prop("checked"));
        },

        /** Enables or disables relation viewer */
        _timelineRelations : function(e) {
            this._timeline.option("showRelations",$(e.target).prop("checked"));
        },

        /** Updates side bar widget info */
        _updateZoomLevel : function(dir, level) {
            var dur = moment.duration(this._timeline.getZoomLevel().getSecondsPerPixel()*1000 );
            $("#zoom_level_td").html(level + " <div class='text-muted'>(1 px ~ " + dur.humanize() + ")</div>");
        },
        
        /** Updates side bar widget info */
        _updateTimeInfo : function(newTime) {
            $("#center_time_td").html(newTime.format("LLL"));
            var rng = this._timeline.getViewportRange();
            $("#viewport_range_td").html(rng.start.format("LLL") + "<div>" + rng.end.format("LLL") + "</div>");
        },

        /** Fills the netity relations table with appropriate relations */
        _fillRelationTable : function(entity) {

            var relationIds = entity.getRelationIds(),
                relationList = $("#item_relations");

            relationList.empty();

            for(var i = 0; i < relationIds.length; i++) {
                var relation = this._source.getRelations().get(relationIds[i]),
                    target = this._source.getAllMappedEntities().get(relation.isOrigin(entity) ? relation.getDestinationId() : relation.getOriginId());
                var tr = $("<tr>"),
                    targetAnchor = $("<a>").text(target.getTitle()).attr("href","#");


                $("<td>")
                    .html("<em>" + relation.getTitle() + "</em>")
                    .appendTo(tr);

                $("<td class='text-center'>")
                    .html("<div class='relation-sign'>" + (relation.isOrigin(entity) ? "&#8680;" : "&#8678;") + "</div><div class='text-muted'>(" + this._RELATION_TRANSLATE[relation.getType()] + ")</div>")
                    .appendTo(tr);

                $("<td>")
                    .append(targetAnchor)
                    .appendTo(tr);

                targetAnchor.click(new Closure(this, this._selectEntityInTimeline, target));
                relationList.append(tr);
            }
        },

        /** Sets focus to the specific entity/banditem */
        _selectEntityInTimeline : function(e, entity) {
            e.preventDefault();
            this._timeline.focusItem(entity);
        },

        /** Invokes entity search */
        _searchInTimeline : function(e) {
            var term = $(e.target).val();
            if(term.length < 3) return;
            clearTimeout(this._searchDelayTimer);
            this._searchDelayTimer = setTimeout(new Closure(this, this._search, term), 400);
        },

        /** Performs search */
        _search : function(term) {
            var dsrc = this._timeline.getDataSource().getEntities().raw();
            var resTable = $("#item_search_result").empty();
            var res = 0;
            var reg = new RegExp(term, "ig");
            for(var id in dsrc) {
                if(!dsrc.hasOwnProperty(id)) continue;
                if(dsrc[id].getTitle().search(reg) >= 0 ) {
                    var targetAnchor = $("<a>").text(dsrc[id].getTitle()).attr("href","#");
                    targetAnchor.click(new Closure(this, this._selectEntityInTimeline, id));
                    $("<tr></tr>")
                        .append($("<td>").wrapInner(targetAnchor))
                        .appendTo(resTable);
                    res++;
                }
            }
            if(res === 0) {
                resTable.append($('<tr><td><em>Žádné nálezy...</em></td></tr>'));
            }
        }
        

    //</editor-fold>
    
});
   
   
return App;   
});


