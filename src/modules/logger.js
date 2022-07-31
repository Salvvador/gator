let isLoggingToFile = false;
const file_logs = ['START'];

export function log(message) {
    console.log(message);
    if (isLoggingToFile) {
        file_logs.push(formatFileLogMessage(message))
    }
}

function formatFileLogMessage(message) {
    return Date.now() + ', ' + message;
}

export function startLoggingToFile() {
    isLoggingToFile = true;
}

export function stopLoggingToFile() {
    isLoggingToFile = false;
}

export function generateFile(file_name) {
    const blob = new Blob([concatFileLogs()], {type: 'plain/text'});
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = (file_name ? file_name : 'unknown') + '.txt';
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
}

function concatFileLogs() {
    return file_logs.join("\n")
}