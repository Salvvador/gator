import {CONTEXT} from '../utils/enums';

const eventRegister = new Map();
let currentContext = CONTEXT.DEFAULT;

export function setContext(context) {
    document.getElementById('current-context').innerHTML = `Current context: ${context}`; 
    currentContext = context;
}

export function registerEvent(context, modality, action, callback) {
    const key = getKey(modality, context);
    if (!eventRegister.has(key)) {
        eventRegister.set(key, []);
    }
    eventRegister.get(key).push({action, callback});
}

export function getActionHandlerPairs(modality) {
    const key = getKey(modality, currentContext);
    if (eventRegister.has(key)) {
        return eventRegister.get(key);
    }
    return [];
}

function getKey(modality, context) {
    return `${modality}:${context}`;
}
