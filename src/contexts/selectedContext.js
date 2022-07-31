import * as tts from '../modules/tts';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import * as txtEditor from '../modules/textEditor';
import * as logger from '../modules/logger';
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
    logger.log('Action triggered: stop selection');
    try {
        txtEditor.restart();
        await tts.giveFeedback('Unselecting');

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), tracker.getIndex());
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));

        eventReg.setContext(CONTEXT.DEFAULT);
    } catch(e) {
        console.error('Stop selection error: ' + e)
        console.error('Stop selection error phrase: ' + phrase);
    }
}

async function deleteAction() {
    logger.log('Action triggered: delete');
    try {
        const newIndex = txtEditor.deleteSelected();
        await tts.giveFeedback('Phrase deleted');

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), newIndex);
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));

        eventReg.setContext(CONTEXT.DEFAULT);
    } catch(e) {
        console.error('Delete error: ' + e)
    }
}

async function replaceAction(phrase) {
    logger.log('Action triggered: replace');
    logger.log('Replace action action phrase: ' + phrase);
    try {
        const newIndex = txtEditor.replaceSelected(phrase[0]);
        await tts.giveFeedback('Phrase replaced with ' + phrase[0]);

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), newIndex);
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));

        eventReg.setContext(CONTEXT.DEFAULT);
    } catch(e) {
        console.error('Replace error: ' + e)
        console.error('Replace error phrase: ' + phrase);
    }
}

async function changeToReplaceMode() {
    logger.log('Action triggered: change to replace mode');
    try {
        await tts.giveFeedback('What to replace with');
        eventReg.setContext(CONTEXT.REPLACE);
    } catch(e) {
        console.error('Change to replace mode error: ' + e)
    }
}

async function changeToInsertBeforeMode() {
    logger.log('Action triggered: change to insert before mode');
    try {
        await tts.giveFeedback('What to insert before');
        eventReg.setContext(CONTEXT.INSERT_BEFORE);
    } catch(e) {
        console.error('Change to insert before error: ' + e)
    }
}

async function changeToInsertAfterMode() {
    logger.log('Action triggered: change to insert after mode');
    try {
        await tts.giveFeedback('What to insert after');
        eventReg.setContext(CONTEXT.INSERT_AFTER);
    } catch(e) {
        console.error('Change to insert after mode error: ' + e)
    }
}