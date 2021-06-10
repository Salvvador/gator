import React from 'react';
import {setupLeapMotionDriver} from "../drivers/leapMotionDriver";
import * as tts from '../modules/tts';
import * as spRec from '../modules/speechRecognition';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import {setupTextEditorDriver, updateTextEditorRef} from "../drivers/textEditorDriver";
import TextEditor from "./TextEditor";
import {registerDefaultVoiceContext} from "../contexts/defaultVoiceContext";
import {registerDefaultLeapMotionContext} from "../contexts/defaultLeapMotionContext";
import {registerSelectedLeapMotionContext} from "../contexts/selectedLeapMotionContext";
import {updateIndexOfLastWordSpoken} from "../utils/spokenWordsCounter"
import {generateFile} from "../utils/logger"
import * as txtEditor from '../modules/textEditor';

class App extends React.Component {

    state = {
        text: 'Mr and Mrs Dursley, of number four, Privet Drive, were ' +
            'proud to say that they were perfectly normal, thank ' +
            'you very much. They were the last people you’d expect to be ' +
            'involved in anything strange or mysterious, because they just ' +
            'didn’t hold with such nonsense.',
        errorMsg: ''
    };

    componentDidMount() {
        try {
            this.registerContexts();
            this.setupAllDrivers();
            spRec.start();
        } catch(e) {
            this.setState({errorMsg: e.message});
        }
    }

    setupAllDrivers = () => {
        tts.setup(tracker.updateIndex);
        spRec.setup(eventReg.getActionHandlerPairs("DEFAULT", "VOICE"), () => {console.log('git')});
        setupTextEditorDriver(this.state.text);
        setupLeapMotionDriver();
    };

    registerContexts = () => {
        registerDefaultVoiceContext();
        // registerDefaultLeapMotionContext();
        // registerSelectedLeapMotionContext();
    };

    onRefUpdate = (ref) => {
        updateTextEditorRef(ref);
        txtEditor.updateTextEditorRef(ref);
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
