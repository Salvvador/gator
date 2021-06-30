import * as tts from '../modules/tts';
import * as spRec from '../modules/speechRecognition';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import * as txtEditor from '../modules/textEditor';
import {getNearestSmallerOccurence, getStartIndexOfSentence} from '../utils/textParser';

const DEFAULT_CONTEXT = "DEFAULT";
const SELECTED_CONTEXT = "SELECTED";
const VOICE_MODALITY = "VOICE";


export function registerDefaultVoiceContext() {
    // eventReg.registerEvent(DEFAULT_CONTEXT, VOICE_MODALITY, 'start', repeatAction);
    // eventReg.registerEvent(DEFAULT_CONTEXT, VOICE_MODALITY, 'delete (.*)', deleteAction);
    eventReg.registerEvent(DEFAULT_CONTEXT, VOICE_MODALITY, 'select (.*)', selectAction);
}

// function repeatAction(phrase) {
//     if (phrase === 'previous') {
//         readFromBeginningOfPreviousSentence();
//         return;
//     }
//     readFromBeginningOfSentence();
// }

async function selectAction(phrase) {
    tts.pause();
    const text = txtEditor.getText();
    const i = getNearestSmallerOccurence(text, phrase[0], tracker.getIndex());
    if (i !== -1) {
        txtEditor.select(i, phrase[0].length);
        tts.giveFeedback("Phrase selected");
        spRec.updateEventRegistry(eventReg.getActionHandlerPairs(SELECTED_CONTEXT, VOICE_MODALITY));
    } else {
        await tts.giveFeedback("Phrase not found. What I heard was: select " + phrase);
        console.log("Phrase not found. What I heard was: select " + phrase);
        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), tracker.getIndex());
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));
    }




    // try {
    //     const text = txtEditor.getText();
    //     const i = getNearestSmallerOccurence(text, phrase[0], tracker.getIndex());
    //     txtEditor.select(i, phrase[0].length);
    //     tts.giveFeedback("Phrase selected");
    // } catch(e) {
    //     tts.giveFeedback("Phrase not found. What I heard was " + phrase);
    //     console.log("Phrase not found. What I heard was " + phrase);
    //     const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), tracker.getIndex());
    //     tracker.setIndex(startIndexOfCurrentSentence);
    //     tts.readText(txtEditor.getText(startIndexOfCurrentSentence));
    // }
}

// function deleteAction(phrase) {
//     console.log('added')
//     console.log(phrase)
//     try {
//         selectPhrase(getIndexOfLastWordSpoken(), phrase[0]);
//         tts.giveFeedback("Phrase removed");
//         const index = deleteSelectedText();
//         readFromBeginningOfSentence(index);
//     } catch(e) {
//         tts.giveFeedback("Phrase not found. What I heard was " + phrase);
//         console.log("Phrase not found. What I heard was " + phrase);
//         const startIndexOfCurrentSentence = getStartIndexOfSentence(tracker.getIndex());
//         tracker.setIndex(startIndexOfCurrentSentence);
//         tts.readText(getRemainingText(startIndexOfCurrentSentence));
//     }
// }

// function readFromBeginningOfPreviousSentence() {
//     const startIndexOfCurrentSentence = getStartIndexOfSentence(getIndexOfLastWordSpoken());
//     const startIndexOfPreviousSentence = getStartIndexOfSentence(startIndexOfCurrentSentence - 2);
//     readFromIndex(startIndexOfPreviousSentence);
// }

// function readFromBeginningOfSentence() {
//     const startIndexOfCurrentSentence = getStartIndexOfSentence(getIndexOfLastWordSpoken());
//     readFromIndex(startIndexOfCurrentSentence);
// }

// function readFromIndex(index) {
//     setIndexOfLastWordSpoken(index);
//     tts.readText(getRemainingText(index));
// }


// import {
//     registerSpeechRecognitionEvent,
//     registerUnrecognizedPhraseEvent,
// } from "../drivers/speechRecDriver";
// import {
//     getRemainingText,
//     selectPhrase,
//     getStartIndexOfSentence,
//     deleteSelectedText,
//     replaceSelectedText,
//     insertAfterSelectedText,
//     insertBeforeSelectedText,
//     undo,
//     increaseSelection,
//     decreaseSelection
// } from "../drivers/textEditorDriver";
// import * as tts from '../modules/tts';
// import {getIndexOfLastWordSpoken, setIndexOfLastWordSpoken, restartIndexOfLastWordSpoken} from "../utils/spokenWordsCounter"
// import {changeContextOfAllLeapMotionGestures} from "../drivers/leapMotionDriver";

// const DEFAULT_CONTEXT = "default";
// const SELECTED_CONTEXT = "selected";

// const INSERT_COMMAND = "insert";
// const ADD_COMMAND = "add";
// const INSIDE_COMMAND = "inside";
// const REPLACE_COMMAND = "replace";
// const CHANGE_COMMAND = "change";
// const DELETE_COMMAND = "delete";
// const REMOVE_COMMAND = "remove";
// const REPEAT_COMMAND = "repeat";
// const STOP_COMMAND = "stop";
// const START_COMMAND = "start";
// const UNDO_COMMAND = "undo";
// const RESTART_COMMAND = "restart";
// const INCREASE_COMMAND = "increase";
// const DECREASE_COMMAND = "decrease";

// export function registerDefaultVoiceContext() {
//     registerSpeechRecognitionEvent(INSERT_COMMAND, DEFAULT_CONTEXT, insertAction);
//     registerSpeechRecognitionEvent(ADD_COMMAND, DEFAULT_CONTEXT, insertAction);
//     registerSpeechRecognitionEvent(INSIDE_COMMAND, DEFAULT_CONTEXT, insertAction);
//     registerSpeechRecognitionEvent(REPLACE_COMMAND, DEFAULT_CONTEXT, replaceAction);
//     registerSpeechRecognitionEvent(CHANGE_COMMAND, DEFAULT_CONTEXT, replaceAction);
//     registerSpeechRecognitionEvent(DELETE_COMMAND, DEFAULT_CONTEXT, deleteAction);
//     registerSpeechRecognitionEvent(REMOVE_COMMAND, DEFAULT_CONTEXT, deleteAction);
//     registerSpeechRecognitionEvent(REPEAT_COMMAND, DEFAULT_CONTEXT, repeatAction);
//     registerSpeechRecognitionEvent(START_COMMAND, DEFAULT_CONTEXT, repeatAction);
//     registerSpeechRecognitionEvent(STOP_COMMAND, DEFAULT_CONTEXT, stopAction);
//     registerSpeechRecognitionEvent(UNDO_COMMAND, DEFAULT_CONTEXT, undoAction);
//     registerSpeechRecognitionEvent(RESTART_COMMAND, DEFAULT_CONTEXT, restartReadingAction);
//     registerSpeechRecognitionEvent(INCREASE_COMMAND, DEFAULT_CONTEXT, increaseAction);
//     registerSpeechRecognitionEvent(DECREASE_COMMAND, DEFAULT_CONTEXT, decreaseAction);

//     registerUnrecognizedPhraseEvent(DEFAULT_CONTEXT, selectPhraseAction);
// }

// function selectPhraseAction(phrase) {
//     if (phrase) {
//         phrase = phrase.toLowerCase();
//     }
//     try {
//         selectPhrase(getIndexOfLastWordSpoken(), phrase);
//         tts.speakQuickly("Phrase selected");
//         changeContextOfAllLeapMotionGestures(SELECTED_CONTEXT);
//     } catch(e) {
//         tts.speakQuickly("Phrase not found. What I heard was " + phrase);
//         console.log("Phrase not found. What I heard was " + phrase);
//         readFromBeginningOfSentence();
//     }
// }

// function restartReadingAction() {
//     restartIndexOfLastWordSpoken();
//     tts.speakNormally(getRemainingText(0));
// }

// function deleteAction(phrase) {
//     console.log('deleteAction')
//     console.log(phrase)
//     console.log(getIndexOfLastWordSpoken())
//     try {
//         selectPhrase(getIndexOfLastWordSpoken(), phrase);
//         tts.speakQuickly("Phrase removed");
//         const index = deleteSelectedText();
//         readFromBeginningOfSentence(index);
//     } catch(e) {
//         tts.speakQuickly("Phrase not found. What I heard was " + phrase);
//         console.log("Phrase not found. What I heard was " + phrase);
//         readFromBeginningOfSentence();
//     }
// }

// function replaceAction(phrase) {
//     let separationWord;
//     try {
//         separationWord = getReplaceSeparationWord(phrase);
//     } catch(e) {
//         tts.speakQuickly("No separation word");
//         console.log("No separation word");
//         readFromBeginningOfSentence();
//         return;
//     }
//     const separationWordIndex = phrase.indexOf(separationWord);
//     const insertionPhrase = phrase.substring(separationWordIndex + separationWord.length + 1);
//     const locationPhrase = phrase.substring(0, separationWordIndex);
//     if (!insertionPhrase) {
//         tts.speakQuickly("No insertion phrase found");
//         console.log("No insertion phrase found");
//         readFromBeginningOfSentence();
//         return;
//     }
//     if (!locationPhrase) {
//         tts.speakQuickly("No location phrase found");
//         console.log("No location phrase found");
//         readFromBeginningOfSentence();
//         return;
//     }
//     try {
//         selectPhrase(getIndexOfLastWordSpoken(), locationPhrase);
//         tts.speakQuickly("Phrase replaced");
//         const index = replaceSelectedText(insertionPhrase);
//         readFromBeginningOfSentence(index);
//     } catch(e) {
//         tts.speakQuickly("Phrase not found. What I heard was " + locationPhrase);
//         console.log("Phrase not found. What I heard was " + locationPhrase);
//         readFromBeginningOfSentence();
//     }
// }

// function getReplaceSeparationWord(phrase) {
//     if (phrase.includes("with")) {
//         return "with";
//     } else if (phrase.includes("by")) {
//         return "by";
//     }  else if (phrase.includes("to")) {
//         return "to";
//     } else {
//         throw new Error("No separation phrase");
//     }
// }

// function insertAction(phrase) {
//     let separationWord;
//     try {
//         separationWord = getInsertSeparationWord(phrase);
//     } catch(e) {
//         tts.speakQuickly("No separation word");
//         console.log("No separation word");
//         readFromBeginningOfSentence();
//         return;
//     }
//     const separationWordIndex = phrase.indexOf(separationWord);
//     const locationPhrase = phrase.substring(separationWordIndex + separationWord.length + 1);
//     const insertionPhrase = phrase.substring(0, separationWordIndex);
//     try {
//         let index;
//         selectPhrase(getIndexOfLastWordSpoken(), locationPhrase);
//         if (separationWord === "before") {
//             index = insertBeforeSelectedText(insertionPhrase);
//         } else {
//             index = insertAfterSelectedText(insertionPhrase);
//         }
//         tts.speakQuickly("Phrase inserted");
//         readFromBeginningOfSentence(index);
//     } catch(e) {
//         tts.speakQuickly("Phrase not found. What I heard was " + locationPhrase);
//         console.log("Phrase not found. What I heard was " + locationPhrase);
//         readFromBeginningOfSentence();
//     }
// }

// function getInsertSeparationWord(phrase) {
//     if (phrase.includes("after")) {
//         return "after";
//     } else if (phrase.includes("before")) {
//         return "before";
//     } else {
//         throw new Error("No separation phrase");
//     }
// }

// function repeatAction(phrase) {
//     if (phrase === 'previous') {
//         readFromBeginningOfPreviousSentence();
//         return;
//     }
//     readFromBeginningOfSentence();
// }

// function readFromBeginningOfPreviousSentence() {
//     const startIndexOfCurrentSentence = getStartIndexOfSentence(getIndexOfLastWordSpoken());
//     const startIndexOfPreviousSentence = getStartIndexOfSentence(startIndexOfCurrentSentence - 2);
//     readFromIndex(startIndexOfPreviousSentence);
// }

// function readFromBeginningOfSentence() {
//     const startIndexOfCurrentSentence = getStartIndexOfSentence(getIndexOfLastWordSpoken());
//     readFromIndex(startIndexOfCurrentSentence);
// }

// function readFromIndex(index) {
//     setIndexOfLastWordSpoken(index);
//     tts.speakNormally(getRemainingText(index));
// }

// function stopAction() {
//     if (tts.isSpeaking()) {
//         tts.stopSpeaking();
//         tts.speakQuickly("Reading stopped");
//     }
// }

// function undoAction() {
//     undo();
//     tts.speakQuickly("Action undone");
//     readFromBeginningOfSentence();
// }

// function increaseAction() {
//     try {
//         const currentSelection = increaseSelection();
//         tts.speakQuickly(currentSelection + " selected");
//     } catch(e) {
//         if (e.message === "Maximum text selected") {
//             tts.speakQuickly("Whole text already selected");
//         } else {
//             tts.speakQuickly("Nothing selected");
//         }
//     }
// }

// function decreaseAction() {
//     try {
//         const currentSelection = decreaseSelection();
//         tts.speakQuickly(currentSelection + " selected");
//     } catch(e) {
//         tts.speakQuickly("Nothing selected");
//     }
// }