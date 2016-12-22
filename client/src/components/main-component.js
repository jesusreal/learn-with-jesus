import React from 'react';
import WordsSvc from '../words-service';
import NewWordComponent from './new-word/new-word-component';
import WordCardComponent from './word-card/word-card-component'


export default class MainComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      words: [],
      listVisible: false,
      lastListDisplayed: null
    };

    this.onListBtnClicked = this.onListBtnClicked.bind(this);
    this.onWordAdded = this.onWordAdded.bind(this);
    this.onWordRemoved = this.onWordRemoved.bind(this);
  }

  onWordAdded(word) {
    if(this.state.listVisible && this.state.lastListDisplayed === 0) {
      const updatedWords = this.state.words.concat(word);
      this.setState({words: updatedWords});
    }
  }

  onWordRemoved(word) {
    const updatedWords = this.state.words.filter((w) => w.id !== word.id);
    this.setState({words: updatedWords});
  }

  onListBtnClicked(event) {
    const wordsList = Number(
      event.target.id
        .split('-')[0]
        .substr(-1)
    );

    if(!this.state.listVisible || this.state.lastListDisplayed !== wordsList) {
      WordsSvc.getAllForList(wordsList)
        .then((words) => { this.setState({words}) })
    }

    if(this.state.lastListDisplayed !== wordsList) {
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
          <button type="button" id="step0-words-btn" onClick={this.onListBtnClicked}>Daily</button>
          <button type="button" id="step1-words-btn" onClick={this.onListBtnClicked}>Weekly</button>
          <button type="button" id="step2-words-btn" onClick={this.onListBtnClicked}>Monthly</button>
        </div>
        <div id="words-list" className={'block ' + ((this.state.listVisible) ? 'visible' : '')}>
          {this.state.words.map((word, index) =>
              <WordCardComponent key={index} word={word} onWordRemovedFn={this.onWordRemoved}/>
          )}
        </div>
        <NewWordComponent onWordAddedFn={this.onWordAdded}/>
      </div>
    );
  }
}
