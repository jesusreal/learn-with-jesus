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
      text:'Genre',
      inputType:'select'
    },
    plural: {
      text:'Plural',
      inputType:'text',
      html: null
    },
    translation: {
      text:'Translation',
      inputType:'text',
      html: null
    },
  },
  verb: {
    infinitive: {
      text: 'Infinitive',
      inputType:'text',
      html: null
    },
    past: {
      text: 'Past',
      inputType:'text',
      html: null
    },
    perfect: {
      text: 'Perfect',
      inputType:'text',
      html: null
    },
    translation: {
      text:'Translation',
      inputType:'text',
      html: null
    },
  },
  other: {
    word: {
      text: 'Word',
      inputType:'text',
      html: null
    },
    translation: {
      text:'Translation',
      inputType:'text',
      html: null
    },
  }
};
