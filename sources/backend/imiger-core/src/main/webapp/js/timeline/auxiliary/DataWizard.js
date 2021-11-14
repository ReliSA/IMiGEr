/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */


define([
    'bootstrap-dialog',
    'auxiliary/RestSource',
    'momentjs',
    'cz/kajda/data/Entity',
    'cz/kajda/data/Relation'
],
function(BootstrapDialog, RestSource, moment, Entity, Relation) {


/**
 * Wizard thet enables user to set entity and relation stereotype priorities.
 * @type Class
 */
var DataWizard = new Class("DataWizard", {

    _constructor: function(url, callback) {
        this._slide = 0;
		this._url = url;
        this._callback = callback;
        this._init();
    },
	
	_url : null,

    _DIALOG_OPTS: {
        title: 'Průvodce výběrem dat',
        closable: false,
        buttons: [{
                id: 'nextBtn',
                label: 'Další krok',
                cssClass: 'btn-primary',
                hotkey: 13
            }]
    },

    _SLIDES: [
        {
            "url": "dialogs/intro.dlg"
        },
        {
            "url": "dialogs/step1.dlg",
            "verify": function(payload) {
                var from = payload.from.val(),
                        to = payload.to.val();
                if (to > from) {
                    this._restSource.setTimeRange(moment.utc("0000-01-01T00:00:00").year(from), moment.utc("0000-12-31T23:59:00").year(to));
                    return true;
                } else {
                    BootstrapDialog.alert({
                        type: BootstrapDialog.TYPE_WARNING,
                        message: "Abyste mohli pokračovat, musíte nejdříve určit, s jakým časovým rozmezím historických dat chcete pracovat."
                    });
                    return false;
                }
            }
        },
        {
            "url": "dialogs/step2.dlg",
            "verify": function(payload) {
                var entityPriors = {};
                for(prior in payload)
                    entityPriors[prior] = payload[prior].val();
                this._restSource.setEntityPriorities(entityPriors);
                return true;
            }
        },
        {
            "url": "dialogs/step3.dlg",
            "verify": function(payload) {
                var relationPriors = {};
                for(prior in payload)
                    relationPriors[prior] = payload[prior].val();
                this._restSource.setRelationPriorities(relationPriors);
                return true;
            }
        },
        {
            "url": "dialogs/processing.dlg",
            "action" : function() {
                this._dialog.enableButtons(false);
                this._restSource.loadData();
            },
        },
        {
            "url": "dialogs/finish.dlg"
        }
    ],

    _slide: null,

    _dialog: null,

    _callback: null,

    _restSource: null,

    _init: function() {
        this._dialog = new BootstrapDialog(this._DIALOG_OPTS);
        this._dialog.realize();
        this._dialog.getButton("nextBtn").click(new Closure(this, this._handleNextClick));
        this._dialog.open();

        this._restSource = new RestSource(Entity, Relation, this._url, null);

        this._restSource.addListener("requestFailed", new Closure(this, this._handleError));
        this._restSource.addListener("dataLoaded", new Closure(this, function() {
            this._dialog.enableButtons(true);
            this._slideTo(++this._slide);
        }));

        this._slideTo(0);
    },

    _handleNextClick: function() {
        var slide = this._SLIDES[this._slide];
        var payload;
        if (this._slide === this._SLIDES.length - 1) {
            this._finishWizard();
            return;
        }

        if (isset(slide.verify)) {
            payload = {};
            this._dialog.getModalBody().find("[data-dlg-payload]").each(function() {
                var $this = $(this);
                payload[$this.attr("data-dlg-payload")] = $this;
            });
            if (!slide.verify.call(this, payload))
                return false;
        }

        this._dialog.enableButtons(false);
        this._slideTo(++this._slide);
        return true;
    },

    _handleError : function(jqXhr, text, st) {
        BootstrapDialog.alert({
            type: BootstrapDialog.TYPE_DANGER,
            message: "Při zpracovávání Vašeho požadavku bohužel došlo k chybě.<div>Zkuste jej provézt znovu později nebo se obraťte na administrátora.</div><p><strong>" + text + " " + st + ":</strong> " + (isset(jqXhr.responseJSON) ? jqXhr.responseJSON.error : "") + "</p>"
        });
        this._dialog.close();
    },

    _slideTo: function(slideIndex) {
        this._slide = slideIndex;
        this._dialog.getModalBody().load(this._SLIDES[slideIndex].url);
        this._dialog.enableButtons(true);
        if (isset(this._SLIDES[slideIndex].action)) {
            this._SLIDES[slideIndex].action.call(this);
        }
        if (this._slide === this._SLIDES.length - 1) {
            this._dialog.getButton("nextBtn")
                    .text("Začít průzkum");
        }
    },

    _isValidYear: function(val) {
        var iVal = parseInt(val);
        if (isNaN(iVal))
            return false;
        return iVal >= -200000 && iVal <= 200000;
    },

    _finishWizard: function() {
        this._dialog.close();
        if (isset(this._callback)) {
            this._callback.call(null, this._restSource);
        }
    }
});



return DataWizard;
});

