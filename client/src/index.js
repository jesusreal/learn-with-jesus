// import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom';
// import newWords from './new-words';

// import ReactDOMServer from 'react-dom/server'; //for server-side rendering

import NewWordComponent from './components/new-word';
import WordsViewComponent from './components/words-view-component';

export class Page extends React.Component {
  render() {
    return (
      <div>
        <WordsViewComponent/>
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
