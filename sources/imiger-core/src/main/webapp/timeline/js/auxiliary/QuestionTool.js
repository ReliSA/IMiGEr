/**
 * @author Michal Fiala
 * Tool for track user activities while searching for answer
 * @version 1.0
 */

define([
    'cz/kajda/common/Observable',
    '../../data/questions',
],
function(Observable, __questionsData) {
    

var QuestionTool = new Class("QuestionTool", {
    
    _extends : Observable,

    
    _constructor : function() {
        this._setup();
        Observable.call(this);
    },
    /** Object to store test result */
    _test : null,
    /** Actuall question index */
    _question_index : 0,
    /** Max questions */
    _question_max_index : 0,
    /** Questions */
    _questions : {},
    /** Actual question object */
    _actualQuestion : null,
    /** Element of answer */
    _answerElement : null,
    /** Element of test content */
    _testContentElement : null,
    /** Element of start test */
    _startTestElement : null,
    /** Element of end test */
    _endTestElement : null,
    /** Element of question label */
    _questionLabelElement : null,
    /** Element of wrong answer */
    _wrongAnswerElement : null,
    /** Element of progress label */
    _progressLabelElement : null,
    /** Timeout to hide label */
    _WRONG_ANSWER_TIMEOUT : 1000,

    /**
     * Setup question tool
     */
    _setup : function(){
        this.__groupDebug("Question tool setup");
        // Prepare test object
        this._setupTestObject();
        // Prepare questions
        this._setupQuestions();
        // Set events
        this._setupEvents();
        //Start test
        this._startTest();

        this.__closeGroupDebug();
    },
    /**
     * Prepare question from data file
     */
    _setupQuestions : function(){
        this.__groupDebug("Questions setup");
        //Set questions
        this._questions = __questionsData.questions;
        //Set max questions index
        this._question_max_index = this._questions.length - 1;

        this.__closeGroupDebug();
    },
    /**
     * Prepare events to be logged
     */
    _setupEvents : function(){
        this.__groupDebug("Events setup");
        
        //Setup elements
        this._startTestElement = $("#start_test_content");
        this._endTestElement = $("#end_test_content");
        this._testContentElement = $("#test_content");
        this._answerElement = $("#answer_text");
        this._questionLabelElement = $("#question_label");
        this._wrongAnswerElement = $("#wrong_anser_content");
        this._progressLabelElement = $("#questions_progress_label");

        //Item click
        this.addListener("itemLogClick", new Closure(this, this._itemLogClicked));
        //Timeline zoom
        this.addListener("timelineLogZoom", new Closure(this, this._timelineLogZoomed));
        //Relation click
        this.addListener("relationLogClick", new Closure(this, this._relationLogClicked));
        //Item enter
        this.addListener("itemLogEnter", new Closure(this, this._itemLogEnter));
        //Relation enter
        this.addListener("relationLogEnter", new Closure(this, this._relationLogEnter));
        //Item right click
        this.addListener("itemLogRightClick", new Closure(this, this._itemLogRightClicked));
        //Timeline shifted
        this.addListener("timelineLogShifted", new Closure(this, this._timelineLogShifted));
        //Confirm button click
        $("#confirm_btn").on("click", new Closure(this, this._confirmAnswer));
        //Key pressed
        this._answerElement.on("keyup", new Closure(this, this._keyUpEvent));
        //Mouse clicked
        document.body.addEventListener("click",new Closure(this, this._mouseClickEvent), true);

        this.__closeGroupDebug();
    },
    /**
     * Setup test object - test result
     */
    _setupTestObject: function(){
        this._test = new Object();
        this._test.mouseClickedCount = 0;
        this._test.questions = [];
    },
    /**
     * Starts test
     */
    _startTest : function(){
        // Visible content
        this._toggleVisibilityOfElement(this._testContentElement, true);
        // Not visible start button
        this._toggleVisibilityOfElement(this._startTestElement, false);
        // Set first question
        this._changeQuestion();
        // Change progress
        this._changeProgressLabel();
        // Set start time
        this._test.startTime = new Date();
    },
    /**
     * Ends test
     */
    _endTest : function(){
        // Hide content
        this._toggleVisibilityOfElement(this._testContentElement, false);
        // Hide content
        this._toggleVisibilityOfElement(this._endTestElement, true);

        // Set test end time
        this._test.endTime = new Date();
        // Set test duration
        this._test.duration = Math.round((this._test.endTime.getTime() - this._test.startTime.getTime())/1000);
        // Set test events count
        this._test.eventsCount = this._countEventsInTest(this._test);

        this._copyPaste();
        this._download(this._getDateToString(this._test.startTime) + ".js","return" + JSON.stringify(this._test));
    },
    /**
     * Returns formated date to string
     * @param {Date} date 
     */
    _getDateToString : function(date){
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    },
    /**
     * Counts events in whole test
     * @param {Object} test
     * @returns {int} count
     */
    _countEventsInTest : function(test){
        var result = 0;
        // For each question in test get events length
        for(var i = 0; i < test.questions.length; i++){
            var question = test.questions[i];
            if(question.events !== null){
                result += question.events.length;
            }
        }
        return result;
    },
    /**
     * Setup question object
     * @returns {question object} question
     */
    _setupQuestionObjectByActualIndex : function(){
        //Creating question object 
        var question = new Object();
        //Get index and text of question
        var questionIndex = this._question_index;
        var questionText = this._questions[this._question_index].text;
        //Set atributes of question
        question.events = [];
        question.index = questionIndex;
        question.questionText = questionText;
        question.questionStartTime = new Date();

        return question;
    },
    /**
     * Ends question
     */
    _endQuestion : function(){
        this._actualQuestion.questionEndTime = new Date();
        this._actualQuestion.questionDuration = Math.round((this._actualQuestion.questionEndTime.getTime() - this._actualQuestion.questionStartTime.getTime())/1000);
    },
    /**
     * Returns if is no more questions
     * @returns {bool}
     */
    _isEndOfTest : function(){
        if(this._question_index >= this._question_max_index){
            return true;
        }
        return false;
    },
    /**
     * Set visibility of element
     * @param {element} elementToWork 
     * @param {visibility} visibility 
     */
    _toggleVisibilityOfElement : function(element ,visibility){
        if(visibility)
            element.show();
        else
            element.hide(); 
    },
    /**
     * Changes question by actual index
     */
    _changeQuestion : function(){
        // Set new question by index
        this._actualQuestion = this._setupQuestionObjectByActualIndex();
        // Push into test object
        this._test.questions.push(this._actualQuestion);

        //Change label
        this._questionLabelElement.text(this._actualQuestion.questionText);
    },
    /**
     * End test if isEndOfTEst
     * Else change question
     */
    _rightAnswer : function() {
        // If actual is set, end this question
        if(this._actualQuestion !== null){
            this._endQuestion();
        }
        //End test
        if(this._isEndOfTest()){
            this._endTest();
        }
        //Change question
        else{
            this._question_index++;
            this._changeProgressLabel();
            this._changeQuestion();
        }
    },
    /**
     * Show and hide wrong aswer label
     */
    _wrongAnswer : function() {
        var el = this._wrongAnswerElement;
        this._toggleVisibilityOfElement(el, true);
        setTimeout(function(){
            el.hide();
        }, this._WRONG_ANSWER_TIMEOUT);
    },
    /**
     * Changes progress label by actual index
     */
    _changeProgressLabel : function(){
        var actual = (this._question_index + 1);
        var to = (this._question_max_index + 1);
        this._progressLabelElement.text(`${actual}/${to}`);
    },
    /**
     * Creates event object and store info and date in it
     * @param {object} info 
     * @param {string} eventType 
     * @returns {object} event
     */
    _createEvent : function(info, eventType){
        var event = new Object();
        event.info = info;
        event.eventType = eventType;
        event.eventTime = new Date();
        return event;
    },
    _download: function(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
    
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    },
    /** ############################# Section - event handlerer  ############################# */
    /**
     * Event after confirm button clicked
     * Check if answer is right
     * @param {event} e 
     */
    _confirmAnswer : function(e){
        var answer = this._answerElement.val();
        if(answer === this._questions[this._question_index].answer){
            this._rightAnswer();
        }
        else{
            this._wrongAnswer();
        }

        this._answerElement.val("");
    },
    _itemLogClicked : function(e){
        this._actualQuestion.events.push(this._createEvent(e, "Item click"));
    },
    _timelineLogZoomed : function(e){
        this._actualQuestion.events.push(this._createEvent(e, "Timeline zoom"));
    },
    _timelineLogShifted: function(e){
        this._actualQuestion.events.push(this._createEvent(e, "Timeline shifted"));
    },
    _relationLogClicked : function(e){
        this._actualQuestion.events.push(this._createEvent(e, "Relation click"));
    },
    _itemLogEnter : function(e){
        this._actualQuestion.events.push(this._createEvent(e, "Item enter"));
    },
    _relationLogEnter : function(e){
        this._actualQuestion.events.push(this._createEvent(e, "Relation enter"));
    },
    _itemLogRightClicked : function(e){
        this._actualQuestion.events.push(this._createEvent(e, "Item right clicked"));
    },
    /**
     * If possible prepare JSON string to copy paste
     */
    _copyPaste : function(){
        var copied = false;
  
        // Create textarea element
        const textarea = document.createElement('textarea');

        // Set the value of the text
        textarea.value = JSON.stringify(this._test);
        
        // Make sure we cant change the text of the textarea
        textarea.setAttribute('readonly', '');
        
        // Hide the textarea off the screnn
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        
        // Add the textarea to the page
        document.body.appendChild(textarea);

        // Copy the textarea
        textarea.select()

        try {
            var successful = document.execCommand('copy');
            copied = true;
        } catch(err) {
            copied = false;
        }
        if(copied){
            console.log(textarea.value);
        }

        textarea.remove();
    },
    /**
     * If enter was pressed, call confirm Answer
     * @param {event} e 
     */
    _keyUpEvent : function(e){
        if(e.keyCode === 13){
            this._confirmAnswer();
        }
    },
    /**
     * Increments mouse clicked count
     * @param {event} e 
     */
    _mouseClickEvent : function(e){
        this._test.mouseClickedCount++;
    }
    
});

return QuestionTool;   
});


