import * as tts from '../modules/tts';
import * as spRec from '../modules/speechRecognition';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import * as txtEditor from '../modules/textEditor';
import {getStartIndexOfSentence} from '../utils/textParser';

const INSERT_AFTER_CONTEXT = "INSERT_AFTER";
const DEFAULT_CONTEXT = "DEFAULT";
const VOICE_MODALITY = "VOICE";


export function registerInsertAfterContext() {
    eventReg.registerEvent(INSERT_AFTER_CONTEXT, VOICE_MODALITY, '(.*)', insertAfterAction);
}

async function insertAfterAction(phrase) {
    console.log('insert after')
    try {
        const newIndex = txtEditor.replaceSelected(phrase[0]);
        await tts.giveFeedback("Inserted phrase " + phrase[0]);

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), newIndex);
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));

        spRec.updateEventRegistry(eventReg.getActionHandlerPairs(DEFAULT_CONTEXT, VOICE_MODALITY));
    } catch(e) {
        console.log('Insert after error: ' + e)
        console.log("Insert after error phrase: " + phrase);
    }
}