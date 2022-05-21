const db = require('../config');
const errorHandling = require('../helper');
const inventoryFuncs = require('./inventory');
const validations = errorHandling.validations
const shipments = db.shipmentsCollection;
const { ObjectId } = require('mongodb');

/**This file contains data functions for the sipments collection */

async function createShipment(order){
    /**Attempts to create a shipment (will not submit if appropriate quantity not available, or other error caught) 
     * If successful, adds the shipment to the shipments collection
     * 
     * order is an array of objects, which have the following structure:
     * {_id: id, quantity: quantity, price: price}
     */

    //1. validate input
    if (arguments.length !== 1) throw "Invalid number of arguments for create shipment!";
    order = validations.validateCreateShipment(order);

    //2. attempt to submit shipment
    await submitShipment(order);

    //3. upon successful submit, create new shipment object
    //3a. calculate total cost & subtotal cost per item x quantity
    let totalCost = 0;
    let subtotal
    order.forEach(itemObj =>{
        subtotal = (itemObj.price * itemObj.quantity);
        totalCost += subtotal;
        itemObj['subtotal'] = subtotal;
    });

    //3b. create new shipment object
    let newShipment = {
        date: new Date(),
        totalCost: totalCost,
        order: order
    };

    //4. insert shipment object into the shipments collection
    const shipmentsCollection = await shipments();

    let insertData = await shipmentsCollection.insertOne(newShipment);
    if (insertData.acknowldeged === 0 || !insertData.insertedId === 0){
        throw 'Could not add shipment!';
    };

    //5. return the newly created objectID as a string
    return insertData.insertedId.toString();
    
};

async function submitShipment(order){
    /**Takes a created order, checks that there is enough inventory to 
     * fulfill the order, and then updates inventory collection accordingly.
     * 
     * order is an array of objects, which have the following structure:
     * {_id: id, quantity: quantity, price: price} */

    //1. validate input
    if (arguments.length !== 1) throw "Invalid number of arguments for submit shipment!";
    order = validations.validateCreateShipment(order);

    //2. check that there is sufficient quantity for each item
    for (let orderItem of order){
        let inventoryItem = await inventoryFuncs.getItem(orderItem._id);
        if (inventoryItem === null) throw "Error! That item does not exist in the inventory!";

        orderItem.name = inventoryItem.name; //adds the item name to the order object
    
        if(orderItem.quantity > inventoryItem.quantity){ //checks if there is enough quantity in inventory for the shipment
            throw `Error! Shipment quantity for ${orderItem.name} exceeds available quantity in current inventory!`;
        }
        orderItem.newQuantity = inventoryItem.quantity - orderItem.quantity; //temp variable to store the updated inventory quantity
    };


    //3. Once it is checked that enough inventory is available, inventory is then adjusted to account for shipment
    for (let orderItem of order){
        await inventoryFuncs.updateItem(orderItem._id, orderItem.name, orderItem.newQuantity, orderItem.price);
        delete orderItem.newQuantity; //remove the temp variable after updating inventory quantity
    };
    return

};

async function getAllShipments(){
    /**This function returns an array of ALL shipment documents from the shipments collection */

    //1. Validate Input
    if (arguments.length !== 0) throw "getAllShipments takes no arguments!!";

    //2. establish db connection
    const shipmentsCollection = await shipments();

    //3. Query the item from the inventory db
    const allShipments = await shipmentsCollection.find({}).toArray();
    if(! allShipments) throw "Error! Could not fetch all shipments from the inventory db!";

    if (allShipments.length === 0) return [];

    //4. format each item document's objectID to a regular string (this is for when the data is sent in the get route)
    allShipments.forEach(itemObj =>{ 
        itemObj['_id'] = itemObj["_id"].toString();
    });

    //5. return the array of items
    return allShipments;

};

async function getShipment(itemId){
    /**This function returns ONE shipment document from the shipment collection */

    //1. Validate Input
    if (arguments.length !== 1) throw "Invalid number of arguments for getShipment!";
    itemId = validations.checkId(itemId);

    //2. establish db connection
    const shipmentsCollection = await shipments();

    //3. Query the shipment from the inventory db
    const shipment = await shipmentsCollection.findOne({ _id: ObjectId(itemId) });
    if (!shipment) throw 'No shipment found with that id in the inventory!';

    //4. return the user
    return shipment;

};

module.exports = {
    createShipment,
    submitShipment,
    getAllShipments,
    getShipment
};

