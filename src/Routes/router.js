const express = require("express");
const router = express.Router();


const controller = require("../Controllers/controller");


router.get("/holiday", controller.getHolidays);
router.get("/countries", controller.getcountries);
router.post("/imagegeneration", controller.getImages);

module.exports = router;
