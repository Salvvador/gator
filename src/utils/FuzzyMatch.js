const FuzzySet = require('fuzzyset.js');

export class FuzzyMatch {
    minScore = 0.6;
    fuzzySet;

    constructor(minScore) {
        this.minScore = minScore;
        this.fuzzySet = FuzzySet([]);
    }

    createFuzzySetFromSentence(sentence) {
        const wordsArray = sentence.split(' ');
        for (let i = 0; i < wordsArray.length; i++) {
            for (let j = 0; j <= i; j++) {
                this.fuzzySet.add(wordsArray.slice(j, i + 1).join(' '));
            }
        }
    }

    registerCommandInFuzzySet(command) {
        this.fuzzySet.add(command);
    }

    findInFuzzySet(phraseToMatch) {
        const foundMatch = this.fuzzySet.get(phraseToMatch, undefined, this.minScore);
        if (foundMatch) {
            return foundMatch[0][1];
        }
        return undefined;
    }

    getFuzzySet() {
        return this.fuzzySet.values()
    }
}
