const express = require("express");
const router = express.Router();
const db = require("../data");
const errorHandling = require('../helper');
const inventoryFuncs = db.inventoryFuncs;
const shipmentFuncs = db.shipmentFuncs;
const validations = errorHandling.validations;
const xss = require('xss');

router.route("/") //this is the route for the create shipment page
    .get(async (request, response) => { //GET route populates page 
        try {
            //1. get data
            let data = await inventoryFuncs.getAllItems();

            //2. send response with data to populate page
            response.status(200).render("pages/createShipment", {inventoryData: data, script: "/public/js/createShipment.js"});
        } catch (e) {
            response.status(404).render("errors/404", {error: e});
        };
    })
    .post(async (request, response) =>{
        let order = request.body.order;
        
        try {
            //1. Vlaidate form data
            validations.validateShipmentPost(order);
            order = validations.validateCreateShipment(order);

            //2. Send order to db
            let newShipmentId = await shipmentFuncs.createShipment(order);
           
            //3. send id to redirect to shipment page
            response.status(200).send(newShipmentId);
        } catch (e) {
            response.status(400).send(e);
        };

    });

router.route("/orders") //this is the route to view all past shipment orders
    .get(async (request, response) => { //GET route populates page 
        try {
            //1. get data
            let data = await shipmentFuncs.getAllShipments();

            //2. send response with data
            response.status(200).render("pages/allShipments", {shipmentData: data});
        } catch (e) {
            response.status(404).render("errors/404", {error: e});
        };
    });

router.route("/orders/:id") //this is the route to view a specific shipment order
    .get(async (request, response) => { //GET route populates page 
        try {
            //1. validate id
            let id = validations.checkId(request.params.id);

            //2. get data
            let data = await shipmentFuncs.getShipment(id);
            
            //3. send response with data
            response.status(200).render("pages/shipmentPage", {shipmentData: data});
        } catch (e) {
            response.status(404).render("errors/404", {error: e});
        };
    });

module.exports = router;