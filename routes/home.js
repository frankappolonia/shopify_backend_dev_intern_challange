const express = require("express");
const router = express.Router();
const db = require("../data");
const errorHandling = require('../helper');
const inventoryFuncs = db.inventoryFuncs;
const validations = errorHandling.validations;
const xss = require('xss');

router.route("/") //this is the main route for the application landing page
    .get(async (request, response) => {
        try {
            response.status(200).render("pages/home");
        } catch (e) {
            console.log(e);
            response.status(404).render("errors/404");
        };
    });

router.route("/:id") //this is the route for specific items in the inventory
    .get(async (request, response) => {
        try {
            response.status(200).render("pages/itemPage");
        } catch (e) {
            console.log(e);
            response.status(404).render("errors/404");
        };

    })
  module.exports = router;