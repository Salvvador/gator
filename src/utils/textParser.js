export function getNearestSmallerOccurence(text, phrase, index) {
    const occurences = getAllOccurences(text, phrase);
    if (!occurences || occurences.length === 0) return -1;
    let i = 0;
    while (i < occurences.length && occurences[i] <= index) i++;
    return i - 1 >= 0 ? occurences[i - 1] : -1;
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



