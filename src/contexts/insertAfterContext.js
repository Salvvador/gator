import * as tts from '../modules/tts';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import * as txtEditor from '../modules/textEditor';
import * as logger from '../modules/logger';
import {getStartIndexOfSentence} from '../utils/textParser';
import {MODALITY, CONTEXT} from '../utils/enums';

export function register() {
    eventReg.registerEvent(CONTEXT.INSERT_AFTER, MODALITY.VOICE, 'stop', stopSelection);
    eventReg.registerEvent(CONTEXT.INSERT_AFTER, MODALITY.VOICE, '(.*)', insertAfterAction);
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

async function insertAfterAction(phrase) {
    logger.log('Action triggered: Insert after');
    logger.log('Insert after action phrase: ' + phrase);
    try {
        const newIndex = txtEditor.insertAfter(phrase[0]);
        await tts.giveFeedback('Inserted phrase ' + phrase[0]);

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), newIndex);
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));

        eventReg.setContext(CONTEXT.DEFAULT);
    } catch(e) {
        console.error('Insert after error: ' + e);
        console.error('Insert after error phrase: ' + phrase);
    }
}