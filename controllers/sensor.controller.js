const Temperature = require("../models/temperature.model");

exports.receiveTemperature = async (req, res) => {
  try {
    const { deviceId, temperature, battery } = req.body;
    console.log(deviceId, temperature, battery);

    if (!deviceId || temperature === undefined) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // Save to DB
    const record = await Temperature.create({
      deviceId,
      temperature,
      battery,
    });

    // Build LIVE dashboard JSON
    const dashboardData = {
      temperature,
      time: record.createdAt.toLocaleTimeString(),
      online: true,
      battery: battery || 0,
      tempprediction: temperature + 10, // we'll improve later
      lastupdate: 0, // 🔥 JUST UPDATED
    };

    // Emit live update
    req.app.get("io").emit("temperature-update", dashboardData);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sensor error" });
  }
};
