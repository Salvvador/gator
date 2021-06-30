import Quill from 'quill';
import {getWordAt} from '../utils/textParser';

let editor;

export function setup(container, text) {
    editor = new Quill(container, {
        modules: {
          toolbar: false
        },
        placeholder: 'Compose an epic...',
        theme: 'bubble'  // or 'snow'
    });
    setText(text);
}

export function select(from, length) {
    editor.setSelection(from, length);
}

export function markWord(from) {
    restart();
    const currentWord = getWordAt(editor.getText(), from);
    editor.formatText(from, currentWord.length, 'background', 'red');
}

export function setText(text) {
    editor.setText(text);
}

export function getText(from = 0) {
    return editor.getText(from);
}

export function restart() {
    editor.setSelection(null);
    editor.formatText(0, editor.getLength(), 'background', false);
}

export function deleteSelected() {
    const selection = editor.getSelection();
    editor.deleteText(selection.index, selection.length);
    return selection.index;
}

export function replaceSelected(text) {
    const selectionIndex = deleteSelected();
    editor.insertText(selectionIndex, text);
    return selectionIndex;
}

export function insertBefore(text) {
    const selection = editor.getSelection();
    editor.insertText(selection.index, text + ' ');
    return selection.index;
}

export function insertAfter(text) {
    const selection = editor.getSelection();
    editor.insertText(selection.index + selection.length, ' ' + text);
    return selection.index;
}