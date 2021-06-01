const synth = window.speechSynthesis;

const RATE = 1.0;
const TIMEOUT_TO_CLEAR_UTTERANCE = 350;
const LANGUAGE = 'en-UK';

let onEndOfMessage = undefined;
let onWordSpoken = undefined;

export function isSpeaking() {
    return synth.speaking;
}

export function setupTtsEngine(onWordSpokenHandler, onEndOfMessageHandler) {
    // if (!doesBrowserSupport()) {
    //     throw new Error("This web app cannot run on your browser (Speech Synthesis Problem)");
    // }
    onEndOfMessage = onEndOfMessageHandler;
    onWordSpoken = onWordSpokenHandler;
}

// function doesBrowserSupport() {
//     if (synth === undefined) {
//         return false;
//     }
//     synth.getVoices().forEach(voice => {
//         if (voice.localService) {
//             return true;
//         }
//     });
//     return false;
// }

function interruptPreviousUtterance() {
    synth.cancel();
}

export function startSpeaking(message, immediately = false, rate = RATE) {
    if (immediately) {
        interruptPreviousUtterance();
    }
    const utterance = createUtterance(message, rate);
    setTimeout(() => synth.speak(utterance), TIMEOUT_TO_CLEAR_UTTERANCE);
}

export function pauseSpeaking() {
    synth.pause();
}

export function resumeSpeaking() {
    synth.resume();
}

export function stopSpeaking() {
    synth.cancel();
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
