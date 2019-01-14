const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');

const DB_URL = (process.env.startType === 'dev') ? 
  'mongodb://127.0.0.1:27017/data' :
  'mongodb://mongo:27017/data';
const SERVER_PORT = process.env.PORT || 3333;
const SERVER_URL = '0.0.0.0';
const HEADER_OPTIONS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'accept, accept-language, content-type',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE'
};
const USER_ID = 1;

const app = express();

const mapWordForFrontend = (word) => {
  delete word.userId;
  return Object.assign({}, word, {title: word.word || word.infinitive || word.singular});
}


const doDbBackup = () => {
  MongoClient.connect(DB_URL, (err, db) => {
    db.collection('words')
      .find({})
      .toArray((err, result) => {
        db.close();
        fs.writeFile(
          './server/db-backup/words.json',
          JSON.stringify(result),
          (err) => {
            if(err) console.error('ERROR: DB backup failed');
          }
        );
      });
  });
}

app.listen(SERVER_PORT, SERVER_URL, () => {
  console.info(`server running on port ${SERVER_PORT}`);
});


app.options('/word', (request, response) => {
  response.writeHead(200, HEADER_OPTIONS);
  response.end();
});


app.get('/words', (request, response) => {
  response.writeHead(200, HEADER_OPTIONS);
  MongoClient.connect(DB_URL, (err, db) => {
    const searchObj = request.query.step ?
      {userId: USER_ID, step: Number(request.query.step)} :
      {userId: USER_ID}
    db.collection('words')
      .find(
        searchObj,
        {userId: false}
      )
      .toArray((err, result) => {
        // console.info('err, result: ', err, result);
        db.close();
        response.end(JSON.stringify(result.map(mapWordForFrontend)));
      });
  });
});

app.put('/word', (request, response) => {
  request.on('data', (data) => {
    const wordObj = JSON.parse(data);
    const updateObj = Object.assign({}, wordObj);
    delete updateObj._id;
    request.on('end', () => {
      response.writeHead(200, HEADER_OPTIONS);
      MongoClient.connect(DB_URL, (err, db) => {
        db.collection('words')
          .update(
            { '_id': ObjectID(wordObj._id) },
            { $set: updateObj }
          )
          .then(() => {
            db.close();
            response.end(JSON.stringify(wordObj));
            doDbBackup();
          })
      });
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


