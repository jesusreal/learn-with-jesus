let express = require('express');
let fs = require('fs');

const SERVER_PORT = 8080;
const SERVER_URL = '127.0.0.1';
const SEPARATOR = '---';
const HEADER_OPTIONS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'accept, accept-language, content-type',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE'
};
const USER_FILENAME = 'server/user{USER_ID}.json';
const USER_ID = '1';

let getFilename = () => USER_FILENAME.replace('{USER_ID}', USER_ID);

let app = express();

app.listen(SERVER_PORT, SERVER_URL);

app.get('/words', (request, response) => {
  let list = request.query.list;
  const filename = getFilename();
  response.writeHead(200, HEADER_OPTIONS);

  fs.readFile(filename, (error, contents) => {
    let words = JSON.parse(contents.toString())[list];
    let result = words.reduce((acc, word, index) => {
      if (index !== 0) {
        acc += SEPARATOR;
      }
      return acc + JSON.stringify(word);
    }, '');
    response.end(result);
  });
});


app.post('/word', (request, response) => {
  let requestData = '';
  const filename = getFilename();

  request.on('data', (data) => {
    requestData = JSON.parse(data);
  });

  request.on('end', () => {
    let userId = 1;
    if (requestData.action === 'delete') {
      fs.readFile(filename, (error, contents) => {
        let fileData = JSON.parse(contents.toString());
        let listKey = requestData.listKey;
        fileData[listKey] = fileData[listKey].filter((word) => word.id !== requestData.wordId);
        fs.writeFile(filename, JSON.stringify(fileData), () => {
          response.end(`Word successfully deleted for user ${userId}`);
        });
      });
      return;
    }

    fs.readFile(filename, (error, contents) => {
      let fileData = JSON.parse(contents.toString());
      requestData.id = fileData.totalWords = fileData.totalWords + 1;
      fileData.daily = fileData.daily.concat([requestData]);
      fs.writeFile(filename, JSON.stringify(fileData), () => {
        response.end(JSON.stringify(requestData));
      });
    });
  });

  response.writeHead(200, HEADER_OPTIONS);
});


console.info(`server running on port ${SERVER_PORT}`);
