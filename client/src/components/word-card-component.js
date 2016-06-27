import React from 'react';

export default class WordCardComponent extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={'word-card ' + this.props.word.type}>
      { Object.keys(this.props.word).slice(1).map((key) =>
        <div className="word-param" key={key}>
          <span className="word-key">{key}:&nbsp;</span>
          <span>{this.props.word[key]}</span>
        </div>
      ) }
      </div>
    );
  }
}


