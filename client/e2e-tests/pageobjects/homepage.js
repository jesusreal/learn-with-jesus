let homepageCommands = {
};

module.exports = {
  commands: [homepageCommands],

  url() {
    return this.api.globals.appUrl;
  },

  sections: {
    addWord: {
      selector: '#add-word-forms',
      elements: {
        btnAddWord: {
          selector: '#add-word-btn'
        },
        inputSingular: {
          selector: 'input[name="singular"]'
        },
        inputPlural: {
          selector: 'input[name="plural"]'
        },
        inputTranslation: {
          selector: 'input[name="translation"]'
        }
      }
    },
    wordsList: {
      selector: '#words-list',
      elements: {
        wordCard: {
          selector: '.word-card'
        },
        last: {
          selector: '.word-card:last-of-type'
        },
        lastDelete: {
          selector: '.word-card:last-of-type .word-actions .delete-word-btn'
        },
        lastTranslation: {
          selector: '.word-card:last-of-type .word-keys .word-param:last-of-type span:last-of-type'
        }
      }
    },
    wordsGroups: {
      selector: '#words-groups',
      elements: {
        btnStep0: {
          selector: '#step0-words-btn'
        }
      }
    }
  }
};
