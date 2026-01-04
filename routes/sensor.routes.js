const express = require("express");
const router = express.Router();
const { receiveTemperature } = require("../controllers/sensor.controller");

// POST sensor data
router.post("/data", receiveTemperature);

module.exports = router;
