const Temperature = require("../models/temperature.model");
const { predictNext10Min } = require("../utils/predictTemperature");

exports.receiveTemperature = async (req, res) => {
  try {
    const { deviceId, temperature, battery } = req.body;

    if (!deviceId || typeof temperature !== "number") {
      return res.status(400).json({ message: "Invalid data" });
    }

    // Save reading
    const record = await Temperature.create({
      deviceId,
      temperature,
      battery,
    });

    // Get recent readings for prediction
    const recentReadings = await Temperature.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const predictedTemp = predictNext10Min(recentReadings);

    // Emit real-time update
    req.app.get("io").emit("temperature-update", {
      temperature,
      time: record.createdAt.toLocaleTimeString(),
      online: true,
      battery: battery || 0,
      tempprediction: predictedTemp,
      lastupdate: 0,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Receive Temperature Error:", err);
    res.status(500).json({ message: "Sensor error" });
  }
};
