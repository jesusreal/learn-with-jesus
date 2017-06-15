import React from 'react';
import WordsSvc from '../../words-service';
import {WORDS_METADATA, WORD_TYPES} from './../../constants';
import $ from 'jquery';

export default class NewWordComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedWordType: 'name',
      formsInput: WORDS_METADATA
        .reduce((acc, wordMetadata) => {
          acc[wordMetadata.type] = this.getResetWordObj(wordMetadata.type);
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
      WORDS_METADATA.find((obj) => obj.type === type).fields
        .reduce((acc, field) => {
          acc[field.id] = (field.id === 'genre') ? 'der' : null;
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
      console.info('word', word.title, 'added');
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
    const formData = WORDS_METADATA.find((obj) => obj.type === this.state.selectedWordType).fields;
    const formInput = this.state.formsInput[this.state.selectedWordType];

    return (
      <div id="add-word-forms" className="block">
        <form name={this.state.selectedWordType + '-form'} onSubmit={this.addWord}>
          <div id="add-word-menu" className="block">
            <h6>Add a new word:</h6>
            <select onChange={this.onWordTypeChange}>
              {
                Object.keys(WORD_TYPES).map((type) =>
                  <option value={WORD_TYPES[type]} key={WORD_TYPES[type]}>
                    {WORD_TYPES[type][0].toUpperCase() + WORD_TYPES[type].substr(1)}
                  </option>
                )
              }
            </select>
          </div>
          {formData.map((param, i) =>
            <div className="word-param-input" key={'word-type-form-elem' + i}>
              <label htmlFor={param.id}>
                {param.text}
              </label>
              {
                param.id === 'genre' ?
                  <select required name={param.id} onChange={this.updateField}>
                    <option value="der">Der</option>
                    <option value="die">Die</option>
                    <option value="das">Das</option>
                  </select>
                :
                <input required name={param.id} value={formInput[param.id] || ''} 
                    onChange={this.updateField} onBlur={this.updateField} type={param.inputType}/>
              }
            </div>
          )}
          <button type="submit" id="add-word-btn">
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
