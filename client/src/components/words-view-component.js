import React from 'react';
import jQuery from 'jquery';
import * as constants from './../constants';

import NewWordComponent from './new-word';
import WordCardComponent from './word-card-component';


export default class WordsViewComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      words: [],
      listVisible: false,
      lastListDisplayed: null
    };

    this.showNewWords = this.showNewWords.bind(this);
    this.addOrRemoveWord = this.addOrRemoveWord.bind(this);
  }

  addOrRemoveWord(targetWord, action) {
    // TODO: daily, weekly and monthly should be in a constants module
    // TODO: Also actions for words "add" and "remove"
    if (action === 'add' && this.state.listVisible && this.state.lastListDisplayed === 'daily') {
      let newWords = this.state.words.concat(targetWord);
      this.setState({words: newWords});
    }

    if (action === 'remove') {
      let currentWords = this.state.words;
      let newWords = currentWords.filter( (word) => word.id !== targetWord.id );
      this.setState({words: newWords});
    }
  }

  showNewWords(event) {
    let wordsList = event.target.id.split('-')[0];

    if (!this.state.listVisible || this.state.lastListDisplayed !== wordsList) {
      let requestUrl = `${constants.SERVER_URL}/words`;
      this.setState({words: []});
      jQuery.get(requestUrl, {list: wordsList}, (data) => {        this.setState({words: JSON.parse(data)});
      });
    }

    if (this.state.lastListDisplayed !== wordsList) {
      this.setState({listVisible: true});
      this.setState({lastListDisplayed: wordsList});
    } else {
      this.setState({listVisible: !this.state.listVisible});
    }
  }


  render() {
    return (
      <div>
        <div id="words-groups" className="block">
          <button type="button" id="daily-words-btn" onClick={this.showNewWords}>Daily</button>
          <button type="button" id="weekly-words-btn" onClick={this.showNewWords}>Weekly</button>
          <button type="button" id="monthly-words-btn" onClick={this.showNewWords}>Monthly</button>
        </div>
        <div id="words-list" className={'block ' + ((this.state.listVisible) ? 'visible' : '')}>
          {this.state.words.map((word, index) =>
              <WordCardComponent key={index} word={word} addOrRemoveWord={this.addOrRemoveWord} listKey={this.state.lastListDisplayed}/>
          )}
        </div>
        <NewWordComponent addOrRemoveWord={this.addOrRemoveWord}/>
      </div>
    );
  }
}
