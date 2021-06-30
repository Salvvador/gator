import * as tts from '../modules/tts';
import * as spRec from '../modules/speechRecognition';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import * as txtEditor from '../modules/textEditor';
import {getStartIndexOfSentence} from '../utils/textParser';

const INSERT_BEFORE_CONTEXT = "INSERT_BEFORE";
const DEFAULT_CONTEXT = "DEFAULT";
const VOICE_MODALITY = "VOICE";


export function registerInsertBeforeContext() {
    eventReg.registerEvent(INSERT_BEFORE_CONTEXT, VOICE_MODALITY, '(.*)', insertBeforeAction);
}

async function insertBeforeAction(phrase) {
    console.log('insert before')
    try {
        const newIndex = txtEditor.replaceSelected(phrase[0]);
        await tts.giveFeedback("Inserted phrase " + phrase[0]);

        const startIndexOfCurrentSentence = getStartIndexOfSentence(txtEditor.getText(), newIndex);
        tracker.setIndex(startIndexOfCurrentSentence);
        tts.readText(txtEditor.getText(startIndexOfCurrentSentence));

        spRec.updateEventRegistry(eventReg.getActionHandlerPairs(DEFAULT_CONTEXT, VOICE_MODALITY));
    } catch(e) {
        console.log('Insert before error: ' + e)
        console.log("Insert before error phrase: " + phrase);
    }
}