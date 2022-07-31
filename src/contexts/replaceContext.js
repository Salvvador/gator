import * as tts from '../modules/tts';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import * as txtEditor from '../modules/textEditor';
import {getStartIndexOfSentence} from '../utils/textParser';
import {MODALITY, CONTEXT} from '../utils/enums';
import * as logger from '../modules/logger';

export function register() {
    eventReg.registerEvent(CONTEXT.REPLACE, MODALITY.VOICE, 'stop', stopSelection);
    eventReg.registerEvent(CONTEXT.REPLACE, MODALITY.VOICE, '(.*)', replaceAction);
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