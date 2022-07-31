import * as tts from '../modules/tts';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import * as txtEditor from '../modules/textEditor';
import * as logger from '../modules/logger';
import {findNearestMatchingPhrase, getStartIndexOfSentence} from '../utils/textParser';
import {MODALITY, CONTEXT, GESTURE} from '../utils/enums';

export function register() {
    eventReg.registerEvent(CONTEXT.DEFAULT, MODALITY.VOICE, 'select (.*)', selectAction);
    eventReg.registerEvent(CONTEXT.DEFAULT, MODALITY.VOICE, 'restart', restartAction);
    eventReg.registerEvent(CONTEXT.DEFAULT, MODALITY.VOICE, 'stop', stopAction);
    eventReg.registerEvent(CONTEXT.DEFAULT, MODALITY.VOICE, 'repeat', rewindAction);
    eventReg.registerEvent(CONTEXT.DEFAULT, MODALITY.VOICE, 'start', rewindAction);
    eventReg.registerEvent(CONTEXT.DEFAULT, MODALITY.VOICE, 'undo', undoAction);
    eventReg.registerEvent(CONTEXT.DEFAULT, MODALITY.VOICE, 'ando', undoAction);
    eventReg.registerEvent(CONTEXT.DEFAULT, MODALITY.GESTURE, GESTURE.WAVE_IN, rewindAction);
    eventReg.registerEvent(CONTEXT.DEFAULT, MODALITY.GESTURE, GESTURE.STOP, stopAction);
    eventReg.registerEvent(CONTEXT.DEFAULT, MODALITY.GESTURE, GESTURE.SWIPE_LEFT, undoAction);
}

async function selectAction(phrase) {
    logger.log('Action triggered: select');
    logger.log('Select action phrase: ' + phrase);
    tts.pause();
    const text = txtEditor.getText();
    const i = findNearestMatchingPhrase(text, phrase[0], tracker.getIndex());
    if (i !== -1) {
        txtEditor.select(i, phrase[0].length);
        tts.giveFeedback('Phrase selected');
        eventReg.setContext(CONTEXT.SELECTED);
    } else {
        await tts.giveFeedback('Phrase not found. What I heard was: select ' + phrase);
        logger.log('Phrase not found. What I heard was: select ' + phrase);
        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), tracker.getIndex());
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));
    }
}

async function stopAction() {
    logger.log('Action triggered: stop');
    tts.cancel();
}

async function rewindAction() {
    logger.log('Action triggered: rewind');
    const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), tracker.getIndex());
    tracker.setIndex(startIndexOfCurrentSentence);
    tts.readText(txtEditor.getText(startIndexOfCurrentSentence));
}

async function restartAction() {
    logger.log('Action triggered: restart');
    tracker.setIndex(0);
    tts.readText(txtEditor.getText());
}

async function undoAction() {
    logger.log('Action triggered: undo');
    tts.pause();
    try {
        txtEditor.undo();
        await tts.giveFeedback('Undoing');

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), tracker.getIndex());
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));
    } catch(e) {
        console.error('Undo error: ' + e);
    }
}