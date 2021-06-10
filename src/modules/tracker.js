let currentIndex = 0;

export function getIndex() {
    return currentIndex;
}

export function updateIndex(delta) {
    currentIndex += delta;
}

export function setIndex(newIndex) {
    currentIndex = newIndex;
}

