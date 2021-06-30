import * as tts from '../modules/tts';
import * as spRec from '../modules/speechRecognition';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import * as txtEditor from '../modules/textEditor';
import {getStartIndexOfSentence} from '../utils/textParser';

const SELECTED_CONTEXT = "SELECTED";
const DEFAULT_CONTEXT = "DEFAULT";
const REPLACE_CONTEXT = "REPLACE";
const INSERT_BEFORE_CONTEXT = "INSERT_BEFORE";
const INSERT_AFTER_CONTEXT = "INSERT_AFTER";
const VOICE_MODALITY = "VOICE";

export function registerSelectedContext() {
    eventReg.registerEvent(SELECTED_CONTEXT, VOICE_MODALITY, 'delete', deleteAction);
    eventReg.registerEvent(SELECTED_CONTEXT, VOICE_MODALITY, 'replace with (.*)', replaceAction);
    eventReg.registerEvent(SELECTED_CONTEXT, VOICE_MODALITY, 'replace', replaceModeAction);
    eventReg.registerEvent(SELECTED_CONTEXT, VOICE_MODALITY, 'insert before', insertBeforeModeAction);
    eventReg.registerEvent(SELECTED_CONTEXT, VOICE_MODALITY, 'insert after', insertAfterModeAction);
}

async function deleteAction(phrase) {
    console.log('deleted')
    try {
        const newIndex = txtEditor.deleteSelected();
        await tts.giveFeedback("Phrase deleted");

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), newIndex);
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));

        spRec.updateEventRegistry(eventReg.getActionHandlerPairs(DEFAULT_CONTEXT, VOICE_MODALITY));
    } catch(e) {
        console.log('Delete error: ' + e)
        console.log("Delete error phrase: " + phrase);
    }
}

async function replaceAction(phrase) {
    console.log('replace')
    try {
        const newIndex = txtEditor.replaceSelected(phrase[0]);
        await tts.giveFeedback("Phrase replaced with " + phrase[0]);

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), newIndex);
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));

        spRec.updateEventRegistry(eventReg.getActionHandlerPairs(DEFAULT_CONTEXT, VOICE_MODALITY));
    } catch(e) {
        console.log('Replace error: ' + e)
        console.log("Replace error phrase: " + phrase);
    }
}

async function replaceModeAction(phrase) {
    console.log('replace mode')
    try {
        await tts.giveFeedback("What to replace with");
        spRec.updateEventRegistry(eventReg.getActionHandlerPairs(REPLACE_CONTEXT, VOICE_MODALITY));
    } catch(e) {
        console.log('Replace mode error: ' + e)
        console.log("Replace mode error phrase: " + phrase);
    }
}

async function insertBeforeModeAction(phrase) {
    console.log('insert before mode')
    try {
        await tts.giveFeedback("What to insert before");
        spRec.updateEventRegistry(eventReg.getActionHandlerPairs(INSERT_BEFORE_CONTEXT, VOICE_MODALITY));
    } catch(e) {
        console.log('Replace mode error: ' + e)
        console.log("Replace mode error phrase: " + phrase);
    }
}

async function insertAfterModeAction(phrase) {
    console.log('insert after mode')
    try {
        await tts.giveFeedback("What to insert after");
        spRec.updateEventRegistry(eventReg.getActionHandlerPairs(INSERT_AFTER_CONTEXT, VOICE_MODALITY));
    } catch(e) {
        console.log('Replace mode error: ' + e)
        console.log("Replace mode error phrase: " + phrase);
    }
}