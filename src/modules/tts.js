const synth = window.speechSynthesis;

// const TIMEOUT_TO_CLEAR_UTTERANCE = 350;
const LANGUAGE = 'en-US';
const NORMAL_RATE = 1.0;
const FEEDBACK_TIMEOUT = 2000;
// const VERY_QUICK_RATE = 2.0;
// const QUICK_RATE = 1.5;

// let onEndOfMessage = undefined;
let onWordSpoken = undefined;

export function isSpeaking() {
    return synth.speaking;
}

export function isPaused() {
    return synth.paused;
}

export function setup(onWordSpokenHandler, onEndOfMessageHandler) {
    // onEndOfMessage = onEndOfMessageHandler;
    onWordSpoken = onWordSpokenHandler;
}

export function pause() {
    synth.pause();
}

export function cancel() {
    synth.cancel();
}

export function resume() {
    synth.resume();
}

export async function giveFeedback(message) {
    return new Promise(resolve => {
        cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = NORMAL_RATE;
        utterance.lang = LANGUAGE;

        // as of writing this code, utterance.onend is broken. It is triggered right away and doesn't wait for the msg to finish
        // utterance.onend = () => { console.log('FEEDBACK DONE'); resolve(); };
        setTimeout(resolve, FEEDBACK_TIMEOUT)
        synth.speak(utterance);
    });
}

export function readText(text) {
    cancel();
    console.log('STARTED SPEAKING');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = NORMAL_RATE;
    utterance.lang = LANGUAGE;
    utterance.onboundary = (event) => {onWordSpoken && onWordSpoken(event.charIndex);};

    // as of writing this code, utterance.onend is broken. It is triggered right away and doesn't wait for the msg to finish
    // utterance.onend = () => onEndOfMessage && onEndOfMessage();
    synth.speak(utterance);
}

// export function speak(message, immediately = false, rate = NORMAL_RATE) {
//     if (immediately) {
//         cancel();
//     }
//     const utterance = createUtterance(message, rate);
//     setTimeout(() => synth.speak(utterance), TIMEOUT_TO_CLEAR_UTTERANCE);
// }