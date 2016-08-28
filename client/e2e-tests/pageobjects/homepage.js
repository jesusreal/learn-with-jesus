let homepageCommands = {
};

module.exports = {
  commands: [homepageCommands],

  url: function() {
    return this.api.globals.appUrl;
  },

  sections: {
    addWord: {
      selector: '#add-word-forms',
      elements: {
        btnAddWord: {
          selector: '#add-word-btn'
        }
      }
    }
  }
};
