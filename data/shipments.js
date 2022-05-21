const db = require('../config');
const errorHandling = require('../helper');
const inventoryFuncs = require('./inventory');
const validations = errorHandling.validations
const shipments = db.shipmentsCollection;


async function createShipment(order){
    /**Attempts to create a shipment (will throw error if appropriate quantity not available.) 
     * If successful, adds the shipment to the shipments collection
     * 
     * order is an array of objects, which have the following structure:
     * {_id: id, name: name, quantity: quantity, price: price}
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
     * {_id: id, name: name, quantity: quantity, price: price} */

    //1. validate input
    if (arguments.length !== 1) throw "Invalid number of arguments for submit shipment!"
    order = validations.validateCreateShipment(order);

    //2. check that there is sufficient quantity for each item
    for (let orderItem of order){
        let inventoryItem = await inventoryFuncs.getItem(orderItem._id);
        if (inventoryItem === null) throw "Error! That item does not exist in the inventory!";
    
        if(orderItem.quantity > inventoryItem.quantity){
            throw `Error! Shipment quantity for ${orderItem.name} exceeds available quantity in current inventory!`;
        }
        orderItem.newQuantity = inventoryItem.quantity - orderItem.quantity; //temp variable to store the updated inventory quantity
    };


    //3. adjust inventory to account for shipment
    for (let orderItem of order){
        await inventoryFuncs.updateItem(orderItem._id, orderItem.name, orderItem.newQuantity, orderItem.price);
        delete orderItem.newQuantity; //remove the temp variable after updating inventory quantity
    };

    return

};

async function test(){
    try {
        let o1 = {
            _id: "62881b73b40bd65da9f54ec6",
            name: "bagels",
            quantity: 50,
            price: 2,
        }
        await createShipment([o1]);
        
    } catch (error) {
        console.log(error)
    }
}

test()
module.exports = {
    createShipment,
    submitShipment
};

