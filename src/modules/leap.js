import * as leap from 'leapjs';
import {MODALITY, GESTURE} from '../utils/enums';
import * as evReg from './eventRegister';

const controller = new leap.Controller();

let currentFrame;
let holdAfterGestureDetected = 0;
let shouldBeRecognizing = false;

let notInRegistryCallback = (phrase) => { console.log('Gesture: ' + phrase + ' with no registered callback') };

export function setup(newNotInRegistryCallback) {
    notInRegistryCallback = newNotInRegistryCallback;
    controller.connect();
}

export function start() {
    shouldBeRecognizing = true;
    document.getElementById('voice-rec-is-on').innerHTML = `Is recognizing gestures: <span class='true'>true</span>`; 
}

export function stop() {
    shouldBeRecognizing = false;
    document.getElementById('voice-rec-is-on').innerHTML = `Is recognizing gestures: <span class='false'>false</span>`; 
}

export function unregister() {
    controller.disconnect();
}

controller.loop(function(frame) {
    currentFrame = frame;
});

setInterval(async function() {
    if (currentFrame === undefined) {
        return;
    }
    
    let rightHand = null;
    let leftHand = null;
    currentFrame.hands.forEach(hand => {
        if (hand.type === 'right') {
            rightHand = hand;
        } else if (hand.type === 'left') {
            leftHand = hand;
        }
    });
    document.getElementById('left-hand-present').innerHTML = `Is left hand present: ${leftHand ? "<span class='true'>true</span>" : "<span class='false'>false</span>"}`; 
    document.getElementById('right-hand-present').innerHTML = `Is right hand present: ${rightHand ? "<span class='true'>true</span>" : "<span class='false'>false</span>"}`; 

    if (!shouldBeRecognizing) {
        return;
    }
    
    if (holdAfterGestureDetected > 0) {
        holdAfterGestureDetected--;
        return;
    }

    if (isRightHandFacingUp(rightHand)) {
        await performGestureAction(GESTURE.HANDS_UPWARD);
    }

    if (isRightHandFacingForwardVertical(rightHand)) {
        await performGestureAction(GESTURE.STOP);
    }

    if (isRightHandFacingLeft(rightHand) && isLeftHandFacingRight(leftHand) && (isRightHandMovingLeft(rightHand) || isLeftHandMovingRight(leftHand))) {
        await performGestureAction(GESTURE.HANDS_FOLDING);
    }

    if (isRightHandFacingLeft(rightHand) && isLeftHandFacingRight(leftHand) && (isRightHandMovingRight(rightHand) || isLeftHandMovingLeft(leftHand))) {
        await performGestureAction(GESTURE.HANDS_UNFOLDING);
    }

    if (/*(isRightHandFacingLeft() && !isLeftHandFacingRight() && isRightHandMovingRight()) || */isRightHandFacingBack(rightHand)) {
        await performGestureAction(GESTURE.WAVE_IN);
    }

    if (/*(isRightHandFacingLeft() && !isLeftHandFacingRight() && isRightHandMovingLeft()) || */isRightHandFacingForwardHorizontal(rightHand)) {
        await performGestureAction(GESTURE.WAVE_OUT);
    }

    if (isRightHandMakingFist(rightHand) && isRightHandMovingAnywhere(rightHand)) {
        await performGestureAction(GESTURE.FIST_AND_THROW_AWAY);
    }

    if (isRightHandIndexFingerPointing(rightHand) && isRightHandMovingLeft(rightHand)) {
        await performGestureAction(GESTURE.INDEX_FINGER_LEFT);
    }

    if (isRightHandIndexFingerPointing(rightHand) && isRightHandMovingRight(rightHand)) {
        await performGestureAction(GESTURE.INDEX_FINGER_RIGHT);
    }

    if (isRightHandFacingLeft(rightHand) && isRightHandMovingLeft(rightHand)) {
        await performGestureAction(GESTURE.SWIPE_LEFT);
    }
}, 250);

async function performGestureAction(eventName) {
    console.log('Gesture: ' + eventName)
    document.getElementById('detected-gesture').innerHTML = `Reconized gesture: ${eventName} (${new Date().toLocaleTimeString()})`;
    for (const event of evReg.getActionHandlerPairs(MODALITY.GESTURE)) {
        if (event.action === eventName) {
            await event.callback(eventName);
            holdAfterGestureDetected = 4;
            return;
        }
    }
    notInRegistryCallback(eventName);
}



//   GESTURES   //

function isRightHandFacingUp(rightHand) {
    return rightHand &&
        rightHand.palmNormal[0] < 0.5 && rightHand.palmNormal[0] > -0.5 &&
        rightHand.palmNormal[1] > 0.6 &&
        rightHand.palmNormal[2] < 0.5 && rightHand.palmNormal[2] > -0.5;
}

function isRightHandFacingLeft(rightHand) {
    return rightHand &&
        rightHand.palmNormal[0] < -0.6 &&
        rightHand.palmNormal[1] < 0.5 && rightHand.palmNormal[1] > -0.5 &&
        rightHand.palmNormal[2] < 0.5 && rightHand.palmNormal[2] > -0.5
}

function isRightHandFacingBack(rightHand) {
    return rightHand &&
        rightHand.palmNormal[0] < 0.5 && rightHand.palmNormal[0] > -0.5 &&
        rightHand.palmNormal[1] < 0.5 && rightHand.palmNormal[1] > -0.5 &&
        rightHand.palmNormal[2] > 0.6;
}

function isRightHandFacingForwardVertical(rightHand) {
    return rightHand &&
        rightHand.palmNormal[0] < 0.5 && rightHand.palmNormal[0] > -0.5 &&
        rightHand.palmNormal[1] < 0.3 && rightHand.palmNormal[1] > -0.5 &&
        rightHand.palmNormal[2] < -0.7;
}

function isRightHandFacingForwardHorizontal(rightHand) {
    return rightHand &&
        rightHand.palmNormal[0] < -0.5 &&
        rightHand.palmNormal[1] < 0.5 && rightHand.palmNormal[1] > -0.5 &&
        rightHand.palmNormal[2] < -0.5;
}

function isRightHandMakingFist(rightHand) {
    return rightHand && rightHand.grabStrength > 0.8;
}

function isRightHandMovingLeft(rightHand) {
    return rightHand && rightHand.palmVelocity[0] < -200;
}

function isRightHandMovingRight(rightHand) {
    return rightHand && rightHand.palmVelocity[0] > 200;
}

function isRightHandIndexFingerPointing(rightHand) {
    return rightHand &&
        rightHand.indexFinger.extended &&
        !rightHand.middleFinger.extended &&
        !rightHand.ringFinger.extended &&
        !rightHand.pinky.extended;
}

function isRightHandMovingAnywhere(rightHand) {
    return rightHand &&
        (rightHand.palmVelocity[0] > 200 || rightHand.palmVelocity[0] < -200 ||
            rightHand.palmVelocity[1] > 200 || rightHand.palmVelocity[1] < -200 ||
            rightHand.palmVelocity[2] > 200 || rightHand.palmVelocity[1] < -200);
}

function isLeftHandFacingRight(leftHand) {
    return leftHand &&
        leftHand.palmNormal[0] > 0.6 &&
        leftHand.palmNormal[1] < 0.5 && leftHand.palmNormal[1] > -0.5 &&
        leftHand.palmNormal[2] < 0.5 && leftHand.palmNormal[2] > -0.5;
}

function isLeftHandMovingRight(leftHand) {
    return leftHand && leftHand.palmVelocity[0] > 200;
}

function isLeftHandMovingLeft(leftHand) {
    return leftHand && leftHand.palmVelocity[0] < -200;
}