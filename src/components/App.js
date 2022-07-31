import React from 'react';
import * as tts from '../modules/tts';
import * as spRec from '../modules/speechRecognition';
import * as tracker from '../modules/tracker';
import * as eventReg from '../modules/eventRegister';
import * as leap from '../modules/leap';
import * as txtEditor from '../modules/textEditor';
import * as logger from '../modules/logger';
import * as defaultContext from '../contexts/defaultContext';
import * as selectedContext from '../contexts/selectedContext';
import * as replaceContext from '../contexts/replaceContext';
import * as insertAfterContext from '../contexts/insertAfterContext';
import * as insertBeforeContext from '../contexts/insertBeforeContext';
import {CONTEXT} from '../utils/enums';

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
        participant: '',
        isLoggingToLogFile: false
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
        spRec.setup(this.notUnderstoodCallback);
        txtEditor.setup('#editor-container', this.text);
        leap.setup((gesture) => console.log(`Gesture: ${gesture} with no registered callback`));
    };

    notUnderstoodCallback = (phrase) => {
        tts.resume();
    }

    ttsOnWordSpoken = (delta) => {
        this.setState({wordIndex: tracker.getIndex()});
        tracker.updateIndex(delta);
        txtEditor.markWord(tracker.getIndex());
    }

    registerContexts = () => {
        defaultContext.register();
        selectedContext.register();
        replaceContext.register();
        insertAfterContext.register();
        insertBeforeContext.register();
    };

    start = () => {
        logger.log('Experimenter triggered event: start/restart button');
        txtEditor.restart();
        spRec.start();
        leap.start();
        this.setState({paused: false});
        tracker.setIndex(0);
        tts.readText(txtEditor.getText());
        eventReg.setContext(CONTEXT.DEFAULT);
    }

    pause = () => {
        logger.log('Experimenter triggered event: pause/resume button');
        if (this.state.paused) {
            spRec.start();
            leap.start();
            tts.resume();
            this.setState({paused: false});
        } else {
            spRec.stop();
            leap.stop();
            tts.pause();
            this.setState({paused: true});
        }
    }

    undo = () => {
        logger.log('Experimenter triggered event: undo button');
        txtEditor.undo();
    }

    handleParticipantChange = (event) => {
        this.setState({participant: event.target.value});
    }

    logToFile = () => {
        if (this.state.isLoggingToLogFile) {
            this.setState({isLoggingToLogFile: false});
            logger.stopLoggingToFile();
        } else {
            this.setState({isLoggingToLogFile: true});
            logger.startLoggingToFile();
        }

    }

    generateLogFile = () => {
        logger.generateFile(this.state.participant)
    }

    render() {
        return (
            <>
                <p>{this.state.errorMsg}</p>
                <div id='editor-container'></div>
                <button onClick={this.start}>{ this.state.wordIndex === 0 ? 'Start' : 'Restart' }</button>
                <button onClick={this.pause}>{ this.state.paused ? 'Resume' : 'Pause' }</button>
                <button onClick={this.undo}>Undo</button>
                <p id='voice-rec-is-on'>Is recognizing voice: <span class='false'>false</span></p>
                <p id='gesture-rec-is-on'>Is recognizing gestures: <span class='false'>false</span></p>
                <p id='left-hand-present'>Is left hand present: <span class='false'>false</span></p>
                <p id='right-hand-present'>Is right hand present: <span class='false'>false</span></p>
                <p id='reading-is-on'></p>
                <p id='detected-gesture'>Reconized gesture: - </p>
                <p id='detected-voice-cmd'>Reconized voice command: - </p>
                <p id='current-context'>Current context: DEFAULT</p>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <h3>Experiment:</h3>
                <p>Participant: </p>
                <input type="text" value={this.state.participant} onChange={this.handleParticipantChange} />
                <br></br>
                <br></br>
                <button onClick={this.logToFile}>
                    { this.state.isLoggingToLogFile ? 'Stop' : 'Start' } logging to log file
                </button>
                <br></br>
                <br></br>
                <button onClick={this.generateLogFile}>Generate log file</button>
            </>
        )
    }
}

export default App;
