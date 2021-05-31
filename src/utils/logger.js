const FILE_NAME = 'participant.txt';
let data = "";

export function logMessage(message) {
    console.log(message);
    data += message + ','
}

export function generateFile() {
    const blob = new Blob([data], {type: 'text/csv'});
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = FILE_NAME;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
}