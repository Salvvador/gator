const recognition = new window.webkitSpeechRecognition();

const CONTINUOUS_RECOGNITION = true;
const LANGUAGE = 'en-US';
const INTERIM_RESULTS = true;
const NOT_LISTENING_AFTER_COMMAND_TIME = 500;
const MAX_ALTERNATIVES = 1;

export function setupSpeechRecognitionEngine(resultCallback, endRecognitionCallback) {
    recognition.continuous = CONTINUOUS_RECOGNITION;
    recognition.lang = LANGUAGE;
    recognition.interimResults = INTERIM_RESULTS;

    recognition.maxAlternatives = MAX_ALTERNATIVES;

    recognition.onend = endRecognitionCallback;
    recognition.onresult = createResultCallback(resultCallback);
}

export function startSpeechRecognition() {
    recognition.start();
}

export function stopSpeechRecognition() {
    recognition.stop();
}

function createResultCallback(callback) {
    return (event) => {
        if(event.results[0].isFinal) {
            const indexOfLastSentence = event.results.length - 1;
            const understoodPhrases = event.results[indexOfLastSentence];
            callback(understoodPhrases);
            setTimeout(() => startSpeechRecognition, NOT_LISTENING_AFTER_COMMAND_TIME);
        }
    }
}