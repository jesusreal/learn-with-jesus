import React from 'react';
import jQuery from 'jquery';
import * as constants from './../constants';

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
  }


  showNewWords(event) {
    let wordsList = event.target.id.split('-')[0];

    if (!this.state.listVisible || this.state.lastListDisplayed !== wordsList) {
      let requestUrl = `${constants.SERVER_URL}/words`;
      this.setState({words: []});
      jQuery.get(requestUrl, {list: wordsList}, (data) => {
        data = data.split(constants.SEPARATOR);
        data = data.map( (line) => JSON.parse(line) );
        this.setState({words: data});
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
              <WordCardComponent key={index} word={word}/>
          )}
        </div>
      </div>
    );
  }
}
