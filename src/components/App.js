import React from 'react';
import {setupLeapMotionDriver} from "../drivers/leapMotionDriver";
import {setupTtsDriver} from '../drivers/ttsDriver';
import {setupSpeechDriver, startRecording} from "../drivers/speechRecDriver";
import {setupTextEditorDriver, updateTextEditorRef} from "../drivers/textEditorDriver";
import TextEditor from "./TextEditor";
import {registerDefaultVoiceContext} from "../contexts/defaultVoiceContext";
import {registerDefaultLeapMotionContext} from "../contexts/defaultLeapMotionContext";
import {registerSelectedLeapMotionContext} from "../contexts/selectedLeapMotionContext";
import {updateIndexOfLastWordSpoken} from "../utils/spokenWordsCounter"
import {generateFile} from "../utils/logger"

class App extends React.Component {

    state = {
        text: 'The other day I was looking through some new and exciting browser APIs which could be worth trying out. ' +
            'Now I’d like to share my findings about such API, which could be or at least become interesting in the future.. ' +
            'You can find the link to the code for these experiments at the end of the article..',
        errorMsg: ''
    };

    componentDidMount() {
        try {
            this.setupAllDrivers();
            this.registerContexts();
            startRecording();
        } catch(e) {
            this.setState({errorMsg: e.message});
        }
    }

    setupAllDrivers = () => {
        setupTtsDriver(updateIndexOfLastWordSpoken);
        setupSpeechDriver();
        setupTextEditorDriver(this.state.text);
        setupLeapMotionDriver();
    };

    registerContexts = () => {
        registerDefaultVoiceContext();
        registerDefaultLeapMotionContext();
        registerSelectedLeapMotionContext();
    };

    onRefUpdate = (ref) => {
        updateTextEditorRef(ref);
    };

    render() {
        return (
            <>
                <p>{this.state.errorMsg}</p>
                <TextEditor
                    text={this.state.text}
                    onRefUpdate={this.onRefUpdate}/>
                <button onClick={generateFile}>Generate report</button>
            </>
        )
    }
}

export default App;
