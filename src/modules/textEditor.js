let textEditorRef;

export function updateTextEditorRef(quillRef) {
    textEditorRef = quillRef;
}

export function select(from, length) {
    textEditorRef.setSelection(from, length);
}
