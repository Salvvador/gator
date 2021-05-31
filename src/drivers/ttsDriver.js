import {
    setupTtsEngine,
    startSpeaking,
    stopSpeaking,
    isSpeaking
} from '../engines/ttsEngine';

const SHORT_FEEDBACK_RATE = 2.0;
const LONG_FEEDBACK_RATE = 1.2;

export function isTTSSpeaking() {
    return isSpeaking();
}

export function setupTtsDriver(onWordSpokenHandler, onEndOfMessage) {
    setupTtsEngine(onWordSpokenHandler, onEndOfMessage);
}

export function giveQuickFeedback(message) {
    startSpeaking(message, true, SHORT_FEEDBACK_RATE);
}

export function giveLongFeedback(message) {
    startSpeaking(message, true, LONG_FEEDBACK_RATE);
}

export function readText(text, immediately) {
    startSpeaking(text, immediately);
}

export function stopReadingText() {
    stopSpeaking();
}

// export function stopReadingTextForCommand() {
//     stopSpeaking();
//     setTimeout(() => readTextFromBeginningOfSentence(), TIMEOUT_FOR_COMMAND_EXEC);
// }
