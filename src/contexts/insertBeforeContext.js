import * as tts from '../modules/tts';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import * as txtEditor from '../modules/textEditor';
import {getStartIndexOfSentence} from '../utils/textParser';
import {MODALITY, CONTEXT} from '../utils/enums';

export function register() {
    eventReg.registerEvent(CONTEXT.INSERT_BEFORE, MODALITY.VOICE, '(.*)', insertBeforeAction);
}

async function insertBeforeAction(phrase) {
    console.log('insert before')
    try {
        const newIndex = txtEditor.replaceSelected(phrase[0]);
        await tts.giveFeedback('Inserted phrase ' + phrase[0]);

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), newIndex);
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));

        eventReg.setContext(CONTEXT.DEFAULT);
    } catch(e) {
        console.log('Insert before error: ' + e)
        console.log('Insert before error phrase: ' + phrase);
    }
}