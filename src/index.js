// import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom';
import newWords from './new-words';

// import ReactDOMServer from 'react-dom/server'; //for server-side rendering

import NewWordComponent from './components/new-word';

export class Page extends React.Component {
  showNewWords() {
    console.log('HI', newWords.getAll());
  }

  render() {
    return (
      <div>
        <div id="words-groups" className="block">
          <button onClick={this.showNewWords}>Täglich</button>
          <button>Wochentlich</button>
          <button>Monatlich</button>
        </div>
        <NewWordComponent/>
      </div>
    );
  }
}

setTimeout(function() {
  // console.log(ReactDOMServer.renderToString(<Page/>)); // for server-side rendering
  ReactDOM.render(<Page/>, document.getElementById('app'));
}, 80);

// var ComponentFactory = React.createFactory(Page);
// console.log('ComponentFactory ' , ComponentFactory());
// express.Router().get('/react', function(req, res, next) {
//   // console.log(ReactDOMServer.renderToString(<Page/>)); // for server-side rendering
//   //   ReactDOM.render(<Page/>, document.getElementById('app'));

//   var markup = ReactDOMServer.renderToString(ComponentFactory());
//   console.log('markup ' , markup);
//   res.send(markup);
// });

// call this file using `babel-node src/index.js > dist/index.html` to create a server-side
// rendered HTML
