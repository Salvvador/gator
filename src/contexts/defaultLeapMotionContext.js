import {
    changeContextOfAllLeapMotionGestures,
    registerStopEvent,
    registerWaveInEvent,
    registerWaveOutEvent
} from "../drivers/leapMotionDriver";
import {giveQuickFeedback, isTTSSpeaking, readText, stopReadingText} from "../drivers/ttsDriver";
import {
    getRemainingText,
    getStartIndexOfSentence,
    increaseSelection,
    selectPhrase
} from "../drivers/textEditorDriver";
import {getIndexOfLastWordSpoken, setIndexOfLastWordSpoken} from "../utils/spokenWordsCounter";

const SELECTED_CONTEXT = "selected";
const DEFAULT_CONTEXT = "default";
const PREV_SENTENCE_JUMP_THRESHOLD = 20;

export function registerDefaultLeapMotionContext() {
    registerStopEvent(DEFAULT_CONTEXT, stopReadingAction);
    registerWaveInEvent(DEFAULT_CONTEXT, rewindAction);
    registerWaveOutEvent(DEFAULT_CONTEXT, selectCurrentSentenceAction);
}


function stopReadingAction() {
    if (isTTSSpeaking()) {
        stopReadingText();
        giveQuickFeedback("Reading stopped");
    }
}

function rewindAction() {
    const startIndexOfCurrentSentence = getStartIndexOfSentence(getIndexOfLastWordSpoken());
    if (getIndexOfLastWordSpoken() - startIndexOfCurrentSentence < PREV_SENTENCE_JUMP_THRESHOLD) {
        const startIndexOfPreviousSentence = getStartIndexOfSentence(startIndexOfCurrentSentence - 2);
        readFromIndex(startIndexOfPreviousSentence);
    } else {
        readFromIndex(startIndexOfCurrentSentence);
    }
}

function readFromIndex(index) {
    setIndexOfLastWordSpoken(index);
    readText(getRemainingText(index), true);
}

function selectCurrentSentenceAction() {
    selectPhrase(getIndexOfLastWordSpoken());
    increaseSelection();
    giveQuickFeedback("Sentence selected");
    changeContextOfAllLeapMotionGestures(SELECTED_CONTEXT);
}