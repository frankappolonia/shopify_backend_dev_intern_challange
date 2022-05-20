const db = require('../config');
const errorHandling = require('../helper')
const validations = errorHandling.validations
const { ObjectId } = require('mongodb');
const shipments = db.shipmentsCollection;


async function createShipment(order){
    /**Attempts to create a shipment (will throw error if appropriate quantity not available.) 
     * If successful, adds the shipment to the shipments collection
     */
    
};

async function submitShipment(order){
    /**Takes a created order  and updates inventory collection accordingly */

};

module.exports = {
    createShipment,
    submitShipment
}

