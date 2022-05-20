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
            let allItems = await inventoryFuncs.getAllItems();
            response.status(200).render("pages/home", allItems);
        } catch (e) {
            console.log(e);
            response.status(404).render("errors/404");
        };
    });

router.route("/:id") //this is the route for specific items in the inventory
    .get(async (request, response) => { //GET route populates page with data from specfic item in inventory
        let itemId = request.params.id.trim();
        try {
            //validate item id in url 
            validations.checkId(itemId);
        } catch (e) {
            console.log(e);
            response.status(400).render("errors/invalidItem");
            return
        };

        try {
            let itemData = await inventoryFuncs.getItem(itemId);
            response.status(200).render("pages/itemPage", itemData);

        } catch (e) {
            console.log(e);
            response.status(404).render("errors/404");
            return
            
        };
    })
  module.exports = router;