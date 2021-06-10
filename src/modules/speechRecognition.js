import * as tts from './tts';
const recognition = new window.webkitSpeechRecognition();

const CONTINUOUS_RECOGNITION = true;
const LANGUAGE = 'en-US';
const INTERIM_RESULTS = true;
const NOT_LISTENING_AFTER_COMMAND_TIME = 500;
const MAX_ALTERNATIVES = 1;
let eventsRegistry = [];
let notInRegistryCallback = () => { console.log('Empty notInRegistryCallback') };
let shouldBeRecognizing = false;

export function setup(newEventsRegistry, newNotInRegistryCallback) {
    recognition.continuous = CONTINUOUS_RECOGNITION;
    recognition.lang = LANGUAGE;
    recognition.interimResults = INTERIM_RESULTS;
    recognition.maxAlternatives = MAX_ALTERNATIVES;

    recognition.onend = endRecognitionCallback;
    recognition.onresult = resultCallback();
    updateEventRegistry(newEventsRegistry, newNotInRegistryCallback);
}

export function start() {
    shouldBeRecognizing = true;
    recognition.start();
}

export function stop() {
    shouldBeRecognizing = false;
    recognition.stop();
}

export function updateEventRegistry(newEventsRegistry, newNotInRegistryCallback) {
    notInRegistryCallback = newNotInRegistryCallback;
    eventsRegistry = newEventsRegistry;
}

function resultCallback() {
    return (event) => {
        const indexOfLastSentence = event.results.length - 1;
        const result = event.results[indexOfLastSentence]
        if (!result.isFinal) {
            tts.stopSpeaking();
            return;
        } else {
            const sentence = result[0].transcript.split('.').join("");
            triggerEventCallback(sentence);
            // setTimeout(() => {recognition.start()}, NOT_LISTENING_AFTER_COMMAND_TIME);
        }
    }
}

function triggerEventCallback(phrase) {
    for (const event of eventsRegistry) {
        const regex = phrase.match(new RegExp(event.action, 'i'));
        if (regex && regex.length > 0) {
            regex.shift();
            event.callback(regex);
            return;
        }
    }
    notInRegistryCallback();
}

function endRecognitionCallback() {
    if (shouldBeRecognizing) {
        recognition.start();
    }
}