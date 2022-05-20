const dbConnection = require('./mongoConnection');

/* This allows for one reference to each collection needed for a web application */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection.connectToDb();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/*collections reference:*/
module.exports = {
  inventory: getCollectionFn('inventory'),
  shipments: getCollectionFn('shipments'),
};