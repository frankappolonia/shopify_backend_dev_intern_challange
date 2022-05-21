const express = require("express");
const router = express.Router();
const db = require("../data");
const errorHandling = require('../helper');
const inventoryFuncs = db.inventoryFuncs;
const validations = errorHandling.validations;
const xss = require('xss');

router.route("/") //this is the main route for the inventory  
    .get(async (request, response) => { //GET route populates page with full inventory list
        try {
            //1. get data
            let data = await inventoryFuncs.getAllItems();

            //2. send response with data
            response.status(200).render("pages/inventory", {inventoryData: data});
        } catch (e) {
            console.log(e);
            response.status(404).render("errors/404", {error: e});
        };
    })
    .post(async (request, response) => { //post route for adding new inventory items
        try {
            //1. validate form input 
            let formData = request.body;
            validations.validatePostRoute(formData);

            //2. sanitize input data to prevent XSS attacks and query database
            await inventoryFuncs.createItem(xss(formData.name), xss(formData.quantity), xss(formData.price));

            //3. reload page
            response.status(200).redirect('/inventory');
            return

        } catch (e) {
            response.status(404).render("errors/404", {error: e});
        };
    });

router.route("/item/:id") //this is the route for specific items in the inventory
    .get(async (request, response) => { //GET route populates page with data from specfic item in inventory
        let itemId = request.params.id.trim();
        try {
            //1. validate item id in url 
            validations.checkId(itemId);
        } catch (e) {
            response.status(400).render("errors/invalidItem", {error: e});
            return
        };

        try {
            //2. get item from inventory collection 
            let data = await inventoryFuncs.getItem(itemId);

            //3. send response with data
            response.status(200).render("pages/itemPage", {itemData: data, script: '/public/js/itemPage.js'});

        } catch (e) {
            response.status(404).render("errors/404", {error: e});
            return
        };
    })
    .put(async (request, response) =>{ //this route is for updating a specific item in the inventory
        let itemId = request.params.id.trim();
        let formData = request.body;

        try {
            //1. validate form data and id
            validations.checkId(itemId);
            validations.validatePostRoute(formData);

            //2. sanitize input data to prevent XSS attacks and query database
            let updatedItem = await inventoryFuncs.updateItem(xss(itemId), xss(formData.name), xss(formData.quantity), xss(formData.price));

            //3. respond with updated item data for ajax request
            response.status(200).json(updatedItem)

        } catch (e) {
            response.status(400).send(e);
            return
        };

    })
    .delete(async (request, response) =>{ //this route is for deleting a specific item in the inventory
        try {
            //1. validate id
            let itemId = validations.checkId(request.params.id);

            //2. query dabatase for deletion
            let deleteItem = await inventoryFuncs.deleteItem(itemId);

            //3. send the data for the ajax request
            response.status(200).send(deleteItem);
            
        } catch (e) {
            response.status(400).send(e);
            return
        };

    });

  module.exports = router;