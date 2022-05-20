const db = require('../config');
const { ObjectId } = require('mongodb');
const inventory = db.inventoryCollection;

async function createItem(name, currentQuantity, price){
    /**This function is for creating/adding a new item to the inventory collection */

    //1. validate input
    

    //2. establish db connection
    const inventoryCollection = await inventory();

    //3. create inventory object
    let newItem = {
        name: name,
        quantity: currentQuantity,
        price: price
    };

    //4. insert the new inventory item into the db
    let insertData = await inventoryCollection.insertOne(newItem);
    if (insertData.acknowldeged === 0 || !insertData.insertedId === 0){
        throw 'Could not add new user!'
    };

    //5. return the newly created objectID
    return insertData.insertedId.toString()

};

async function updateItem(id, name, quantity, price){
    /**This function is for updating an existing item in the db */

    //1. Validate Input

    //2. establish db connection
    const inventoryCollection = await inventory();

    //3. ensure that the item exists in the db

    //4. create inventory object with updated info
    let newItem = {
        name: name,
        quantity: currentQuantity,
        price: price
    };

    //5. Update the item in the db
    const update = await inventoryCollection.updateOne(
    { _id: ObjectId(id) }, 
    {$set: {newItem}});

    if (update["modifiedCount" === 0]) throw "Error! Could not update inventory item!";

    //6. return the updated item
    

};

async function deleteItem(){

};

async function getItem(){

};

async function test(){
    try{
        let id = await createItem("test", 3, 2.00)
        console.log(id)
    }catch(e){
        console.log(e)
    }
}
test()

module.exports = {
    createItem,
    updateItem,
    deleteItem,
    getItem
};