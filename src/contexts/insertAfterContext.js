import * as tts from '../modules/tts';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import * as txtEditor from '../modules/textEditor';
import {getStartIndexOfSentence} from '../utils/textParser';
import {MODALITY, CONTEXT} from '../utils/enums';

export function register() {
    eventReg.registerEvent(CONTEXT.INSERT_AFTER, MODALITY.VOICE, 'stop', stopSelection);
    eventReg.registerEvent(CONTEXT.INSERT_AFTER, MODALITY.VOICE, '(.*)', insertAfterAction);
}

async function stopSelection(phrase) {
    console.log('insert after');
    try {
        txtEditor.restart();
        await tts.giveFeedback('Unselecting');

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), tracker.getIndex());
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));

        eventReg.setContext(CONTEXT.DEFAULT);
    } catch(e) {
        console.log('Stop selection: ' + e);
        console.log('Stop selection: ' + phrase);
    }
}

async function insertAfterAction(phrase) {
    console.log('insert after');
    try {
        const newIndex = txtEditor.insertAfter(phrase[0]);
        await tts.giveFeedback('Inserted phrase ' + phrase[0]);

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), newIndex);
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));

        eventReg.setContext(CONTEXT.DEFAULT);
    } catch(e) {
        console.log('Insert after error: ' + e);
        console.log('Insert after error phrase: ' + phrase);
    }
}