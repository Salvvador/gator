export function findNearestMatchingPhrase(text, phrase, index) {
    const pastOccurences = getAllOccurences(text.slice(0, index), phrase);
    if (!pastOccurences || pastOccurences.length === 0) {
        const futureOccurences = getAllOccurences(text.slice(index, getEndIndexOfSentence(text, index)), phrase);
        if (!futureOccurences || futureOccurences.length === 0) {
            return -1;
        } else {
            return index + futureOccurences[0];
        }
    } else {
        return pastOccurences[pastOccurences.length - 1];
    }
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

export function getEndIndexOfSentence(text, index) {
    const readText = text.slice(index, text.length);
    const startIndex = readText.indexOf('.');
    return startIndex === -1 ? text.length - 1 : startIndex;
}

function getAllOccurences(text, phrase) {
    const regex = new RegExp(phrase, 'gi');
    const occurences = [];
    let match = regex.exec(text);
    while (match !== null) {
        occurences.push(match.index);
        match = regex.exec(text);
    }
    return occurences;
}