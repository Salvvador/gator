let startIndex = 0;
let currentIndex = 0;

export function getIndexOfLastWordSpoken() {
    return currentIndex;
}

export function updateIndexOfLastWordSpoken(newIndex) {
    currentIndex = startIndex + newIndex;
}

export function setIndexOfLastWordSpoken(newIndex) {
    startIndex = newIndex;
    currentIndex = newIndex;
}

export function restartIndexOfLastWordSpoken() {
    startIndex = 0;
    currentIndex = 0;
}