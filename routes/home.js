const express = require("express");
const router = express.Router();

router.route("/") //this is the main route for the landing page
.get(async (request, response) => { 
    try {
        response.status(200).render("pages/home");
    } catch (e) {
        response.status(404).render("errors/404", {error: e});
    };
});

module.exports = router;