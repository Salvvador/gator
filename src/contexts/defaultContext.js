import * as tts from '../modules/tts';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import * as txtEditor from '../modules/textEditor';
import {findNearestMatchingPhrase, getStartIndexOfSentence} from '../utils/textParser';
import {MODALITY, CONTEXT, GESTURE} from '../utils/enums';

export function register() {
    eventReg.registerEvent(CONTEXT.DEFAULT, MODALITY.VOICE, 'select (.*)', selectAction);
    eventReg.registerEvent(CONTEXT.DEFAULT, MODALITY.GESTURE, GESTURE.WAVE_IN, rewindAction);
}

async function selectAction(phrase) {
    tts.pause();
    const text = txtEditor.getText();
    const i = findNearestMatchingPhrase(text, phrase[0], tracker.getIndex());
    if (i !== -1) {
        txtEditor.select(i, phrase[0].length);
        tts.giveFeedback('Phrase selected');
        eventReg.setContext(CONTEXT.SELECTED);
    } else {
        await tts.giveFeedback('Phrase not found. What I heard was: select ' + phrase);
        console.log('Phrase not found. What I heard was: select ' + phrase);
        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), tracker.getIndex());
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));
    }
}

async function rewindAction() {
    const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), tracker.getIndex());
    tracker.setIndex(startIndexOfCurrentSentence);
    tts.readText(txtEditor.getText(startIndexOfCurrentSentence));
}
