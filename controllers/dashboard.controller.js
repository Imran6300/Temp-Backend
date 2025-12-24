const Temperature = require("../models/temperature.model");

exports.getDashboardData = async (req, res) => {
  try {
    const readings = await Temperature.find().sort({ createdAt: -1 }).limit(5);

    if (readings.length < 2) {
      return res.json({
        temperature: readings[0]?.temperature || 0,
        time: "--",
        online: true,
        battery: readings[0]?.battery || 0,
        tempprediction: readings[0]?.temperature || 0,
        lastupdate: 5,
      });
    }

    const latest = readings[0];
    const oldest = readings[readings.length - 1];

    const tempDiff = latest.temperature - oldest.temperature;

    const timeDiffMinutes = (latest.createdAt - oldest.createdAt) / (1000 * 60);

    const ratePerMinute = tempDiff / timeDiffMinutes;

    const predictedTemp = latest.temperature + ratePerMinute * 15;

    res.json({
      temperature: latest.temperature,
      time: latest.createdAt.toLocaleTimeString(),
      online: true,
      battery: latest.battery || 0,
      tempprediction: Number(predictedTemp.toFixed(1)),
      lastupdate: 5,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Prediction error" });
  }
};
