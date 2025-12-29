const Temperature = require("../models/temperature.model");
const { predictNext10Min } = require("../utils/predictTemperature");
const { generateCSV } = require("../utils/report.util");

exports.getDashboardData = async (req, res) => {
  try {
    const readings = await Temperature.find().sort({ createdAt: -1 }).limit(10);

    if (!readings.length) {
      return res.json({
        temperature: 0,
        time: "--",
        online: false,
        battery: 0,
        tempprediction: 0,
        lastupdate: 10,
      });
    }

    const latest = readings[0];
    const predictedTemp = predictNext10Min(readings);

    res.json({
      temperature: latest.temperature,
      time: latest.createdAt.toLocaleTimeString(),
      online: true,
      battery: latest.battery || 0,
      tempprediction: predictedTemp,
      lastupdate: 10,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Prediction error" });
  }
};

exports.downloadReport = async (req, res) => {
  try {
    const data = await Temperature.find()
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    if (!data.length) {
      return res.status(404).json({ message: "No data available" });
    }

    const csv = generateCSV(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=temperature-report-${Date.now()}.csv`
    );

    res.status(200).send(csv);
  } catch (err) {
    console.error("Download Report Error:", err);
    res.status(500).json({ message: "Failed to generate report" });
  }
};
