const synth = window.speechSynthesis;

const TIMEOUT_TO_CLEAR_UTTERANCE = 350;
const LANGUAGE = 'en-UK';
const NORMAL_RATE = 1.0;
const VERY_QUICK_RATE = 2.0;
const QUICK_RATE = 1.2;

let onEndOfMessage = undefined;
let onWordSpoken = undefined;

export function isSpeaking() {
    return synth.speaking;
}

export function setup(onWordSpokenHandler, onEndOfMessageHandler) {
    onEndOfMessage = onEndOfMessageHandler;
    onWordSpoken = onWordSpokenHandler;
}

export function stopSpeaking() {
    synth.cancel();
}

export function speakVeryQuickly(message) {
    speak(message, true, VERY_QUICK_RATE);
}

export function speakQuickly(message) {
    speak(message, true, QUICK_RATE);
}

export function speakNormally(message) {
    speak(message, false, NORMAL_RATE);
}

function speak(message, immediately = false, rate = NORMAL_RATE) {
    if (immediately) {
        stopSpeaking();
    }
    const utterance = createUtterance(message, rate);
    setTimeout(() => synth.speak(utterance), TIMEOUT_TO_CLEAR_UTTERANCE);
}

function createUtterance(message, rate) {
    console.log("I'm speaking")
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = rate;
    utterance.lang = LANGUAGE;
    utterance.onboundary = (event) => {onWordSpoken && onWordSpoken(event.charIndex);};
    utterance.onend = () => onEndOfMessage && onEndOfMessage();
    return utterance;
}
