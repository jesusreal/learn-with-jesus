import React from 'react';

export const SERVER_URL = 'http://127.0.0.1:3333';
export const WORD_FIELDS_NOT_TO_SHOW = ['_id', 'type', 'title'];
export const WORDS_LISTS_BUTTONS = [
  {text: 'Daily', apiStepId: 0},
  {text: 'Weekly', apiStepId: 1},
  {text: 'Monthly', apiStepId: 2},
];
export const ADD_WORD_FORMS = {
  // Field name and text. Think about translations
  name: {
    singular: {
      text:'Singular',
      inputType:'text',
      html: null
    },
    genre: {
      text:'Genus',
      inputType:'select'
    },
    plural: {
      text:'Plural',
      inputType:'text',
      html: null
    },
    translation: {
      text:'Übersetzung',
      inputType:'text',
      html: null
    },
  },
  verb: {
    infinitive: {
      text: 'Infinitiv',
      inputType:'text',
      html: null
    },
    cases: {
      text: 'Fälle',
      inputType:'text',
      html: null
    },
    past: {
      text: 'Präteritum (3. Pers. Sg)',
      inputType:'text',
      html: null
    },
    perfect: {
      text: 'Partizip Perfect',
      inputType:'text',
      html: null
    },
    translation: {
      text:'Übersetzung',
      inputType:'text',
      html: null
    },
  },
  other: {
    word: {
      text: 'Wort',
      inputType:'text',
      html: null
    },
    translation: {
      text:'Übersetzung',
      inputType:'text',
      html: null
    },
  }
};
