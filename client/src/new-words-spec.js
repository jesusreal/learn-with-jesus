const assert = require('assert');

import NewWords from './new-words';

describe('add(), ', function() {
  it('adds a word to persistent data', () => {
    var word = {
      look: 'at medasf',
      'i look': 'like a word'
    };
    NewWords.add(word);
    assert.deepStrictEqual(NewWords.getAll(), [word], 'new word added');
  });
})







