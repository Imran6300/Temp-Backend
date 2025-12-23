const express = require("express");
const router = express.Router();
const { receiveTemperature } = require("../controllers/sensor.controller");

router.post("/data", receiveTemperature);

module.exports = router;
