const assert = require('assert');

import NewWord from './new-word-component';

describe( 'test setup ', () => {
  it('works', () => assert(true));
});

describe('getFormData(), ', function() {
  it('existent form data for word type', () => {
    const type = 'verb';
    const newWord = new NewWord();
    newWord.state.type = type;
    const actual = newWord.getFormData();
    const expected = newWord.forms[type];
    assert.strictEqual(actual, expected, 'form data match');
  });

  it('non-existent form data for word type', () => {
    const type = 'no-match';
    const newWord = new NewWord();
    newWord.state.type = type;
    const actual = newWord.getFormData(type);
    const expected = null;
    assert.strictEqual(actual, expected, 'form data no match');
  });
});
