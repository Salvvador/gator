import {registerEvent, setupRemoteControllerEngine} from "../engines/remoteControllerEngine";
import {logRecognizedEvent, logUnrecognizedEvent, plainLogMessage} from "../utils/logger";

const DRIVER_NAME = "RemoteControllerDriver";
const DEFAULT_CONTEXT = "default";

const PREVIOUS_PAGE_EVENT_NAME = "previous_page";
const NEXT_PAGE_EVENT_NAME = "next_page";
const START_PRESENTATION_EVENT_NAME = "start_presentation";
const DARK_SCREEN_EVENT_NAME = "dark_screen";

const eventsRegistry = {
    previous_page: [],
    next_page: [],
    start_presentation: [],
    dark_screen: []
};

const currentContextRegistry = {
    previous_page: DEFAULT_CONTEXT,
    next_page: DEFAULT_CONTEXT,
    start_presentation: DEFAULT_CONTEXT,
    dark_screen: DEFAULT_CONTEXT
};


export function setupRemoteControllerDriver() {
    setupRemoteControllerEngine();
    registerButtonEvents();
}

export function registerPreviousPageEvent(contextName, handler) {
    eventsRegistry.previous_page.push({contextName, handler});
}

export function registerNextPageEvent(contextName, handler) {
    eventsRegistry.next_page.push({contextName, handler});
}

export function registerStartPresentationEvent(contextName, handler) {
    eventsRegistry.start_presentation.push({contextName, handler});
}

export function registerDarkScreenEvent(contextName, handler) {
    eventsRegistry.dark_screen.push({contextName, handler});
}

export function changeContextOfAllRemoteControllerGestures(newContext) {
    plainLogMessage("Switching remote controller commands to " + newContext + " context");
    changePreviousPageContext(newContext);
    changeNextPageContext(newContext);
    changeStartPresentationContext(newContext);
    changeDarkScreenContext(newContext);
}

export function changePreviousPageContext(newContext) {
    currentContextRegistry.previous_page = newContext;
}

export function changeNextPageContext(newContext) {
    currentContextRegistry.next_page = newContext;
}

export function changeStartPresentationContext(newContext) {
    currentContextRegistry.start_presentation = newContext;
}

export function changeDarkScreenContext(newContext) {
    currentContextRegistry.dark_screen = newContext;
}

function registerButtonEvents() {
    registerEvent(PREVIOUS_PAGE_EVENT_NAME, createControllerDriverCallback(PREVIOUS_PAGE_EVENT_NAME));
    registerEvent(NEXT_PAGE_EVENT_NAME, createControllerDriverCallback(NEXT_PAGE_EVENT_NAME));
    registerEvent(START_PRESENTATION_EVENT_NAME, createControllerDriverCallback(START_PRESENTATION_EVENT_NAME));
    registerEvent(DARK_SCREEN_EVENT_NAME, createControllerDriverCallback(DARK_SCREEN_EVENT_NAME));
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
