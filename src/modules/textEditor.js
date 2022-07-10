import Quill from 'quill';
import {getWordAt} from '../utils/textParser';

let editor;
let undoVersions = [];

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
    undoVersions.push(editor.getText());
}

export function setText(text) {
    editor.setText(text);
    undoVersions.push(editor.getText());
}

export function getText(from = 0) {
    return editor.getText(from);
}

export function restart() {
    editor.setSelection(null);
    editor.formatText(0, editor.getLength(), 'background', false);
    undoVersions = [undoVersions[0]]
}

export function deleteSelected() {
    const selection = editor.getSelection();
    editor.deleteText(selection.index, selection.length);
    undoVersions.push(editor.getText());
    return selection.index;
}

export function replaceSelected(text) {
    const selectionIndex = deleteSelected();
    editor.insertText(selectionIndex, text);
    undoVersions.push(editor.getText());
    return selectionIndex;
}

export function insertBefore(text) {
    const selection = editor.getSelection();
    editor.insertText(selection.index, text + ' ');
    undoVersions.push(editor.getText());
    return selection.index;
}

export function insertAfter(text) {
    const selection = editor.getSelection();
    editor.insertText(selection.index + selection.length, ' ' + text);
    undoVersions.push(editor.getText());
    return selection.index;
}

export function undo() {
    if (undoVersions.length > 1) {
        undoVersions.pop();
    }
    setText(undoVersions.pop());
}