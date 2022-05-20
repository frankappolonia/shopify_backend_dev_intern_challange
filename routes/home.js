const express = require("express");
const router = express.Router();
const db = require("../data");
const errorHandling = require('../helper');
const inventoryFuncs = db.inventoryFuncs;
const validations = errorHandling.validations;
const xss = require('xss');

router.route("/") //this is the main route for the application landing page
    .get(async (request, response) => { //GET route populates page with full inventory list
        try {
            //1. get data
            let data = await inventoryFuncs.getAllItems();

            //2. send response with data
            response.status(200).render("pages/home", {inventoryData: data});
        } catch (e) {
            console.log(e);
            response.status(404).render("errors/404", {error: e});
        };
    })
    .post(async (request, response) => {
        try {
            //1. validate form input 
            let formData = request.body;
            validations.validatePostRoute(formData);

            //2. sanitize input data to prevent XSS attacks and query database
            inventoryFuncs.createItem(xss(formData.name), xss(formData.quantity), xss(formData.price));

            //3. reload page
            response.status(200).redirect('/');
            return

        } catch (e) {
            console.log(e);
            response.status(404).render("errors/404", {error: e});
        };
    });

router.route("/:id") //this is the route for specific items in the inventory
    .get(async (request, response) => { //GET route populates page with data from specfic item in inventory
        let itemId = request.params.id.trim();
        try {
            //1. validate item id in url 
            validations.checkId(itemId);
        } catch (e) {
            console.log(e);
            response.status(400).render("errors/invalidItem");
            return
        };

        try {
            //2. get item from inventory collection 
            let data = await inventoryFuncs.getItem(itemId);

            //3. send response with data
            response.status(200).render("pages/itemPage", {itemData: data});

        } catch (e) {
            console.log(e);
            response.status(404).render("errors/404", {error: e});
            return
        };
    })
  module.exports = router;