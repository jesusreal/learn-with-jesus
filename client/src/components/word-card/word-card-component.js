import React from 'react';
import WordsSvc from '../../words-service';
import * as constants from './../../constants';

export default class WordCardComponent extends React.Component {
  constructor(props) {
    super(props);
    this.deleteWord = this.deleteWord.bind(this);
    this.getRowsToDisplay = this.getRowsToDisplay.bind(this);
    this.state = {
      wordToShow: {}
    }
  }

  deleteWord() {
    let word = this.props.word;
    const confirmed = window.confirm(`Are you sure you want to delete word "${word.title}"`)
    if(confirmed) {
      WordsSvc.remove(word._id).then((wordRemoved) => {
        console.info('word', wordRemoved._id, 'removed');
        this.props.onWordRemovedFn(wordRemoved._id);
      });
    }
  }

  getRowsToDisplay() {
    let word = Object.assign({}, this.props.word);
    Object.keys(constants.ADD_WORD_FORMS[word.type || 'other'])
      .filter((key) => !constants.WORD_FIELDS_NOT_TO_SHOW.includes(key))
      .forEach((key) => word[key] = word[key] || '');
    let result;
    switch(word.type) {
      case constants.WORD_TYPES.name:
        result = [
          `${word.genre} ${word.singular}, Pl.: ${word.plural}`,
          `${word.translation}`
        ];
        break;
      case(constants.WORD_TYPES.verb):
        result = [
          `${word.cases} ${word.infinitive}`, 
          `${word.translation}`,
          `${word.past}${word.perfect ? ', ' + word.perfect : ''}`,
        ];
        break;
      default:
        result = [
          `${word.word}`, 
          `${word.translation}`
        ];
        break;
    }
    return result.filter((r) => r);
  }
 
  // edit() {
  //   // New component, as content type (read to write) and buttons change?
  //   // Then, parent component should decide which component to render
  // }

  render() {
    return (
      <div className={'word-card ' + this.props.word.type}>
        <div className="word-keys">
          {
            this.getRowsToDisplay().map((value, index) =>
              <div className={'word-param '} key={index}>
                <span className="content">{value}</span>
              </div>
            )
          }
        </div>
        <div className="word-actions">
          <button type="button" className="delete-word-btn" onClick={this.deleteWord}>X</button>
        </div>
      </div>
    );
  }
}
// <button type="button" className="edit-word-btn disabled" onClick={this.edit}>Edit</button>
// <button disabled type="button" className="to-next-list-btn disabled" onClick={this.moveWord}>Next</button>
// <button disabled type="button" className="to-prev-list-btn disabled" onClick={this.moveWord}>Prev</button>

WordCardComponent.propTypes = {
  onWordRemovedFn: React.PropTypes.func,
  word: React.PropTypes.object
};

