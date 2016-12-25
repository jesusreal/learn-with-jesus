import React from 'react';
import WordsSvc from '../../words-service';
import {ADD_WORD_FORMS} from './../../constants';
import $ from 'jquery';

export default class NewWordComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedWordType: 'name',
      formsInput: Object.keys(ADD_WORD_FORMS)
        .reduce((acc, wordType) => {
          acc[wordType] = this.getResetWordObj(wordType);
          return acc;
        }, {})
    };

    this.onWordTypeChange = this.onWordTypeChange.bind(this);
    this.updateField = this.updateField.bind(this);
    this.addWord = this.addWord.bind(this);
  }

  getResetWordObj(type) {
    return Object.assign(
      {type},
      Object.keys(ADD_WORD_FORMS[type]).reduce((acc, param) => {
        acc[param] = (param === 'genre') ? 'der' : null;
        return acc
      }, {})
    )
  }

  updateWordObj(type, newObj){
    this.setState({
      formsInput: Object.assign(
        {},
        this.state.formsInput,
        {[type]: newObj}
      )
    });
  }

  onWordTypeChange(event) {
    this.setState({selectedWordType: event.target.value});
  }

  addWord(event) {
    event.preventDefault();
    const wordData = this.state.formsInput[this.state.selectedWordType];
    WordsSvc.add(wordData).then((word) => {
      console.info('word', word.id, 'added');
      this.props.onWordAddedFn(word);
    });
    this.updateWordObj(
      wordData.type,
      this.getResetWordObj(wordData.type)
    );
    $('select[name="genre"]').prop('selectedIndex', 0);
  }

  updateField({target}) {
    const wordData = this.state.formsInput[this.state.selectedWordType];
    this.updateWordObj(
      wordData.type,
      Object.assign({}, wordData, {[target.name]: target.value})
    );
  }


  render() {
    const formData = ADD_WORD_FORMS[this.state.selectedWordType];
    const formInput = this.state.formsInput[this.state.selectedWordType];

    return (
      <div id="add-word-forms" className="block">
        <form name={this.state.selectedWordType + '-form'} onSubmit={this.addWord}>
          <div id="add-word-menu" className="block">
            <h6>Add a new word:</h6>
            <select autoFocus="autofocus" onChange={this.onWordTypeChange}>
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
                param === 'genre' ?
                  <select required name={param} onChange={this.updateField}>
                    <option value="der">Der</option>
                    <option value="die">Die</option>
                    <option value="das">Das</option>
                  </select>
                :
                  <input required name={param} value={formInput[param] || ''} onChange={this.updateField} type={formData[param].inputType}/>
              }
            </div>
          )}
          <button type="submit" id="add-word-btn" autoFocus="autofocus">
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
