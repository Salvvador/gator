import {registerEvent, setupLeapMotionEngine} from "../engines/leapMotionEngine";
import {logMessage} from "../utils/logger";

const DRIVER_NAME = "LeapMotionDriver";
const DEFAULT_CONTEXT = "default";

const HANDS_FOLDING = "handsFolding";
const HANDS_UNFOLDING = "handsUnfolding";
const WAVE_IN = "waveIn";
const WAVE_OUT = "waveOut";
const FIST_AND_THROW_AWAY = "fistAndThrowAway";
const HANDS_UPWARD = "handUpward";
const INDEX_FINGER_LEFT = "indexFingerLeft";
const INDEX_FINGER_RIGHT= "indexFingerRight";
const STOP = "stop";

const eventsRegistry = {
    handsFolding: [],
    handsUnfolding: [],
    waveIn: [],
    waveOut: [],
    fistAndThrowAway: [],
    handUpward: [],
    indexFingerLeft: [],
    indexFingerRight: [],
    stop: []
};

const currentContextRegistry = {
    handsFolding: DEFAULT_CONTEXT,
    handsUnfolding: DEFAULT_CONTEXT,
    waveIn: DEFAULT_CONTEXT,
    waveOut: DEFAULT_CONTEXT,
    fistAndThrowAway: DEFAULT_CONTEXT,
    handUpward: DEFAULT_CONTEXT,
    indexFingerLeft: DEFAULT_CONTEXT,
    indexFingerRight: DEFAULT_CONTEXT,
    stop: DEFAULT_CONTEXT
};


export function setupLeapMotionDriver() {
    setupLeapMotionEngine();
    registerGestureEvents();
}

export function registerHandsFoldingEvent(contextName, handler) {
    eventsRegistry.handsFolding.push({contextName, handler});
}

export function registerHandsUnfoldingEvent(contextName, handler) {
    eventsRegistry.handsUnfolding.push({contextName, handler});
}

export function registerWaveInEvent(contextName, handler) {
    eventsRegistry.waveIn.push({contextName, handler});
}

export function registerWaveOutEvent(contextName, handler) {
    eventsRegistry.waveOut.push({contextName, handler});
}

export function registerFistAndThrowAwayEvent(contextName, handler) {
    eventsRegistry.fistAndThrowAway.push({contextName, handler});
}

export function registerHandUpwardEvent(contextName, handler) {
    eventsRegistry.handUpward.push({contextName, handler});
}

export function registerIndexFingerLeftEvent(contextName, handler) {
    eventsRegistry.indexFingerLeft.push({contextName, handler});
}

export function registerIndexFingerRightEvent(contextName, handler) {
    eventsRegistry.indexFingerRight.push({contextName, handler});
}

export function registerStopEvent(contextName, handler) {
    eventsRegistry.stop.push({contextName, handler});
}

export function changeContextOfAllLeapMotionGestures(newContext) {
    logMessage(`${DRIVER_NAME}: switching to ${newContext} context`);
    changeHandsFoldingContext(newContext);
    changeHandsUnfoldingContext(newContext);
    changeWaveInContext(newContext);
    changeWaveOutContext(newContext);
    changeFistAndThrowAwayContext(newContext);
    changeHandUpwardContext(newContext);
    changeIndexFingerLeftContext(newContext);
    changeIndexFingerRightContext(newContext);
    changeStopContext(newContext);
}

export function changeHandsFoldingContext(newContext) {
    currentContextRegistry.handsFolding = newContext;
}

export function changeHandsUnfoldingContext(newContext) {
    currentContextRegistry.handsUnfolding = newContext;
}

export function changeWaveInContext(newContext) {
    currentContextRegistry.waveIn = newContext;
}

export function changeWaveOutContext(newContext) {
    currentContextRegistry.waveOut = newContext;
}

export function changeFistAndThrowAwayContext(newContext) {
    currentContextRegistry.fistAndThrowAway = newContext;
}

export function changeHandUpwardContext(newContext) {
    currentContextRegistry.handUpward = newContext;
}

export function changeIndexFingerLeftContext(newContext) {
    currentContextRegistry.indexFingerLeft = newContext;
}

export function changeIndexFingerRightContext(newContext) {
    currentContextRegistry.indexFingerRight = newContext;
}

export function changeStopContext(newContext) {
    currentContextRegistry.stop = newContext;
}

function registerGestureEvents() {
    registerEvent(HANDS_FOLDING, createControllerDriverCallback(HANDS_FOLDING));
    registerEvent(HANDS_UNFOLDING, createControllerDriverCallback(HANDS_UNFOLDING));
    registerEvent(WAVE_IN, createControllerDriverCallback(WAVE_IN));
    registerEvent(WAVE_OUT, createControllerDriverCallback(WAVE_OUT));
    registerEvent(FIST_AND_THROW_AWAY, createControllerDriverCallback(FIST_AND_THROW_AWAY));
    registerEvent(HANDS_UPWARD, createControllerDriverCallback(HANDS_UPWARD));
    registerEvent(INDEX_FINGER_LEFT, createControllerDriverCallback(INDEX_FINGER_LEFT));
    registerEvent(INDEX_FINGER_RIGHT, createControllerDriverCallback(INDEX_FINGER_RIGHT));
    registerEvent(STOP, createControllerDriverCallback(STOP));
}

function createControllerDriverCallback(eventName) {
    return () => {
        // log(eventName);
        eventsRegistry[eventName] && executeCallbackForCurrentContext(eventName);
    };
}

function executeCallbackForCurrentContext(eventName) {
    if (currentContextRegistry[eventName]) {
        const currentContext = currentContextRegistry[eventName];
        const callbackForEventInCurrentContext = getCallbackForEventInCurrentContext(eventName, currentContext);
        if (callbackForEventInCurrentContext) {
            callbackForEventInCurrentContext();
            logMessage(`${DRIVER_NAME}: event - ${eventName}`);
        } else {
            // logMessage(`${DRIVER_NAME}: switching to ${newContext} context`);
            // logUnrecognizedEvent(DRIVER_NAME, eventName, currentContext);
        }
    }
}

function getCallbackForEventInCurrentContext(eventName, currentContext) {
    const currentEventHandlersRegistry = eventsRegistry[eventName];
    const eventInCurrentContext = currentEventHandlersRegistry.find(pose => pose.contextName === currentContext);
    if (eventInCurrentContext) {
        return eventInCurrentContext.handler;
    }
}
