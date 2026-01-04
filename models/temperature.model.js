const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
  deviceId: String,
  temperature: Number,
  battery: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Temperature", temperatureSchema);
