import * as tts from '../modules/tts';
import * as spRec from '../modules/speechRecognition';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import * as txtEditor from '../modules/textEditor';
import {getStartIndexOfSentence} from '../utils/textParser';

const REPLACE_CONTEXT = "REPLACE";
const DEFAULT_CONTEXT = "DEFAULT";
const VOICE_MODALITY = "VOICE";


export function registerReplaceContext() {
    eventReg.registerEvent(REPLACE_CONTEXT, VOICE_MODALITY, '(.*)', replaceAction);
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