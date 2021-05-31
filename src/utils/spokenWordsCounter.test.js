import {
    getIndexOfLastWordSpoken,
    restartIndexOfLastWordSpoken,
    setIndexOfLastWordSpoken,
    updateIndexOfLastWordSpoken
} from "./spokenWordsCounter";

describe('Test spoken word counter', function () {
    it('should properly set index of last word spoken', function () {
        const index = 10;
        const expectedIndex = 10;
        setIndexOfLastWordSpoken(index);
        expect(getIndexOfLastWordSpoken()).toEqual(expectedIndex);
    });

    it('should properly restart index of last word spoken', function () {
        const index = 10;
        const expectedIndex = 0;
        setIndexOfLastWordSpoken(index);
        restartIndexOfLastWordSpoken();
        expect(getIndexOfLastWordSpoken()).toEqual(expectedIndex);
    });

    it('should properly update index of last word spoken', function () {
        const index = 10;
        const updateIndex = 10;
        const expectedIndex = 20;
        setIndexOfLastWordSpoken(index);
        updateIndexOfLastWordSpoken(updateIndex);
        expect(getIndexOfLastWordSpoken()).toEqual(expectedIndex);
    });
});
