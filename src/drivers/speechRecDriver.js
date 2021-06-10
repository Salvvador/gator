import {setupSpeechRecognitionEngine, startSpeechRecognition, stopSpeechRecognition} from '../engines/speechRecEngine';
import * as tts from '../modules/tts';
import {logMessage} from "../utils/logger";
// import {logRecognizedEvent, logUnrecognizedEvent, plainLogMessage} from "../utils/logger";
const {FuzzyMatch} = require("../utils/FuzzyMatch");

const DEFAULT_CONTEXT = "default";
const UNRECOGNIZED = "UNRECOGNIZED";
const COMMAND_FUZZY_SET_MIN_VALUE = 0.6;
const DRIVER_NAME = "SpeechRecDriver";

const eventsRegistry = [];
const currentContextRegistry = [];

let shouldBeRecognizing = false;
let commandFuzzyMatchSet;

export function setupSpeechDriver() {
    setupSpeechRecognitionEngine(resultCallback, endRecognitionCallback);
    commandFuzzyMatchSet = new FuzzyMatch(COMMAND_FUZZY_SET_MIN_VALUE);
}

export function registerSpeechRecognitionEvent(phrase, contextName, handler) {
    const phraseToWhichNewContextIsAdded = eventsRegistry.find(current => current.phrase === phrase);
    if (phraseToWhichNewContextIsAdded) {
        extendExistingPhraseInReg(phraseToWhichNewContextIsAdded, contextName, handler)
    } else {
        addNewPhraseInReg(phrase, contextName, handler);
        extendCurrentContextReg(phrase);
        commandFuzzyMatchSet.registerCommandInFuzzySet(phrase);
    }
}

export function registerUnrecognizedPhraseEvent(contextName, handler) {
    registerSpeechRecognitionEvent(UNRECOGNIZED, contextName, handler);
}

export function changeContextOfAllPhrases(nameOfNewContext) {
    logMessage(`${DRIVER_NAME}: switching to ${nameOfNewContext} context`);
    currentContextRegistry.forEach((phraseContext) => {
        phraseContext.currentContext = nameOfNewContext;
    });
}

export function changePhraseContext(phrase, nameOfNewContext) {
    const phraseContextToBeUpdated = currentContextRegistry.find(current => current.phrase === phrase);
    if (phraseContextToBeUpdated) {
        phraseContextToBeUpdated.currentContext = nameOfNewContext;
    }
}

export function startRecording() {
    startSpeechRecognition();
    shouldBeRecognizing = true;
}

export function stopRecording() {
    stopSpeechRecognition();
    shouldBeRecognizing = false;
}

function extendExistingPhraseInReg(phraseToWhichNewContextIsAdded, contextName, handler) {
    phraseToWhichNewContextIsAdded.contexts.push({
        contextName,
        handler
    });
}

function addNewPhraseInReg(phrase, contextName, handler) {
    eventsRegistry.push({
        phrase,
        contexts: [
            {
                contextName,
                handler
            }
        ]
    });
}

function extendCurrentContextReg(phrase) {
    currentContextRegistry.push({
        phrase,
        currentContext: DEFAULT_CONTEXT
    });
}

function resultCallback(understoodPhrases) {
    if (!understoodPhrases.isFinal) {
        tts.stopSpeaking();
        return;
    }
    const currentSentence = understoodPhrases[0].transcript.trim().toLowerCase();
    logMessage(`${DRIVER_NAME}: understood ${currentSentence}`);

    const mainCommand = getMainCommandFromSentence(currentSentence);
    const additionalRemarks = getAdditionalRemarkFromSentence(currentSentence).trim();
    const phraseFromReg = getPhraseFromReg(mainCommand);
    if (phraseFromReg) {
        console.log('executePhraseCallbackForCurrentContext')
        executePhraseCallbackForCurrentContext(phraseFromReg, additionalRemarks);
    } else {
        console.log('executeUnrecognizedForCurrentContext')
        executeUnrecognizedForCurrentContext(currentSentence);
    }
}

function executeUnrecognizedForCurrentContext(currentSentence) {
    const phraseContexts = getPhraseFromReg(UNRECOGNIZED).contexts;
    const currentContextName = getCurrentContextName(UNRECOGNIZED);
    const handler = getPhraseCallbackForCurrentContext(phraseContexts, currentContextName);
    if (handler) {
        // logMessage(`${DRIVER_NAME}: switching to ${nameOfNewContext} context`);
        // logRecognizedEvent(DRIVER_NAME, currentSentence, currentContextName);
        handler(currentSentence);
    } else {
        // logUnrecognizedEvent(DRIVER_NAME, currentSentence, currentContextName);
    }
}

function endRecognitionCallback() {
    if (shouldBeRecognizing) {
        startSpeechRecognition();
    }
}

function getMainCommandFromSentence(currentSentence) {
    const firstWord = currentSentence.split(" ")[0].toLowerCase();
    return commandFuzzyMatchSet.findInFuzzySet(firstWord);
}

function getAdditionalRemarkFromSentence(currentSentence) {
    const currentSentenceWordList = currentSentence.split('.').join("").split(" ");
    currentSentenceWordList.shift();
    return currentSentenceWordList.join(" ");
}

function executePhraseCallbackForCurrentContext(phraseFromReg, additionalRemarks) {
    const phraseContexts = phraseFromReg.contexts;
    const currentContextName = getCurrentContextName(phraseFromReg.phrase);
    const handler = getPhraseCallbackForCurrentContext(phraseContexts, currentContextName);
    if (handler) {
        handler(additionalRemarks);
    } else {
    }
}

function getCurrentContextName(phrase) {
    return currentContextRegistry.find(current => current.phrase === phrase).currentContext;
}

function getPhraseFromReg(phrase) {
    return eventsRegistry.find(current => current.phrase === phrase);
}

function getPhraseCallbackForCurrentContext(phraseContexts, currentContextName) {
    const phraseContextForCurrentContextName = phraseContexts.find(current => current.contextName === currentContextName);
    return phraseContextForCurrentContextName.handler;
}
