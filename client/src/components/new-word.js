import React from 'react';
import jQuery from 'jquery';
// import newWords from './../new-words';
import * as constants from './../constants';

export default class NewWordComponent extends React.Component {
  constructor() {
    super();
    this.forms = {
      // Field name and text. Think about translations
      name: [
        ['singular', 'Singular'],
        ['plural', 'Plural'],
        ['translation', 'Translation']
      ],
      verb: [
        ['infinitive', 'Infinitive'],
        ['past', 'Past'],
        ['perfect', 'Perfect'],
        ['translation', 'Translation']
      ],
      other: [
        ['word', 'Word'],
        ['translation', 'Translation']
      ]
    };

    this.state = {
      type: 'name'
    };
    Object.keys(this.forms).forEach(function(key) {
      this.state[key] = {};
    }, this);

    this.addWord = this.addWord.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  addWord(event) {
    event.preventDefault();
    const type = this.state.type;
    const wordData = Object.assign(
      {type},
      this.state[type]
    );
    jQuery.post(`${constants.SERVER_URL}/word`, JSON.stringify(wordData));
  }

  getFormData() {
    const type = this.state.type;
    return this.forms[type] || null;
  }

  onSelectionChange(event) {
    this.setState({type: event.target.value});
  }

  updateField(event) {
    const type = this.state.type;
    var newState = Object.assign(
      {},
      this.state[type],
      {[event.target.name]: event.target.value}
    );
    this.setState({[type]: newState});
  }

  render() {
    const formData = this.getFormData();

    return (
      <div id="add-word-forms" className="block">
        <form name={this.props.type + '-form'}>
          <div id="add-word-menu" className="block">
            <h6>Add a new word: </h6>
            <select onChange={this.onSelectionChange} autofocus>
              <option value="name">Name</option>
              <option value="verb">Verb</option>
              <option value="other">Other</option>
            </select>
          </div>
          {formData.map((formElem, i) =>
            <div className="word-param-input" key={'word-tipe-form-elem' + i}>

              <label for={formElem[0]}>
                {formElem[1]}
              </label>
              <input name={formElem[0]} onChange={this.updateField} type="text" value={formElem[2]}/>
            </div>
          )}
          <button type="submit" id="add-word-btn" onClick={this.addWord} autofocus="autofocus">
            Add word
          </button>
        </form>
      </div>
    );
  }
}