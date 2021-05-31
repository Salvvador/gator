// import {FuzzyMatch} from "./FuzzyMatch";
//
// const SENTENCE_FUZZY_SET_MIN_VALUE = 0.6;
//
// let text;
// let sentencePositionList = [];
// let sentenceFuzzyMatchSet = new FuzzyMatch(SENTENCE_FUZZY_SET_MIN_VALUE);
//
// export function updateText(newText) {
//     text = newText;
//     createBeginningOfSentenceIndexList();
// }
//
// export function getTextLength() {
//     return text.length;
// }
//
// export function createUtteranceFromText(indexToStartReading) {
//     return text.substring(indexToStartReading);
// }
//
// function createBeginningOfSentenceIndexList() {
//     sentencePositionList = [];
//     sentencePositionList.push(0);
//     text = text.toLowerCase();
//     for (let i = 0; i < text.length; i++) {
//         if (text[i] === ".") {
//             sentencePositionList.push(i);
//         }
//     }
// }
//
// function findToWhichConsecutiveSentenceWordBelongsTo(indexOfWord) {
//     for (let i = sentencePositionList.length - 1; i >= 0; i--) {
//         if (sentencePositionList[i] <= indexOfWord) {
//             return i;
//         }
//     }
//     return sentencePositionList.length - 1;
// }
//
// export function findIndexOfBeginningOfCurrentSentence(indexOfWordBeingRead) {
//     const sentenceNo = findToWhichConsecutiveSentenceWordBelongsTo(indexOfWordBeingRead);
//     return sentencePositionList[sentenceNo];
// }
//
// export function findIndexOfBeginningOfPreviousSentence(indexOfWordBeingRead) {
//     let sentenceNo = findToWhichConsecutiveSentenceWordBelongsTo(indexOfWordBeingRead);
//     if (sentenceNo > 0) {
//         sentenceNo--;
//     }
//     return sentencePositionList[sentenceNo];
// }
//
// export function findIndexOfBeginningOfNextSentence(indexOfWordBeingRead) {
//     let sentenceNo = findToWhichConsecutiveSentenceWordBelongsTo(indexOfWordBeingRead);
//     if (sentenceNo < sentencePositionList.length - 1) {
//         sentenceNo++;
//     }
//     return sentencePositionList[sentenceNo];
// }
//
// function getCurrentAndPrevSentence(indexOfWordBeingRead) {
//     const beginning = findIndexOfBeginningOfPreviousSentence(indexOfWordBeingRead);
//     const end = findIndexOfBeginningOfNextSentence(indexOfWordBeingRead);
//     return text.substring(beginning, end);
// }
//
// export function getBoundariesOfPhraseInsideCurrentAndPrevSentence(indexOfWordBeingRead, phrase) {
//     const startOfPrevSentence = findIndexOfBeginningOfPreviousSentence(indexOfWordBeingRead);
//     const currentAndPrevSentence = getCurrentAndPrevSentence(indexOfWordBeingRead);
//     sentenceFuzzyMatchSet.createFuzzySetFromSentence(currentAndPrevSentence);
//     const fuzzyMatchedPhrase = sentenceFuzzyMatchSet.findInFuzzySet(phrase);
//     console.log("Phrase from fuzzy match: " + fuzzyMatchedPhrase);
//     const indexOfPhraseInsideSentences = currentAndPrevSentence.lastIndexOf(fuzzyMatchedPhrase);
//     if (indexOfPhraseInsideSentences === -1) {
//         throw "Phrase is not in current sentence";
//     }
//     const phraseLength = fuzzyMatchedPhrase.length;
//
//     const beginning = startOfPrevSentence + indexOfPhraseInsideSentences;
//     const end = beginning + phraseLength;
//
//     return { beginning, end };
// }
//
// export function phraseFollowedBySpace(index) {
//     return text[index] === " ";
// }
//
// export function phraseFollowedByDot(index) {
//     return text[index] === ".";
// }
//
// export function phraseFollowedByComma(index) {
//     return text[index] === ",";
// }