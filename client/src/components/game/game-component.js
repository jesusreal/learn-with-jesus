import React from 'react';
import * as constants from './../../constants';

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
          <input type="text" required name="totalWords" value={this.state.totalWords} onChange={this.updateField} autoFocus="autofocus"/>
          <button type="button" id="start-game" onClick={this.startGame}>
            Play
          </button>
        </div>

        <div id="words-list" className={'block game ' + ((this.state.playing) ? '' : 'hide')}>
          <div id="game-progress" className={'block word-card ' + this.state.currentWord.type + ((this.state.playing) ? '' : 'hide')}>
            <p>
              <span className="index">{this.state.index + 1}</span>
              <span>/</span>
              <span>{this.state.gameWords.length}</span>
            </p>
          </div>
          <div className={'word-card ' + this.state.currentWord.type}>
            <div className={'word-keys ' + ((this.state.step === 0) ? '' : 'hide')} onClick={this.onCardClicked}>
              <div className={'word-param ' + this.state.currentWord.title}>
                <span className="content">{this.state.currentWord.title}</span>
              </div>
            </div>
            <div className={'word-keys ' + ((this.state.step === 1) ? '' : 'hide')} onClick={this.onCardClicked}>
              {
                Object.keys(this.state.currentWord)
                  .filter((key) => !constants.WORD_FIELDS_NOT_TO_SHOW.includes(key))
                  .filter((key) => this.state.currentWord[key])
                  .map((key, value) =>
                    <div className={'word-param ' + key + ' ' + ((this.state.step !== 1) ? 'hide' : '')} key={key}>
                      <span className="key">{key}:&nbsp;</span>
                      <span className="content">{this.state.currentWord[key]}</span>
                    </div>
                  )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

GameComponent.propTypes = {
  words: React.PropTypes.array
};
