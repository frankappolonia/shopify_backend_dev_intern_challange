const dataFuncs = require('../data');
const inventoryFuncs = dataFuncs.inventoryFuncs;
const shipmentFuncs = dataFuncs.shipmentFuncs;
const db = require('../config');
const shipments = db.shipmentsCollection;
const inventory = db.inventoryCollection;
const connection = db.connection;


/**Optional seed file */

/**Users empty*/
async function deleteInventory(){
    const inventoryCollection = await inventory();
    inventoryCollection.deleteMany({});
};

/**Posts empty */
async function deleteShipments(){
    const shipmentsCollection = await shipments();
    shipmentsCollection.deleteMany({});
};

async function seed(){
    await deleteInventory();
    await deleteShipments();

    //inventory
    try{
    let stereo = await inventoryFuncs.createItem('Sony Stereo', 50, 149.99);
    let turntable = await inventoryFuncs.createItem('Classic Turntable', 25, 279.99);
    let vinyl = await inventoryFuncs.createItem('12 pack Vinyl', 150, 34.95);
    let bose = await inventoryFuncs.createItem('Bose Bluetooth Headphones', 99, 114.45);
    let airpods = await inventoryFuncs.createItem('Apple Air Pod Pro', 200, 179.00);

    //shipments
    let shipment1 = [{_id: stereo, quantity: 20, price: 179.99}, {_id: turntable, quantity: 5, price: 349.00}];
    await shipmentFuncs.createShipment(shipment1);

    let shipment2 = [{_id: bose, quantity: 30, price: 159.99}, {_id: airpods, quantity: 15, price: 199.00}];
    await shipmentFuncs.createShipment(shipment2);

    let shipment3 = [{_id: vinyl, quantity: 10, price: 67.85}];
    await shipmentFuncs.createShipment(shipment3);

    let shipment4 =  [{_id: stereo, quantity: 10, price: 179.99}, {_id: turntable, quantity: 10, price: 349.00},
        {_id: bose, quantity: 10, price: 159.99}, {_id: airpods, quantity: 10, price: 199.00}]
    await shipmentFuncs.createShipment(shipment4);

    }catch(e){
        console.log(e);
    };
    console.log("Inventory collection seeded!")
    console.log("Shipment collection seeded!")
    await connection.closeConnection();
};

seed();
