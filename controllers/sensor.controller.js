const Temperature = require("../models/temperature.model");

exports.receiveTemperature = async (req, res) => {
  try {
    const { deviceId, temperature, battery } = req.body;

    if (!deviceId || temperature === undefined) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // Save to database
    const record = await Temperature.create({
      deviceId,
      temperature,
      battery,
    });

    // Prepare data for live dashboard (frontend)
    const dashboardData = {
      temperature,
      time: record.createdAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      online: true,
      battery: battery || 0,
      tempprediction: temperature, // dashboard will calculate real prediction
      lastupdate: 0,
    };

    // Send to all connected browsers via Socket.IO
    req.app.get("io").emit("temperature-update", dashboardData);

    res.json({ success: true });
  } catch (err) {
    console.error("Sensor Error:", err);
    res.status(500).json({ message: "Sensor error" });
  }
};
