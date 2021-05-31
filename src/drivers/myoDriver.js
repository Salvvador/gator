import {connectMyo, registerEvent, setupMyoEngine, vibrate} from "../engines/myoEngine";
import {logRecognizedEvent, logUnrecognizedEvent, plainLogMessage} from "../utils/logger";

const DEFAULT_CONTEXT = "default";
const SYNCED_EVENT_NAME = 'arm_synced';
const UNSYNCED_EVENT_NAME = 'arm_unsynced';
const CONNECTED_EVENT_NAME = 'connected';
const DISCONNECTED_EVENT_NAME = 'disconnected';
const IMU_EVENT_NAME = 'imu';
const EMG_EVENT_NAME = 'emg';
const FINGER_SPREAD_EVENT_NAME = 'fingers_spread';
const WAVE_IN_EVENT_NAME = 'wave_in';
const WAVE_OUT_EVENT_NAME = 'wave_out';
const FIST_EVENT_NAME = 'fist';
const DOUBLE_TAP_EVENT_NAME = 'double_tap';
const SHORT_VIBRATION = 'short';
const MEDIUM_VIBRATION = 'medium';
const LONG_VIBRATION = 'long';

let emgStreamingEnabled = false;
let imuStreamingEnabled = false;

const DRIVER_NAME = "MyoDriver";

const eventsRegistry = {
    fingers_spread: [],
    wave_in: [],
    wave_out: [],
    fist: [],
    double_tap: []
};

const currentContextRegistry = {
    fingers_spread: DEFAULT_CONTEXT,
    wave_in: DEFAULT_CONTEXT,
    wave_out: DEFAULT_CONTEXT,
    fist: DEFAULT_CONTEXT,
    double_tap: DEFAULT_CONTEXT
};


export function setupMyoDriver(enableEmgStreaming, enableImuStream) {
    emgStreamingEnabled = enableEmgStreaming;
    imuStreamingEnabled = enableImuStream;
    setupMyoEngine(enableEmgStreaming, enableImuStream);
    registerStateChangeEvents();
    registerPoseEvents();
    connectMyo();
}

export function registerFingerSpreadEvent(contextName, handler) {
    eventsRegistry.fingers_spread.push({contextName, handler});
}

export function registerWaveInEvent(contextName, handler) {
    eventsRegistry.wave_in.push({contextName, handler});
}

export function registerWaveOutEvent(contextName, handler) {
    eventsRegistry.wave_out.push({contextName, handler});
}

export function registerFistEvent(contextName, handler) {
    eventsRegistry.fist.push({contextName, handler});
}

export function registerDoubleTapEvent(contextName, handler) {
    eventsRegistry.double_tap.push({contextName, handler});
}

export function changeContextOfAllMyoGestures(newContext) {
    plainLogMessage("Switching gesture commands to " + newContext + " context");
    changeFingerSpreadContext(newContext);
    changeWaveInContext(newContext);
    changeWaveOutContext(newContext);
    changeFistContext(newContext);
    changeDoubleTapContext(newContext);
}

export function changeFingerSpreadContext(newContext) {
    currentContextRegistry.fingers_spread = newContext;
}

export function changeWaveInContext(newContext) {
    currentContextRegistry.wave_in = newContext;
}

export function changeWaveOutContext(newContext) {
    currentContextRegistry.wave_out = newContext;
}

export function changeFistContext(newContext) {
    currentContextRegistry.fist = newContext;
}

export function changeDoubleTapContext(newContext) {
    currentContextRegistry.double_tap = newContext;
}

export function registerEmgEvent(callback) {
    registerEvent(EMG_EVENT_NAME, function (data) {
        if (emgStreamingEnabled) {
            // log(data);
            callback && callback(data);
        }
    });
}

export function registerImuEvent(callback) {
    registerEvent(IMU_EVENT_NAME, function (data) {
        if (imuStreamingEnabled) {
            // log(data);
            callback && callback(data);
        }
    });
}

export function triggerShortVibration() {
    vibrate(SHORT_VIBRATION);
}

export function triggerMediumVibration() {
    vibrate(MEDIUM_VIBRATION);
}

export function triggerLongVibration() {
    vibrate(LONG_VIBRATION);
}

function registerStateChangeEvents() {
    registerEvent(SYNCED_EVENT_NAME, createMyoCallback(SYNCED_EVENT_NAME));
    registerEvent(UNSYNCED_EVENT_NAME, createMyoCallback(UNSYNCED_EVENT_NAME));
    registerEvent(CONNECTED_EVENT_NAME, createMyoCallback(CONNECTED_EVENT_NAME));
    registerEvent(DISCONNECTED_EVENT_NAME, createMyoCallback(DISCONNECTED_EVENT_NAME));
}

function registerPoseEvents() {
    registerEvent(FINGER_SPREAD_EVENT_NAME, createMyoCallback(FINGER_SPREAD_EVENT_NAME));
    registerEvent(WAVE_IN_EVENT_NAME, createMyoCallback(WAVE_IN_EVENT_NAME));
    registerEvent(WAVE_OUT_EVENT_NAME, createMyoCallback(WAVE_OUT_EVENT_NAME));
    registerEvent(FIST_EVENT_NAME, createMyoCallback(FIST_EVENT_NAME));
    registerEvent(DOUBLE_TAP_EVENT_NAME, createMyoCallback(DOUBLE_TAP_EVENT_NAME));
}

function createMyoCallback(eventName) {
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
            triggerShortVibration();
            logRecognizedEvent(DRIVER_NAME, eventName, currentContext);
        } else {
            logUnrecognizedEvent(DRIVER_NAME, eventName, currentContext);
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
