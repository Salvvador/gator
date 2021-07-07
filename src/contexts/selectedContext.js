import * as tts from '../modules/tts';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import * as txtEditor from '../modules/textEditor';
import {getStartIndexOfSentence} from '../utils/textParser';
import {MODALITY, CONTEXT, GESTURE} from '../utils/enums';

export function register() {
    eventReg.registerEvent(CONTEXT.SELECTED, MODALITY.VOICE, 'stop', stopSelection);
    eventReg.registerEvent(CONTEXT.SELECTED, MODALITY.VOICE, 'delete', deleteAction);
    eventReg.registerEvent(CONTEXT.SELECTED, MODALITY.VOICE, 'replace with (.*)', replaceAction);
    eventReg.registerEvent(CONTEXT.SELECTED, MODALITY.VOICE, 'replace', changeToReplaceMode);
    eventReg.registerEvent(CONTEXT.SELECTED, MODALITY.VOICE, 'insert before', changeToInsertBeforeMode);
    eventReg.registerEvent(CONTEXT.SELECTED, MODALITY.VOICE, 'before', changeToInsertBeforeMode);
    eventReg.registerEvent(CONTEXT.SELECTED, MODALITY.VOICE, 'insert after', changeToInsertAfterMode);
    eventReg.registerEvent(CONTEXT.SELECTED, MODALITY.VOICE, 'after', changeToInsertAfterMode);
    eventReg.registerEvent(CONTEXT.SELECTED, MODALITY.GESTURE, GESTURE.FIST_AND_THROW_AWAY, deleteAction);
    eventReg.registerEvent(CONTEXT.SELECTED, MODALITY.GESTURE, GESTURE.HANDS_UPWARD, changeToReplaceMode);
    eventReg.registerEvent(CONTEXT.SELECTED, MODALITY.GESTURE, GESTURE.INDEX_FINGER_LEFT, changeToInsertBeforeMode);
    eventReg.registerEvent(CONTEXT.SELECTED, MODALITY.GESTURE, GESTURE.INDEX_FINGER_RIGHT, changeToInsertAfterMode);
}

async function stopSelection(phrase) {
    console.log('insert after')
    try {
        txtEditor.restart();
        await tts.giveFeedback('Unselecting');

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), tracker.getIndex());
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));

        eventReg.setContext(CONTEXT.DEFAULT);
    } catch(e) {
        console.log('Stop selection: ' + e)
        console.log('Stop selection: ' + phrase);
    }
}

async function deleteAction() {
    console.log('deleted')
    try {
        const newIndex = txtEditor.deleteSelected();
        await tts.giveFeedback('Phrase deleted');

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), newIndex);
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));

        eventReg.setContext(CONTEXT.DEFAULT);
    } catch(e) {
        console.log('Delete error: ' + e)
    }
}

async function replaceAction(phrase) {
    console.log('replace')
    try {
        const newIndex = txtEditor.replaceSelected(phrase[0]);
        await tts.giveFeedback('Phrase replaced with ' + phrase[0]);

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), newIndex);
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));

        eventReg.setContext(CONTEXT.DEFAULT);
    } catch(e) {
        console.log('Replace error: ' + e)
        console.log('Replace error phrase: ' + phrase);
    }
}

async function changeToReplaceMode() {
    console.log('replace mode')
    try {
        await tts.giveFeedback('What to replace with');
        eventReg.setContext(CONTEXT.REPLACE);
    } catch(e) {
        console.log('Replace mode error: ' + e)
    }
}

async function changeToInsertBeforeMode() {
    console.log('insert before mode')
    try {
        await tts.giveFeedback('What to insert before');
        eventReg.setContext(CONTEXT.INSERT_BEFORE);
    } catch(e) {
        console.log('Replace mode error: ' + e)
    }
}

async function changeToInsertAfterMode() {
    console.log('insert after mode')
    try {
        await tts.giveFeedback('What to insert after');
        eventReg.setContext(CONTEXT.INSERT_AFTER);
    } catch(e) {
        console.log('Replace mode error: ' + e)
    }
}