import React from 'react';
import WordsSvc from '../../words-service';
import * as constants from './../../constants';

export default class WordCardComponent extends React.Component {
  constructor(props) {
    super(props);
    this.deleteWord = this.deleteWord.bind(this);
    // this.updateWord = this.updateWord.bind(this);
    this.moveWordToNextList = this.moveWordToNextList.bind(this);
    this.moveWordToPreviousList = this.moveWordToPreviousList.bind(this);
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

  // updateWord() {
  //   // New component, as content type (read to write) and buttons change?
  //   // Then, parent component should decide which component to render
  //   let word = this.props.word;
  //   WordsSvc.update(word._id).then((wordUpdated) => {
  //     console.info('word', wordUpdated._id, 'updated');
  //   });
  // }

  moveWordToNextList() {
    let payload = {'_id': this.props.word._id, 'step': this.props.word.step + 1};
    WordsSvc.update(payload).then((wordUpdated) => {
      console.info('word', wordUpdated._id, 'moved to', payload.step, 'list');
    });    
  }

  moveWordToPreviousList() {
    let payload = { '_id': this.props.word._id, 'step': this.props.word.step - 1 };
    WordsSvc.update(payload).then((wordUpdated) => {
      console.info('word', wordUpdated._id, 'moved to', payload.step, 'list');
    });    
  }

  getRowsToDisplay() {
    let word = Object.assign({}, this.props.word);
    if(!word.type) { return []; }
    let rows;
    constants.WORDS_METADATA.find((w) => w.type === word.type).fields
      .filter((field) => !constants.WORD_FIELDS_NOT_TO_SHOW.includes(field.id))
      .forEach((field) => { word[field.id] = word[field.id] || '' });
    switch(word.type) {
      case constants.WORD_TYPES.name:
        rows = [
          `${word.genre} ${word.singular}, Pl.: ${word.plural}`,
          `${word.translation}`
        ];
        break;
      case(constants.WORD_TYPES.verb):
        rows = [
          `${word.cases} ${word.infinitive}`, 
          `${word.translation}`,
          `${word.past}${word.perfect ? ', ' + word.perfect : ''}`,
        ];
        break;
      default:
        rows = [
          `${word.word}`, 
          `${word.translation}`
        ];
        break;
    }
    return rows.filter((r) => r);
  }
 
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
          <button type="button" className="to-next-list-btn" onClick={this.moveWordToNextList}>Next</button>
          <button type="button" className="to-prev-list-btn" onClick={this.moveWordToPreviousList}>Prev</button>
        </div>
      </div>
    );
  }
}
//  <button type="button" className="update-word-btn" onClick={this.updateWord}>Edit</button>

WordCardComponent.propTypes = {
  onWordRemovedFn: React.PropTypes.func,
  word: React.PropTypes.object
};

