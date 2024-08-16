const express = require("express");
const router = express.Router();
var multer = require("multer");

const controller = require("../Controllers/controller");
const check_auth = require("../Middleware/check_auth");

router.get("/holiday", controller.getHolidays);
router.get("/countries", controller.getcountries);
router.post("/imagegeneration", controller.getImages);

module.exports = router;
