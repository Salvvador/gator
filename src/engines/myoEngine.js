import Myo from 'myo';

export function setupMyoEngine(emgStreamingEnabled) {
    Myo.on("connected", function () {
        Myo.setLockingPolicy("none");
        this.streamEMG(emgStreamingEnabled);
    });
}

export function connectMyo() {
    Myo.connect();
}

export function registerEvent(eventName, callback) {
    Myo.on(eventName, () => {
        callback && callback();
    });
}

export function vibrate(intensity) {
    Myo.myos[0].vibrate(intensity);
}