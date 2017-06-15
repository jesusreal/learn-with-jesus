import React from 'react';
import * as constants from './../../constants';
import WordCardComponent from './../word-card/word-card-component'

export default class GameComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      totalWords: 10,
      index: 0,
      step: 0,
      playing: false,
      gameWords: [],
      currentWord: {}
    };

    this.startGame = this.startGame.bind(this);
    this.updateField = this.updateField.bind(this);
    this.onCardClicked = this.onCardClicked.bind(this);
  }

  updateField({target}) {
    const totalWords = (Number(target.value) <= this.props.words.length) ?
      target.value :
      this.props.words.length;
    this.setState({totalWords});
  }

  startGame() {
    let gameWords = [];
    while(gameWords.length !== Number(this.state.totalWords)) {
      const candidate = this.props.words[Math.floor(Math.random() * this.props.words.length)];
      if(!gameWords.includes(candidate)) {
        gameWords.push(candidate);
      }
    }
    this.setState({
      index: 0,
      step: 0,
      currentWord: gameWords[0],
      playing: true,
      gameWords
    });
  }

  onCardClicked() {
    if(this.state.step === 0) {
      this.setState({step: 1});
    } else {
      if(this.state.index === this.state.gameWords.length - 1) {
        this.setState({playing: false});
        return;
      }
      this.setState({
        index: this.state.index + 1,
        step: 0,
        currentWord: this.state.gameWords[this.state.index + 1]
      });
    }
  }

  render() {
    return (
      <div>
        <div id="game-selection" className={'block ' + ((this.state.playing) ? 'hide' : '')}>
          <button type="button" id="start-game" onClick={this.startGame}>
            Play
          </button>
          <input type="text" required name="totalWords" value={this.state.totalWords} onChange={this.updateField} autoFocus="autofocus"/>
          <span>Words</span>
        </div>

        <div id="words-list" className={'block game ' + ((this.state.playing) ? '' : 'hide')}>
          <div id="game-progress" className={'block word-card ' + this.state.currentWord.type + ((this.state.playing) ? '' : 'hide')}>
            <p>
              <span className="index">{this.state.index + 1}</span>
              <span>/</span>
              <span>{this.state.gameWords.length}</span>
            </p>
          </div>
          <div className={'word-card word-title ' + this.state.currentWord.type + ((this.state.step === 0) ? '' : ' hide')}>
            <div className="word-keys" onClick={this.onCardClicked}>
              <div className={'word-param ' + this.state.currentWord.title}>
                <span className="content">{this.state.currentWord.title}</span>
              </div>
            </div>
          </div>
          <div className={(this.state.step === 1) ? '' : ' hide'} onClick={this.onCardClicked}>
            <WordCardComponent word={this.state.currentWord}/>
          </div>
        </div>
      </div>
    );
  }
}

GameComponent.propTypes = {
  words: React.PropTypes.array
};
