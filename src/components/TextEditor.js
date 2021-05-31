import React from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import {updateText} from "../drivers/textEditorDriver";

class TextEditor extends React.Component {

    constructor(props) {
        super(props);
        this.reactQuillRef = null; // ReactQuill component
    }

    componentDidMount() {
        this.props.onRefUpdate(this.getQuillRefs());
    }

    componentDidUpdate() {
        this.props.onRefUpdate(this.getQuillRefs());
    }

    getQuillRefs = () => {
        if (typeof this.reactQuillRef.getEditor !== 'function') return;
        return this.reactQuillRef.getEditor();
    };

    handleChange = () => {
        if (this.reactQuillRef) {
            updateText(this.getQuillRefs().getText());
        }
    };

    render() {
        return (
            <ReactQuill
                ref={(el) => { this.reactQuillRef = el }}
                value={this.props.text}
                onChange={this.handleChange}
                modules={ {"toolbar": false} }
                theme={'snow'} />
        )
    }
}

export default TextEditor;