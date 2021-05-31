const F5_KEY = 116;
const PAGE_UP_KEY = 33;
const PAGE_DOWN_KEY = 34;
const B_KEY = 66;
const ESC_KEY = 27;
const SHIFT_KEY = 16;

const clickEvents = {
    previous_page: undefined,
    next_page: undefined,
    start_presentation: undefined,
    dark_screen: undefined
};

export function setupRemoteControllerEngine() {
    document.addEventListener("keydown", remoteControllerCallback, false);
}

export function unregister() {
    document.removeEventListener("keydown", remoteControllerCallback, false);
}

function remoteControllerCallback(event) {
    if (event.keyCode === F5_KEY) {
        event.preventDefault();
    } else if (event.keyCode === PAGE_UP_KEY) {
        event.preventDefault();
        clickEvents.previous_page();
    } else if (event.keyCode === PAGE_DOWN_KEY) {
        event.preventDefault();
        clickEvents.next_page();
    } else if (event.keyCode === B_KEY) {
        event.preventDefault();
        clickEvents.start_presentation();
    } else if (event.keyCode === ESC_KEY || event.keyCode === SHIFT_KEY) {
        event.preventDefault();
        clickEvents.dark_screen();
    }
}

export function registerEvent(eventName, callback) {
    if (clickEvents.hasOwnProperty(eventName)) {
        clickEvents[eventName] = callback;
    } else {
        throw "Unrecognized remote controller button"
    }
}