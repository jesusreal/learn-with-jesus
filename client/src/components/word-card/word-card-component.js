import React from 'react';
import WordsSvc from '../../words-service';
import * as constants from './../../constants';

export default class WordCardComponent extends React.Component {
  constructor(props) {
    super(props);
    this.deleteWord = this.deleteWord.bind(this);
    this.state = {
      wordToShow: {}
    }
  }

  deleteWord() {
    let word = this.props.word;
    const confirmed = window.confirm(`Are you sure you want to delete word "${word.title}"`)
    if(confirmed) {
      WordsSvc.remove(word.id).then(() => {
        console.info('word', word.id, 'removed');
        this.props.onWordRemovedFn(word);
      });
    }
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
            Object.keys(this.props.word)
              .filter((key) => !constants.WORD_FIELDS_NOT_TO_SHOW.includes(key))
              .map((key) =>
                <div className={'word-param ' + key} key={key}>
                  <span className="key">{key}:&nbsp;</span>
                  <span className="content">{this.props.word[key]}</span>
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

