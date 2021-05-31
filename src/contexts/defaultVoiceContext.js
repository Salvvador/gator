import {
    registerSpeechRecognitionEvent,
    registerUnrecognizedPhraseEvent,
} from "../drivers/speechRecDriver";
import {
    getRemainingText,
    selectPhrase,
    getStartIndexOfSentence,
    deleteSelectedText,
    replaceSelectedText,
    insertAfterSelectedText,
    insertBeforeSelectedText,
    undo,
    increaseSelection,
    decreaseSelection
} from "../drivers/textEditorDriver";
import {
    giveLongFeedback,
    giveQuickFeedback,
    isTTSSpeaking,
    stopReadingText,
    readText
} from "../drivers/ttsDriver";
import {getIndexOfLastWordSpoken, setIndexOfLastWordSpoken, restartIndexOfLastWordSpoken} from "../utils/spokenWordsCounter"
import {changeContextOfAllLeapMotionGestures} from "../drivers/leapMotionDriver";

const DEFAULT_CONTEXT = "default";
const SELECTED_CONTEXT = "selected";

const INSERT_COMMAND = "insert";
const ADD_COMMAND = "add";
const INSIDE_COMMAND = "inside";
const REPLACE_COMMAND = "replace";
const CHANGE_COMMAND = "change";
const DELETE_COMMAND = "delete";
const REMOVE_COMMAND = "remove";
const REPEAT_COMMAND = "repeat";
const STOP_COMMAND = "stop";
const START_COMMAND = "start";
const UNDO_COMMAND = "undo";
const RESTART_COMMAND = "restart";
const INCREASE_COMMAND = "increase";
const DECREASE_COMMAND = "decrease";

export function registerDefaultVoiceContext() {
    registerSpeechRecognitionEvent(INSERT_COMMAND, DEFAULT_CONTEXT, insertAction);
    registerSpeechRecognitionEvent(ADD_COMMAND, DEFAULT_CONTEXT, insertAction);
    registerSpeechRecognitionEvent(INSIDE_COMMAND, DEFAULT_CONTEXT, insertAction);
    registerSpeechRecognitionEvent(REPLACE_COMMAND, DEFAULT_CONTEXT, replaceAction);
    registerSpeechRecognitionEvent(CHANGE_COMMAND, DEFAULT_CONTEXT, replaceAction);
    registerSpeechRecognitionEvent(DELETE_COMMAND, DEFAULT_CONTEXT, deleteAction);
    registerSpeechRecognitionEvent(REMOVE_COMMAND, DEFAULT_CONTEXT, deleteAction);
    registerSpeechRecognitionEvent(REPEAT_COMMAND, DEFAULT_CONTEXT, repeatAction);
    registerSpeechRecognitionEvent(START_COMMAND, DEFAULT_CONTEXT, repeatAction);
    registerSpeechRecognitionEvent(STOP_COMMAND, DEFAULT_CONTEXT, stopAction);
    registerSpeechRecognitionEvent(UNDO_COMMAND, DEFAULT_CONTEXT, undoAction);
    registerSpeechRecognitionEvent(RESTART_COMMAND, DEFAULT_CONTEXT, restartReadingAction);
    registerSpeechRecognitionEvent(INCREASE_COMMAND, DEFAULT_CONTEXT, increaseAction);
    registerSpeechRecognitionEvent(DECREASE_COMMAND, DEFAULT_CONTEXT, decreaseAction);

    registerUnrecognizedPhraseEvent(DEFAULT_CONTEXT, selectPhraseAction);
}

function selectPhraseAction(phrase) {
    if (phrase) {
        phrase = phrase.toLowerCase();
    }
    try {
        selectPhrase(getIndexOfLastWordSpoken(), phrase);
        giveQuickFeedback("Phrase selected");
        changeContextOfAllLeapMotionGestures(SELECTED_CONTEXT);
    } catch(e) {
        giveLongFeedback("Phrase not found. What I heard was " + phrase);
        console.log("Phrase not found. What I heard was " + phrase);
        readFromBeginningOfSentence();
    }
}

function restartReadingAction() {
    restartIndexOfLastWordSpoken();
    readText(getRemainingText(0));
}

function deleteAction(phrase) {
    try {
        selectPhrase(getIndexOfLastWordSpoken(), phrase);
        giveQuickFeedback("Phrase removed");
        const index = deleteSelectedText();
        readFromBeginningOfSentence(index);
    } catch(e) {
        giveLongFeedback("Phrase not found. What I heard was " + phrase);
        console.log("Phrase not found. What I heard was " + phrase);
        readFromBeginningOfSentence();
    }
}

function replaceAction(phrase) {
    let separationWord;
    try {
        separationWord = getReplaceSeparationWord(phrase);
    } catch(e) {
        giveQuickFeedback("No separation word");
        console.log("No separation word");
        readFromBeginningOfSentence();
        return;
    }
    const separationWordIndex = phrase.indexOf(separationWord);
    const insertionPhrase = phrase.substring(separationWordIndex + separationWord.length + 1);
    const locationPhrase = phrase.substring(0, separationWordIndex);
    if (!insertionPhrase) {
        giveQuickFeedback("No insertion phrase found");
        console.log("No insertion phrase found");
        readFromBeginningOfSentence();
        return;
    }
    if (!locationPhrase) {
        giveQuickFeedback("No location phrase found");
        console.log("No location phrase found");
        readFromBeginningOfSentence();
        return;
    }
    try {
        selectPhrase(getIndexOfLastWordSpoken(), locationPhrase);
        giveQuickFeedback("Phrase replaced");
        const index = replaceSelectedText(insertionPhrase);
        readFromBeginningOfSentence(index);
    } catch(e) {
        giveLongFeedback("Phrase not found. What I heard was " + locationPhrase);
        console.log("Phrase not found. What I heard was " + locationPhrase);
        readFromBeginningOfSentence();
    }
}

function getReplaceSeparationWord(phrase) {
    if (phrase.includes("with")) {
        return "with";
    } else if (phrase.includes("by")) {
        return "by";
    }  else if (phrase.includes("to")) {
        return "to";
    } else {
        throw new Error("No separation phrase");
    }
}

function insertAction(phrase) {
    let separationWord;
    try {
        separationWord = getInsertSeparationWord(phrase);
    } catch(e) {
        giveLongFeedback("No separation word");
        console.log("No separation word");
        readFromBeginningOfSentence();
        return;
    }
    const separationWordIndex = phrase.indexOf(separationWord);
    const locationPhrase = phrase.substring(separationWordIndex + separationWord.length + 1);
    const insertionPhrase = phrase.substring(0, separationWordIndex);
    try {
        let index;
        selectPhrase(getIndexOfLastWordSpoken(), locationPhrase);
        if (separationWord === "before") {
            index = insertBeforeSelectedText(insertionPhrase);
        } else {
            index = insertAfterSelectedText(insertionPhrase);
        }
        giveQuickFeedback("Phrase inserted");
        readFromBeginningOfSentence(index);
    } catch(e) {
        giveLongFeedback("Phrase not found. What I heard was " + locationPhrase);
        console.log("Phrase not found. What I heard was " + locationPhrase);
        readFromBeginningOfSentence();
    }
}

function getInsertSeparationWord(phrase) {
    if (phrase.includes("after")) {
        return "after";
    } else if (phrase.includes("before")) {
        return "before";
    } else {
        throw new Error("No separation phrase");
    }
}

function repeatAction(phrase) {
    if (phrase === 'previous') {
        readFromBeginningOfPreviousSentence();
        return;
    }
    readFromBeginningOfSentence();
}

function readFromBeginningOfPreviousSentence() {
    const startIndexOfCurrentSentence = getStartIndexOfSentence(getIndexOfLastWordSpoken());
    const startIndexOfPreviousSentence = getStartIndexOfSentence(startIndexOfCurrentSentence - 2);
    readFromIndex(startIndexOfPreviousSentence);
}

function readFromBeginningOfSentence() {
    const startIndexOfCurrentSentence = getStartIndexOfSentence(getIndexOfLastWordSpoken());
    readFromIndex(startIndexOfCurrentSentence);
}

function readFromIndex(index) {
    setIndexOfLastWordSpoken(index);
    readText(getRemainingText(index));
}

function stopAction() {
    if (isTTSSpeaking()) {
        stopReadingText();
        giveQuickFeedback("Reading stopped");
    }
}

function undoAction() {
    undo();
    giveQuickFeedback("Action undone");
    readFromBeginningOfSentence();
}

function increaseAction() {
    try {
        const currentSelection = increaseSelection();
        giveQuickFeedback(currentSelection + " selected");
    } catch(e) {
        if (e.message === "Maximum text selected") {
            giveQuickFeedback("Whole text already selected");
        } else {
            giveQuickFeedback("Nothing selected");
        }
    }
}

function decreaseAction() {
    try {
        const currentSelection = decreaseSelection();
        giveQuickFeedback(currentSelection + " selected");
    } catch(e) {
        giveQuickFeedback("Nothing selected");
    }
}