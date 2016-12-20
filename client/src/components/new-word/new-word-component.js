import React from 'react';
import jQuery from 'jquery';
// import newWords from './../new-words';
import * as constants from './../../constants';

export default class NewWordComponent extends React.Component {
  constructor(props) {
    super(props);
    this.forms = {
      // Field name and text. Think about translations
      name: [
        ['singular', 'Singular', 'text'],
        ['genre', 'Genre', 'select' ,
            <select><option value="der">Der</option><option value="die">Die</option> <option value="das">Das</option></select>
        ],
        ['plural', 'Plural', 'text'],
        ['translation', 'Translation', 'text']
      ],
      verb: [
        ['infinitive', 'Infinitive', 'text'],
        ['past', 'Past', 'text'],
        ['perfect', 'Perfect', 'text'],
        ['translation', 'Translation', 'text']
      ],
      other: [
        ['word', 'Word', 'text'],
        ['translation', 'Translation', 'text']
      ]
    };

    this.state = {
      type: 'name'
    };

    this.addWord = this.addWord.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  componentDidMount() {
    Object.keys(this.forms).forEach((type) => {
      this.setState({[type]: {type}});
    });
  }

  addWord(event) {
    event.preventDefault();
    const wordData = this.state[this.state.type];
    jQuery.post(`${constants.SERVER_URL}/word`, JSON.stringify(wordData), (word) => {
      word = JSON.parse(word);
      console.info('word', word.id, 'added');
      this.props.addOrRemoveWordFn(word, 'add');
    });
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
            <h6>Add a new word:</h6>
            <select autoFocus="autofocus" onChange={this.onSelectionChange}>
              <option value="name">Name</option>
              <option value="verb">Verb</option>
              <option value="other">Other</option>
            </select>
          </div>
          {formData.map((formElem, i) =>
            <div className="word-param-input" key={'word-type-form-elem' + i}>
              <label htmlFor={formElem[0]}>
                {formElem[1]}
              </label>
              {(() => {
                switch (formElem[2]) {
                  case "select":
                    return formElem[3];
                    break;
                  default:
                    return <input name={formElem[0]} onChange={this.updateField} type={formElem[2]}/>
;
                }
              })()}
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
  addOrRemoveWordFn: React.PropTypes.func,
  type: React.PropTypes.string
};
