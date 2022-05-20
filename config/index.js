const collections = require('./mongoCollections');
const mongoConnection = require('./mongoConnection');

/**This exports the mongo collections and connection capibility to be used in other
 * modules of this application.
 */
module.exports = {
    inventoryCollection: collections.inventory,
    connection: mongoConnection

};