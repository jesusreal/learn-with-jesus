import React from 'react';
import jQuery from 'jquery';
import * as constants from './../constants';

export default class WordCardComponent extends React.Component {
  constructor(props) {
    super(props);
    this.deleteWord = this.deleteWord.bind(this);
  }

  deleteWord() {
    let word = this.props.word;
    let listKey = this.props.listKey;
    let requestUrl = `${constants.SERVER_URL}/word`;
    jQuery.post(requestUrl, JSON.stringify({wordId: word.id, listKey, action: 'delete'}), () => {
      console.info('word', word.id, 'removed');
      this.props.addOrRemoveWord(word, 'remove');
    });
  }

  render() {
    return (
      <div className={'word-card ' + this.props.word.type}>
        <div>
          { Object.keys(this.props.word).slice(1).map((key) =>
            <div className="word-param" key={key}>
              <span className="word-key">{key}:&nbsp;</span>
              <span>{this.props.word[key]}</span>
            </div>
          )}
        </div>
        <button type="button" className="delete-word-btn" onClick={this.deleteWord}>X</button>
      </div>
    );
  }
}

WordCardComponent.propTypes = {
  addOrRemoveWord: React.PropTypes.func,
  word: React.PropTypes.object,
  listKey: React.PropTypes.string
};

