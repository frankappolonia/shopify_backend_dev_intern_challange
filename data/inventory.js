const db = require('../config');
const errorHandling = require('../helper')
const validations = errorHandling.validations
const { ObjectId } = require('mongodb');
const inventory = db.inventoryCollection;

async function createItem(name, currentQuantity, price){
    /**This function is for creating/adding a new item document to the inventory collection */

    //1. validate input
    if (arguments.length !== 3) throw "Invalid number of arguments for createItem!";
    validations.validateItem(name, currentQuantity, price);

    //2. establish db connection
    const inventoryCollection = await inventory();

    //3. create inventory object
    let newItem = {
        name: name.trim(),
        quantity: parseInt(currentQuantity),
        price: parseFloat(price).toFixed(2) //rounds to 2 decimal places
    };

    //4. insert the new inventory item into the db
    let insertData = await inventoryCollection.insertOne(newItem);
    if (insertData.acknowldeged === 0 || !insertData.insertedId === 0){
        throw 'Could not add new user!'
    };

    //5. return the newly created objectID as a string
    return insertData.insertedId.toString();

};

async function updateItem(itemId, name, quantity, price){
    /**This function is for updating an existing item document in the inventory collection */

    //1. Validate Input
    if (arguments.length !== 4) throw "Invalid number of arguments for updateItem!";
    itemId = validations.checkId(itemId);
    validations.validateItem(name, quantity, price);

    //2. establish db connection
    const inventoryCollection = await inventory();

    //3. ensure that the item exists in the db
    const item = await getItem(itemId);
    if (item === null) throw "Error! That item does not exist in the inventory!";

    //4. create inventory object with updated info
    let newItem = {
        name: name.trim(),
        quantity: parseInt(currentQuantity),
        price: parseFloat(price).toFixed(2) //rounds to 2 decimal places
    };

    //5. Update the item in the db
    const update = await inventoryCollection.updateOne(
    { _id: ObjectId(itemId) }, 
    {$set: {newItem}});

    if (update["modifiedCount" === 0]) throw "Error! Could not update inventory item!";

    //6. return the updated item
    return newItem;
    
};

async function deleteItem(id){
    /**Function for deleting a ONE item document from the inventory collection */

    //1. Validate Input
    if (arguments.length !== 1) throw "Invalid number of arguments for deleteItem!";
    id = validations.checkId(id);

    //2. establish db connection
    const inventoryCollection = await inventory();

    //3. ensure that the item exists in the db
    const item = await getItem(id);
    if (item === null) throw "Error! That item does not exist!";

    const itemName = item['name'];

    //4. Query item for deletion
    const removeItem = await inventoryCollection.deleteOne({_id: ObjectId(id)})

    if (removeItem["deletedCount"] === 1){
        return `${itemName} has been successfully deleted!`
    };

    return "Error!  Could not delete item from inventory!";

};

async function getItem(itemId){
    /**This function returns ONE item document from the inventory collection */

    //1. Validate Input
    if (arguments.length !== 1) throw "Invalid number of arguments for deleteItem!";
    itemId = validations.checkId(itemId);

    //2. establish db connection
    const inventoryCollection = await inventory();

    //3. Query the item from the inventory db
    const item = await inventoryCollection.findOne({ _id: ObjectId(itemId) });
    if (!item) throw 'No item found with that id in the inventory!';

    //4. return the user
    return item;

};

async function getAllItems(){
    /**This function returns an array of ALL item documents from the inventory collection */

    //1. Validate Input
    if (arguments.length !== 0) throw "getAllItems takes no arguments!!";

    //2. establish db connection
    const inventoryCollection = await inventory();

    //3. Query the item from the inventory db
    const allItems = await inventoryCollection.find({}).toArray();
    if(! allItems) throw "Error! Could not fetch all items from the inventory db!";

    if (allItems.length === 0) return [];

    //4. return the array of items
    return allItems;

};

async function test(){
    try{
        let id = await createItem("test", 3, 2.00)
        console.log(id)
    }catch(e){
        console.log(e)
    }
}
//test()

module.exports = {
    createItem,
    updateItem,
    deleteItem,
    getItem,
    getAllItems
};