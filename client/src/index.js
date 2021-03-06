// import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom';
// import newWords from './new-words';


// import ReactDOMServer from 'react-dom/server'; //for server-side rendering

import MainComponent from './components/main-component';

export class Page extends React.Component {
  render() {
    return (
      <div>
        <MainComponent/>
      </div>
    );
  }
}

setTimeout(function() {
  // console.info(ReactDOMServer.renderToString(<Page/>)); // for server-side rendering
  if(typeof window !== 'undefined') {
    require('./css/index.css');
    require('./css/nav.css');
    require('./css/word-card.css');
    ReactDOM.render(<Page/>, document.getElementById('app'));
  }
}, 0);

// var ComponentFactory = React.createFactory(Page);
// console.info('ComponentFactory ' , ComponentFactory());
// express.Router().get('/react', function(req, res, next) {
//   // console.info(ReactDOMServer.renderToString(<Page/>)); // for server-side rendering
//   //   ReactDOM.render(<Page/>, document.getElementById('app'));

//   var markup = ReactDOMServer.renderToString(ComponentFactory());
//   console.info('markup ' , markup);
//   res.send(markup);
// });

// call this file using `babel-node src/index.js > dist/index.html` to create a server-side
// rendered HTML
