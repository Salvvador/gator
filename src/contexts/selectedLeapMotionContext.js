import {
    registerFistAndThrowAwayEvent,
    registerHandsFoldingEvent,
    registerHandsUnfoldingEvent,
    registerHandUpwardEvent,
    registerIndexFingerLeftEvent,
    registerIndexFingerRightEvent,
    registerStopEvent,
    registerWaveInEvent,
    changeContextOfAllLeapMotionGestures,
    registerWaveOutEvent
} from "../drivers/leapMotionDriver";
import {giveLongFeedback, giveQuickFeedback, readText} from "../drivers/ttsDriver";
import {
    decreaseSelection,
    deleteSelectedText,
    getRemainingText,
    getStartIndexOfSentence,
    increaseSelection,
    insertAfterSelectedText,
    insertBeforeSelectedText,
    replaceSelectedText,
    unselectText
} from "../drivers/textEditorDriver";
import {getIndexOfLastWordSpoken, setIndexOfLastWordSpoken} from "../utils/spokenWordsCounter";
import {changeContextOfAllPhrases, registerUnrecognizedPhraseEvent} from "../drivers/speechRecDriver";

const DEFAULT_CONTEXT = "default";
const SELECTED_CONTEXT = "selected";
const REPLACE_CONTEXT = "replace";
const INSERT_BEFORE_CONTEXT = "insert_before";
const INSERT_AFTER_CONTEXT = "insert_after";

export function registerSelectedLeapMotionContext() {
    registerFistAndThrowAwayEvent(SELECTED_CONTEXT, deleteAction);
    registerHandsFoldingEvent(SELECTED_CONTEXT, decreaseAction);
    registerHandsUnfoldingEvent(SELECTED_CONTEXT, increaseAction);
    registerHandUpwardEvent(SELECTED_CONTEXT, replaceLMAction);
    registerIndexFingerLeftEvent(SELECTED_CONTEXT, insertBeforeLMAction);
    registerIndexFingerRightEvent(SELECTED_CONTEXT, insertAfterLMAction);
    registerStopEvent(SELECTED_CONTEXT, stopAction);
    registerWaveInEvent(SELECTED_CONTEXT, decreaseAction);
    registerWaveOutEvent(SELECTED_CONTEXT, increaseAction);


    registerUnrecognizedPhraseEvent(REPLACE_CONTEXT, replaceAction);
    registerUnrecognizedPhraseEvent(INSERT_BEFORE_CONTEXT, insertBeforeAction);
    registerUnrecognizedPhraseEvent(INSERT_AFTER_CONTEXT, insertAfterAction);
}

function replaceLMAction() {
    giveQuickFeedback("Replaced action selected");
    changeContextOfAllPhrases(REPLACE_CONTEXT)
}

function insertBeforeLMAction() {
    giveQuickFeedback("Phrase replaced");
    changeContextOfAllPhrases(INSERT_BEFORE_CONTEXT)
}

function insertAfterLMAction() {
    giveQuickFeedback("Phrase replaced");
    changeContextOfAllPhrases(INSERT_BEFORE_CONTEXT)
}

function replaceAction(phrase) {
    try {
        giveQuickFeedback("Phrase replaced");
        changeContextOfAllPhrases(DEFAULT_CONTEXT);
        changeContextOfAllLeapMotionGestures(DEFAULT_CONTEXT);
        const index = replaceSelectedText(phrase);
        readFromBeginningOfSentence(index);
    } catch (e) {
        giveLongFeedback("Phrase not found. What I heard was " + phrase);
        console.log("Phrase not found. What I heard was " + phrase);
        readFromBeginningOfSentence();
    }
}

function insertBeforeAction(phrase) {
    try {
        giveQuickFeedback("Phrase replaced");
        changeContextOfAllPhrases(DEFAULT_CONTEXT);
        changeContextOfAllLeapMotionGestures(DEFAULT_CONTEXT);
        const index = insertBeforeSelectedText(phrase);
        readFromBeginningOfSentence(index);
    } catch (e) {
        giveLongFeedback("Phrase not found. What I heard was " + phrase);
        readFromBeginningOfSentence();
    }
}

function insertAfterAction(phrase) {
    try {
        giveQuickFeedback("Phrase replaced");
        changeContextOfAllPhrases(DEFAULT_CONTEXT);
        changeContextOfAllLeapMotionGestures(DEFAULT_CONTEXT);
        const index = insertAfterSelectedText(phrase);
        readFromBeginningOfSentence(index);
    } catch (e) {
        giveLongFeedback("Phrase not found. What I heard was " + phrase);
        console.log("Phrase not found. What I heard was " + phrase);
        readFromBeginningOfSentence();
    }
}

function deleteAction() {
    try {
        giveQuickFeedback("Phrase removed");
        changeContextOfAllPhrases(DEFAULT_CONTEXT);
        changeContextOfAllLeapMotionGestures(DEFAULT_CONTEXT);
        const index = deleteSelectedText();
        readFromBeginningOfSentence(index);
    } catch (e) {
        readFromBeginningOfSentence();
    }
}

function stopAction() {
    giveQuickFeedback("Selection aborted");
    changeContextOfAllPhrases(DEFAULT_CONTEXT);
    changeContextOfAllLeapMotionGestures(DEFAULT_CONTEXT);
    const index = unselectText();
    readFromBeginningOfSentence(index);
}

function readFromBeginningOfSentence(index) {
    if (index === undefined) {
        const startIndexOfCurrentSentence = getStartIndexOfSentence(getIndexOfLastWordSpoken());
        readFromIndex(startIndexOfCurrentSentence);
    } else {
        const startIndexOfSentence = getStartIndexOfSentence(index);
        readFromIndex(startIndexOfSentence);
    }

}

function readFromIndex(index) {
    setIndexOfLastWordSpoken(index);
    readText(getRemainingText(index));
}

function increaseAction() {
    try {
        const currentSelection = increaseSelection();
        giveQuickFeedback(currentSelection + " selected");
    } catch (e) {
        if (e.message === "Maximum text selected") {
            giveQuickFeedback("Whole text already selected");
        } else {
            giveQuickFeedback("Selection aborted");
            changeContextOfAllPhrases(DEFAULT_CONTEXT);
            changeContextOfAllLeapMotionGestures(DEFAULT_CONTEXT);
        }
    }
}

function decreaseAction() {
    try {
        const currentSelection = decreaseSelection();
        giveQuickFeedback(currentSelection + " selected");
    } catch (e) {
        if (e.message === "Selection aborted") {
            giveQuickFeedback("Selection aborted");
            changeContextOfAllPhrases(DEFAULT_CONTEXT);
            changeContextOfAllLeapMotionGestures(DEFAULT_CONTEXT);
            const index = unselectText();
            readFromBeginningOfSentence(index);
        } else {
            console.log(e);
        }
    }
}
