const Temperature = require("../models/temperature.model");

exports.receiveTemperature = async (req, res) => {
  try {
    const { deviceId, temperature, battery } = req.body;
    console.log(deviceId, temperature, battery);

    if (!deviceId || temperature === undefined) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // Save to DB Usong Mongoos Methods
    const record = await Temperature.create({
      deviceId,
      temperature,
      battery,
    });

    const dashboardData = {
      temperature,
      time: record.createdAt.toLocaleTimeString(),
      online: true,
      battery: battery || 0,
      tempprediction: temperature + 10,
      lastupdate: 0,
    };

    req.app.get("io").emit("temperature-update", dashboardData);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sensor error" });
  }
};
