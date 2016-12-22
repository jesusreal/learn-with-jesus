import React from 'react';
import jQuery from 'jquery';
// import newWords from './../new-words';
import {SERVER_URL, ADD_WORD_FORMS} from './../../constants';

export default class NewWordComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wordsForms = ADD_WORD_FORMS;

    this.state = {
      selectedWordType: 'name',
      formsInput: Object.keys(this.wordsForms)
        .reduce((acc, wordType) => {
          acc[wordType] = Object.assign(
            {type: wordType},
            Object.keys(this.wordsForms[wordType]).reduce((acc, param) => { acc[param] = null; return acc }, {})
          )
          return acc;
        }, {})
    };

    this.addWord = this.addWord.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  addWord(event) {
    event.preventDefault();
    const wordData = this.state.formsInput[this.state.selectedWordType];
    jQuery.post(`${SERVER_URL}/word`, JSON.stringify(wordData), (word) => {
      word = JSON.parse(word);
      console.info('word', word.id, 'added');
      this.props.onWordAddedFn(word);
    });
    // ToDo: reset word
  }

  onSelectionChange(event) {
    this.setState({selectedWordType: event.target.value});
  }

  updateField(event) {
    const wordType = this.state.selectedWordType;
    var newState = Object.assign(
      this.state.formsInput[wordType],
      {[event.target.name]: event.target.value}
    );
    this.setState({formsInput: Object.assign(
      this.state.formsInput,
      {[wordType]: this.state.formsInput[wordType]}
    )});
  }

  render() {
    const formData = this.wordsForms[this.state.selectedWordType];
    const formInput = this.state.formsInput[this.state.selectedWordType];

    return (
      <div id="add-word-forms" className="block">
        <form name={this.state.selectedWordType + '-form'}>
          <div id="add-word-menu" className="block">
            <h6>Add a new word:</h6>
            <select autoFocus="autofocus" onChange={this.onSelectionChange}>
              <option value="name">Name</option>
              <option value="verb">Verb</option>
              <option value="other">Other</option>
            </select>
          </div>
          {Object.keys(formData).map((param, i) =>
            <div className="word-param-input" key={'word-type-form-elem' + i}>
              <label htmlFor={param}>
                {formData[param].text}
              </label>
              {
                formData[param].html ||
                <input required="required" name={param} value={formInput[param] || ''} onChange={this.updateField} type={formData[param].inputType}/>
              }
            </div>
          )}
          <button type="submit" id="add-word-btn" onClick={this.addWord} autoFocus="autofocus">
            Add word
          </button>
        </form>
      </div>
    );
  }
}

NewWordComponent.propTypes = {
  onWordAddedFn: React.PropTypes.func
};
