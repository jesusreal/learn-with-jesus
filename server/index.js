const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');

const DB_URL = 'mongodb://127.0.0.1:27017/data';
const SERVER_PORT = 3333;
const SERVER_URL = '127.0.0.1';
const HEADER_OPTIONS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'accept, accept-language, content-type',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE'
};
const USER_ID = 1;

const app = express();

const mapWordForFrontend = (word) => {
  delete word.userId;
  delete word.step;
  return Object.assign({}, word, {title: word.word || word.infinitive || word.singular});
}


const doDbBackup = () => {
  MongoClient.connect(DB_URL, (err, db) => {
    db.collection('words')
      .find({})
      .toArray((err, result) => {
        db.close();
        fs.writeFile(
          './server/db-backup/words.txt',
          JSON.stringify(result),
          (err) => {
            if(err) console.error('ERROR: DB backup failed');
          }
        );
      });
  });
}


app.listen(SERVER_PORT, SERVER_URL);


app.options('/word', (request, response) => {
  response.writeHead(200, HEADER_OPTIONS);
  response.end();
});


app.get('/words', (request, response) => {
  response.writeHead(200, HEADER_OPTIONS);
  MongoClient.connect(DB_URL, (err, db) => {
    db.collection('words')
      .find(
        {userId: USER_ID, step: Number(request.query.step)},
        {userId: false, step: false}
      )
      .toArray((err, result) => {
        db.close();
        response.end(JSON.stringify(result.map(mapWordForFrontend)));
      });
  });
});


app.post('/word', (request, response) => {
  request.on('data', (data) => {
    const wordObj = JSON.parse(data);
    request.on('end', () => {
      response.writeHead(200, HEADER_OPTIONS);
      MongoClient.connect(DB_URL, (err, db) => {
        const newWord = Object.assign(
          {userId: USER_ID, step: 0},
          wordObj
        )
        db.collection('words').insert(newWord, () => {
          db.close();
          response.end(JSON.stringify(mapWordForFrontend(newWord)));
          doDbBackup();
        });
      });
    });
  });
});


app.delete('/word', (request, response) => {
  request.on('data', (data) => {
    const wordId = JSON.parse(data).wordId;
    request.on('end', () => {
      response.writeHead(200, HEADER_OPTIONS);
      MongoClient.connect(DB_URL, (err, db) => {
        db.collection('words').remove({'_id': ObjectID(wordId)}, () => {
          db.close();
          response.end(JSON.stringify({'_id': wordId}));
          doDbBackup();
        });
      });
    });
  });
});


console.info(`server running on port ${SERVER_PORT}`);
