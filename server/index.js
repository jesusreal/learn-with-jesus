let express = require('express');
let fs = require('fs');

const SERVER_PORT = 3333;
const SERVER_URL = '127.0.0.1';
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
  const list = request.query.list;
  const filename = getFilename();

  fs.readFile(filename, 'utf8', (error, fileData) => {
    let words = JSON.parse(fileData)[list];
    response.writeHead(200, HEADER_OPTIONS);
    response.end(JSON.stringify(words));
  });
});


app.post('/word', (request, response) => {
  let reqData = '';
  const filename = getFilename();

  request.on('data', (data) => { reqData = JSON.parse(data) });

  request.on('end', () => {
    fs.readFile(filename, 'utf8', (error, fileData) => {
      fileData = JSON.parse(fileData);
      response.writeHead(200, HEADER_OPTIONS);
      if (reqData.action === 'delete') {
        let listKey = reqData.listKey;
        const oldList = fileData[listKey];
        const newList = oldList.filter((word) => word.id !== reqData.wordId);
        fileData[listKey] = newList;
        fs.writeFile(filename, JSON.stringify(fileData), () => {
          const userId = 1;
          response.end(`Word successfully deleted for user ${userId}`);
        });
      } else {
        reqData.id = fileData.totalWords = fileData.totalWords + 1;
        fileData.daily = fileData.daily.concat([reqData]);
        fs.writeFile(filename, JSON.stringify(fileData), () => {
          response.end(JSON.stringify(reqData));
        });
      }
    });
  });
});


console.info(`server running on port ${SERVER_PORT}`);
