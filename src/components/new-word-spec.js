const assert = require('assert');

import NewWord from './new-word';

describe( 'test setup ', () => {
  it('works', () => assert(true));
});

describe('getFormData(), ', function() {
  it('existent form data for word type', () => {
    const wordType = 'verb';
    const newWord = new NewWord();
    newWord.state.wordType = wordType;
    const actual = newWord.getFormData();
    const expected = newWord.forms[wordType];
    assert.strictEqual(actual, expected, 'form data match');
  });

  it('non-existent form data for word type', () => {
    const wordType = 'no-match';
    const newWord = new NewWord();
    newWord.state.wordType = wordType;
    const actual = newWord.getFormData(wordType);
    const expected = null;
    assert.strictEqual(actual, expected, 'form data no match');
  });
});
