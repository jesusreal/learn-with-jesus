let words = [];

export default {
  add(word) {
    // localStorage.words = JSON.stringify(this.get().push(word));
    words.push(word);
  },

  getAll() {
    // return JSON.parse(localStorage.words);
    console.log('this.words', words);
    return words;
  }
};

