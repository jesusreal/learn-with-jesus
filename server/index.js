let express = require('express');
let fs = require('fs');
let readline = require('readline');
let Rx = require('rxjs/Rx');

const SERVER_PORT = 3333;
const SERVER_URL = '127.0.0.1';
const HEADER_OPTIONS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'accept, accept-language, content-type',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE'
};
const USER_ID = 1;

let app = express();
const wordsFile = './server/words.txt';

const mapWordForFrontend = (word) => {
    delete word.userId;
    delete word.step;
    return word;
  }

app.listen(SERVER_PORT, SERVER_URL);

app.get('/words', (request, response) => {
  let rl = readline.createInterface({
    input: fs.createReadStream(wordsFile, 'utf8')
  });
  const list = Number(request.query.list);

  response.writeHead(200, HEADER_OPTIONS);
  let words = [];
  Rx.Observable.fromEvent(rl, 'line')
    .takeUntil(Rx.Observable.fromEvent(rl, 'close'))
    .map((word) => JSON.parse(word))
    .filter((word) => word.userId === USER_ID)
    .filter((word) => word.step === list)
    .map(mapWordForFrontend)
    .subscribe(
      (word) => { words = words.concat([word]) },
      err => console.error("Error: %s", err),
      () => { response.end(JSON.stringify(words)) }
  );
});

app.options('/word', (request, response) => {
  response.writeHead(200, HEADER_OPTIONS);
  response.end();
});

app.post('/word', (request, response) => {
  let reqData = '';

  request.on('data', (data) => { reqData = JSON.parse(data) });

  request.on('end', () => {
    response.writeHead(200, HEADER_OPTIONS);

    if(reqData.action === 'delete') {
      let rl = readline.createInterface({
        input: fs.createReadStream(wordsFile, 'utf8')
      });
      let resultStr = '';
      Rx.Observable.fromEvent(rl, 'line')
        .takeUntil(Rx.Observable.fromEvent(rl, 'close'))
        .map((word) => JSON.parse(word))
        .filter((word) => word.id !== reqData.wordId)
        .subscribe(
          (word) => { resultStr += JSON.stringify(word) + '\n'},
          err => console.error("Error: %s", err),
          () => {
            const stream = fs.createWriteStream(wordsFile);
            stream.once('open', function() {
              stream.write(resultStr);
              stream.end();
              response.end(`Word successfully deleted for user ${USER_ID}`);
            });
          }
        )
    } else {
      let rl = readline.createInterface({
        input: fs.createReadStream(wordsFile, 'utf8')
      });
      let newId;
      Rx.Observable.fromEvent(rl, 'line')
        .takeUntil(Rx.Observable.fromEvent(rl, 'close'))
        .map((word) => JSON.parse(word))
        .map((word) => word.id)
        .max()
        .subscribe(
          id => { newId = id },
          err => console.error("Error: %s", err),
          () => {
            const newWord = JSON.stringify(Object.assign(
              {id: newId + 1, userId: USER_ID, step: 0},
              reqData)
            );
            const stream = fs.createWriteStream(wordsFile, {flags:'a'});
            stream.once('open', function() {
              stream.write(`${newWord}\n`);
              stream.end();
              response.end(mapWordForFrontend(newWord));
            });
          }
        )
    }
  });
});


console.info(`server running on port ${SERVER_PORT}`);
