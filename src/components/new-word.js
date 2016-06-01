import React from 'react';
import newWords from './../new-words';

export default class NewWordComponent extends React.Component {
  constructor() {
    super();
    this.forms = {
      name: [
        ['singular', 'Singular'],
        ['plural', 'Plural'],
        ['translation', 'Translation']
      ],
      verb: [
        ['infinitive', 'Infinitive'],
        ['past', 'Präteritum'],
        ['perfect', 'Perfekt'],
        ['translation', 'Translation']
      ],
      other: [
        ['other-word', 'Wort'],
        ['translation', 'Translation']
      ]
    };

    this.state = {
      wordType: 'name'
    };
    Object.keys(this.forms).forEach(function(key) {
      this.state[key] = {};
    }, this);

    this.addWord = this.addWord.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  addWord() {
    const wordType = this.state.wordType;
    const wordData = Object.assign(
      {wordType: wordType},
      this.state[wordType]
    );
    console.log('Will add word', wordData);
    newWords.add(wordData);
  }

  getFormData() {
    const wordType = this.state.wordType;
    return this.forms[wordType] || null;
  }

  onSelectionChange(event) {
    this.setState({wordType: event.target.value});
  }

  updateField(event) {
    const wordType = this.state.wordType;
    var newState = Object.assign(
      {},
      this.state[wordType],
      {[event.target.name]: event.target.value}
    );
    this.setState({[wordType]: newState});
  }

  render() {
    const formData = this.getFormData();

    return (
      <div id="add-word-forms" className="block">
        <form name={this.props.wordType + '-form'}>
          <div id="add-word-menu" className="block">
            <h6>Fügt ein neues Wort hinzu: </h6>
            <select onChange={this.onSelectionChange} autofocus>
              <option value="name">Name</option>
              <option value="verb">Verb</option>
              <option value="other">Other</option>
            </select>
          </div>
          {formData.map((formElem, i) =>
            <div key={'word-tipe-form-elem' + i}>

              <label for={formElem[0]}>
                {formElem[1]}
              </label>
              <input name={formElem[0]} onInput={this.updateField}type="text"/>
            </div>
          )}
          <input type="button" onClick={this.addWord} value="Add word"/>
        </form>
      </div>
    );
  }
}
