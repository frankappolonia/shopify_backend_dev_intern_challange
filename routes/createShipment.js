const express = require("express");
const router = express.Router();
const db = require("../data");
const errorHandling = require('../helper');
const inventoryFuncs = db.inventoryFuncs;
const validations = errorHandling.validations;
const xss = require('xss');

router.route("/") //this is the route for the create shipment page
    .get(async (request, response) => { //GET route populates page 
        try {
            //1. get data
            let data = await inventoryFuncs.getAllItems();

            //2. send response with data
            response.status(200).render("pages/createShipment");
        } catch (e) {
            response.status(404).render("errors/404", {error: e});
        };
    });

module.exports = router;