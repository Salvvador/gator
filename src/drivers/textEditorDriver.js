import Delta from "quill-delta";
import {logMessage} from "../utils/logger";

let textEditorRef;
let selectedText = [];
let text;

export function setupTextEditorDriver(startText) {
    text = startText;
}

export function updateText(newText) {
    text = newText;
    logMessage(text);
}

export function getRemainingText(currentIndex) {
    return text.substring(currentIndex);
}

export function getTextLength() {
    return text.length;
}

export function updateTextEditorRef(quillRef) {
    textEditorRef = quillRef;
}

function getStartIndexOfPhrase(currentIndex, phrase) {
    const alreadyReadText = text.slice(0, currentIndex).toLowerCase();
    return alreadyReadText.lastIndexOf(phrase);
}

export function increaseSelection() {
    if (selectedText === undefined || selectedText.length === 0) {
        throw new Error("No text selected");
    } else if (selectedText.length === 1) {
        const startIndexOfCurrentSentence = getStartIndexOfSentence(selectedText[selectedText.length - 1].start);
        const endIndexOfCurrentSentence = getEndIndexOfCurrentSentence(selectedText[selectedText.length - 1].start);
        selectedText.push({ start: startIndexOfCurrentSentence, textLength: endIndexOfCurrentSentence - startIndexOfCurrentSentence });
        selectText();
        return "Sentence";
    } else if (selectedText.length === 2) {
        const startIndexOfCurrentParagraph = getStartIndexOfCurrentParagraph(selectedText[selectedText.length - 1].start);
        const endIndexOfCurrentParagraph = getEndIndexOfCurrentParagraph(selectedText[selectedText.length - 1].start);
        selectedText.push({ start: startIndexOfCurrentParagraph, textLength: endIndexOfCurrentParagraph - startIndexOfCurrentParagraph });
        selectText();
        return "Paragraph";
    } else if (selectedText.length === 3) {
        selectedText.push({ start: 0, textLength: text.length });
        selectText();
        return "Whole text";
    } else {
        throw new Error("Maximum text selected");
    }
}

export function decreaseSelection() {
    if (selectedText === undefined || selectedText.length === 0) {
        throw new Error("No text selected");
    } else if (selectedText.length === 1) {
        throw new Error("Selection aborted");
        // unselectText();
        // return "Nothing";
    } else if (selectedText.length === 2) {
        selectedText.pop();
        if (selectedText[selectedText.length - 1].textLength === 0) {
            throw new Error("Selection aborted");
        }
        selectText();
        return "Phrase";
    } else if (selectedText.length === 3) {
        selectedText.pop();
        selectText();
        return "Sentence";
    } else if (selectedText.length === 4) {
        selectedText.pop();
        selectText();
        return "Paragraph";
    }
}

export function selectPhrase(currentIndex, phrase) {
    if (phrase === undefined) {
        selectedText.push({ start: currentIndex, textLength: 0 });
        return;
    }
    const startIndexOfPhrase = getStartIndexOfPhrase(currentIndex, phrase);
    if (startIndexOfPhrase === -1) {
        throw new Error("Phrase not found");
    }
    selectedText.push({ start: startIndexOfPhrase, textLength: phrase.length });
    selectText();
    return startIndexOfPhrase;
}

function selectText() {
    textEditorRef.setSelection(selectedText[selectedText.length - 1].start, selectedText[selectedText.length - 1].textLength);
}

export function deleteSelectedText() {
    if (selectedText === undefined || selectedText.length === 0) {
        throw new Error("No text selected");
    }
    textEditorRef.deleteText(selectedText[selectedText.length - 1].start, selectedText[selectedText.length - 1].textLength);
    return unselectText();
}

export function insertBeforeSelectedText(phrase) {
    if (selectedText === undefined || selectedText.length === 0) {
        throw new Error("No text selected");
    }
    const textToInsert = phrase + " ";
    textEditorRef.insertText(selectedText[selectedText.length - 1].start, textToInsert);
    return unselectText();
}

export function insertAfterSelectedText(phrase) {
    if (selectedText === undefined || selectedText.length === 0) {
        throw new Error("No text selected");
    }
    const textToInsert = " " + phrase;
    textEditorRef.insertText(selectedText[selectedText.length - 1].start + selectedText[selectedText.length - 1].textLength, textToInsert);
    return unselectText();
}

export function replaceSelectedText(phrase) {
    if (selectedText === undefined || selectedText.length === 0) {
        throw new Error("No text selected");
    }
    const delta = new Delta().retain(selectedText[selectedText.length - 1].start).delete(selectedText[selectedText.length - 1].textLength).insert(phrase);
    textEditorRef.updateContents(delta);
    return unselectText();
}

export  function getStartIndexOfSentence(currentIndex) {
    if (currentIndex < 0) {
        return 0;
    }
    return getStartIndexOfPhrase(currentIndex, ".") + 1;
}

export  function getStartIndexOfCurrentParagraph(currentIndex) {
    if (currentIndex < 0) {
        return 0;
    }
    return getStartIndexOfPhrase(currentIndex, "..") + 1;
}

function getEndIndexOfCurrentSentence(currentIndex) {
    return currentIndex + getRemainingText(currentIndex).indexOf(".");
}

function getEndIndexOfCurrentParagraph(currentIndex) {
    return currentIndex + getRemainingText(currentIndex).indexOf("..");
}

export  function getStartIndexOfSentenceOfSelectedPhrase() {
    if (selectedText === undefined || selectedText.length === 0) {
        throw new Error("No text selected");
    }
    const textBeforeSelectedPhrase = text.slice(0, selectedText[selectedText.length - 1].start);
    return textBeforeSelectedPhrase.lastIndexOf(".") + 1;
}

export function unselectText() {
    const startOfSelectedText = selectedText[selectedText.length - 1].start;
    selectedText = [];
    textEditorRef.setSelection(0, 0);
    return startOfSelectedText;
}

export function undo() {
    textEditorRef.history.undo();
}