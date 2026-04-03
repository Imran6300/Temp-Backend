const Temperature = require("../models/temperature.model");
exports.receiveTemperature = async (req, res) => {
  try {
    const { deviceId, temperature, battery } = req.body;

    if (!deviceId || temperature === undefined) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const record = await Temperature.create({
      deviceId,
      temperature,
      battery,
    });

    const io = req.app.get("io");

    // 🔥 FIXED EMIT
    io.emit("sensor:update", {
      temperature: record.temperature,
      battery: record.battery,
      createdAt: record.createdAt,
    });

    console.log("📡 Thunder → sensor:update emitted");

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sensor error" });
  }
};
