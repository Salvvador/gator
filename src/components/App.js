import React from 'react';
import {setupLeapMotionDriver} from "../drivers/leapMotionDriver";
import * as tts from '../modules/tts';
import * as spRec from '../modules/speechRecognition';
import * as eventReg from '../modules/eventRegister';
import * as tracker from '../modules/tracker';
import * as txtEditor from '../modules/textEditor';
import {registerDefaultVoiceContext} from "../contexts/defaultVoiceContext";
import {registerSelectedContext} from "../contexts/selectedContext";
import {registerReplaceContext} from "../contexts/replaceContext";
import {registerInsertAfterContext} from "../contexts/insertAfterContext";
import {registerInsertBeforeContext} from "../contexts/insertBeforeContext";
import {generateFile} from "../utils/logger"

class App extends React.Component {
    text = 'Mr and Mrs Dursley, of number four, Privet Drive, were ' +
        'proud to say that they were perfectly normal, thank ' +
        'you very much. They were the last people you’d expect to be ' +
        'involved in anything strange or mysterious, because they just ' +
        'didn’t hold with such nonsense.'

    state = {
        errorMsg: '',
        paused: false,
        wordIndex: 0,
        understoodText: ''
    };

    componentDidMount() {
        try {
            this.registerContexts();
            this.setupAllDrivers();
        } catch(e) {
            this.setState({errorMsg: e.message});
        }
    }

    setupAllDrivers = () => {
        tts.setup(this.ttsOnWordSpoken);
        spRec.setup(eventReg.getActionHandlerPairs("DEFAULT", "VOICE"), this.notUnderstoodCallback);
        txtEditor.setup("#editor-container", this.text);
        setupLeapMotionDriver();
    };

    notUnderstoodCallback = (phrase) => {
        this.setState({understoodText: phrase})
        tts.resume();
    }

    ttsOnWordSpoken = (delta) => {
        this.setState({wordIndex: tracker.getIndex()});
        tracker.updateIndex(delta);
        txtEditor.markWord(tracker.getIndex());
    }

    registerContexts = () => {
        registerDefaultVoiceContext();
        registerSelectedContext();
        registerReplaceContext();
        registerInsertAfterContext();
        registerInsertBeforeContext();
        // registerDefaultLeapMotionContext();
        // registerSelectedLeapMotionContext();
    };

    start = () => {
        txtEditor.restart();
        spRec.start();
        this.setState({paused: false});
        tracker.setIndex(0);
        tts.readText(txtEditor.getText());
    }

    pause = () => {
        if (this.state.paused) {
            spRec.start();
            tts.resume();
            this.setState({paused: false});
        } else {
            spRec.stop();
            tts.pause();
            this.setState({paused: true});
        }
    }

    render() {
        return (
            <>
                <p>{this.state.errorMsg}</p>
                <div id="editor-container"></div>
                <button onClick={this.start}>{ this.state.wordIndex === 0 ? "Start" : "Restart" }</button>
                <button onClick={this.pause}>{ this.state.paused ? "Resume" : "Pause" }</button>
                <button onClick={generateFile}>Generate report</button>
                <p>{this.state.understoodText}</p>
            </>
        )
    }
}

export default App;
