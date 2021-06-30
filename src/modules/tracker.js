let startIndex = 0;
let currentIndex = 0;

export function getIndex() {
    return startIndex + currentIndex;
}

export function updateIndex(delta) {
    currentIndex = delta;
}

export function setIndex(newIndex) {
    startIndex = newIndex;
    currentIndex = 0;
}