export function getNearestSmallerOccurence(text, phrase, index) {
    const occurences = getAllOccurences(text, phrase);
    if (!occurences || occurences.length === 0) return -1;
    let i = 0;
    while (i < occurences.length && occurences[i] <= index) i++;
    return i - 1 >= 0 ? occurences[i - 1] : -1;
}

export function getWordAt(text, index) {
    // Search for the word's beginning and end.
    const left = text.slice(0, index + 1).search(/\S+$/),
        right = text.slice(index).search(/\s/);
    // The last word in the string is a special case.
    if (right < 0) {
        return text.slice(left);
    }
    // Return the word, using the located bounds to extract it from the string.
    return text.slice(left, right + index);
}

export function getStartIndexOfSentence(text, index) {
    const readText = text.slice(0, index);
    const startIndex = readText.lastIndexOf('.');
    return startIndex === -1 ? 0 : startIndex;
}


function getAllOccurences(text, phrase) {
    const regex = new RegExp(phrase, 'gi');
    const occurences = [];
    let match;
    while (match = regex.exec(text)) {
        occurences.push(match.index);
    }
    return occurences;
}