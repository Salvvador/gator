import * as tts from './tts';
import * as evReg from './eventRegister';
import * as logger from './logger';
import {MODALITY} from '../utils/enums';
const recognition = new window.webkitSpeechRecognition();

const CONTINUOUS_RECOGNITION = true;
const LANGUAGE = 'en-US';
const INTERIM_RESULTS = true;
// const NOT_LISTENING_AFTER_COMMAND_TIME = 500;
const MAX_ALTERNATIVES = 1;
let notInRegistryCallback = () => { console.log('Empty notInRegistryCallback') };
let shouldBeRecognizing = false;
let isRecognizing = false;

export function setup(newNotInRegistryCallback) {
    recognition.continuous = CONTINUOUS_RECOGNITION;
    recognition.lang = LANGUAGE;
    recognition.interimResults = INTERIM_RESULTS;
    recognition.maxAlternatives = MAX_ALTERNATIVES;

    recognition.onend = endRecognitionCallback;
    recognition.onresult = resultCallback();
    notInRegistryCallback = newNotInRegistryCallback;
}

export function start() {
    shouldBeRecognizing = true;

    if (!isRecognizing) {
        isRecognizing = true;
        document.getElementById('gesture-rec-is-on').innerHTML = `Is recognizing voice: <span class='true'>true</span>`;
        recognition.start();
    }
}

export function stop() {
    shouldBeRecognizing = false;
    isRecognizing = false;
    document.getElementById('gesture-rec-is-on').innerHTML = `Is recognizing voice: <span class='false'>false</span>`; 
    recognition.stop();
}

function resultCallback() {
    return async (event) => {
        const indexOfLastSentence = event.results.length - 1;
        const result = event.results[indexOfLastSentence];
        tts.pause();
        if (!result.isFinal) {
            document.getElementById('detected-voice-cmd').innerHTML = `Reconized voice command: ${result[0].transcript} (${new Date().toLocaleTimeString()})`;
            // tts.pause();
            return;
        } else {
            const sentence = result[0].transcript.split('.').join('').split('?').join('');
            document.getElementById('detected-voice-cmd').innerHTML = `Reconized voice command: ${sentence} (${new Date().toLocaleTimeString()})`;
            await triggerEventCallback(sentence);
            // setTimeout(() => {recognition.start()}, NOT_LISTENING_AFTER_COMMAND_TIME);
        }
    }
}

async function triggerEventCallback(phrase) {
    logger.log('Event: speech - ' + phrase);
    for (const event of evReg.getActionHandlerPairs(MODALITY.VOICE)) {
        const regex = phrase.match(new RegExp(event.action, 'i'));
        if (regex && regex.length > 0) {
            regex.shift();
            await event.callback(regex);
            return;
        }
    }
    notInRegistryCallback(phrase);
}

function endRecognitionCallback() {
    if (shouldBeRecognizing) {
        recognition.start();
    }
}