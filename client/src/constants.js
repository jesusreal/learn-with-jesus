export const SERVER_URL = window.location.host.includes('lwj') ?
  // 'http://192.168.64.134:30992'; // Works without ingress for BE and BE service NodePort
  'http://api.lwj.com' : // Works with ingress for BE and BE service ClusterIP
  'http://127.0.0.1:3333'
export const WORD_FIELDS_NOT_TO_SHOW = ['_id', 'type', 'title'];
export const WORD_TYPES = {
  name: 'name',
  verb: 'verb',
  other: 'other',
};
export const WORDS_LISTS_METADATA = [
  {text: 'Daily', apiStepId: 0},
  {text: 'Weekly', apiStepId: 1},
  {text: 'Monthly', apiStepId: 2},
];
export const WORDS_METADATA = [
  // Field name and text. Think about translations
  {
    type: WORD_TYPES.name,
    fields: [
      {
        id: 'singular',
        text:'Singular',
        inputType:'text',
        html: null
      },
      {
        id: 'genre',
        text:'Genus',
        inputType:'select'
      },
      {
        id: 'plural',
        text:'Plural',
        inputType:'text',
        html: null
      },
      {
        id: 'translation',
        text:'Übersetzung',
        inputType:'text',
        html: null
      }
    ]
  },
  {
    type: WORD_TYPES.verb,
    fields: [
      {
        id: 'infinitive',
        text: 'Infinitiv',
        inputType:'text',
        html: null
      },
      {
        id: 'cases',
        text: 'Fälle',
        inputType:'text',
        html: null
      },
      {
        id: 'past',
        text: 'Präteritum (3. Pers. Sg)',
        inputType:'text',
        html: null
      },
      {
        id: 'perfect',
        text: 'Partizip Perfect',
        inputType:'text',
        html: null
      },
      {
        id: 'translation',
        text:'Übersetzung',
        inputType:'text',
        html: null
      }
    ]
  },
  {
    type: WORD_TYPES.other,
    fields: [
      {
        id: 'word',
        text: 'Wort',
        inputType:'text',
        html: null
      },
      {
        id: 'translation',
        text:'Übersetzung',
        inputType:'text',
        html: null
      }
    ]
  }
];
