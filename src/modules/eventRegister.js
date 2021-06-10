const events = [];

export function registerEvent(context, modality, action, callback) {
    events.push({context, modality, action, callback});
}

export function getActionHandlerPairs(context, modality) {
    return events.filter(event => event.context === context && event.modality === modality)
}
