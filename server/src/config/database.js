module.exports = {
  url: (process.env.NODE_ENV === 'production') ?
    'mongodb://lwj-db-service:27017/data' :
    'mongodb://127.0.0.1:27017/data'
}