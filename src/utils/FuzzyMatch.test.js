const {FuzzyMatch} = require("./FuzzyMatch");

const FUZZY_MIN_SCORE = 0.6;
const sentence = "Some random test sentence";
const fuzzySetFromSentence = [ "some", "some random", "random", "some random test", "random test", "test",
    "some random test sentence", "random test sentence", "test sentence", "sentence" ];

describe('Test fuzzy match', function () {
    it('should convert sentence into Fuzzy Set', function () {
        const fuzzyMatch = new FuzzyMatch(FUZZY_MIN_SCORE);
        fuzzyMatch.createFuzzySetFromSentence(sentence);
        expect(fuzzyMatch.getFuzzySet()).toEqual(fuzzySetFromSentence);
    });

    it('should match similar words', function() {
        const stringToMatch = "same";
        const targetString = "some";
        const fuzzyMatch = new FuzzyMatch(FUZZY_MIN_SCORE);
        fuzzyMatch.createFuzzySetFromSentence(sentence);
        const foundMatch = fuzzyMatch.findInFuzzySet(stringToMatch);
        expect(foundMatch).toEqual(targetString);
    });

    it('should match similar phrases', function() {
        const stringToMatch = "same tandom";
        const targetString = "some random";
        const fuzzyMatch = new FuzzyMatch(FUZZY_MIN_SCORE);
        fuzzyMatch.createFuzzySetFromSentence(sentence);
        const foundMatch = fuzzyMatch.findInFuzzySet(stringToMatch);
        expect(foundMatch).toEqual(targetString);
    });

    it('should return undefined if words are not matching', function() {
        const stringToMatch = "rabbit";
        const fuzzyMatch = new FuzzyMatch(FUZZY_MIN_SCORE);
        fuzzyMatch.createFuzzySetFromSentence(sentence);
        const foundMatch = fuzzyMatch.findInFuzzySet(stringToMatch);
        expect(foundMatch).toEqual(undefined);
    });

    it('should return undefined if phrases are not matching', function() {
        const stringToMatch = "other senten";
        const fuzzyMatch = new FuzzyMatch(FUZZY_MIN_SCORE);
        fuzzyMatch.createFuzzySetFromSentence(sentence);
        const foundMatch = fuzzyMatch.findInFuzzySet(stringToMatch);
        expect(foundMatch).toEqual(undefined);
    });
});
