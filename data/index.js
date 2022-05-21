const inventoryFuncs = require("./inventory");
const shipmentFuncs = require("./shipments");

/**This file exports the databse functions so they can be used in other modules */
module.exports = {
  inventoryFuncs: inventoryFuncs,
  shipmentFuncs: shipmentFuncs
};