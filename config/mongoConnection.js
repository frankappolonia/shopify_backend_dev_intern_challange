const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings.json');
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

/**This is the wrapper function that allows you to connect to the mongo db
 * and create collections in /mongoCollections
 */
module.exports = {
  connectToDb: async () => {
    if (!_connection) {
      _connection = await MongoClient.connect(mongoConfig.serverUrl);
      _db = await _connection.db(mongoConfig.database);
    }

    return _db;
  },
  
  closeConnection: () => {
    _connection.close();
    console.log("Connection closed!")
  }
};