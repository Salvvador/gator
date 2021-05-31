const Leap =  require('leapjs');

const controller = new Leap.Controller();

let rightHand = null;
let leftHand = null;
let currentFrame;
let holdAfterGestureDetected = 0;

const HANDS_FOLDING = "handsFolding";
const HANDS_UNFOLDING = "handsUnfolding";
const WAVE_IN = "waveIn";
const WAVE_OUT = "waveOut";
const FIST_AND_THROW_AWAY = "fistAndThrowAway";
const HANDS_UPWARD = "handUpward";
const INDEX_FINGER_LEFT = "indexFingerLeft";
const INDEX_FINGER_RIGHT= "indexFingerRight";
const STOP = "stop";

const gestureEvents = {
    handsFolding: undefined,
    handsUnfolding: undefined,
    waveIn: undefined,
    waveOut: undefined,
    fistAndThrowAway: undefined,
    handUpward: undefined,
    indexFingerLeft: undefined,
    indexFingerRight: undefined,
    stop: undefined
};

export function setupLeapMotionEngine() {
    // if (!controller.streaming()) {
    //     throw new Error("Leap Motion is not connected");
    // }
    controller.connect();
}

export function unregister() {
    controller.disconnect();
}

controller.loop(function(frame) {
    currentFrame = frame;
});

setInterval(function() {
    if (currentFrame === undefined) {
        return;
    }
    rightHand = null;
    leftHand = null;
    currentFrame.hands.forEach(hand => {
        if (hand.type === "right") {
            rightHand = hand;
            // console.table(rightHand.palmNormal);
            // console.table(rightHand.grabStrength);
            // console.table(rightHand.palmNormal);
        } else if (hand.type === "left") {
            leftHand = hand;
            // console.table(leftHand.palmNormal);
        }
    });

    if (holdAfterGestureDetected > 0) {
        holdAfterGestureDetected--;
        return;
    }

    if (isRightHandFacingUp()) {
        performGestureAction(HANDS_UPWARD);
    }

    if (isRightHandFacingForwardVertical()) {
        performGestureAction(STOP);
    }

    if (isRightHandFacingLeft() && isLeftHandFacingRight() && (isRightHandMovingLeft() || isLeftHandMovingRight())) {
        performGestureAction(HANDS_FOLDING);
    }

    if (isRightHandFacingLeft() && isLeftHandFacingRight() && (isRightHandMovingRight() || isLeftHandMovingLeft())) {
        performGestureAction(HANDS_UNFOLDING);
    }

    if (/*(isRightHandFacingLeft() && !isLeftHandFacingRight() && isRightHandMovingRight()) || */isRightHandFacingBack()) {
        performGestureAction(WAVE_IN);
    }

    if (/*(isRightHandFacingLeft() && !isLeftHandFacingRight() && isRightHandMovingLeft()) || */isRightHandFacingForwardHorizontal()) {
        performGestureAction(WAVE_OUT);
    }

    if (isRightHandMakingFist() && isRightHandMovingAnywhere()) {
        performGestureAction(FIST_AND_THROW_AWAY);
    }

    if (isRightHandIndexFingerPointing() && isRightHandMovingLeft()) {
        performGestureAction(INDEX_FINGER_LEFT);
    }

    if (isRightHandIndexFingerPointing() && isRightHandMovingRight()) {
        performGestureAction(INDEX_FINGER_RIGHT);
    }
}, 250);

function performGestureAction(eventName) {
    if (gestureEvents.hasOwnProperty(eventName)) {
        gestureEvents[eventName]();
        holdAfterGestureDetected = 4;
    }
}

function isRightHandFacingUp() {
    return rightHand &&
        rightHand.palmNormal[0] < 0.5 && rightHand.palmNormal[0] > -0.5 &&
        rightHand.palmNormal[1] > 0.6 &&
        rightHand.palmNormal[2] < 0.5 && rightHand.palmNormal[2] > -0.5;
}

function isRightHandFacingLeft() {
    return rightHand &&
        rightHand.palmNormal[0] < -0.6 &&
        rightHand.palmNormal[1] < 0.5 && rightHand.palmNormal[1] > -0.5 &&
        rightHand.palmNormal[2] < 0.5 && rightHand.palmNormal[2] > -0.5
}

function isRightHandFacingBack() {
    return rightHand &&
        rightHand.palmNormal[0] < 0.5 && rightHand.palmNormal[0] > -0.5 &&
        rightHand.palmNormal[1] < 0.5 && rightHand.palmNormal[1] > -0.5 &&
        rightHand.palmNormal[2] > 0.6;
}

function isRightHandFacingForwardVertical() {
    return rightHand &&
        rightHand.palmNormal[0] < 0.5 && rightHand.palmNormal[0] > -0.5 &&
        rightHand.palmNormal[1] < 0.3 && rightHand.palmNormal[1] > -0.5 &&
        rightHand.palmNormal[2] < -0.7;
}

function isRightHandFacingForwardHorizontal() {
    return rightHand &&
        rightHand.palmNormal[0] < -0.5 &&
        rightHand.palmNormal[1] < 0.5 && rightHand.palmNormal[1] > -0.5 &&
        rightHand.palmNormal[2] < -0.5;
}

function isRightHandMakingFist() {
    return rightHand && rightHand.grabStrength > 0.8;
}

function isRightHandMovingLeft() {
    return rightHand && rightHand.palmVelocity[0] < -200;
}

function isRightHandMovingRight() {
    return rightHand && rightHand.palmVelocity[0] > 200;
}

function isRightHandIndexFingerPointing() {
    return rightHand &&
        rightHand.indexFinger.extended &&
        !rightHand.middleFinger.extended &&
        !rightHand.ringFinger.extended &&
        !rightHand.pinky.extended;
}

function isRightHandMovingAnywhere() {
    return rightHand &&
        (rightHand.palmVelocity[0] > 200 || rightHand.palmVelocity[0] < -200 ||
            rightHand.palmVelocity[1] > 200 || rightHand.palmVelocity[1] < -200 ||
            rightHand.palmVelocity[2] > 200 || rightHand.palmVelocity[1] < -200);
}

function isLeftHandFacingRight() {
    return leftHand &&
        leftHand.palmNormal[0] > 0.6 &&
        leftHand.palmNormal[1] < 0.5 && leftHand.palmNormal[1] > -0.5 &&
        leftHand.palmNormal[2] < 0.5 && leftHand.palmNormal[2] > -0.5;
}

function isLeftHandMovingRight() {
    return leftHand && leftHand.palmVelocity[0] > 200;
}

function isLeftHandMovingLeft() {
    return leftHand && leftHand.palmVelocity[0] < -200;
}

export function registerEvent(eventName, callback) {
    if (gestureEvents.hasOwnProperty(eventName)) {
        gestureEvents[eventName] = callback;
    } else {
        throw new Error("Unrecognized gesture");
    }
}